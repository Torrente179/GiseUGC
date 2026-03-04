const isDev = import.meta.env.DEV;
const hasWindow = typeof window !== 'undefined';
const hasPerformanceApi = hasWindow && typeof window.performance !== 'undefined';

let longTaskObserverStarted = false;

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
