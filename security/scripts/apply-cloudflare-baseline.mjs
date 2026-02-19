#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createCloudflareClient } from './lib/cloudflare-client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rateLimitConfigPath = path.resolve(__dirname, '../config/rate-limit-baseline.json');
const customFirewallConfigPath = path.resolve(__dirname, '../config/custom-firewall-baseline.json');

const rawArgs = new Set(process.argv.slice(2));
const shouldApply = rawArgs.has('--apply');
const useEmergencyThresholds = rawArgs.has('--emergency');

const parseNumericArg = (prefix, fallbackValue) => {
  const argument = process.argv.slice(2).find((entry) => entry.startsWith(`${prefix}=`));
  if (!argument) return fallbackValue;
  const parsed = Number.parseFloat(argument.split('=').slice(1).join('='));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackValue;
};

const thresholdMultiplier = parseNumericArg(
  '--multiplier',
  useEmergencyThresholds ? 0.6 : 1,
);

const readJson = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
};

const toRateLimitRulesetRule = (rule, multiplier) => {
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

const main = async () => {
  const [rateLimitConfig, customFirewallConfig] = await Promise.all([
    readJson(rateLimitConfigPath),
    readJson(customFirewallConfigPath),
  ]);

  const rateLimitRules = (rateLimitConfig.rules ?? []).map((rule) =>
    toRateLimitRulesetRule(rule, thresholdMultiplier),
  );
  const customFirewallRules = customFirewallConfig.rules ?? [];

  if (!shouldApply) {
    console.log('Dry run only. Add --apply to push these rules to Cloudflare.');
    console.log('');
    console.log('Rate limit rules payload:');
    console.log(JSON.stringify(rateLimitRules, null, 2));
    console.log('');
    console.log('Custom firewall rules payload:');
    console.log(JSON.stringify(customFirewallRules, null, 2));
    process.exit(0);
  }

  const client = createCloudflareClient();

  await client.putRateLimitEntrypoint(rateLimitRules, 'GiseUGC anti-cost spike rate limits');
  await client.putCustomFirewallEntrypoint(
    customFirewallRules,
    'GiseUGC anti-cost spike custom firewall rules',
  );

  console.log(
    `Cloudflare baseline applied successfully (multiplier=${thresholdMultiplier.toFixed(2)}).`,
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
