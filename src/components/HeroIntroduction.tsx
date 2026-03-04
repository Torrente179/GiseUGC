import { useTranslation } from 'react-i18next';
import LiteSplitTextReveal from '@/components/motion/LiteSplitTextReveal';

const HeroIntroduction = () => {
  const { t } = useTranslation();

  return (
    <section id="hero-introduction" className="studio-section bg-background pt-10 pb-10">
      <div className="studio-container">
        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 md:gap-10 items-start">
          <div className="space-y-4">
            <span className="section-label">{t('hero.introduction.eyebrow')}</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground leading-[0.95] tracking-tight-serif">
              <LiteSplitTextReveal text={t('hero.introduction.title')} delay={0} stagger={0.07} />
            </h2>
          </div>
          <div className="md:pt-9">
            <p className="strategic-body text-foreground/60 text-base sm:text-lg">
              {t('hero.introduction.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroIntroduction;
