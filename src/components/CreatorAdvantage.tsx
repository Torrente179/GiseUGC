import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { revealUp, springHoverTransition, staggerContainer } from '@/components/motion/variants';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import LazyVideo from '@/components/media/LazyVideo';
import VIDEO_LQIP from '@/data/video-lqip';
import { r2Poster, r2PreviewVideo } from '@/data/portfolio-clips';

interface CollageClip {
  id: number;
  labelKey: string;
  previewSrc: string;
  posterSrc: string;
  desktopBaseClass: string;
  desktopHoverClass: string;
  mobileClass: string;
}

type NavigatorConnection = {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  saveData?: boolean;
};

const getLqip = (url: string) => {
  const filename = url.split('/').pop() ?? '';
  const key = filename.replace(/-preview\.mp4$/, '').replace(/-poster\.jpg$/, '').replace(/\.mp4$/, '');
  return VIDEO_LQIP[key] || undefined;
};

const COLLAGE_CLIPS: CollageClip[] = [
  {
    id: 1,
    labelKey: 'portfolio.collageClip1',
    previewSrc: r2PreviewVideo('ugc-clothing-showcase-1.mp4'),
    posterSrc: r2Poster('ugc-clothing-showcase-1-poster.jpg'),
    desktopBaseClass: 'top-[18%] left-[6.5%] w-[31%] -rotate-[8deg] z-20',
    desktopHoverClass: 'top-[16%] left-[12%] w-[30%] -rotate-[4deg] z-30',
    mobileClass: 'top-[17%] left-[4%] w-[35%] -rotate-[9deg] z-20',
  },
  {
    id: 2,
    labelKey: 'portfolio.collageClip2',
    previewSrc: r2PreviewVideo('ugc-clothing-showcase-2.mp4'),
    posterSrc: r2Poster('ugc-clothing-showcase-2-poster.jpg'),
    desktopBaseClass: 'top-[8%] left-1/2 w-[30.5%] -translate-x-1/2 rotate-0 z-40',
    desktopHoverClass: 'top-[6%] left-1/2 w-[31.5%] -translate-x-1/2 rotate-0 z-50 scale-[1.035]',
    mobileClass: 'top-[3%] left-1/2 w-[34%] -translate-x-1/2 rotate-0 z-40',
  },
  {
    id: 3,
    labelKey: 'portfolio.collageClip3',
    previewSrc: r2PreviewVideo('ugc-clothing-showcase-3.mp4'),
    posterSrc: r2Poster('ugc-clothing-showcase-3-poster.jpg'),
    desktopBaseClass: 'top-[18%] right-[6.5%] w-[31%] rotate-[8deg] z-20',
    desktopHoverClass: 'top-[16%] right-[12%] w-[30%] rotate-[4deg] z-30',
    mobileClass: 'top-[17%] right-[4%] w-[35%] rotate-[9deg] z-20',
  },
];

