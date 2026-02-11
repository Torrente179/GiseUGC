# Modern Animations with Framer Motion (Less is More)

Applied a minimalist, high-end animation system to the website to enhance the premium feel without being distracting or slow.

## Changes Made

### 1. Unified Animation System
- Integrated `framer-motion` for professional physics and coordinated entrance reveals.
- Used consistent "Less is More" timing: fast, high-speed transitions that don't block content access.

### 2. Hero Section (Enhanced)
- **Split-text Title**: Implemented word-by-word reveals for "Gisela Saldarriaga" for a high-end luxury feel.
- **Floating Parallax**: Added continuous floating animations to the main hero image shell and tactical cards.
- **Ambient Aura**: Subtle opacity/scale pulse on the hero glow background.

### 3. Services & Portfolio (Enhanced)
- **Split-text Headers**: Added word-by-word entrance reveals for the Portfolio main title.
- **Spring Hover Physics**: High-stiffness, low-damping spring hover effects on all interactive cards.

### 4. Site-wide Scroll Reveals
- Implemented coordinated `whileInView` reveals for previously static sections:
    - **Social Proof**: Staggered items and luxury fade-ins.
    - **Testimonials**: Smooth scale-in panels and entrance headers.
    - **Contact**: Staggered entrance for sidebar and form containers.

## Technical Details
- Used `[0.22, 1, 0.36, 1]` for all reveals (sharp editorial motion).
- Custom spring physics for interactive elements: `{ type: "spring", stiffness: 400, damping: 25 }`.
- Universal `viewport={{ once: true }}` for performance optimization.
