import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/40 text-foreground py-16 border-t border-border">
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-playfair font-semibold mb-6 text-primary">{t('footer.brandName')}<span className="text-foreground text-3xl">.</span></h3>
            <p className="text-muted-foreground mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/75 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/75 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/75 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/75 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6 text-primary">{t('footer.servicesTitle')}</h3>
            <ul className="space-y-3">
              {/* Use keys from services section */}
              <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('services.service1.title')}</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('services.service2.title')}</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('services.service3.title')}</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('services.service4.title')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6 text-primary">{t('footer.quickLinksTitle')}</h3>
            <ul className="space-y-3">
              {/* Use keys from navbar section */}
              <li><a href="#home" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.home')}</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.services')}</a></li>
              <li><a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.portfolio')}</a></li>
              <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.testimonials')}</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6 text-primary">{t('footer.contactTitle')}</h3>
            <ul className="space-y-3">
              {/* Use keys from contact section */}
              <li className="text-muted-foreground">{t('contact.emailLabel')}: {t('contact.emailValue')}</li>
              <li className="text-muted-foreground">{t('contact.fiverrLabel')}: {t('contact.fiverrValue')}</li>
              <li>
                <a 
                  href="https://www.fiverr.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover-grow"
                >
                  {t('footer.hireOnFiverrButton')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            {t('footer.copyright', { year: year })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