const CreatorAdvantage = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const [collageHovered, setCollageHovered] = useState(false);

  const connectionProfile = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return { constrained: false, slow: false };
    }

    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    if (!connection) {
      return { constrained: false, slow: false };
    }

    const constrained =
      Boolean(connection.saveData) ||
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g';
    const slow = constrained || connection.effectiveType === '3g';
    return { constrained, slow };
  }, []);

  const handleContactCtaClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (isMobileViewport()) {
        event.preventDefault();
        toggleContactDock();
        return;
      }

      handleHashLinkClick(event);
    },
    [handleHashLinkClick],
  );

  const collageIsActive = collageHovered && !shouldReduceMotion;
  const collageStatusLabel = collageIsActive ? t('portfolio.collageHintPlaying') : t('portfolio.collageHintIdle');

  const renderCollageShell = (isMobile: boolean) => (
    <div
      className={`relative isolate mx-auto overflow-hidden border border-border/50 bg-card/80 shadow-[0_34px_80px_-56px_rgba(47,42,36,0.48)] ${
        isMobile
          ? 'w-full max-w-[440px] rounded-[1.7rem] px-3.5 pb-3.5 pt-5 sm:p-4 pointer-events-none select-none'
          : 'h-[560px] w-full max-w-[720px] rounded-[2rem] px-6 pb-6 pt-7 xl:h-[590px] xl:px-7 xl:pb-7 xl:pt-8 cursor-default'
      }`}
      onMouseEnter={isMobile ? undefined : () => setCollageHovered(true)}
      onMouseLeave={isMobile ? undefined : () => setCollageHovered(false)}
    >
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 14%, hsl(var(--primary) / 0.18) 0%, transparent 34%), radial-gradient(circle at 18% 28%, hsl(var(--secondary) / 0.34) 0%, transparent 36%), radial-gradient(circle at 82% 32%, hsl(var(--accent) / 0.18) 0%, transparent 34%), linear-gradient(180deg, hsl(var(--primary) / 0.78) 0%, hsl(var(--accent) / 0.34) 38%, hsl(var(--secondary) / 0.52) 70%, hsl(var(--card)) 100%)',
        }}
      />
      <div
        className={`absolute inset-[1px] border border-white/40 dark:border-white/8 ${
          isMobile ? 'rounded-[calc(1.7rem-1px)]' : 'rounded-[calc(2rem-1px)]'
        }`}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-white/10 dark:bg-slate-950/18" aria-hidden="true" />
      <div
        className={`absolute left-[9%] top-[11%] rounded-full blur-3xl ${
          isMobile ? 'h-28 w-28 opacity-75' : 'h-40 w-40 opacity-70'
        }`}
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.34) 0%, transparent 72%)' }}
      />
      <div
        className={`absolute right-[-5%] top-[20%] rounded-full blur-3xl ${
          isMobile ? 'h-32 w-32 opacity-45' : 'h-48 w-48 opacity-40'
        }`}
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.32) 0%, transparent 72%)' }}
      />
      <div
        className={`absolute left-1/2 top-[16%] -translate-x-1/2 rounded-full blur-3xl ${
          isMobile ? 'h-[42%] w-[68%] opacity-35' : 'h-[54%] w-[56%] opacity-40'
        }`}
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle, hsl(var(--pure-linen) / 0.44) 0%, transparent 72%)' }}
      />

      <div className="relative z-20 flex h-full flex-col">
        <div className="pointer-events-none relative z-30 self-start">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/60 bg-white/56 px-3 py-2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-slate-950/38 sm:px-4">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_5px_hsl(var(--primary)/0.15)]" aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/74 sm:text-[11px]">
              {collageStatusLabel}
            </span>
          </div>
        </div>

        <div
          className={`relative flex-1 ${
            isMobile ? 'mt-3 min-h-[320px] sm:min-h-[356px]' : 'mt-5 min-h-0 xl:mt-6'
          }`}
        >
          <div
            className={`absolute left-1/2 -translate-x-1/2 rounded-full blur-3xl ${
              isMobile ? 'bottom-[13%] h-[17%] w-[82%] opacity-25' : 'bottom-[15%] h-[18%] w-[78%] opacity-30'
            }`}
            aria-hidden="true"
            style={{ background: 'radial-gradient(circle, hsl(var(--foreground) / 0.22) 0%, transparent 70%)' }}
          />
          <div
            className={`absolute left-1/2 h-px -translate-x-1/2 bg-foreground/12 ${
              isMobile ? 'bottom-[14%] w-[76%]' : 'bottom-[15%] w-[72%]'
            }`}
            aria-hidden="true"
          />

          {COLLAGE_CLIPS.map((clip) => {
            const cardClass = isMobile
              ? clip.mobileClass
              : collageIsActive
                ? clip.desktopHoverClass
                : clip.desktopBaseClass;

            return (
              <div
                key={clip.id}
                className={`pointer-events-none absolute origin-center overflow-hidden rounded-[1.45rem] border border-white/80 bg-white/10 shadow-[0_24px_52px_-30px_rgba(47,42,36,0.56)] transition-[top,left,right,width,transform,opacity] duration-700 ${cardClass}`}
                style={{
                  aspectRatio: '9/16',
                  transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" aria-hidden="true" />
                <LazyVideo
                  className="h-full w-full object-cover pointer-events-none"
                  src={clip.previewSrc}
                  poster={clip.posterSrc}
                  lqip={getLqip(clip.previewSrc)}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload={isMobile ? 'metadata' : connectionProfile.slow ? 'metadata' : 'auto'}
                  loadWhenVisible
                  rootMargin={isMobile ? '120px 0px' : undefined}
                  pauseOffscreen
                  aria-label={t(clip.labelKey)}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/18" aria-hidden="true" />
                <div className="pointer-events-none absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/65 bg-white/68 text-foreground/78 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.4)] backdrop-blur-sm dark:border-white/12 dark:bg-slate-950/42">
                  <Play className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor" />
                </div>
              </div>
            );
          })}
        </div>

        <div className={`relative z-30 ${isMobile ? 'mt-1.5' : 'mt-2'}`}>
          <div className="rounded-[1.35rem] border border-white/60 bg-white/58 p-3.5 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)] backdrop-blur-md dark:border-white/10 dark:bg-slate-950/38 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="section-label mb-2 text-foreground/45">{t('portfolio.collageEyebrow')}</p>
                <p className="max-w-[18rem] text-[0.9rem] font-medium leading-snug text-foreground/82 sm:text-[0.96rem]">
                  {collageStatusLabel}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-0.5" aria-hidden="true">
                {COLLAGE_CLIPS.map((clip, index) => (
                  <span
                    key={clip.id}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === 1
                        ? 'w-8 bg-primary/90'
                        : collageIsActive
                          ? 'w-3 bg-foreground/22'
                          : 'w-2.5 bg-foreground/14'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className={`mt-3 ${isMobile ? 'grid grid-cols-3 gap-2' : 'flex flex-wrap gap-2.5'}`}>
              {COLLAGE_CLIPS.map((clip) => (
                <div
                  key={clip.id}
                  className={`rounded-full border border-foreground/8 bg-white/44 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/68 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-foreground/72 ${
                    isMobile ? 'text-center' : 'inline-flex max-w-full items-center gap-2 px-3'
                  }`}
                >
                  <span className="text-foreground/42">{String(clip.id).padStart(2, '0')}</span>
                  {!isMobile ? <span className="truncate">{t(clip.labelKey)}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="studio-section bg-background pt-0">
      <div className="studio-container">
        <motion.div
          className="grid lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] gap-8 lg:gap-10 items-center mb-14 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerContainer(0.12, 0.05)}
        >
          <motion.div variants={staggerContainer(0.1, 0.04)}>
            <motion.p className="section-label text-muted-foreground mb-4" variants={revealUp(14, 0.56)}>
              {t('portfolio.collageEyebrow')}
            </motion.p>
            <h3 className="text-3xl md:text-[2.4rem] font-serif font-medium tracking-tight leading-tight mb-5">
              <SplitTextReveal
                text={t('portfolio.collageTitle')}
                delay={0.06}
                className="font-serif"
                wordClassName="font-serif"
              />
            </h3>
            <motion.p className="strategic-body text-muted-foreground mb-6" variants={revealUp(16, 0.62)}>
              {t('portfolio.collageDescription')}
            </motion.p>

            <motion.ul className="space-y-3 text-foreground/85 mb-8" variants={staggerContainer(0.08, 0.02)}>
              <motion.li className="flex gap-3" variants={revealUp(10, 0.5)}>
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint1')}</span>
              </motion.li>
              <motion.li className="flex gap-3" variants={revealUp(10, 0.5)}>
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint2')}</span>
              </motion.li>
              <motion.li className="flex gap-3" variants={revealUp(10, 0.5)}>
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint3')}</span>
              </motion.li>
            </motion.ul>

            <motion.a
              href="#contact"
              onClick={handleContactCtaClick}
              className="btn-primary-nordic px-7 py-3"
              whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={springHoverTransition}
            >
              {t('portfolio.collageCta')}
            </motion.a>
          </motion.div>

          <motion.div
            className="hidden lg:block"
            variants={revealUp(24, 0.72)}
            whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.012 }}
            transition={springHoverTransition}
          >
            {renderCollageShell(false)}
          </motion.div>

          <motion.div
            className="lg:hidden"
            variants={revealUp(20, 0.6)}
          >
            {renderCollageShell(true)}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CreatorAdvantage;
