import { useTranslation } from 'react-i18next';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#C4B59B] text-foreground py-16 md:py-20">
      <div className="studio-container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-start mb-16">
          <div>
            <h3 className="brand-logo text-3xl mb-6">
              {t('footer.brandName')}
              <span className="text-accent text-4xl">.</span>
            </h3>
            <p className="strategic-body text-foreground/70 max-w-md">{t('footer.description')}</p>

            <div className="flex gap-3 mt-8">
              <a href="#" className="h-10 w-10 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="section-label text-accent mb-6">{t('footer.servicesTitle')}</h4>
              <ul className="space-y-3.5 text-sm">
                <li><a href="#services" className="text-foreground/70 hover:text-foreground transition-colors">{t('services.service1.title')}</a></li>
                <li><a href="#services" className="text-foreground/70 hover:text-foreground transition-colors">{t('services.service2.title')}</a></li>
                <li><a href="#services" className="text-foreground/70 hover:text-foreground transition-colors">{t('services.service3.title')}</a></li>
                <li><a href="#services" className="text-foreground/70 hover:text-foreground transition-colors">{t('services.service4.title')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="section-label text-accent mb-6">{t('footer.quickLinksTitle')}</h4>
              <ul className="space-y-3.5 text-sm">
                <li><a href="#home" className="text-foreground/70 hover:text-foreground transition-colors">{t('navbar.home')}</a></li>
                <li><a href="#services" className="text-foreground/70 hover:text-foreground transition-colors">{t('navbar.services')}</a></li>
                <li><a href="#portfolio" className="text-foreground/70 hover:text-foreground transition-colors">{t('navbar.portfolio')}</a></li>
                <li><a href="#testimonials" className="text-foreground/70 hover:text-foreground transition-colors">{t('navbar.testimonials')}</a></li>
                <li><a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors">{t('navbar.contact')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="section-label text-accent mb-6">{t('footer.contactTitle')}</h4>
              <ul className="space-y-3 text-sm">
                <li className="text-foreground/70">{t('contact.emailLabel')}: <span className="text-foreground">{t('contact.emailValue')}</span></li>
                <li className="text-foreground/70">{t('contact.fiverrLabel')}: <span className="text-foreground">{t('contact.fiverrValue')}</span></li>
                <li>
                  <a
                    href="https://www.fiverr.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-nordic mt-5 px-6 py-3 hover-grow inline-flex"
                  >
                    {t('footer.hireOnFiverrButton')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/15 pt-8 text-center">
          <p className="text-xs text-foreground/55 tracking-wider">
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
