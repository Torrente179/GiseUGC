#!/usr/bin/env node
/**
 * The media host's video lock: Cloudflare serves the videos on
 * media.giselasaldarriaga.com only to the site's own pages and to crawlers it
 * has verified (Googlebot, Bingbot…). A video requested from anywhere else gets
 * Cloudflare's 403 page. That covers a link pasted into a browser tab, a
 * download tool given the URL, and another website embedding the file. Posters
 * and other images stay open for link previews and image search.
 *
 * A page says where it is in the Referer header of every request it makes,
 * <video> loads included (checked in Chromium and in WebKit, Mac and iPhone,
 * 2026-10-19). Any tool can fake that header, so this stops casual saving and
 * hotlinking, not a determined copier.
 *
 *   npm run video:lock               create or update the rule, switched on
 *   npm run video:lock -- --off      keep the rule but switch it off
 *   npm run video:lock -- --status   print the live rule
 *
 * Needs CF_API_TOKEN (Zone WAF edit) and CF_ZONE_ID in .env. The rule is a WAF
 * custom rule (Security → WAF → Custom rules); this script only touches the
 * rule whose ref is RULE_REF.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const RULE_REF = 'gise_video_referer_lock';
const MEDIA_HOST = 'media.giselasaldarriaga.com';
const VIDEO_EXTENSIONS = ['mp4', 'm4v', 'mov', 'webm', 'm4s', 'm3u8', 'ts'];
/** Pages allowed to play the videos: production, local dev servers. */
const ALLOWED_REFERER_PREFIXES = [
  'https://www.giselasaldarriaga.com/',
  'https://giselasaldarriaga.com/',
  'http://localhost:',
  'http://127.0.0.1:',
];
/** Vercel previews: gise-<hash>-torrente179s-projects.vercel.app (and gise-git-<branch>-…). */
const PREVIEW_PREFIX = 'https://gise-';
const PREVIEW_SUFFIX = '-torrente179s-projects.vercel.app/';

const quote = (value) => JSON.stringify(value);

const lockExpression = () =>
  [
    `http.host eq ${quote(MEDIA_HOST)}`,
    `http.request.uri.path.extension in {${VIDEO_EXTENSIONS.map(quote).join(' ')}}`,
    'not cf.client.bot',
    ...ALLOWED_REFERER_PREFIXES.map((prefix) => `not starts_with(http.referer, ${quote(prefix)})`),
    `not (starts_with(http.referer, ${quote(PREVIEW_PREFIX)}) and http.referer contains ${quote(PREVIEW_SUFFIX)})`,
  ].join('\n  and ');

const env = Object.fromEntries(
  readFileSync(path.join(root, '.env'), 'utf8')
    .split('\n')
    .filter((line) => /^CF_[A-Z0-9_]+=/u.test(line))
    .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1).trim()]),
);

const api = async (method, endpoint, body) => {
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${env.CF_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json();
  return { status: response.status, json };
};

const fail = (message, json) => {
  console.error(message, JSON.stringify(json?.errors ?? json, null, 2));
  process.exit(1);
};

const PHASE = '/rulesets/phases/http_request_firewall_custom/entrypoint';

const main = async () => {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) fail('CF_API_TOKEN and CF_ZONE_ID must be set in .env');
  const mode = process.argv.includes('--status') ? 'status' : process.argv.includes('--off') ? 'off' : 'on';

  const entry = await api('GET', PHASE);
  const missing = entry.status === 404;
  if (!missing && !entry.json.success) fail('Could not read the custom rules:', entry.json);
  const ruleset = missing ? null : entry.json.result;
  const current = ruleset?.rules?.find((rule) => rule.ref === RULE_REF) ?? null;

  if (mode === 'status') {
    console.log(current ? { enabled: current.enabled, action: current.action, expression: current.expression } : 'No video lock rule.');
    return;
  }

  const rule = {
    ref: RULE_REF,
    description: 'Videos only for the site and verified crawlers (scripts/cloudflare-video-lock.mjs)',
    expression: lockExpression(),
    action: 'block',
    enabled: mode === 'on',
  };

  let result;
  if (!ruleset) {
    result = await api('PUT', PHASE, { rules: [rule] });
  } else if (!current) {
    result = await api('POST', `/rulesets/${ruleset.id}/rules`, rule);
  } else {
    result = await api('PATCH', `/rulesets/${ruleset.id}/rules/${current.id}`, rule);
  }
  if (!result.json.success) fail('Cloudflare refused the rule:', result.json);
  console.log(`Video lock ${rule.enabled ? 'on' : 'off'}:\n  ${rule.expression}`);
};

await main();
