#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createCloudflareClient } from './lib/cloudflare-client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rateLimitConfigPath = path.resolve(__dirname, '../config/rate-limit-baseline.json');

const WINDOW_MINUTES = 5;
const ANALYSIS_WINDOWS = 3;
const RECOVERY_WINDOWS = 2;
const BASELINE_DAYS = 7;

const REQUESTS_PER_MIN_ABSOLUTE_FLOOR = 80;
const CACHE_MISS_PER_MIN_ABSOLUTE_FLOOR = 40;
const UNIQUE_IPS_PER_MIN_ABSOLUTE_FLOOR = 30;
const FOUR_XX_RATIO_ALERT = 0.35;

const rawArgs = new Set(process.argv.slice(2));
const shouldApply = rawArgs.has('--apply');

const baseSecurityLevel = process.env.CF_BASE_SECURITY_LEVEL ?? 'medium';
const alertWebhook = process.env.CF_ALERT_WEBHOOK ?? '';

const getByPath = (obj, path) => {
  let current = obj;
  for (const key of path) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[key];
  }
  return current;
};

const coerceNumber = (value) => {
  const numericValue = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isFinite(numericValue) ? numericValue : null;
};

const firstFinite = (...values) => {
  for (const value of values) {
    const normalized = coerceNumber(value);
    if (normalized !== null) return normalized;
  }
  return 0;
};

const median = (values) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[midpoint - 1] + sorted[midpoint]) / 2;
  }
  return sorted[midpoint];
};

const sumStatus4xx = (statusMap) => {
  if (!statusMap) return 0;

  if (Array.isArray(statusMap)) {
    return statusMap.reduce((total, item) => {
      if (!item || typeof item !== 'object') return total;
      const statusCode = String(item.edgeResponseStatus ?? item.status ?? '');
      if (!statusCode.startsWith('4')) return total;
      return total + firstFinite(item.requests, item.count, item.value);
    }, 0);
  }

  if (typeof statusMap === 'object') {
    const direct4xx = coerceNumber(statusMap['4xx']);
    if (direct4xx !== null) return direct4xx;
    return Object.entries(statusMap).reduce((total, [statusCode, count]) => {
      if (!String(statusCode).startsWith('4')) return total;
      return total + firstFinite(count);
    }, 0);
  }

  return 0;
};

const parseAnalyticsMetrics = (result, windowMinutes) => {
  const totals = result?.totals ?? {};

  const requests = firstFinite(
    getByPath(totals, ['requests', 'all']),
    getByPath(totals, ['requests']),
    getByPath(totals, ['totals', 'requests', 'all']),
  );

  const cachedRequests = firstFinite(
    getByPath(totals, ['requests', 'cached']),
    getByPath(totals, ['cachedRequests']),
    getByPath(totals, ['totals', 'requests', 'cached']),
  );

  const uniqueIps = firstFinite(
    getByPath(totals, ['uniques', 'all']),
    getByPath(totals, ['uniques']),
    getByPath(totals, ['totals', 'uniques', 'all']),
  );

  const status4xx = sumStatus4xx(
    getByPath(totals, ['requests', 'http_status']) ?? getByPath(totals, ['http_status']),
  );

  const requestsPerMin = requests / windowMinutes;
  const cacheMissPerMin = Math.max(0, requests - cachedRequests) / windowMinutes;
  const uniqueIpsPerMin = uniqueIps / windowMinutes;
  const ratio4xx = requests > 0 ? status4xx / requests : 0;

  return {
    requestsPerMin,
    cacheMissPerMin,
    uniqueIpsPerMin,
    ratio4xx,
  };
};

const formatIso = (timestampMs) => new Date(timestampMs).toISOString();

const readJson = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
};

const toRateLimitRulePayload = (rule, multiplier) => {
  const adjustedRequests = Math.max(1, Math.floor(rule.requests_per_period * multiplier));
  return {
    ref: rule.id,
    description: `${rule.description} (<=${adjustedRequests}/${rule.period}s)`,
    expression: rule.expression,
    action: 'block',
    enabled: true,
    ratelimit: {
      characteristics: ['ip.src'],
      period: rule.period,
      requests_per_period: adjustedRequests,
      mitigation_timeout: rule.mitigation_timeout,
    },
  };
};

