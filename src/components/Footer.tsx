import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-playfair font-semibold mb-6">{t('footer.brandName')}<span className="text-3xl">.</span></h3>
            <p className="text-white/70 mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6">{t('footer.servicesTitle')}</h3>
            <ul className="space-y-3">
              {/* Use keys from services section */}
              <li><a href="#services" className="text-white/70 hover:text-white transition-colors">{t('services.service1.title')}</a></li>
              <li><a href="#services" className="text-white/70 hover:text-white transition-colors">{t('services.service2.title')}</a></li>
              <li><a href="#services" className="text-white/70 hover:text-white transition-colors">{t('services.service3.title')}</a></li>
              <li><a href="#services" className="text-white/70 hover:text-white transition-colors">{t('services.service4.title')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6">{t('footer.quickLinksTitle')}</h3>
            <ul className="space-y-3">
              {/* Use keys from navbar section */}
              <li><a href="#home" className="text-white/70 hover:text-white transition-colors">{t('navbar.home')}</a></li>
              <li><a href="#services" className="text-white/70 hover:text-white transition-colors">{t('navbar.services')}</a></li>
              <li><a href="#portfolio" className="text-white/70 hover:text-white transition-colors">{t('navbar.portfolio')}</a></li>
              <li><a href="#testimonials" className="text-white/70 hover:text-white transition-colors">{t('navbar.testimonials')}</a></li>
              <li><a href="#contact" className="text-white/70 hover:text-white transition-colors">{t('navbar.contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6">{t('footer.contactTitle')}</h3>
            <ul className="space-y-3">
              {/* Use keys from contact section */}
              <li className="text-white/70">{t('contact.emailLabel')}: {t('contact.emailValue')}</li>
              <li className="text-white/70">{t('contact.fiverrLabel')}: {t('contact.fiverrValue')}</li>
              <li>
                <a 
                  href="https://www.fiverr.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2.5 rounded-full bg-white text-primary font-medium hover-grow"
                >
                  {t('footer.hireOnFiverrButton')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/60">
            {t('footer.copyright', { year: year })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
