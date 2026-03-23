const isDev = import.meta.env.DEV;
const hasWindow = typeof window !== 'undefined';
const hasPerformanceApi = hasWindow && typeof window.performance !== 'undefined';
const MOBILE_MEDIA_LOG_INTERVAL_MS = 8000;

let longTaskObserverStarted = false;
let mobileMediaObserverStop: (() => void) | null = null;

type NavigatorConnection = {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  saveData?: boolean;
};

type PerformanceWithMemory = Performance & {
  memory?: {
    usedJSHeapSize?: number;
  };
};

export const mark = (name: string) => {
  if (!isDev || !hasPerformanceApi) return;
  window.performance.mark(name);
};

export const measure = (startMark: string, endMark: string, label = `${startMark} -> ${endMark}`) => {
  if (!isDev || !hasPerformanceApi) return;

  try {
    window.performance.measure(label, startMark, endMark);
  } catch {
    // Ignore missing-mark scenarios in non-deterministic user flows.
  }
};

export const startLongTaskObserver = () => {
  if (!isDev || !hasWindow || longTaskObserverStarted) return;
  if (typeof window.PerformanceObserver === 'undefined') return;

  try {
    const observer = new window.PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration < 50) return;
        console.info(
          `[perf] long-task ${Math.round(entry.duration)}ms at ${Math.round(entry.startTime)}ms`,
        );
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
    longTaskObserverStarted = true;
  } catch {
    // Browser/runtime may not expose longtask in all contexts.
  }
};

const shouldEnableMobilePerfDebug = () => {
  if (!hasWindow) return false;
  if (isDev) return true;

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('perfdebug') === '1') return true;
    return window.localStorage.getItem('ugc-perf-debug') === '1';
  } catch {
    return false;
  }
};

const isMobileViewport = () => {
  if (!hasWindow) return false;
  return window.matchMedia('(max-width: 767px)').matches;
};

const getBufferedSeconds = (video: HTMLVideoElement) => {
  try {
    const { buffered, currentTime } = video;
    if (!buffered || buffered.length === 0) return 0;
    const end = buffered.end(buffered.length - 1);
    return Number.isFinite(end) ? Math.max(0, end - currentTime) : 0;
  } catch {
    return 0;
  }
};

const getHeapUsedMb = () => {
  if (!hasPerformanceApi) return null;
  const memory = (window.performance as PerformanceWithMemory).memory;
  if (!memory || typeof memory.usedJSHeapSize !== 'number') return null;
  return memory.usedJSHeapSize / (1024 * 1024);
};

export const logMobileMediaPressureSnapshot = () => {
  if (!hasWindow || !isMobileViewport()) return;

  const videos = Array.from(document.querySelectorAll('video'));
  const activeVideos = videos.filter((video) => !video.paused && !video.ended).length;
  const videosWithSource = videos.filter((video) =>
    Boolean(video.currentSrc || video.getAttribute('src')),
  ).length;
  const totalBufferedSeconds = videos.reduce((sum, video) => sum + getBufferedSeconds(video), 0);
  const heapUsedMb = getHeapUsedMb();

  const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
  const networkLabel = connection
    ? `${connection.effectiveType ?? 'unknown'}${connection.saveData ? '+save-data' : ''}`
    : 'n/a';

  console.info(
    `[perf] mobile-media videos=${videos.length} active=${activeVideos} ` +
      `sources=${videosWithSource} buffered=${totalBufferedSeconds.toFixed(1)}s ` +
      `heap=${heapUsedMb === null ? 'n/a' : `${heapUsedMb.toFixed(1)}MB`} ` +
      `network=${networkLabel} path=${window.location.pathname}`,
  );
};

export const startMobileMediaPressureObserver = () => {
  if (!hasWindow || mobileMediaObserverStop || !shouldEnableMobilePerfDebug()) {
    return mobileMediaObserverStop ?? undefined;
  }

  const runSnapshot = () => {
    logMobileMediaPressureSnapshot();
  };

  const intervalId = window.setInterval(runSnapshot, MOBILE_MEDIA_LOG_INTERVAL_MS);
  const handleVisibilityChange = () => {
    if (!document.hidden) runSnapshot();
  };
  const handlePageHide = () => runSnapshot();

  window.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', handlePageHide);
  runSnapshot();

  (window as Window & { __ugcPerfSnapshot?: () => void }).__ugcPerfSnapshot = runSnapshot;

  mobileMediaObserverStop = () => {
    window.clearInterval(intervalId);
    window.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', handlePageHide);
    delete (window as Window & { __ugcPerfSnapshot?: () => void }).__ugcPerfSnapshot;
    mobileMediaObserverStop = null;
  };

  return mobileMediaObserverStop;
};
