import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from '@/lib/locale-context';
import ReelPhone from '@/components/media/ReelPhone';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import AdaptiveVideo from '@/components/media/AdaptiveVideo';
import { getPosterVariantSrc, LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const REEL_INTERVAL_MS = 3500;

const CreatorAdvantage = () => {
  const { locale, t } = useTranslation();
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

  const reelIsPlaying = !shouldReduceMotion && isSectionNearViewport;
  useEffect(() => {
    if (!reelIsPlaying) return;
    const id = window.setInterval(
      () => setReelIndex((prev) => (prev + 1) % reelClips.length),
      REEL_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [reelIsPlaying, reelClips.length]);
  const reelClip = reelClips[reelIndex];
  const reelTitle = reelClip.titleKey
    ? t(reelClip.titleKey)
    : reelClip.localizedTitle?.[locale] ?? reelClip.title ?? '';

  const renderPhoneReel = () => (
    <ReelPhone
      className="creator-reel-phone"
      title={reelTitle}
      reelKey={reelClip.id}
      playing={reelIsPlaying}
      clipMs={REEL_INTERVAL_MS}
      onNavigate={handleHashLinkClick}
      onContact={handleContactCtaClick}
    >
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
    </ReelPhone>
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
