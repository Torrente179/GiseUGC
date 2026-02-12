import { useTranslation } from 'react-i18next';
import { Diamond, Sparkles, Zap } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';

const Hero = () => {
  const { t } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();

  const heroPills = [
    { icon: Sparkles, labelKey: 'hero.pillStrategy' },
    { icon: Diamond, labelKey: 'hero.pillAesthetic' },
    { icon: Zap, labelKey: 'hero.pillConversion' },
  ];

  return (
    <section
      id="home"
      className="hero-section relative isolate min-h-[92svh] flex items-center pt-24 md:pt-28 pb-16 md:pb-20 overflow-hidden grain-overlay"
    >
      <div className="hero-ambient absolute inset-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="hero-shell grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <p className="section-label font-outfit text-muted-foreground/95">{t('hero.subtitle')}</p>
            </div>

            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] text-foreground mt-7 mb-3">
              <span className="inline-block">Gisela</span>{' '}
              <span className="text-accent luxury-accent inline-block align-baseline">Saldarriaga</span>
            </h1>

            <p className="section-label text-foreground/55 mb-8">{t('hero.signature')}</p>

            <div className="w-44 h-px signature-line mb-8" />

            <p className="strategic-body text-foreground/80 text-lg md:text-xl mb-10 max-w-xl">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <a
                href="#portfolio"
                onClick={handleHashLinkClick}
                className="btn-primary-nordic px-8 py-3.5 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]"
              >
                {t('hero.buttonPortfolio')}
              </a>
              <a
                href="#contact"
                onClick={handleHashLinkClick}
                className="btn-secondary-nordic px-8 py-3.5 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]"
              >
                {t('hero.buttonContact')}
              </a>
            </div>

            <div className="mt-10 hidden md:flex md:flex-wrap gap-3">
              {heroPills.map(({ icon: Icon, labelKey }) => (
                <div
                  key={labelKey}
                  className="hero-chip group transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]"
                >
                  <Icon className="h-3 w-3 text-accent/70 group-hover:text-accent transition-colors" />
                  <span>{t(labelKey)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[25rem]">
              <div className="hero-frame-glow absolute -inset-6 pointer-events-none" />
              <div className="hero-image-shell relative overflow-hidden p-3.5 bg-card/95">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/uploads/gisela-hero-585.webp 585w, /uploads/gisela-hero-640.webp 640w, /uploads/gisela-hero-800.webp 800w, /uploads/gisela-hero-1200.webp 1200w"
                    sizes="(min-width: 1280px) 400px, (min-width: 1024px) 380px, (min-width: 768px) 43vw, 76vw"
                  />
                  <img
                    src="/uploads/gisela-hero-585.jpg"
                    alt={t('hero.imageAlt')}
                    className="w-full aspect-[4/5] object-cover rounded-[1.5rem]"
                    width={585}
                    height={731}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              </div>

              <div className="hero-floating-card">
                <p className="hero-floating-label">{t('hero.proofLabel')}</p>
                <p className="hero-floating-value">{t('hero.proofValue')}</p>
                <p className="hero-floating-caption">{t('hero.proofCaption')}</p>
              </div>

              <div className="hero-corner-tag">
                <span>{t('hero.tagline')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 mb-16 pt-16 border-t border-border/40">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <div className="space-y-6">
              <span className="section-label">{t('hero.introduction.eyebrow')}</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[0.95] tracking-tight-serif">
                {t('hero.introduction.title')}
              </h2>
            </div>
            <div className="lg:pt-20">
              <p className="strategic-body text-foreground/60 text-lg md:text-xl max-w-2xl">
                {t('hero.introduction.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
