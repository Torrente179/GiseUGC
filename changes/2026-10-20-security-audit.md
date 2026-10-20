# Website security review — 2026-10-20

## Scope and baseline

- Reviewed the production Vercel deployment at commit `74bf647d38bbdb54556ab865d10a3ed9f82bff83` and made code changes on the isolated `codex/security-audit-20261020` worktree. The original checkout had unrelated edits and was left alone.
- Traced the public app, prerender/build scripts, generated HTML, dependency lockfile, Vercel headers/project metadata, and the Cloudflare media rule. The site is a static React/Vite deployment with no contact form, login, application API, or user-upload endpoint in this repository.
- This is a bounded review, not a penetration test or an account-wide compromise investigation. No authenticated Vercel access logs, Cloudflare traffic logs, GitHub organization settings, R2 bucket policy, or production secret inventory were examined.

## Direct findings and changes

1. **Affected React Router DOM version.** The production lockfile had `react-router-dom@6.30.4`. [GHSA-jjmj-jmhj-qwj2](https://github.com/advisories/GHSA-jjmj-jmhj-qwj2) lists 6.30.2–6.30.5 as affected by an open-redirect/XSS issue and 6.30.6 as the patched 6.x release. Pinned `react-router-dom` and its `react-router` dependency to 6.30.6, and `@remix-run/router` to 1.23.4. This removes the package-specific XSS advisory; it does not prove the old version was exploitable through this site's current static links.
2. **Content links accepted executable URL schemes.** `InlineCopy` and three build-time copy renderers used authored `[label](href)` data without scheme validation. They now render invalid schemes, protocol-relative paths, backslashes, control characters, and credential-bearing HTTPS URLs as plain labels. Site-root routes, fragments, and ordinary HTTPS links continue to work. This closes a future content-ingestion/XSS path even if authored copy changes.
3. **CSP allowed all inline event handlers.** Production `script-src` needs `unsafe-inline` for current boot/theme scripts. Added `script-src-attr 'unsafe-hashes'` with only the SHA-256 of Beasties' known stylesheet `onload` handler. This blocks other inline event handlers while preserving deferred CSS. Prerender now fails if generated handlers lack a matching production CSP hash. Inline `<script>` blocks remain allowed; removing `unsafe-inline` safely requires a separate boot/theme and GTM migration.
4. **Vulnerable build dependencies.** Pinned direct `postcss` to 8.5.23, the fixed release for [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp). Applied npm's nonbreaking lockfile fixes, including patched `nanoid`, `source-map-js`, `brace-expansion`, `proxy-addr`, and `vitest`. No `--force` or major Tailwind migration was used.

## Live observations

- `HEAD` requests on `/`, `/en/`, and `/recursos/como-contratar-creadora-ugc/` returned 200 and the configured CSP, HSTS, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY` on 2026-10-20. `/.env` and `/.git/config` returned 404. These checks cover only the named paths.
- Vercel project `gise-ugc` reported SSO protection for deployment URLs and previews; public custom domains remain intentionally accessible. The connected firewall-config and attack-status API calls returned `404 Seawall Config not found`, so project-specific Vercel WAF rules and attack history were **not verified**.
- The Cloudflare custom media rule `gise_video_referer_lock` was enabled with action `block`. One known video returned 403 with no Referer, 403 with a foreign Referer, and 200 with the site's Referer. Referer is forgeable, so this is hotlink friction, not confidentiality protection or DRM.
- The tracked source has no committed `.env` file. This does not assess historic commits, deployment environment values, or other accounts.

## Verification

- `npm ci` completed from the patched lockfile locally and in [GitHub CI run 39466900761](https://github.com/Torrente179/GiseUGC/actions/runs/39466900761) on Node 20. That run also passed typecheck, tests, and lint. An initial CI run failed because npm 11 had removed optional lockfile entries required by npm 10; commit `326f3d5` restored those unchanged entries.
- Typecheck passed. Vitest: 465/465 tests passed across 37 files. ESLint: 0 errors, 14 pre-existing Fast Refresh warnings.
- `SEO_SKIP_VIDEO_HEAD=1 npm run build` prerendered 36 registered routes and passed the new CSP handler-hash gate. In the local sandbox, 64 R2 readiness requests were inconclusive; the build preserved the last known-good generated catalog. This is not independent verification of all media URLs.
- Headless Chrome loaded home, English home, and a resource page from local preview with stylesheets activated, React hydrated, no CSP console errors, and no page errors. A locally injected arbitrary `onclick` handler was blocked by CSP. Build and browser tests used the local Node runtime; the Vercel project's configured runtime is Node 22.
- The last successful `npm audit` scan, before the optional lock entries were restored for CI, changed from 40 package findings (1 critical, 24 high) to 27 (0 critical, 16 high). `npm audit --omit=dev` then reported 9 package findings (0 critical, 5 high), including Tailwind build-tool descendants and React Router 6 advisories. The registry was unavailable for a fresh scan of the final lockfile, so these are dated scan results, not final-lockfile counts. Audit counts are package/advisory exposure signals, not evidence that visitors can exploit each item.
- The Vercel preview for commit `326f3d5` built successfully. Its home page returned 200 with the new `script-src-attr` CSP directive; the generated HTML contains the expected deferred stylesheet handler. The preview has `X-Robots-Tag: noindex`.

## Remaining risk and release boundary

- React Router 6 still inherits [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6), whose published fix is in v7.18.0. Its described condition is attacker-supplied paths passed to navigation. This site's reviewed navigation sources are static/author controlled; the new content-link guard narrows that path. [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) explicitly excludes Declarative Mode, which this app uses. A v7 migration needs its own compatibility review.
- `script-src 'unsafe-inline'` remains an XSS defense gap for inline `<script>` injection. The new `script-src-attr` policy covers event-handler attributes only. A strict script CSP should be staged with GTM/analytics and theme boot checks before enforcement.
- The remaining reported npm findings are mostly build/test/CLI packages; the Tailwind 3 dependency chain includes advisories that npm cannot clear without a major Tailwind 4 migration. Avoid treating the numeric audit result as a live-site vulnerability count.
- Code fixes in this worktree are not yet on production. The preview build and header are confirmed, while analytics, media playback, and route navigation on that preview have not been checked. Production traffic/compromise status remains unproven without provider logs.
