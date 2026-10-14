# `/#contact` must scroll on a cold load

**Status:** Current
**Implemented:** 2026-10-14
**Scope:** Hash-section scroll in `App.tsx`

The pricing-guide CTAs use `/#contact` and `/en/#contact`. The live target is `id="contact"` on `PageEndStrip`. A Playwright check on production showed the id present but `scrollY` staying at 0:

- The first load is a React Router `POP`. The restore-scroll branch ran first and jumped to `y=0`, skipping the hash.
- Even on `PUSH`, the first `rAF` can measure the footer before route layout / view transitions settle, so the computed Y is ~0.

Hash now wins over POP restore. `scrollToSection` waits a minimum of 8 attempts (~640ms), keeps retrying while a tall page still reports a near-top target, and also waits until the measured Y is stable (deferred home sections can still grow after the first jump). The jump is immediate so a later view-transition cannot cancel it.
