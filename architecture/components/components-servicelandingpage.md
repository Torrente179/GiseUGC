# Service Landing Page

Source: `src/components/ServiceLandingPage.tsx`

## Role
Renders every service landing page from typed service data, media proof examples, structured data, related links, and theater playback state.

## Structural Facts
- Lines: 890
- Category: `code`
- Language: `typescript`
- Layer: Dynamic Page Factories
- Change risk: Low

## Exports
- None detected.

## Local Functions
- `buildUrl`
- `formatDuration`
- `getHighQualityServicePosterSrc`
- `useScrollReveal`
- `RevealSection`
- `ServiceLandingPage`

## Classes
- None detected.

## Depends On
- `src/components/media/AutoplayPreviewVideo.tsx`
- `src/components/media/TheaterVideo.tsx`
- `src/components/motion/PretextLineReveal.tsx`
- `src/components/Navbar.tsx`
- `src/components/PageSeo.tsx`
- `src/components/SiteFooter.tsx`
- `src/data/nuevos-r2-ready.ts`
- `src/data/portfolio-clips.ts`
- `src/data/service-pages.ts`
- `src/data/vertical-pages.ts`
- `src/lib/locale-path.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It is content-driven and should be reviewed with the data modules it imports.
- It participates in the media-heavy path, so memory, autoplay, and mobile behavior matter.
- It is route/locale aware and may affect canonical or bilingual navigation behavior.
- It relies on the shared motion layer for reveal behavior or timing.

## How It Works With The Website
Renders every service landing page from typed service data, media proof examples, structured data, related links, and theater playback state. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

## Maintenance Checkpoints
- Before editing, inspect every importer listed above.
- If the file touches media, test mobile memory and autoplay behavior.
- If the file touches locale paths or SEO, verify Spanish and English routes plus canonical alternates.
- If the file is a UI primitive, search for all consumers before changing variants or class names.

## Parser Snapshot
```json
{
  "metrics": {
    "importCount": 11,
    "exportCount": 0,
    "functionCount": 6,
    "classCount": 0
  },
  "functions": [
    "buildUrl",
    "formatDuration",
    "getHighQualityServicePosterSrc",
    "useScrollReveal",
    "RevealSection",
    "ServiceLandingPage"
  ],
  "exports": [],
  "classes": []
}
```
