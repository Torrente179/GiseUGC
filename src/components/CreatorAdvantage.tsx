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
  cornerClass: string;
  hoverClass: string;
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
    cornerClass: 'top-[13%] left-[8%] w-[29%] -rotate-[6deg] z-30',
    hoverClass: 'top-[12%] left-[16%] w-[29%] -rotate-[2deg] z-40',
  },
  {
    id: 2,
    labelKey: 'portfolio.collageClip2',
    previewSrc: r2PreviewVideo('ugc-clothing-showcase-2.mp4'),
    posterSrc: r2Poster('ugc-clothing-showcase-2-poster.jpg'),
    cornerClass: 'top-[5%] left-[35%] w-[30%] rotate-0 z-50',
    hoverClass: 'top-[7%] left-[35%] w-[30%] rotate-0 z-50 scale-[1.03]',
  },
  {
    id: 3,
    labelKey: 'portfolio.collageClip3',
    previewSrc: r2PreviewVideo('ugc-clothing-showcase-3.mp4'),
    posterSrc: r2Poster('ugc-clothing-showcase-3-poster.jpg'),
    cornerClass: 'top-[13%] right-[8%] w-[29%] rotate-[6deg] z-30',
    hoverClass: 'top-[12%] right-[16%] w-[29%] rotate-[2deg] z-40',
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
            className="hidden lg:block relative h-[530px] xl:h-[560px] w-full max-w-[720px] mx-auto rounded-[1.75rem] border border-border/60 overflow-hidden cursor-pointer shadow-[0_28px_60px_-48px_hsl(var(--foreground)/0.4)]"
            role="presentation"
            onMouseEnter={() => setCollageHovered(true)}
            onMouseLeave={() => setCollageHovered(false)}
            variants={revealUp(24, 0.72)}
            whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.012 }}
            transition={springHoverTransition}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, hsl(var(--coastal-teal)) 0%, hsl(var(--washed-khaki)) 38%, hsl(var(--warm-sand)) 72%, hsl(var(--pure-linen)) 100%)',
              }}
            />
            <div className="absolute inset-0 bg-card/20" />

            {COLLAGE_CLIPS.map((clip) => (
              <div
                key={clip.id}
                className={`absolute rounded-2xl border-[2.5px] border-white/90 shadow-xl overflow-hidden origin-center will-change-transform transition-[top,left,right,width,transform,opacity] duration-700 ${collageHovered ? clip.hoverClass : clip.cornerClass}`}
                style={{
                  aspectRatio: '9/16',
                  transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <LazyVideo
                  className="h-full w-full object-cover"
                  src={clip.previewSrc}
                  poster={clip.posterSrc}
                  lqip={getLqip(clip.previewSrc)}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload={connectionProfile.slow ? 'metadata' : 'auto'}
                  loadWhenVisible
                  pauseOffscreen
                  aria-label={t(clip.labelKey)}
                />

                <div
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${collageHovered ? 'opacity-0' : 'opacity-100'}`}
                >
                  <div className="h-9 w-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md">
                    <Play className="h-4 w-4 text-foreground/80 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="lg:hidden relative w-full max-w-[440px] rounded-[1.25rem] border border-border/60 p-4 overflow-hidden shadow-lg mx-auto pointer-events-none select-none"
            role="presentation"
            variants={revealUp(20, 0.6)}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, hsl(var(--coastal-teal)) 0%, hsl(var(--washed-khaki)) 38%, hsl(var(--warm-sand)) 72%, hsl(var(--pure-linen)) 100%)',
              }}
            />
            <div className="absolute inset-0 bg-card/15" />

            <div className="relative z-10 w-full h-[320px] sm:h-[360px]">
              {COLLAGE_CLIPS.map((clip, index) => (
                <div
                  key={clip.id}
                  className={`absolute rounded-xl border-2 border-white/85 shadow-md overflow-hidden ${index === 0 ? 'top-[19%] left-[8%] w-[33%] -rotate-[7deg] z-20' : index === 1 ? 'top-[6%] left-[34%] w-[32%] rotate-0 z-40' : 'top-[19%] right-[8%] w-[33%] rotate-[7deg] z-20'} pointer-events-none`}
                  style={{ aspectRatio: '9/14' }}
                >
                  <LazyVideo
                    className="h-full w-full object-cover pointer-events-none"
                    src={clip.previewSrc}
                    poster={clip.posterSrc}
                    lqip={getLqip(clip.previewSrc)}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    rootMargin="120px 0px"
                    pauseOffscreen
                    aria-label={t(clip.labelKey)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CreatorAdvantage;
