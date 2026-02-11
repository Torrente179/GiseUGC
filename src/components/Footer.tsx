import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const year = new Date().getFullYear();
  
  return (
    <footer className="relative overflow-hidden bg-brand-cocoa text-brand-cream py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cocoa via-primary/90 to-brand-cocoa" />
      <div className="absolute right-[-10rem] top-[-6rem] h-[16rem] w-[16rem] rounded-full bg-brand-teal/20 blur-[90px]" />
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-playfair font-semibold mb-6">{t('footer.brandName')}<span className="text-brand-teal text-3xl">.</span></h3>
            <p className="text-brand-cream/70 mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-brand-cream/80 hover:text-brand-teal transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-brand-cream/80 hover:text-brand-teal transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-brand-cream/80 hover:text-brand-teal transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-brand-cream/80 hover:text-brand-teal transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6 text-brand-gold">{t('footer.servicesTitle')}</h3>
            <ul className="space-y-3">
              {/* Use keys from services section */}
              <li><a href="#services" className="text-brand-cream/70 hover:text-brand-cream transition-colors">{t('services.service1.title')}</a></li>
              <li><a href="#services" className="text-brand-cream/70 hover:text-brand-cream transition-colors">{t('services.service2.title')}</a></li>
              <li><a href="#services" className="text-brand-cream/70 hover:text-brand-cream transition-colors">{t('services.service3.title')}</a></li>
              <li><a href="#services" className="text-brand-cream/70 hover:text-brand-cream transition-colors">{t('services.service4.title')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6 text-brand-gold">{t('footer.quickLinksTitle')}</h3>
            <ul className="space-y-3">
              {/* Use keys from navbar section */}
              <li><a href="#home" className="text-brand-cream/70 hover:text-brand-cream transition-colors">{t('navbar.home')}</a></li>
              <li><a href="#services" className="text-brand-cream/70 hover:text-brand-cream transition-colors">{t('navbar.services')}</a></li>
              <li><a href="#portfolio" className="text-brand-cream/70 hover:text-brand-cream transition-colors">{t('navbar.portfolio')}</a></li>
              <li><a href="#testimonials" className="text-brand-cream/70 hover:text-brand-cream transition-colors">{t('navbar.testimonials')}</a></li>
              <li><a href="#contact" className="text-brand-cream/70 hover:text-brand-cream transition-colors">{t('navbar.contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6 text-brand-gold">{t('footer.contactTitle')}</h3>
            <ul className="space-y-3">
              {/* Use keys from contact section */}
              <li className="text-brand-cream/70">{t('contact.emailLabel')}: {t('contact.emailValue')}</li>
              <li className="text-brand-cream/70">{t('contact.fiverrLabel')}: {t('contact.fiverrValue')}</li>
              <li>
                <a 
                  href="https://www.fiverr.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2.5 rounded-full bg-brand-cream text-primary font-medium hover-grow"
                >
                  {t('footer.hireOnFiverrButton')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-brand-cream/20 mt-12 pt-8 text-center">
          <p className="text-brand-cream/60">
            {t('footer.copyright', { year: year })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
