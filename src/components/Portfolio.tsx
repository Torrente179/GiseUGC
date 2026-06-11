import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { m, useReducedMotion } from 'framer-motion';
import AdaptiveVideo from '@/components/media/AdaptiveVideo';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { revealUp, springHoverTransition, staggerContainer } from '@/components/motion/variants';
import { useReelTheater } from '@/components/reel-theater/reel-theater-context';
import { ALL_REEL_CLIPS, getReelTitle } from '@/data/reel-catalog';
import { getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';
import { useIsMobile } from '@/hooks/use-mobile';

const DAY_MS = 86_400_000;
const getUtcDayBucket = () => Math.floor(Date.now() / DAY_MS);

const shuffleWithSeed = <T,>(items: T[], seed: number): T[] => {
  const result = [...items];
  let state = seed >>> 0;
  for (let i = result.length - 1; i > 0; i -= 1) {
    state += 0x6d2b79f5;
    let randomState = state;
    randomState = Math.imul(randomState ^ (randomState >>> 15), randomState | 1);
    randomState ^= randomState + Math.imul(randomState ^ (randomState >>> 7), randomState | 61);
    const random = ((randomState ^ (randomState >>> 14)) >>> 0) / 4294967296;
    const j = Math.floor(random * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const Portfolio = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { isOpen, openReel } = useReelTheater();
  const [activeMobileReelIndex, setActiveMobileReelIndex] = useState(0);
  const [utcDayBucket, setUtcDayBucket] = useState(getUtcDayBucket);
  const reelScrollRef = useRef<HTMLDivElement>(null);
  const reelCardTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const reelCardDidDragRef = useRef(false);
  const showcaseReelClips = useMemo(() => shuffleWithSeed(ALL_REEL_CLIPS, utcDayBucket), [utcDayBucket]);

  useEffect(() => {
    const nextUtcBoundary = (utcDayBucket + 1) * DAY_MS;
    const timeoutId = window.setTimeout(
      () => setUtcDayBucket(getUtcDayBucket()),
      Math.max(nextUtcBoundary - Date.now(), 1000) + 20,
    );
    return () => window.clearTimeout(timeoutId);
  }, [utcDayBucket]);

  useEffect(() => {
    if (!isMobile) return;
    const container = reelScrollRef.current;
    if (!container) return;
    let frameId: number | null = null;

    const update = () => {
      frameId = null;
      const firstCard = container.querySelector<HTMLElement>('[data-reel-card="true"]');
      if (!firstCard) return;
      const styles = window.getComputedStyle(container);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '12') || 12;
      const index = Math.round(container.scrollLeft / (firstCard.clientWidth + gap));
      setActiveMobileReelIndex(Math.max(0, Math.min(showcaseReelClips.length - 1, index)));
    };
    const queueUpdate = () => {
      if (frameId === null) frameId = requestAnimationFrame(update);
    };
    queueUpdate();
    container.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    return () => {
      container.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [isMobile, showcaseReelClips.length]);

  const handleTouchStart = useCallback((event: TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    reelCardTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
    reelCardDidDragRef.current = false;
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent<HTMLButtonElement>) => {
    const start = reelCardTouchStartRef.current;
    const touch = event.touches[0];
    if (!start || !touch) return;
    if (Math.abs(touch.clientX - start.x) > 10 || Math.abs(touch.clientY - start.y) > 10) {
      reelCardDidDragRef.current = true;
    }
  }, []);

  const openClip = useCallback((clip: ReelClip, trigger: HTMLElement) => {
    if (reelCardDidDragRef.current) {
      reelCardDidDragRef.current = false;
      return;
    }
    openReel(clip, { source: 'portfolio', trigger });
  }, [openReel]);

  return (
    <section id="portfolio" className="studio-section bg-secondary/5 pt-20 pb-16">
      <div className="studio-container">
        <m.div className="studio-header mb-10 flex flex-col gap-10 md:mb-14 lg:flex-row lg:items-end lg:justify-between" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.32 }} variants={staggerContainer(0.12, 0.05)}>
          <div className="text-center md:text-left">
            <m.div className="mb-6 inline-flex items-center gap-2" variants={revealUp(14, 0.56)}>
              <span className="h-px w-8 bg-accent/40" />
              <p className="section-label text-sm text-accent md:text-base">{t('portfolio.sectionSubtitle')}</p>
            </m.div>
            <h2 className="font-serif text-5xl leading-[0.95] tracking-tight-serif text-foreground md:text-7xl lg:text-[5.5rem]">
              <SplitTextReveal text={t('portfolio.sectionTitle')} delay={0.06} />
              <span className="luxury-accent mt-4 block text-accent lg:ml-4 lg:mt-0">
                <SplitTextReveal text={t('portfolio.sectionTitleAccent')} delay={0.22} />
              </span>
            </h2>
          </div>
          <m.p className="strategic-body text-center text-lg italic text-foreground/45 md:text-xl lg:max-w-xs lg:text-right" variants={revealUp(20, 0.64)}>
            {t('portfolio.reelDescription')}
          </m.p>
        </m.div>

        <m.div className="studio-rule mb-10 md:mb-12" initial={{ opacity: 0, scaleX: 0.7 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.66 }} />
      </div>

      <m.div className="relative overflow-hidden py-4 md:py-6" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealUp(20, 0.62)}>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-background to-secondary/60" />
        <div className="relative z-10 mx-auto px-3 sm:px-6 md:px-10 lg:px-12">
          <div ref={reelScrollRef} className="scrollbar-hide flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain pb-4 scroll-smooth md:snap-none md:gap-4">
            {showcaseReelClips.map((clip, index) => {
              const mobileDistance = Math.abs(activeMobileReelIndex - index);
              const isActiveMobileCard = !isMobile || mobileDistance === 0;
              const isWarmMobileCard = isMobile && mobileDistance <= 1;
              return (
                <m.button
                  key={clip.id}
                  type="button"
                  data-reel-card="true"
                  className="group relative aspect-[9/16] w-[70vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-border text-left shadow-sm transition-colors hover:border-primary/40 sm:w-[55vw] md:w-[180px] lg:w-[200px]"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => { reelCardTouchStartRef.current = null; }}
                  onClick={(event) => openClip(clip, event.currentTarget)}
                  aria-label={getReelTitle(clip, t)}
                  whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                  transition={springHoverTransition}
                >
                  <AdaptiveVideo
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={clip.previewSrc}
                    hlsSrc={clip.previewHlsSrc}
                    poster={isWarmMobileCard || !isMobile ? getBestPosterSrc(clip) : clip.posterSrc}
                    muted
                    autoPlay={!isMobile || isActiveMobileCard}
                    loop
                    playsInline
                    preload={isWarmMobileCard ? 'metadata' : 'none'}
                    rootMargin="100px 0px"
                    pauseOffscreen
                    unloadWhenOffscreen
                    forcePause={isOpen || !isActiveMobileCard}
                    playbackPriority={isActiveMobileCard ? 'preview' : 'background'}
                    aria-hidden="true"
                  />
                </m.button>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-2.5 pt-1 md:hidden">
            <span className="section-label tabular-nums text-muted-foreground">{String(activeMobileReelIndex + 1).padStart(2, '0')}</span>
            <span className="h-px w-7 bg-accent/40" />
            <span className="section-label tabular-nums text-muted-foreground/60">{String(showcaseReelClips.length).padStart(2, '0')}</span>
          </div>
        </div>
      </m.div>
    </section>
  );
};

export default Portfolio;
