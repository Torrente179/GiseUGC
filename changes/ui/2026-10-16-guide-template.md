# Guide template on the service pages' language

**Shipped:** 2026-10-16
**Scope:** the five guides, ES + EN (`/recursos/*`, `/en/resources/*`):
`src/components/ResourcePage.tsx`, `src/styles/guide.css`

## Why

The user said the guides did not have the premium design the rest of the site
has, and named that as the reference. The old template was a serif article:
Cormorant headlines and numerals, hairline rules between chapters, a plain
contents list. The service pages below their hero (`2026-10-14-service-keynote.md`)
are DM Sans on linen with glass panels and a close card.

## What shipped

Copy, data, schema, route data and the boot shells are unchanged. Only the
markup classes and styles moved.

- **Tokens:** `guide.css` copies the keynote's values (ink, body, say, hair,
  the teal gradient, card and panel fills, the close ground and orbs) for light
  and `.dark`. DM Sans only.
- **Hero:** breadcrumb, the eyebrow as a pill with the gradient dot, a 92px
  headline, the summary, the lead CTA as the dark "want" pill, the hero points
  as three linen cards.
- **Contents:** a sticky glass panel beside the chapters, with the current
  chapter marked from scroll (`useActiveSection`). Below 1024px it becomes a
  row of chips; on phones it scrolls with the page because the floating
  language pill owns the top of the screen.
- **Chapters:** teal number, 46px heading, the italic lead as a "say" line,
  17px body. Spacing replaces the rules between chapters. Tables sit in a
  glass card; on guides without the contents panel they span 1120px while the
  text keeps 760px.
- **FAQ:** the service pages' centred heading and ruled list with a round
  plus/minus.
- **Close:** the service close card (pill, heading, teal CTA, last-updated
  line) and its index: related services and other guides as arrow rows.
- **Contact CTAs** (`/#contact` in the data) render as this page's `#contact`
  and open the contact panel in place, like the navbar's Escríbeme.

Heading classes carry `section-label` as a hook out of the global `h2:not(...)`
rules; `guide.css` resets it first, the same trick as `service-keynote.css`.

## Not changed

The "Everything I can film for your brand" marquee under the close is the
shared homepage component. The hubs and legal pages followed the same day
(`2026-10-16-hub-legal-template.md`).
