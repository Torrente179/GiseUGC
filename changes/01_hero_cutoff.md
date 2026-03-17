# Hero Image Cutoff Fix
- **Date**: 2026-03-13
- **File modified**: `src/components/Hero.tsx`
- **Issue**: The cinematic full-screen hero image was using `object-top` and `lg:object-center`, which inadvertently cut off the creator's face on certain screen sizes.
- **Fix**: Adjusted the `object-position` utility classes to strictly anchor the image using custom percentages (`object-[50%_15%] md:object-[50%_20%] lg:object-[50%_25%]`). This gradually lowers the image focus depending on the viewport height to ensure the face is always perfectly positioned within the frame, without the top getting excessively chopped on wider cinematic displays.
