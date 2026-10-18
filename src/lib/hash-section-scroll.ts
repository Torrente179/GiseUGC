/**
 * Landing on a section of a page that is still mounting: a link from another
 * page (`/#services`, `/#contact`), or Back to a page the visitor had scrolled.
 *
 * The page lands on the section at once and holds it there, frame by frame,
 * while the deferred sections above it mount and change height. The
 * visitor's first touch, wheel, click or key hands the scroll back. It never
 * parks the page at the top while it waits, and never moves it after the
 * visitor has taken over. Holding still until a finger moved the page was the
 * "frozen for a couple of seconds" on iPhone (2026-10-17).
 */

/** Room for the fixed nav above a section the page lands on. */
export const HASH_SCROLL_NAV_OFFSET = 80;

/** Longest a landing is held while the page settles (deferred sections, fonts). */
export const SCROLL_PIN_MAX_MS = 3200;

/** Any of these means the visitor is scrolling the page themselves. */
export const USER_SCROLL_INPUTS = ['touchstart', 'wheel', 'pointerdown', 'keydown'] as const;

/**
 * The window position that puts an element's top `offset` px below the top of
 * the viewport, within what the page can scroll.
 */
export const pinnedScrollY = (
  elementTop: number,
  scrollY: number,
  offset: number,
  pageHeight: number,
  viewportHeight: number,
): number => Math.max(0, Math.min(elementTop + scrollY - offset, pageHeight - viewportHeight));

type PinOptions = {
  /** Looked up every frame: the element may not be mounted yet. */
  find: () => HTMLElement | null;
  /** Where its top is held, in px from the top of the viewport. */
  offset: number;
  maxMs?: number;
};

/**
 * Holds an element at `offset` from the top of the viewport until the visitor
 * scrolls, or for `maxMs`. Returns a function that lets go early.
 */
export const pinElementInView = ({ find, offset, maxMs = SCROLL_PIN_MAX_MS }: PinOptions) => {
  const start = performance.now();
  let frame = 0;
  let released = false;

  const release = () => {
    if (released) return;
    released = true;
    cancelAnimationFrame(frame);
    USER_SCROLL_INPUTS.forEach((type) => window.removeEventListener(type, release, true));
  };
  USER_SCROLL_INPUTS.forEach((type) => window.addEventListener(type, release, { capture: true, passive: true }));

  const hold = () => {
    if (released) return;
    const element = find();
    if (element) {
      const y = pinnedScrollY(
        element.getBoundingClientRect().top,
        window.scrollY,
        offset,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
      if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, left: 0, behavior: 'auto' });
    }
    if (performance.now() - start >= maxMs) {
      release();
      return;
    }
    frame = requestAnimationFrame(hold);
  };
  hold();
  return release;
};

/* ── Back to a scrolled page ─────────────────────────────────────────────── */

const ANCHOR_KEY_PREFIX = 'gisela:scroll-anchor:';

export type ScrollAnchor = { id: string; offset: number };

/**
 * The section at the top of the screen, and how far its top sits from the top
 * of the viewport. `null` at the top of the page, where there is nothing to
 * hold.
 */
export const findScrollAnchor = (doc: Document = document): ScrollAnchor | null => {
  // At the top there is nothing to hold, unless an open dialog has locked the
  // page (position: fixed and a negative top keep its place, scrollY reads 0).
  if ((doc.defaultView?.scrollY ?? 0) < 1 && !doc.body.style.top) return null;
  let best: ScrollAnchor | null = null;
  for (const section of Array.from(doc.querySelectorAll<HTMLElement>('section[id]'))) {
    // A duplicate id (a hidden shell) would not be the one found on return.
    if (doc.getElementById(section.id) !== section) continue;
    const { top, bottom } = section.getBoundingClientRect();
    if (bottom - top < 1 || top > HASH_SCROLL_NAV_OFFSET || bottom <= HASH_SCROLL_NAV_OFFSET) continue;
    if (!best || top > best.offset) best = { id: section.id, offset: Math.round(top) };
  }
  return best;
};

export const saveScrollAnchor = (pathname: string, anchor: ScrollAnchor | null) => {
  try {
    if (anchor) sessionStorage.setItem(ANCHOR_KEY_PREFIX + pathname, JSON.stringify(anchor));
    else sessionStorage.removeItem(ANCHOR_KEY_PREFIX + pathname);
  } catch {
    // Private mode or storage off: Back still restores the browser's own way.
  }
};

export const readScrollAnchor = (pathname: string): ScrollAnchor | null => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(ANCHOR_KEY_PREFIX + pathname) ?? 'null') as ScrollAnchor | null;
    return stored && typeof stored.id === 'string' && Number.isFinite(stored.offset) ? stored : null;
  } catch {
    return null;
  }
};

/** Back/Forward or a reload: the browser is restoring a scroll position. */
export const isRestoredNavigation = () => {
  const entry = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
  return entry?.type === 'back_forward' || entry?.type === 'reload';
};
