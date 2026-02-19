# Rate-Limit Tuning Log

Track production tuning changes and outcomes here.

| Date (UTC) | Rule ID | Old Threshold | New Threshold | Reason | Outcome After 24h |
|---|---|---|---|---|---|
| 2026-02-19 | media-session | 8 / 60s | 8 / 60s | Initial baseline | Pending |
| 2026-02-19 | main-videos | 180 / 60s | 180 / 60s | Initial baseline | Pending |
| 2026-02-19 | html-documents | 120 / 10s | 120 / 10s | Initial baseline | Pending |
| 2026-02-19 | static-burst | 600 / 60s | 600 / 60s | Initial baseline | Pending |

## Notes

- Tune weekly or after any incident.
- Prefer small threshold changes (10-20%) to avoid abrupt UX regressions.
- Record false positive reports with timestamp and source IP ASN when possible.
