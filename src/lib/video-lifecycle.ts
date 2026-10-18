/**
 * When a <video> lets go of its stream.
 *
 * Taking a video out of the page does not free it. Its decoder and everything
 * it has buffered stay alive until the element is garbage-collected, which
 * Safari can put off for a long time because the memory is native, not
 * JavaScript. On iPhone that is what builds up: a reel card that swaps its
 * video every few seconds leaves a full-resolution player behind each time,
 * until iOS kills the tab. So every player here hands its stream back the
 * moment it is done with it (`releaseVideo`).
 *
 * The same goes for leaving a page. Safari keeps the last pages in its
 * back/forward cache, in the same process as the page you are on, with every
 * video still holding its buffers. `installVideoPageLifecycle` empties them on
 * `pagehide` and puts them back on `pageshow` if the page is restored.
 */

/** Frees the element's decoder and buffered media now. It keeps its poster. */
export const releaseVideo = (video: HTMLVideoElement) => {
  video.pause();
  if (!video.hasAttribute('src')) return;
  video.removeAttribute('src');
  video.load();
};

/**
 * Elements made outside React that can sit off the page with a source (the
 * feed's pooled players), so `pagehide` can find them.
 */
const offPageVideos = new Set<HTMLVideoElement>();

export const trackOffPageVideo = (video: HTMLVideoElement) => {
  offPageVideos.add(video);
};

export const untrackOffPageVideo = (video: HTMLVideoElement) => {
  offPageVideos.delete(video);
};

/**
 * Videos fed through Media Source (the feed's streams). Their owner suspends
 * and restores them itself (`onVideosSuspended` / `onVideosResumed`): a
 * Media Source URL cannot simply be put back.
 */
const managedVideos = new WeakSet<HTMLVideoElement>();

export const markManagedVideo = (video: HTMLVideoElement) => {
  managedVideos.add(video);
};

export const unmarkManagedVideo = (video: HTMLVideoElement) => {
  managedVideos.delete(video);
};

type Suspended = {
  src: string;
  preload: HTMLVideoElement['preload'];
  time: number;
  playing: boolean;
};

const suspended = new Map<HTMLVideoElement, Suspended>();
const suspendHooks = new Set<() => void>();
const resumeHooks = new Set<() => void>();

const addHook = (hooks: Set<() => void>, hook: () => void) => {
  hooks.add(hook);
  return () => {
    hooks.delete(hook);
  };
};

/** Runs after every video has been released for `pagehide`. */
export const onVideosSuspended = (hook: () => void) => addHook(suspendHooks, hook);

/** Runs when a page restored from the back/forward cache gets its videos back. */
export const onVideosResumed = (hook: () => void) => addHook(resumeHooks, hook);

const suspendAll = () => {
  const videos = new Set<HTMLVideoElement>(offPageVideos);
  document.querySelectorAll('video').forEach((video) => videos.add(video));
  videos.forEach((video) => {
    const src = video.getAttribute('src');
    if (!src || managedVideos.has(video)) return;
    suspended.set(video, {
      src,
      preload: video.preload,
      time: video.currentTime,
      playing: !video.paused,
    });
    releaseVideo(video);
  });
  suspendHooks.forEach((hook) => hook());
};

/** Plays a restored video, muted if the browser wants a fresh tap for sound. */
export const playAfterRestore = (video: HTMLVideoElement) => {
  video.play().catch(() => {
    if (video.muted) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  });
};

const resumeAll = () => {
  suspended.forEach((state, video) => {
    // Something else gave it a source in the meantime; that one stands.
    if (video.hasAttribute('src')) return;
    video.preload = state.preload;
    video.src = state.src;
    if (state.time > 0) {
      video.addEventListener(
        'loadedmetadata',
        () => {
          video.currentTime = Math.min(state.time, video.duration || state.time);
        },
        { once: true },
      );
    }
    if (state.playing) playAfterRestore(video);
  });
  suspended.clear();
  resumeHooks.forEach((hook) => hook());
};

/**
 * A link tap that leaves the page. Media Source players (the feed's streams)
 * let go now, before the browser decides whether to keep this page in its
 * back/forward cache, so a page holding streams can still come back instantly
 * on Back. They are put back if the page is restored (`onVideosResumed`).
 */
export const releaseStreamsForNavigation = () => {
  suspendHooks.forEach((hook) => hook());
};

let installed = false;

export const installVideoPageLifecycle = () => {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('pagehide', suspendAll);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) resumeAll();
    else suspended.clear();
  });
};
