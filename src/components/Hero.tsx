import { useEffect, useRef, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Diamond, Sparkles, Zap } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import LiteSplitTextReveal from '@/components/motion/LiteSplitTextReveal';
import { useMotionProfile } from '@/components/motion/profile';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';

interface HeroProps {
  showIntroduction?: boolean;
}

const Hero = ({ showIntroduction = true }: HeroProps) => {
  const { t } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const motionProfile = useMotionProfile('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const floatingCardRef = useRef<HTMLDivElement>(null);
  const cornerTagRef = useRef<HTMLDivElement>(null);

  const heroPills = [
    { icon: Sparkles, labelKey: 'hero.pillStrategy' },
    { icon: Diamond, labelKey: 'hero.pillAesthetic' },
    { icon: Zap, labelKey: 'hero.pillConversion' },
  ];

  const shouldAnimateHero = motionProfile.heroEnabled;

  const handleContactCtaClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isMobileViewport()) {
      event.preventDefault();
      toggleContactDock();
      return;
    }
    handleHashLinkClick(event);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const floatingCard = floatingCardRef.current;
    const cornerTag = cornerTagRef.current;
    if (!section || !media || !floatingCard || !cornerTag) return;

    let frameId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let sectionTop = 0;
    let sectionHeight = 1;
    let viewportHeight = window.innerHeight;

    const motionReadyTimer = window.setTimeout(() => {
      if (!motionProfile.reduce) {
        section.dataset.motion = 'ready';
      }
    }, shouldAnimateHero ? 180 : 120);

    if (motionProfile.reduce) {
      return () => {
        window.clearTimeout(motionReadyTimer);
        delete section.dataset.motion;
      };
    }

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) {
      return () => {
        window.clearTimeout(motionReadyTimer);
        media.style.transform = '';
        floatingCard.style.transform = '';
        cornerTag.style.transform = '';
        delete section.dataset.motion;
      };
    }

    media.style.willChange = 'transform';
    floatingCard.style.willChange = 'transform';
    cornerTag.style.willChange = 'transform';

    const measure = () => {
      const rect = section.getBoundingClientRect();
      sectionTop = window.scrollY + rect.top;
      sectionHeight = rect.height;
      viewportHeight = window.innerHeight;
    };

    const updateParallax = () => {
      frameId = null;
      const start = sectionTop - viewportHeight;
      const end = sectionTop + sectionHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)));

      const imageY = 40 - 82 * progress;
      const imageRotate = -1.1 + 2.2 * progress;
      const cardY = 18 - 42 * progress;
      const tagY = 12 - 26 * progress;

      media.style.transform = `translate3d(0, ${imageY.toFixed(2)}px, 0) rotate(${imageRotate.toFixed(2)}deg)`;
      floatingCard.style.transform = `translate3d(0, ${cardY.toFixed(2)}px, 0)`;
      cornerTag.style.transform = `translate3d(0, ${tagY.toFixed(2)}px, 0)`;
    };

    const queueParallaxUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateParallax);
    };

    measure();
    queueParallaxUpdate();

    const handleResize = () => {
      measure();
      queueParallaxUpdate();
    };

    window.addEventListener('scroll', queueParallaxUpdate, { passive: true });
    window.addEventListener('resize', handleResize);

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        measure();
        queueParallaxUpdate();
      });
      resizeObserver.observe(section);
    }

    return () => {
      window.clearTimeout(motionReadyTimer);
      window.removeEventListener('scroll', queueParallaxUpdate);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      media.style.transform = '';
      floatingCard.style.transform = '';
      cornerTag.style.transform = '';
      media.style.willChange = '';
      floatingCard.style.willChange = '';
      cornerTag.style.willChange = '';
      delete section.dataset.motion;
    };
  }, [motionProfile.reduce, shouldAnimateHero]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-section relative isolate flex min-h-[92svh] items-center overflow-hidden pb-16 pt-24 md:pb-20 md:pt-28 grain-overlay"
    >
      <div className="hero-ambient absolute inset-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="hero-shell grid items-center gap-12 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <div
              className={`inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/88 px-4 py-2 ${
                shouldAnimateHero ? 'hero-reveal hero-reveal-1' : ''
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <p className="section-label font-outfit text-muted-foreground/95">{t('hero.subtitle')}</p>
            </div>

            <h1 className="hero-title mt-7 mb-3 text-5xl text-foreground md:text-6xl lg:text-7xl xl:text-[5rem]">
              {shouldAnimateHero ? (
                <>
                  <LiteSplitTextReveal text="Gisela" delay={0.18} stagger={0.07} />{' '}
                  <LiteSplitTextReveal
                    text="Saldarriaga"
                    delay={0.28}
                    stagger={0.07}
                    className="text-accent luxury-accent align-baseline"
                  />
                </>
              ) : (
                <>
                  <span>Gisela </span>
                  <span className="text-accent luxury-accent align-baseline">Saldarriaga</span>
                </>
              )}
            </h1>

            <p
              className={`section-label mb-8 text-foreground/55 ${
                shouldAnimateHero ? 'hero-reveal hero-reveal-2' : ''
              }`}
            >
              {t('hero.signature')}
            </p>

            <div
              className={`signature-line mb-8 h-px w-44 ${shouldAnimateHero ? 'hero-reveal hero-reveal-3' : ''}`}
            />

            <p
              className={`strategic-body mb-10 max-w-xl text-lg text-foreground/80 md:text-xl ${
                shouldAnimateHero ? 'hero-reveal hero-reveal-4' : ''
              }`}
            >
              {t('hero.description')}
            </p>

            <div
              className={`hidden flex-col gap-4 sm:flex-row sm:gap-5 md:flex ${
                shouldAnimateHero ? 'hero-reveal hero-reveal-5' : ''
              }`}
            >
              <a href="#portfolio" onClick={handleHashLinkClick} className="btn-primary-nordic px-8 py-3.5">
                {t('hero.buttonPortfolio')}
              </a>
              <a href="#contact" onClick={handleContactCtaClick} className="btn-primary-nordic px-8 py-3.5">
                {t('hero.buttonContact')}
              </a>
            </div>

            <div
              className={`mt-10 hidden gap-3 md:flex md:flex-wrap ${
                shouldAnimateHero ? 'hero-reveal hero-reveal-6' : ''
              }`}
            >
              {heroPills.map(({ icon: Icon, labelKey }) => (
                <div key={labelKey} className="hero-chip group">
                  <Icon className="h-3 w-3 text-accent/70 transition-colors group-hover:text-accent" />
                  <span>{t(labelKey)}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={mediaRef}
            className={`order-1 flex justify-center lg:order-2 lg:justify-end ${
              shouldAnimateHero ? 'hero-reveal hero-reveal-4' : ''
            }`}
          >
            <div className="relative w-full max-w-[25rem]">
              <div className="hero-frame-glow absolute -inset-6 pointer-events-none" />
              <div className="hero-image-shell relative overflow-hidden bg-card/95 p-3.5">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/uploads/gisela-hero-400.webp 400w, /uploads/gisela-hero-585.webp 585w, /uploads/gisela-hero-640.webp 640w, /uploads/gisela-hero-800.webp 800w, /uploads/gisela-hero-1200.webp 1200w"
                    sizes="(min-width: 1280px) 400px, (min-width: 1024px) 380px, (min-width: 768px) 43vw, 76vw"
                  />
                  <img
                    src="/uploads/gisela-hero-585.jpg"
                    alt={t('hero.imageAlt')}
                    className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
                    width={585}
                    height={731}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              </div>

              <div ref={floatingCardRef} className="hero-floating-card hero-parallax-floating-card">
                <p className="hero-floating-label">{t('hero.proofLabel')}</p>
                <p className="hero-floating-value">{t('hero.proofValue')}</p>
                <p className="hero-floating-caption">{t('hero.proofCaption')}</p>
              </div>

              <div ref={cornerTagRef} className="hero-corner-tag hero-parallax-corner-tag">
                <span>{t('hero.tagline')}</span>
              </div>
            </div>
          </div>
        </div>

        {showIntroduction && (
          <div className="mt-24 mb-16 border-t border-border/40 pt-16">
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_2fr]">
              <div className="space-y-6">
                <span className="section-label">{t('hero.introduction.eyebrow')}</span>
                <h2 className="text-4xl text-foreground md:text-5xl lg:text-6xl font-serif leading-[0.95] tracking-tight-serif">
                  <LiteSplitTextReveal text={t('hero.introduction.title')} delay={0} stagger={0.06} />
                </h2>
              </div>
              <div className="lg:pt-20">
                <p className="strategic-body max-w-2xl text-lg text-foreground/60 md:text-xl">
                  {t('hero.introduction.description')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
