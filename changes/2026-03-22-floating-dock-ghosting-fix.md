# Fix: Floating contact dock always ghosted on service pages (desktop)

**Date:** 2026-03-22
**File:** `src/components/FloatingContactDock.tsx`

## Problem

On desktop, the floating social media dock (WhatsApp, Instagram, TikTok, etc.) was permanently ghosted (faded out, blurred, non-interactive) on all service pages. It should only ghost when the user scrolls to the very bottom of the page (footer fully visible), matching the home page behavior.

## Root cause

Service pages render both a mobile and desktop layout, each containing a `<Footer />` with `id="contact"`. The mobile footer is hidden via CSS (`md:hidden`) and has `offsetHeight: 0`. `document.getElementById('contact')` always returned this first hidden footer, so `getBoundingClientRect().bottom` was `0`, which is always `<= window.innerHeight + 2` — making the dock think the page was at the absolute bottom at all times.

## Fix

Replaced `document.getElementById('contact')` with `document.querySelectorAll('#contact')` and iterate to find the first footer with `offsetHeight > 0`. This ensures the dock evaluates against the actually visible footer.

```diff
-      const footer = document.getElementById('contact');
+      const footerCandidates = document.querySelectorAll<HTMLElement>('#contact');
+      let footer: HTMLElement | null = null;
+      for (const candidate of footerCandidates) {
+        if (candidate.offsetHeight > 0) { footer = candidate; break; }
+      }
```
