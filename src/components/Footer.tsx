import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLocaleFromPath, getServicePath, type ServicePageId } from '@/lib/locale-path';

/* ── External URLs ── */
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/+573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/sm_gisela/';
const tiktokUrl = import.meta.env.VITE_TIKTOK_URL ?? 'https://www.tiktok.com/@giselasaldarriaga';
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/in/gisela-saldarriaga-molina-0417b8199/';

const servicePageIds: ServicePageId[] = [
  'bilingual-ugc-creator',
  'spokesperson-videos',
  'ugc-ads-tiktok-meta',
  'ugc-testimonials-reviews',
  'ugc-product-demo',
  'ugc-problem-solution',
  'ugc-lifestyle',
  'ugc-broll-footage',
];

/* ════════════════════════════════════════════════════════════════════
   "END CREDITS" FOOTER
   Dark, confident, final. Two separate render paths.
   Desktop: editorial 3-column grid.
   Mobile: app-like stacked layout.
   ════════════════════════════════════════════════════════════════════ */

const Footer = () => {
  const { t } = useTranslation();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);
  const currentYear = new Date().getFullYear();

  const serviceLinks = servicePageIds.map((serviceId) => ({
    href: getServicePath(serviceId, locale),
    label: t(`footer.services.${serviceId}`),
  }));

  return (
    <footer id="contact" className="ft-root">

      {/* ╔══════════════════════════════════════════════════════════╗
          ║  DESKTOP — Editorial 3-column grid (≥ 768px)            ║
          ╚══════════════════════════════════════════════════════════╝ */}
      <div className="ft-desktop hidden md:block">
        <div className="ft-container">
          {/* Top row: brand + nav columns */}
          <div className="ft-grid">
            {/* Brand column */}
            <div className="ft-brand">
              <p className="ft-logo">Gisela<span className="ft-logo-dot">.</span>UGC</p>
              <h2 className="ft-statement">{t('footer.title')}</h2>
              <p className="ft-desc">{t('footer.description')}</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-cta"
              >
                {t('footer.primaryCta')}
              </a>
            </div>

            {/* Services column */}
            <nav className="ft-nav-col" aria-label={t('footer.servicesTitle')}>
              <p className="ft-nav-label">{t('footer.servicesTitle')}</p>
              {serviceLinks.map((link) => (
                <a key={link.href} href={link.href} className="ft-nav-link">
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Connect column */}
            <div className="ft-nav-col">
              <p className="ft-nav-label">{locale === 'es' ? 'Conectar' : 'Connect'}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="ft-nav-link">WhatsApp</a>
              <a href={fiverrUrl} target="_blank" rel="noopener noreferrer" className="ft-nav-link">Fiverr</a>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="ft-nav-link">Telegram</a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="ft-nav-link">Instagram</a>
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="ft-nav-link">TikTok</a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="ft-nav-link">LinkedIn</a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="ft-bar">
            <p className="ft-bar-text">{t('footer.bottomNote')}</p>
            <p className="ft-bar-text">{t('footer.copyright', { year: currentYear })}</p>
          </div>
        </div>
      </div>

      {/* ╔══════════════════════════════════════════════════════════╗
          ║  MOBILE — App-like stacked layout (< 768px)             ║
          ╚══════════════════════════════════════════════════════════╝ */}
      <div className="ftm-mobile md:hidden">
        {/* Brand + CTA */}
        <div className="ftm-top">
          <p className="ft-logo">Gisela<span className="ft-logo-dot">.</span>UGC</p>
          <h2 className="ftm-statement">{t('footer.title')}</h2>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ftm-cta"
          >
            {t('footer.primaryCta')}
          </a>
          {/* Secondary links inline */}
          <div className="ftm-secondary-links">
            <a href={fiverrUrl} target="_blank" rel="noopener noreferrer">Fiverr</a>
            <span className="ftm-dot" aria-hidden="true">·</span>
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
        </div>

        {/* Service links */}
        <nav className="ftm-services" aria-label={t('footer.servicesTitle')}>
          {serviceLinks.map((link) => (
            <Link key={link.href} to={link.href} className="ftm-service-link">
              <span>{link.label}</span>
              <span className="ftm-service-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>

        {/* Social row */}
        <div className="ftm-social-row">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="ftm-social-pill">Instagram</a>
          <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="ftm-social-pill">TikTok</a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="ftm-social-pill">LinkedIn</a>
        </div>

        {/* Bottom info */}
        <div className="ftm-bottom">
          <p className="ftm-bottom-text">{t('footer.studioFactLocation')}</p>
          <p className="ftm-bottom-text">{t('footer.studioFactLanguages')}</p>
          <p className="ftm-bottom-text ftm-bottom-copyright">{t('footer.copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
