import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { useHeroWall } from '@/hooks/use-hero-wall';
import { useIsMobile } from '@/hooks/use-mobile';
import { getLocaleFromPath } from '@/lib/locale-path';
import { cn } from '@/lib/utils';
import { LEGACY_REEL_CLIPS, getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

// Full catalog — rotated daily so the hero cycles through the reels.
const ALL_CLIPS: ReelClip[] = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];

// Deterministic daily shuffle (mirrors the Portfolio's seeded reshuffle).
const shuffleWithSeed = <T,>(items: T[], seed: number): T[] => {
  const arr = [...items];
  let s = seed % 233280;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const WALL_COLUMNS_DESKTOP = 5;
const WALL_COLUMNS_MOBILE = 3;

const Hero = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);
  const isEs = locale === 'es';

  // The hero follows the global light/dark theme. Read the class that
  // next-themes' blocking script already applied so the first paint matches
  // (no light flash for dark users), then keep it in sync with the toggle.
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  );
  useEffect(() => {
    if (resolvedTheme) setIsDark(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const sectionRef = useRef<HTMLElement>(null);
  useHeroWall(sectionRef, !isMobile);

  // Rotate the catalog by the UTC day bucket — fresh selection every 24h.
  const utcDayBucket = Math.floor(Date.now() / 86400000);
  const dailyClips = useMemo(() => shuffleWithSeed(ALL_CLIPS, utcDayBucket), [utcDayBucket]);

  // Deal the catalog column-by-column so each column holds a distinct vertical
  // strip of reels; each strip is doubled in markup for a seamless drift loop.
  // Fewer, wider columns on mobile so the reels read at a usable size.
  const columnCount = isMobile ? WALL_COLUMNS_MOBILE : WALL_COLUMNS_DESKTOP;
  // Cap unique tiles per column: 6 is more than a viewport-height tall once
  // doubled, so the loop stays seamless while keeping the poster payload lean.
  const tilesPerColumn = 6;
  const wallColumns = useMemo(() => {
    const cols: ReelClip[][] = Array.from({ length: columnCount }, () => []);
    dailyClips.forEach((clip, i) => cols[i % columnCount].push(clip));
    return cols.map((col) => {
      let filled = col;
      while (filled.length < 4) filled = [...filled, ...col];
      return filled.slice(0, tilesPerColumn);
    });
  }, [dailyClips, columnCount]);

  const pitch = isEs
    ? 'Contenido que se siente humano — y vende en social.'
    : 'Content that feels human — and sells on social.';
  const creditLines = [
    isEs ? 'Creadora UGC bilingüe — ES / EN' : 'Bilingual UGC creator — ES / EN',
    isEs ? 'Demos · testimonios · portavoz' : 'Demos · testimonials · spokesperson',
    `${t('hero.proofValue')} · ${t('hero.proofCaption')}`,
  ];

  // ── Name lockup (shared between mobile flow and desktop overlay) ──
  const nameLockup = (
    <h1 className="dc-name-h1 dc-name-stack">
      <span className="hero-line-mask block">
        <span className="hero-line dc-name-a block">Gisela</span>
      </span>
      <span className="hero-line-mask block">
        <span className="hero-line hero-line-late dc-name-b block">Saldarriaga</span>
      </span>
    </h1>
  );

  return (
    <section ref={sectionRef} id="home" className="relative w-full bg-background max-md:overflow-hidden">
      {/* Hero viewport follows the global light/dark theme. */}
      <div
        data-hero-viewport
        className={cn(
          'relative min-h-[100svh] w-full overflow-hidden bg-background text-foreground md:h-[100svh]',
          isDark && 'dark',
        )}
      >
        {/* ─── Full-bleed "Muro de trabajo" reel wall (mobile + desktop) ───
            Desktop drift + pointer parallax is GSAP (useHeroWall); mobile
            drift is the CSS `.dc-wall-track` keyframe (no JS on touch). */}
        <div className="dc-wall" data-hero-wall aria-hidden="true">
          {wallColumns.map((col, ci) => (
            <div key={ci} className="dc-wall-col" data-wall-col>
              <div className="dc-wall-track" data-wall-track>
                {[...col, ...col].map((clip, ti) => (
                  <img
                    key={`${clip.id}-${ti}`}
                    src={getBestPosterSrc(clip)}
                    alt=""
                    loading={ci < 2 && ti < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="dc-wall-tile"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Readability scrim ─── */}
        <div className="dc-wall-scrim" aria-hidden="true" />

        {isMobile ? (
          /* ════ Mobile: type-led flow layout ════ */
          <div className="relative z-10 flex min-h-[100svh] max-md:pointer-events-none max-md:flex-col max-md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)]">
            <div
              className="max-md:min-h-[calc(clamp(10.5rem,46vw,13rem)*1.7778+1rem)] max-md:flex-1 max-md:shrink-0"
              aria-hidden="true"
            />
            <div
              data-hero-identity
              className="hero-mobile-foot container mx-auto w-full shrink-0 px-6 pb-6 max-md:pointer-events-auto max-md:mt-auto"
            >
              {nameLockup}

              <p className="hero-cascade-item dc-pitch mb-4 mt-4 max-w-[20rem] text-[1.05rem]" style={{ '--cascade-i': 0 } as CSSProperties}>
                {pitch}
              </p>

              <div className="hero-cascade-item dc-credits" style={{ '--cascade-i': 1 } as CSSProperties}>
                {creditLines.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ════ Desktop: name + CTAs over the wall ════ */
          <div data-hero-identity className="absolute inset-0 z-10">
            <div className="hero-cascade-item dc-poster-meta left-12 top-[6.25rem]" style={{ '--cascade-i': 0 } as CSSProperties}>
              {isEs ? 'El estudio · Medellín, CO' : 'The studio · Medellín, CO'}
            </div>
            <div className="hero-cascade-item dc-poster-meta right-12 top-[6.25rem] text-right" style={{ '--cascade-i': 0 } as CSSProperties}>
              {t('hero.proofValue')}
            </div>

            <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between gap-8">
              <div className="max-w-[34rem]">
                {nameLockup}
                <p className="hero-cascade-item dc-pitch mb-4 mt-5 max-w-[24rem]" style={{ '--cascade-i': 1 } as CSSProperties}>
                  {pitch}
                </p>
                <div className="hero-cascade-item dc-credits" style={{ '--cascade-i': 2 } as CSSProperties}>
                  {creditLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </div>
              </div>

              <div className="hero-cascade-item dc-poster-meta mb-2 hidden shrink-0 lg:block" style={{ '--cascade-i': 4 } as CSSProperties}>
                {isEs ? 'desliza para ver el trabajo' : 'scroll to see the work'}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
