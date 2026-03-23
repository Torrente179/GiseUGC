# Service Mobile Video Performance Reset

**Date:** 2026-03-23

## Problem

The service landing pages on mobile were rendering the hero poster and reel thumbnails as real `<video>` elements pointing at `mainSrc#t=1.2`. Even though those surfaces were visually acting like static posters, the browser still had to create and manage video resources for each visible card. After visiting multiple service pages, mobile devices could accumulate enough media work to make the site feel hot, laggy, and slow to recover.

## Fix

- Replaced the mobile service hero poster surface with a plain `<img>` using `posterSrc`
- Replaced the mobile reel thumbnail surfaces with plain lazy-loaded `<img>` elements using `posterSrc`
- Kept theater playback on the existing high-quality source order so opening a clip still prioritizes the full-quality video
- Corrected the theater `poster` prop to use a real poster image instead of a video URL fragment

## Result

Mobile service pages now behave like lightweight poster galleries until the user explicitly opens a clip. That removes unnecessary thumbnail decoder pressure while preserving high-quality video playback inside the theater.
