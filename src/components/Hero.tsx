import { useTranslation } from 'react-i18next';
import { ArrowDown, Sparkles, Diamond, Zap } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="hero-section relative isolate min-h-[92svh] flex items-center pt-24 md:pt-28 pb-16 md:pb-20 overflow-hidden grain-overlay"
    >
      <div className="hero-ambient absolute inset-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="hero-shell grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <p className="section-label text-muted-foreground/95">{t('hero.subtitle')}</p>
            </div>

            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] text-foreground mt-7 mb-3 animate-slide-down">
              Gisela <span className="text-primary luxury-accent">Saldarriaga</span>
            </h1>
            <p
              className="text-[11px] md:text-xs uppercase tracking-[0.26em] text-foreground/55 mb-8 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              {t('hero.signature')}
            </p>

            <div className="w-44 h-px signature-line mb-8" />

            <p
              className="text-foreground/80 text-lg md:text-xl mb-10 max-w-xl leading-relaxed animate-fade-in"
              style={{ animationDelay: '0.25s' }}
            >
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <a href="#portfolio" className="btn-primary-nordic px-8 py-3.5 hover-grow btn-press">
                {t('hero.buttonPortfolio')}
              </a>
              <a href="#contact" className="btn-secondary-nordic px-8 py-3.5 hover-grow">
                {t('hero.buttonContact')}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '0.55s' }}>
              <div className="hero-chip group">
                <Sparkles className="h-3 w-3 text-accent/70 group-hover:text-accent transition-colors" />
                <span>{t('hero.pillStrategy')}</span>
              </div>
              <div className="hero-chip group">
                <Diamond className="h-3 w-3 text-accent/70 group-hover:text-accent transition-colors" />
                <span>{t('hero.pillAesthetic')}</span>
              </div>
              <div className="hero-chip group">
                <Zap className="h-3 w-3 text-accent/70 group-hover:text-accent transition-colors" />
                <span>{t('hero.pillConversion')}</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-scale">
            <div className="relative w-full max-w-[25rem]">
              <div className="hero-frame-glow absolute -inset-6 pointer-events-none" />
              <div className="hero-image-shell relative overflow-hidden p-3.5 bg-card/95">
                <img
                  src="/uploads/1bceae6e-5154-4d2e-b3fb-2957b86796a7.png"
                  alt={t('hero.imageAlt')}
                  className="w-full aspect-[4/5] object-cover rounded-[1.5rem]"
                  fetchPriority="high"
                  decoding="async"
                />
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
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex animate-float">
        <a href="#services" className="flex flex-col items-center text-primary/65 hover:text-primary transition-colors">
          <span className="text-xs mb-2 uppercase tracking-[0.14em]">{t('hero.scrollPrompt')}</span>
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
