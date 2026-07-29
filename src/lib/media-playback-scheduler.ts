export type MediaPlaybackPriority = 'theater' | 'hero' | 'preview' | 'ambient' | 'background';

type SchedulerEntry = {
  id: number;
  active: boolean;
  priority: MediaPlaybackPriority;
  createdAt: number;
  setGranted: (granted: boolean) => void;
};

const priorityWeight: Record<MediaPlaybackPriority, number> = {
  theater: 100,
  hero: 80,
  preview: 60,
  ambient: 35,
  background: 20,
};

/**
 * How many decoders a priority class may hold at once.
 *
 * Everything except the hero is deliberately single-slot: a wall of ambient
 * card previews was one of the causes of the mobile decode pressure this
 * scheduler exists to prevent. The hero is the exception because its three
 * film frames are one authored composition rather than a list — showing one
 * frame moving beside two stills reads as a loading failure.
 */
const priorityCapacity: Record<MediaPlaybackPriority, number> = {
  theater: 1,
  hero: 3,
  preview: 1,
  ambient: 1,
  background: 1,
};

const entries = new Map<number, SchedulerEntry>();
let nextEntryId = 1;
let listenersAttached = false;

const getConnectionProfile = () => {
  if (typeof navigator === 'undefined') return { constrained: false, slow: false };
  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'; saveData?: boolean };
    }
  ).connection;

  const constrained =
    Boolean(connection?.saveData) ||
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g';

  return {
    constrained,
    slow: constrained || connection?.effectiveType === '3g',
  };
};

const reconcile = () => {
  const isHidden = typeof document !== 'undefined' && document.visibilityState === 'hidden';
  const activeEntries = [...entries.values()]
    .filter((entry) => entry.active)
    .sort((a, b) => {
      const byPriority = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (byPriority !== 0) return byPriority;
      return a.createdAt - b.createdAt;
    });

  // A theater always wins outright and never shares a decoder with ambient
  // playback. Otherwise the highest priority class present takes the slots and
  // everything below it stays unloaded — so a hero group cannot be diluted by
  // card previews, and card previews cannot borrow the hero's extra capacity.
  const theaterEntry = activeEntries.find((entry) => entry.priority === 'theater');
  const topPriority = theaterEntry?.priority ?? activeEntries[0]?.priority;

  let capacity = topPriority ? priorityCapacity[topPriority] : 0;
  if (capacity > 1 && getConnectionProfile().slow) {
    // Metered or slow links get one decoder regardless of class; the remaining
    // frames keep their posters, which are already painted.
    capacity = 1;
  }

  const selected = isHidden || !topPriority
    ? []
    : activeEntries.filter((entry) => entry.priority === topPriority).slice(0, capacity);

  const grantedIds = new Set(selected.map((entry) => entry.id));
  entries.forEach((entry) => {
    entry.setGranted(entry.active && grantedIds.has(entry.id));
  });
};

const attachListeners = () => {
  if (listenersAttached || typeof window === 'undefined') return;
  listenersAttached = true;

  window.addEventListener('resize', reconcile, { passive: true });
  document.addEventListener('visibilitychange', reconcile);

  const connection = (
    navigator as Navigator & {
      connection?: EventTarget;
    }
  ).connection;
  connection?.addEventListener?.('change', reconcile);
};

export const registerMediaPlaybackEntry = (
  setGranted: (granted: boolean) => void,
  priority: MediaPlaybackPriority,
) => {
  attachListeners();

  const id = nextEntryId;
  nextEntryId += 1;

  entries.set(id, {
    id,
    active: false,
    priority,
    createdAt: performance.now(),
    setGranted,
  });

  reconcile();

  return {
    update(active: boolean, nextPriority: MediaPlaybackPriority = priority) {
      const entry = entries.get(id);
      if (!entry) return;
      entry.active = active;
      entry.priority = nextPriority;
      reconcile();
    },
    unregister() {
      entries.delete(id);
      setGranted(false);
      reconcile();
    },
  };
};
