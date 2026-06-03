import { useTranslation } from 'react-i18next';
import { toggleContactDock } from '@/lib/contact-dock';

const MobileContactCtaSection = () => {
  const { t } = useTranslation();

  return (
    <section id="mobile-contact-cta" className="studio-section bg-background pt-2 pb-4 md:hidden">
      <div className="studio-container flex justify-center">
        <button
          type="button"
          onClick={toggleContactDock}
          className="btn-primary-nordic btn-primary-nordic--lg"
        >
          {t('hero.buttonContact')}
        </button>
      </div>
    </section>
  );
};

export default MobileContactCtaSection;