const sendAlert = async (message, payload) => {
  if (!alertWebhook) return;
  const body = {
    text: `${message}\n\`\`\`${JSON.stringify(payload, null, 2)}\`\`\``,
  };
  await fetch(alertWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

const buildWindow = ({ startMs, endMs, current, baseline }) => {
  const thresholdRequests = Math.max(baseline.requestsPerMin * 3, REQUESTS_PER_MIN_ABSOLUTE_FLOOR);
  const thresholdCacheMiss = Math.max(
    baseline.cacheMissPerMin * 2,
    CACHE_MISS_PER_MIN_ABSOLUTE_FLOOR,
  );
  const thresholdUniqueIps = Math.max(
    baseline.uniqueIpsPerMin * 2.5,
    UNIQUE_IPS_PER_MIN_ABSOLUTE_FLOOR,
  );

  const breachSignals = {
    requestsPerMin: current.requestsPerMin > thresholdRequests,
    cacheMissPerMin: current.cacheMissPerMin > thresholdCacheMiss,
    uniqueIpsPerMin: current.uniqueIpsPerMin > thresholdUniqueIps,
    ratio4xx: current.ratio4xx > FOUR_XX_RATIO_ALERT,
  };

  const breachScore = Object.values(breachSignals).filter(Boolean).length;
  const breach = breachScore >= 2;

  const normalizeSignals = {
    requestsPerMin:
      current.requestsPerMin <= Math.max(baseline.requestsPerMin * 1.4, REQUESTS_PER_MIN_ABSOLUTE_FLOOR * 0.75),
    cacheMissPerMin:
      current.cacheMissPerMin <= Math.max(baseline.cacheMissPerMin * 1.4, CACHE_MISS_PER_MIN_ABSOLUTE_FLOOR * 0.75),
    uniqueIpsPerMin:
      current.uniqueIpsPerMin <= Math.max(baseline.uniqueIpsPerMin * 1.6, UNIQUE_IPS_PER_MIN_ABSOLUTE_FLOOR * 0.75),
    ratio4xx: current.ratio4xx < 0.25,
  };
  const normalized = Object.values(normalizeSignals).filter(Boolean).length >= 3;

  return {
    start: formatIso(startMs),
    end: formatIso(endMs),
    current,
    baseline,
    breachSignals,
    breachScore,
    breach,
    normalized,
  };
};

const computeWindowMetrics = async (client, startMs, endMs) => {
  const analytics = await client.getDashboardAnalytics({
    since: formatIso(startMs),
    until: formatIso(endMs),
  });

  return parseAnalyticsMetrics(analytics, WINDOW_MINUTES);
};

const computeWindowBaseline = async (client, startMs, endMs) => {
  const dailyMetrics = await Promise.all(
    Array.from({ length: BASELINE_DAYS }, (_, index) => {
      const dayOffsetMs = (index + 1) * 24 * 60 * 60 * 1000;
      return computeWindowMetrics(client, startMs - dayOffsetMs, endMs - dayOffsetMs);
    }),
  );

  return {
    requestsPerMin: median(dailyMetrics.map((entry) => entry.requestsPerMin)),
    cacheMissPerMin: median(dailyMetrics.map((entry) => entry.cacheMissPerMin)),
    uniqueIpsPerMin: median(dailyMetrics.map((entry) => entry.uniqueIpsPerMin)),
    ratio4xx: median(dailyMetrics.map((entry) => entry.ratio4xx)),
  };
};

const buildAnalysisWindows = async (client, count, nowMs) => {
  const windows = [];

  for (let index = count - 1; index >= 0; index -= 1) {
    const endMs = nowMs - index * WINDOW_MINUTES * 60 * 1000;
    const startMs = endMs - WINDOW_MINUTES * 60 * 1000;

    const [currentMetrics, baselineMetrics] = await Promise.all([
      computeWindowMetrics(client, startMs, endMs),
      computeWindowBaseline(client, startMs, endMs),
    ]);

    windows.push(
      buildWindow({
        startMs,
        endMs,
        current: currentMetrics,
        baseline: baselineMetrics,
      }),
    );
  }

  return windows;
};

const main = async () => {
  const rateLimitConfig = await readJson(rateLimitConfigPath);
  const baseRateLimitRules = (rateLimitConfig.rules ?? []).map((rule) =>
    toRateLimitRulePayload(rule, 1),
  );
  const tightenedRateLimitRules = (rateLimitConfig.rules ?? []).map((rule) =>
    toRateLimitRulePayload(rule, 0.6),
  );

  const client = createCloudflareClient();
  const securityLevelState = await client.getSecurityLevel();
  const isUnderAttackMode = securityLevelState?.value === 'under_attack';

  const nowMs = Date.now();
  const analysisWindows = await buildAnalysisWindows(client, ANALYSIS_WINDOWS, nowMs);
  const recoveryWindows = analysisWindows.slice(-RECOVERY_WINDOWS);

  const shouldEnableEmergency = analysisWindows.every((entry) => entry.breach);
  const shouldDisableEmergency = recoveryWindows.every((entry) => entry.normalized);

  const summary = {
    now: new Date(nowMs).toISOString(),
    zoneId: client.zoneId,
    apply: shouldApply,
    currentSecurityLevel: securityLevelState?.value ?? 'unknown',
    shouldEnableEmergency,
    shouldDisableEmergency,
    analysisWindows,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (!shouldApply) return;

  if (!isUnderAttackMode && shouldEnableEmergency) {
    await client.setSecurityLevel('under_attack');
    await client.putRateLimitEntrypoint(
      tightenedRateLimitRules,
      'GiseUGC anti-cost spike rate limits (emergency)',
    );
    await sendAlert('Emergency protection enabled (Under Attack mode ON)', summary);
    return;
  }

  if (isUnderAttackMode && shouldDisableEmergency) {
    await client.setSecurityLevel(baseSecurityLevel);
    await client.putRateLimitEntrypoint(
      baseRateLimitRules,
      'GiseUGC anti-cost spike rate limits (baseline)',
    );
    await sendAlert('Emergency protection disabled (Under Attack mode OFF)', summary);
    return;
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
