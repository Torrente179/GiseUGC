import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from '@/lib/locale-context';
import { Play } from 'lucide-react';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import AdaptiveVideo from '@/components/media/AdaptiveVideo';
import { getPosterVariantSrc, LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const CreatorAdvantage = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = usePrefersReducedMotion();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isSectionNearViewport, setIsSectionNearViewport] = useState(false);
  const revealRef = useScrollReveal<HTMLDivElement>();

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

  // ── Phone-UI reel (relocated from the original hero) ──
  const reelClips = LEGACY_REEL_CLIPS;
  const [reelIndex, setReelIndex] = useState(0);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setIsSectionNearViewport(document.visibilityState === 'visible');
      return undefined;
    }

    let intersects = false;
    const sync = () => {
      setIsSectionNearViewport(intersects && document.visibilityState === 'visible');
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersects = Boolean(entry?.isIntersecting);
        sync();
      },
      { rootMargin: '360px 0px' },
    );
    observer.observe(section);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || !isSectionNearViewport) return;
    const id = window.setInterval(
      () => setReelIndex((prev) => (prev + 1) % reelClips.length),
      3500,
    );
    return () => window.clearInterval(id);
  }, [isSectionNearViewport, shouldReduceMotion, reelClips.length]);
  const reelClip = reelClips[reelIndex];

  const renderPhoneReel = () => (
    <a
      href="#portfolio"
      onClick={handleHashLinkClick}
      className="hero-phone-frame mx-auto cursor-pointer"
    >
      <span className="sr-only">{t('portfolio.collageCta')}</span>
      <div className="hero-phone-notch" />
      <AdaptiveVideo
        key={reelClip.id}
        className="hero-phone-video"
        src={reelClip.mobileSrc}
        hlsSrc={reelClip.mobileHlsSrc ?? reelClip.hlsSrc}
        poster={getPosterVariantSrc(reelClip, 720, 'avif')}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        playbackPriority="preview"
        rootMargin="180px 0px"
      />
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
        <Play className="h-2.5 w-2.5 fill-white text-white" />
        <span className="text-[9px] font-bold uppercase tracking-prestige text-white/90">UGC Reel</span>
      </div>
      <div className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
        <span className="text-[9px] font-bold uppercase tracking-prestige text-white/80">
          {reelIndex + 1}/{reelClips.length}
        </span>
      </div>
    </a>
  );


  return (
    <section ref={sectionRef} className="studio-section bg-background pt-0">
      <div className="studio-container">
        <div
          ref={revealRef}
          className="svc-reveal grid lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] gap-8 lg:gap-10 items-center mb-14 md:mb-16"
        >
          <div>
            <p className="section-label text-muted-foreground mb-4">
              {t('portfolio.collageEyebrow')}
            </p>
            <h3 className="type-marketing-display text-[1.5rem] md:text-[1.65rem] font-semibold tracking-tight-marketing leading-[1.14] mb-5">
              <PretextLineReveal
                text={t('portfolio.collageTitle')}
                delay={0.06}
                stagger={0.1}
                className="block"
              />
            </h3>
            <p className="strategic-body text-muted-foreground mb-6">
              {t('portfolio.collageDescription')}
            </p>

            <ul className="space-y-3 text-foreground/85 mb-8">
              <li className="flex gap-3">
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint1')}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint2')}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint3')}</span>
              </li>
            </ul>

            <a
              href="#contact"
              onClick={handleContactCtaClick}
              className="btn-primary-nordic btn-primary-nordic--lg"
            >
              {t('portfolio.collageCta')}
            </a>
          </div>

          <div className="creator-phone-motion flex justify-center">
            {renderPhoneReel()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorAdvantage;
