# Modern Animations with Framer Motion (Less is More)

Applied a minimalist, high-end animation system to the website to enhance the premium feel without being distracting or slow.

## Changes Made

### 1. Unified Animation System
- Integrated `framer-motion` for professional physics and coordinated entrance reveals.
- Used consistent "Less is More" timing: fast, high-speed transitions that don't block content access.

### 2. Hero Section
- Implemented staggered slide-up reveals for the eyebrow, title, and CTA chips.
- Added a subtle scale-in effect for the main hero image to create depth on load.

### 3. Services Section
- Added `whileInView` reveals for the section header and service cards.
- Implemented high-stiffness, low-damping spring hover effects on service cards for a tactile, responsive feel.

### 4. Portfolio Section
- Coordinated entrance animations for the Portfolio header and Reel horizontal scroller.
- Applied snappy spring hover physics to all reel cards.
- Integrated entrance reveals for the Collage section and its mobile counterpart.

## Technical Details
- Used `[0.22, 1, 0.36, 1]` (custom cubic-bezier) for entrance eases to mimic high-end editorial motion.
- Implemented custom spring physics for hovers: `{ type: "spring", stiffness: 400, damping: 25 }`.
- Ensured all animations are `viewport={{ once: true }}` to avoid repetitive motion during navigation.
