# Hubs and legal pages on the guide template

**Shipped:** 2026-10-16
**Scope:** the hub indexes and the legal pages, ES + EN (`/servicios/`,
`/recursos/`, `/politica-de-privacidad/`, `/terminos-y-uso-de-contenido/` and
their `/en/` twins): `src/components/HubPage.tsx`, `src/components/LegalPage.tsx`,
`src/styles/guide.css`

## Why

The page-end strip links to these four pages. After the guides moved to the
service pages' language (`2026-10-16-guide-template.md`) they were the last
pages still on the older templates: the hubs on the `rsc-*` hero and
`st-related` rows, the legal pages on Tailwind panels with a serif-era title.
The user asked for all four to join the guide family.

## What shipped

Copy, data, schema and the boot shells are unchanged. Only markup classes and
styles moved, using the pieces already in `guide.css`.

- **Hubs:** breadcrumb, the hub label as the pill, the 92px headline and lead.
  The child list is the close's index rows at full width: one header with the
  count, then two columns of rows (number, title, blurb, arrow), one column
  below 1024px. The close card carries the pill, the Fiverr proof line as a
  "say" line on the services hub only, the teal CTA, and the other hub as an
  arrow row.
- **Legal pages:** the same hero with a smaller headline for the long titles,
  the dates under the lead, the summary items as two-up linen cards and the
  primary market as a wide note card. The body is the guide's sticky contents
  panel with numbered chapters; section notes are linen cards. The close card
  has the legal contact heading, a mailto CTA, the address, the related page
  as an arrow row and the disclaimer as fine print.
- **Contact CTA on the hubs** renders as `#contact` and opens the contact
  panel in place, like the guides and the navbar. Two test assertions that
  expected `/#contact` in the React markup now check that CTA instead; the
  committed shells still carry `/#contact` for crawlers without scripts.

The `rsc-*` and hub blocks in `templates.css` had no users left and were removed.
