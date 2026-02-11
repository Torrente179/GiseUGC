import { useTranslation } from 'react-i18next';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/70 py-14 md:py-16">
      <div className="studio-container">
        <div className="studio-panel p-6 md:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-start">
            <div>
              <h3 className="brand-logo text-3xl text-primary mb-4">
                {t('footer.brandName')}
                <span className="text-foreground text-4xl">.</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">{t('footer.description')}</p>

              <div className="flex gap-2.5 mt-6">
                <a href="#" className="h-9 w-9 rounded-full border border-border/70 bg-card/80 flex items-center justify-center text-foreground/75 hover:text-primary transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-full border border-border/70 bg-card/80 flex items-center justify-center text-foreground/75 hover:text-primary transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-full border border-border/70 bg-card/80 flex items-center justify-center text-foreground/75 hover:text-primary transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-full border border-border/70 bg-card/80 flex items-center justify-center text-foreground/75 hover:text-primary transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h4 className="section-label text-primary mb-4">{t('footer.servicesTitle')}</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('services.service1.title')}</a></li>
                  <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('services.service2.title')}</a></li>
                  <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('services.service3.title')}</a></li>
                  <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('services.service4.title')}</a></li>
                </ul>
              </div>

              <div>
                <h4 className="section-label text-primary mb-4">{t('footer.quickLinksTitle')}</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="#home" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.home')}</a></li>
                  <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.services')}</a></li>
                  <li><a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.portfolio')}</a></li>
                  <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.testimonials')}</a></li>
                  <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">{t('navbar.contact')}</a></li>
                </ul>
              </div>

              <div>
                <h4 className="section-label text-primary mb-4">{t('footer.contactTitle')}</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-muted-foreground">{t('contact.emailLabel')}: {t('contact.emailValue')}</li>
                  <li className="text-muted-foreground">{t('contact.fiverrLabel')}: {t('contact.fiverrValue')}</li>
                  <li>
                    <a
                      href="https://www.fiverr.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-nordic mt-3 px-5 py-2.5 hover-grow inline-flex"
                    >
                      {t('footer.hireOnFiverrButton')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-border/70 mt-10 pt-6 text-center">
            <p className="text-sm text-muted-foreground">{t('footer.copyright', { year })}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
