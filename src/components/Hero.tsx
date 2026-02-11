import { useTranslation } from 'react-i18next'; // Import useTranslation
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden grain-overlay">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cream via-secondary/70 to-brand-sand/45 dark:from-background dark:via-secondary/35 dark:to-background" />
      <div className="absolute -top-44 -left-44 h-[30rem] w-[30rem] rounded-full bg-brand-teal/10 blur-[130px]" />
      <div className="absolute -bottom-52 -right-44 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[130px]" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <p className="text-brand-olive text-sm md:text-base mb-5 animate-fade-in tracking-[0.2em] uppercase font-semibold">
              {t('hero.subtitle')}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground font-playfair mb-6 leading-tight animate-slide-down">
              Gisela <span className="text-primary italic">Saldarriaga</span>
            </h1>
            <div className="w-40 h-1 signature-line mb-8" />
            <p className="text-foreground/75 dark:text-foreground/80 text-lg md:text-xl mb-10 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <a
                href="#portfolio"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-brand-teal text-primary-foreground font-medium hover-grow btn-press"
              >
                {t('hero.buttonPortfolio')}
              </a>
              <a
                href="#contact"
                className="px-8 py-3.5 rounded-full bg-transparent border border-primary/60 text-primary font-medium hover-grow hover:bg-primary/10"
              >
                {t('hero.buttonContact')}
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-primary/35 via-brand-teal/20 to-brand-gold/30 blur-xl opacity-80" />
              <div className="relative cafe-panel overflow-hidden p-3 max-w-sm mx-auto">
                <img
                  src="/uploads/1bceae6e-5154-4d2e-b3fb-2957b86796a7.png"
                  alt={t('hero.imageAlt')}
                  className="w-full h-auto rounded-[1.2rem]"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
        <a href="#services" className="flex flex-col items-center text-primary/70 hover:text-brand-teal transition-colors">
          <span className="text-sm mb-2 font-light">{t('hero.scrollPrompt')}</span>
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
