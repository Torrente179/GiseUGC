# Styling Motion UI

## CSS Layers
`src/index.css` is the primary styling surface. It contains Tailwind layers, theme variables, typography classes, section primitives, homepage styles, service page styles, and responsive behavior. `src/App.css` is still present but is not the main styling authority.

## Tailwind
`tailwind.config.ts` defines project color tokens, font families, shadows, animations, content scanning, and plugins. The app uses CSS custom properties so light/dark themes flow through Tailwind color aliases.

## Motion
`src/components/motion/variants.ts` centralizes easing, durations, springs, reveal variants, hover transitions, and hero orchestration. Reveal components use these variants instead of each section inventing its own animation policy.

## Text Reveal Components
`PretextLineReveal`, `SplitTextReveal`, and `LiteSplitTextReveal` implement specialized headline entrance behavior. These are coupled to design feel and should be tested with long bilingual strings.

## UI Primitives
`src/components/ui/` contains shadcn/Radix primitive wrappers. Most are foundational rather than business-specific. Changes here are higher risk when the primitive is imported by multiple features or nested primitives.
