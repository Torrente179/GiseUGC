# Security and Deployment Hardening

## Summary
This condenses the deployment and hardening work. The codebase experimented with stronger media/session protection, then simplified down to a lighter baseline while also tightening Vercel cache behavior, fixing routing config issues, and adding Speed Insights instrumentation.

## Current runtime touchpoints
- `vercel.json`
- `src/App.tsx`
- deployment configuration and hosting defaults

## Consolidated outcomes
1. The codebase tested stronger protections around media traffic and fake-cost spikes, then intentionally simplified the production baseline so hosting remained practical.
2. Static assets and HTML now have explicit Vercel cache policy handling instead of relying on defaults.
3. The unmatched Vercel function pattern issue was fixed so deploy config behaves predictably.
4. Speed Insights was added to the runtime for ongoing visibility into production performance.

## Notes on superseded details
- The signed-media session work was exploratory and later reduced to the simpler baseline captured in runtime config.
- This archive keeps the deployment history without preserving every isolated deploy note.

## Legacy notes absorbed
- `2026-02-19-anti-cost-spike-hardening-and-signed-media-sessions.md`
- `2026-02-27-simplified-security-hardening-baseline.md`
- `2026-02-27-vercel-cache-headers-static-assets-and-html.md`
- `2026-02-27-vercel-unmatched-function-pattern-fix.md`
- `2026-03-02-vercel-speed-insights-setup.md`
