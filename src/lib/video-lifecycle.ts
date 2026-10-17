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

type Suspended = {
  src: string;
  preload: HTMLVideoElement['preload'];
  time: number;
  playing: boolean;
};

const suspended = new Map<HTMLVideoElement, Suspended>();
const suspendHooks = new Set<() => void>();

/** Runs after every video has been released for `pagehide`. */
export const onVideosSuspended = (hook: () => void) => {
  suspendHooks.add(hook);
  return () => {
    suspendHooks.delete(hook);
  };
};

const suspendAll = () => {
  const videos = new Set<HTMLVideoElement>(offPageVideos);
  document.querySelectorAll('video').forEach((video) => videos.add(video));
  videos.forEach((video) => {
    const src = video.getAttribute('src');
    if (!src) return;
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
    if (!state.playing) return;
    video.play().catch(() => {
      if (video.muted) return;
      // Sound needs a fresh tap after a restore; carry on muted meanwhile.
      video.muted = true;
      void video.play().catch(() => undefined);
    });
  });
  suspended.clear();
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
