import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { m, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Diamond, Sparkles, Zap, ArrowDownRight, ChevronDown, Play } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import LiteSplitTextReveal from '@/components/motion/LiteSplitTextReveal';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import { premiumEase, easeOutExpo, springSnappy } from '@/components/motion/variants';
import { LEGACY_REEL_CLIPS, posterThumbSrc } from '@/data/portfolio-clips';

interface HeroProps {
  showIntroduction?: boolean;
}

const cinematicContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const cinematicItemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: easeOutExpo },
    transitionEnd: { filter: 'none' },
  },
};

const cinematicLineVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 1.4, ease: premiumEase },
  },
};

type HeroPictureLayerProps = {
  heroImageLoaded: boolean;
  onImageLoad: () => void;
  altText: string;
};

// Shared full-bleed responsive hero image. Rendered statically on mobile /
// reduced-motion, and inside the parallax wrapper on desktop.
const HeroPictureLayer = ({ heroImageLoaded, onImageLoad, altText }: HeroPictureLayerProps) => (
  <picture>
    <source
      media="(max-width: 767px)"
      type="image/webp"
      srcSet="/uploads/gisela-hero-mobile-768.webp 768w, /uploads/gisela-hero-mobile-992.webp 992w"
      sizes="100vw"
    />
    <source
      media="(max-width: 767px)"
      type="image/jpeg"
      srcSet="/uploads/gisela-hero-mobile-992.jpg 992w"
      sizes="100vw"
    />
    <source
      media="(min-width: 1024px)"
      type="image/webp"
      srcSet="/uploads/gisela-hero-desktop-1600.webp 1600w, /uploads/gisela-hero-desktop-2048.webp 2048w"
      sizes="100vw"
    />
    <source
      media="(min-width: 1024px)"
      type="image/jpeg"
      srcSet="/uploads/gisela-hero-desktop-2048.jpg 2048w"
      sizes="100vw"
    />
    <source
      type="image/webp"
      srcSet="/uploads/gisela-hero-400.webp 400w, /uploads/gisela-hero-585.webp 585w, /uploads/gisela-hero-800.webp 800w, /uploads/gisela-hero-1200.webp 1200w"
      sizes="100vw"
    />
    <img
      src="/uploads/gisela-hero-585.jpg"
      alt={altText}
      className={`w-full h-full object-cover object-[44%_0%] md:object-[50%_12%] lg:object-[50%_34%] transition-opacity duration-1000 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      onLoad={onImageLoad}
    />
  </picture>
);

const Hero = ({ showIntroduction = true }: HeroProps) => {
  const { t } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const shouldReduceMotion = useReducedMotion();
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [isDesktopViewport, setIsDesktopViewport] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );
  const containerRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const handleImageLoad = useCallback(() => setHeroImageLoaded(true), []);

  // Desktop-only gate: hero phone-frame video is inside `hidden lg:flex`.
  // Even when visually hidden, <video src> + autoPlay still buffer on mobile Chrome,
  // wasting ~28MB of data per Lighthouse trace. Skip cycling + preload on mobile.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktopViewport(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  // Gate for the popLayout phone-frame reel. On a normal desktop load this is
  // already true, so the reel mounts immediately. But when the desktop breakpoint
  // becomes active at RUNTIME (window resize / tablet rotation), we defer the mount
  // by one frame: mounting framer-motion's popLayout in the SAME commit as the
  // lg-breakpoint layout change made its PopChild measure a not-yet-settled layout
  // and throw, which unmounted the whole app (blank page).
  const [reelReady, setReelReady] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );
  useEffect(() => {
    if (!isDesktopViewport) {
      setReelReady(false);
      return;
    }
    if (reelReady) return;
    const raf = requestAnimationFrame(() => setReelReady(true));
    return () => cancelAnimationFrame(raf);
  }, [isDesktopViewport, reelReady]);

  // TikTok-style auto-cycling through all clips (desktop only)
  useEffect(() => {
    if (shouldReduceMotion || !isDesktopViewport) return;
    const interval = setInterval(() => {
      setCurrentClipIndex((prev) => (prev + 1) % LEGACY_REEL_CLIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion, isDesktopViewport]);

  // Preload next video for smooth transitions (desktop only)
  useEffect(() => {
    if (!isDesktopViewport) return;
    const nextIndex = (currentClipIndex + 1) % LEGACY_REEL_CLIPS.length;
    const nextClip = LEGACY_REEL_CLIPS[nextIndex];
    const nextVideo = videoRefs.current.get(nextIndex);
    if (!nextVideo) {
      const preloadEl = document.createElement('video');
      preloadEl.src = nextClip.mobileSrc;
      preloadEl.preload = 'auto';
      preloadEl.muted = true;
    }
  }, [currentClipIndex, isDesktopViewport]);

  const currentClip = LEGACY_REEL_CLIPS[currentClipIndex];

  const heroPills = [
    { icon: Sparkles, labelKey: 'hero.pillStrategy' },
    { icon: Diamond, labelKey: 'hero.pillAesthetic' },
    { icon: Zap, labelKey: 'hero.pillConversion' },
  ];

  const handleContactCtaClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isMobileViewport()) {
      event.preventDefault();
      toggleContactDock();
      return;
    }
    handleHashLinkClick(event);
  };

  // Parallax: translate-only (no `scale`, which forces full-image re-rasterization
  // every frame). The scroll listener is kept mounted at all breakpoints so the hero
  // image never remounts when crossing the desktop boundary; the transform is simply
  // not applied on mobile / reduced-motion.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const enableParallax = isDesktopViewport && !shouldReduceMotion;

  return (
    <section ref={containerRef} id="home" className="relative w-full overflow-hidden bg-black">
      {/* ─── 100vh Cinematic Window ─── */}
      <div className="relative min-h-[100svh] w-full flex flex-col justify-end">
        {/* Background Image Layer (poster / fallback / SEO) */}
        <m.div
          className="absolute inset-0 z-0 origin-top overflow-hidden"
          style={enableParallax ? { y: yImage } : undefined}
        >
          <HeroPictureLayer
            heroImageLoaded={heroImageLoaded}
            onImageLoad={handleImageLoad}
            altText={t('hero.imageAlt')}
          />
        </m.div>

        {/* Animated Atmosphere Orbs */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 z-10 cinematic-overlay mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none opacity-80" />

        {/* Content Layer */}
        <m.div
          className="container relative z-20 mx-auto px-6 md:px-12 pb-14 md:pb-24 pt-28 md:pt-32 w-full"
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? undefined : cinematicContainerVariants}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
            {/* Left side: Typography */}
            <div className="max-w-4xl">
              <h1 className="cinematic-title text-white text-[12vw] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] -ml-1 md:-ml-2 mb-4">
                <LiteSplitTextReveal text="Gisela" delay={0.2} stagger={0.06} className="block" />
                <LiteSplitTextReveal text="Saldarriaga" delay={0.4} stagger={0.06} className="block text-accent luxury-accent align-baseline" />
              </h1>

              {/*
                LCP element. Skip the staggered reveal so Lighthouse counts the paint
                at hydration time instead of hydration + 0.3s delay + 1.2s duration.
                Other cinematic items (line, pills, CTAs) still animate on stagger.
              */}
              <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/70 mb-6 cinematic-subtitle">
                {t('hero.subtitle')}
              </p>

              <m.div
                className="hidden md:block w-24 md:w-40 h-px bg-white/30 my-8 origin-left"
                variants={shouldReduceMotion ? undefined : cinematicLineVariants}
              />

              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mt-6 md:mt-0">
                {/* Description: visually hidden on mobile, still in DOM for SEO */}
                <m.p
                  className="sr-only md:not-sr-only md:font-sans md:font-light md:text-lg md:text-white/80 md:max-w-sm md:cinematic-subtitle"
                  variants={shouldReduceMotion ? undefined : cinematicItemVariants}
                >
                  {t('hero.description')}
                </m.p>

                <m.div
                  className="flex flex-row sm:flex-col gap-3"
                  variants={shouldReduceMotion ? undefined : cinematicItemVariants}
                >
                  <a
                    href="#portfolio"
                    onClick={handleHashLinkClick}
                    className="btn-shimmer inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-prestige transition-all hover:scale-[1.02] hover:shadow-[0_14px_34px_-8px_rgba(255,255,255,0.25)]"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    {t('hero.buttonPortfolio')}
                  </a>
                  <a
                    href="#contact"
                    onClick={handleContactCtaClick}
                    className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-prestige transition-all hover:bg-white/10 hover:border-white/50"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    {t('hero.buttonContact')}
                  </a>
                </m.div>
              </div>
            </div>

            {/* Right side: Phone-frame video reel + compact metrics */}
            <m.div
              className="hidden lg:flex flex-col items-center gap-5 lg:self-end lg:-mr-4 xl:-mr-8"
              variants={shouldReduceMotion ? undefined : cinematicItemVariants}
            >
              {/* Phone Frame with smooth cycling */}
              <a href="#portfolio" onClick={handleHashLinkClick} className="hero-phone-frame cursor-pointer">
                <div className="hero-phone-notch" />
                {/*
                  popLayout keeps the cross-fade clean (each exiting clip is removed
                  after its fade — default mode leaks a <video> per cycle). Gated on
                  `reelReady` (not isDesktopViewport directly) so that on a runtime
                  breakpoint change the mount is deferred one frame past the layout
                  settle — otherwise popLayout's PopChild measured mid-layout and
                  crashed the page. `initial={false}` skips the enter animation so the
                  reel never flashes in.
                */}
                {reelReady && (
                  <AnimatePresence mode="popLayout" initial={false}>
                    <m.video
                      key={currentClip.id}
                      className="hero-phone-video"
                      src={currentClip.mobileSrc}
                      poster={currentClip.posterSrc}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="metadata"
                      ref={(el) => {
                        if (el) videoRefs.current.set(currentClipIndex, el);
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                    />
                  </AnimatePresence>
                )}
                {/* Play indicator overlay */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1">
                  <Play className="w-2.5 h-2.5 text-white fill-white" />
                  <span className="text-[9px] font-bold uppercase tracking-prestige text-white/90">UGC Reel</span>
                </div>
                {/* Clip counter */}
                <div className="absolute top-3 right-3 z-10 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1">
                  <span className="text-[9px] font-bold uppercase tracking-prestige text-white/80">
                    {currentClipIndex + 1}/{LEGACY_REEL_CLIPS.length}
                  </span>
                </div>
              </a>

              {/* Compact metrics below phone */}
              <div className="flex items-center gap-3 text-white/60">
                <span className="text-lg font-serif font-bold text-white">{t('hero.proofValue')}</span>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-[10px] font-bold uppercase tracking-prestige">{t('hero.proofCaption')}</span>
              </div>
            </m.div>

            {/* Mobile-only: Fixed 4-card reel strip (thumbnails rotate daily) */}
            <m.div
              className="lg:hidden w-full"
              variants={shouldReduceMotion ? undefined : cinematicItemVariants}
            >
              <div className="grid grid-cols-4 gap-2.5 px-1">
                {(() => {
                  const dayOffset = Math.floor(Date.now() / 86400000) % LEGACY_REEL_CLIPS.length;
                  return Array.from({ length: 4 }, (_, i) =>
                    LEGACY_REEL_CLIPS[(dayOffset + i) % LEGACY_REEL_CLIPS.length]
                  );
                })().map((clip) => (
                  <a
                    key={clip.id}
                    href="#portfolio"
                    onClick={handleHashLinkClick}
                    className="aspect-[9/16] rounded-xl overflow-hidden border border-white/15 relative group"
                  >
                    <img
                      src={posterThumbSrc(clip.posterSrc)}
                      alt=""
                      width="92"
                      height="164"
                      className="w-full h-full object-cover transition-transform duration-300 group-active:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white/80 fill-white/80" />
                    </div>
                  </a>
                ))}
              </div>
            </m.div>
          </div>
        </m.div>

        {/* Scroll Indicator */}
        <m.div
          className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8, ease: premiumEase }}
        >
          <m.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-white/40" />
          </m.div>
        </m.div>
      </div>

      {/* ─── Introduction (desktop only, scrolls up naturally) ─── */}
      {showIntroduction && (
        <div className="bg-background relative z-30">
          <m.div
            className="container mx-auto px-6 md:px-12 py-24 border-t border-border/40"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
          >
            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-16 xl:gap-20 items-start">
              <m.div className="space-y-6 max-w-[50rem]" variants={cinematicItemVariants}>
                <span className="section-label">{t('hero.introduction.eyebrow')}</span>
                <h2 className="max-w-[16ch] text-balance text-4xl md:text-[3.4rem] lg:text-[3.35rem] xl:text-[3.65rem] font-serif text-foreground leading-[0.98] tracking-tight-serif">
                  <PretextLineReveal text={t('hero.introduction.title')} delay={0} stagger={0.1} className="block" />
                </h2>
              </m.div>
              <m.div className="lg:pt-14 xl:pt-16" variants={cinematicItemVariants}>
                <p className="strategic-body max-w-[35rem] text-[1.18rem] leading-[1.58] font-normal text-foreground/72 md:text-[1.3rem]">
                  {t('hero.introduction.description')}
                </p>
              </m.div>
            </div>
          </m.div>
        </div>
      )}
    </section>
  );
};

export default Hero;
