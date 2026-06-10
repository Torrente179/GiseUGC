import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import { getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';

type HeroStoryStackProps = {
  clips: ReelClip[];
  advanceMs?: number;
};

const SWIPE_THRESHOLD = 48;
const TAP_SLOP = 10;
const TAP_MS = 350;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Mobile hero "story stack" — an app-native composition instead of the desktop
 * 3D fan: one focused card front and center, the next card peeking from the
 * right edge, story-style segmented progress on top. Auto-advances; swipe or
 * tap (stories zones) to navigate; press-and-hold pauses.
 * Decode-light: only the focused card plays video, the rest show posters.
 */
const HeroStoryStack = ({ clips, advanceMs = 4200 }: HeroStoryStackProps) => {
  const n = clips.length;
  const cycleMs = prefersReducedMotion() ? Math.max(advanceMs, 8000) : advanceMs;
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const prevActiveRef = useRef(0);
  const activeRef = useRef(0);
  const timerRef = useRef<number>();
  const startedAtRef = useRef(0);
  const remainingRef = useRef(cycleMs);
  const gestureRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const inViewRef = useRef(true);
  const stageRef = useRef<HTMLDivElement>(null);

  activeRef.current = active;

  const goTo = (next: number) => {
    if (n <= 1) return;
    prevActiveRef.current = activeRef.current;
    remainingRef.current = cycleMs;
    setActive(((next % n) + n) % n);
    setCycle((c) => c + 1);
    setVideoReady(false);
  };

  // Remaining-time timer — press-and-hold subtracts elapsed, resume continues.
  useEffect(() => {
    if (n <= 1 || paused) return undefined;
    startedAtRef.current = performance.now();
    timerRef.current = window.setTimeout(() => {
      if (inViewRef.current) goTo(activeRef.current + 1);
    }, Math.max(250, remainingRef.current));
    return () => window.clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle, paused, n]);

  // Stop cycling while the hero is scrolled away.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      setPaused(!entry.isIntersecting);
    });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    gestureRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    remainingRef.current = Math.max(0, remainingRef.current - (performance.now() - startedAtRef.current));
    setPaused(true);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const g = gestureRef.current;
    gestureRef.current = null;
    setPaused(false);
    if (!g) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    const dt = performance.now() - g.t;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      goTo(activeRef.current + (dx < 0 ? 1 : -1));
      return;
    }
    if (Math.abs(dx) < TAP_SLOP && Math.abs(dy) < TAP_SLOP && dt < TAP_MS) {
      const width = stageRef.current?.clientWidth ?? window.innerWidth;
      goTo(activeRef.current + (e.clientX < width * 0.3 ? -1 : 1));
    }
  };

  const handlePointerCancel = () => {
    gestureRef.current = null;
    setPaused(false);
  };

  const posFor = (r: number) => {
    if (r === 0) return 'focus';
    if (r === 1) return 'next';
    if (r === n - 1) return 'prev';
    return 'back';
  };

  return (
    <div
      ref={stageRef}
      className="hero-story"
      aria-hidden="true"
      data-paused={paused || undefined}
      style={{ '--advance': `${cycleMs}ms` } as CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className="hero-story-progress">
        {clips.map((clip, i) => (
          <span key={clip.id} className="hero-story-seg">
            <span
              key={i === active ? `fill-${cycle}` : `idle-${i}`}
              className="hero-story-seg-fill"
              data-state={i === active ? 'active' : i < active ? 'done' : 'idle'}
            />
          </span>
        ))}
      </div>
      {clips.map((clip, i) => {
        const r = (i - active + n) % n;
        const oldR = (i - prevActiveRef.current + n) % n;
        // A card jumping from offscreen-left ("prev") back into the right
        // stack must teleport, not streak across the screen.
        const snap = oldR === n - 1 && r === n - 2;
        const poster = getBestPosterSrc(clip);
        return (
          <div
            key={clip.id}
            className={`hero-story-card${snap ? ' hero-story-card--snap' : ''}`}
            data-pos={posFor(r)}
            style={{ zIndex: r === 0 ? 3 : r === 1 || r === n - 1 ? 2 : 1 }}
          >
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="hero-story-face"
            />
            {r === 0 && (
              <AutoplayPreviewVideo
                src={clip.previewSrc}
                poster={poster}
                className="hero-story-face hero-story-video"
                preload="metadata"
                playbackPriority="hero"
                loadStrategy="immediate"
                rootMargin="0px"
                data-ready={videoReady || undefined}
                onPlaying={() => setVideoReady(true)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HeroStoryStack;
