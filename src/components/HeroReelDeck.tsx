import { useEffect, useRef, useState } from 'react';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import { getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';

type HeroReelDeckProps = {
  clips: ReelClip[];
  /** How many cards fan out behind the focused one. */
  fan?: number;
  advanceMs?: number;
};

/**
 * A "ramillete" of reel cards fanned in 3D space. The focus auto-cycles so a
 * different reel keeps rotating to the front; the others float back and turn.
 * Decode-light: only the focused card plays video (a 720p preview MP4 — no
 * hls.js churn), every other card shows its poster.
 */
const HeroReelDeck = ({ clips, fan = 3, advanceMs = 4200 }: HeroReelDeckProps) => {
  const n = clips.length;
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (n <= 1) return undefined;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setActive((a) => (a + 1) % n);
    }, advanceMs);
    return () => window.clearInterval(id);
  }, [n, advanceMs]);

  // Transform for a card at relative position r (0 = focused/front).
  const transformFor = (r: number) => {
    if (r === 0) return 'translate(-50%, -50%) translateZ(0) rotateY(0deg) scale(1)';
    const x = 50 + (r - 1) * 24; // % of card width, fanned to the right
    const ry = -17 - (r - 1) * 4;
    const tz = -150 * r;
    const s = Math.max(0.58, 0.82 - (r - 1) * 0.11);
    return `translate(-50%, -50%) translateX(${x}%) translateZ(${tz}px) rotateY(${ry}deg) scale(${s})`;
  };

  return (
    <div
      className="hero-deck"
      aria-hidden="true"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {clips.map((clip, i) => {
        const r = (i - active + n) % n;
        const visible = r <= fan;
        const poster = getBestPosterSrc(clip);
        return (
          <div
            key={clip.id}
            className="hero-deck-card"
            style={{
              transform: transformFor(r),
              opacity: visible ? Math.max(0, 1 - r * 0.16) : 0,
              zIndex: 60 - r,
              pointerEvents: 'none',
            }}
          >
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="hero-deck-face"
            />
            {r === 0 && (
              <AutoplayPreviewVideo
                src={clip.previewSrc}
                poster={poster}
                className="hero-deck-face hero-deck-video"
                preload="metadata"
                playbackPriority="hero"
                loadStrategy="immediate"
                rootMargin="0px"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HeroReelDeck;
