# Styling Motion UI

## CSS Layers

- `src/index.css`: shared theme tokens, typography, homepage, navigation,
  motion, and runtime utilities.
- `src/styles/templates.css`: service, vertical, resource, and legal route
  styling, loaded by those route families.
- `src/styles/template-critical.css`: small template first-paint subset inlined
  by prerendering.

`src/App.css` was removed.

## Tailwind

`tailwind.config.ts` defines project color tokens, font families, shadows, animations, content scanning, and plugins. The app uses CSS custom properties so light/dark themes flow through Tailwind color aliases.

## Motion

The motion system is browser-native:

- CSS transforms and opacity for entrances, hover, and crossfades
- IntersectionObserver-driven reveal wrappers
- native smooth scrolling
- short-lived, time-normalized `requestAnimationFrame` only where continuous
  input must be interpolated

Lenis, GSAP, Framer Motion, Three.js, the shared motion variants module, and the
WebGL atmosphere were removed. Motion begins after route styles settle, pauses
offscreen/hidden where applicable, and honors reduced motion.

## Text Reveal Components

`PretextLineReveal` and `SplitTextReveal` use layout-stable lightweight wrappers.
They must be checked with long bilingual strings and after font loading.
`LiteSplitTextReveal` and the large Pretext layout dependency were removed.

## UI Primitives

The unused shadcn/Radix catalog was removed after import-graph verification.
`src/components/ui/drawer.tsx` is the only retained local primitive because the
mobile shell uses it.

## Motion Guardrail

New motion should animate transform/opacity first, avoid permanent
`will-change`, stop when hidden or settled, and demonstrate no sustained
frame-budget violations in a Chrome performance trace. Never remove meaningful
motion solely to improve a synthetic score.
