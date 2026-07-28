import { Fragment } from 'react';
import { useTranslation } from '@/lib/locale-context';
import { Link } from 'react-router-dom';
import {
  getLegalPath,
  getServiceIdsInOrder,
  getServicePath,
} from '@/lib/locale-path';

/* ── External URLs ── */
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/+573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/sm_gisela/';
const tiktokUrl = import.meta.env.VITE_TIKTOK_URL ?? 'https://www.tiktok.com/@giselasaldarriaga';
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/in/gisela-saldarriaga-molina-0417b8199/';

// Service links derive from the page registry (canonical order) — never re-listed here.
const servicePageIds = getServiceIdsInOrder();

/* ════════════════════════════════════════════════════════════════════
   FOOTER — Light-linen "bold close"
   One responsive, theme-aware structure: oversized statement + teal CTA,
   then demoted link columns, then a quiet bottom bar.
   ════════════════════════════════════════════════════════════════════ */

const Footer = () => {
  const { t, locale } = useTranslation();
  const currentYear = new Date().getFullYear();

  const serviceLinks = servicePageIds.map((serviceId) => ({
    href: getServicePath(serviceId, locale),
    label: t(`footer.services.${serviceId}`),
  }));

  const connectLinks = [
    { href: whatsappUrl, label: 'WhatsApp' },
    { href: fiverrUrl, label: 'Fiverr' },
    { href: telegramUrl, label: 'Telegram' },
    { href: instagramUrl, label: 'Instagram' },
    { href: tiktokUrl, label: 'TikTok' },
    { href: linkedinUrl, label: 'LinkedIn' },
  ];

  const legalLinks = [
    { href: getLegalPath('privacy-policy', locale), label: t('footer.privacyPolicy') },
    { href: getLegalPath('terms-content-use', locale), label: t('footer.termsContentUse') },
  ];

  const connectTitle = locale === 'es' ? 'Conectar' : 'Connect';
  const studioTitle = locale === 'es' ? 'Estudio' : 'Studio';

  return (
    <footer id="contact" className="ft-root">
      <div className="ft-shell">
        {/* Bold statement close */}
        <div className="ft-close">
          <p className="ft-logo">Gisela<span className="ft-logo-dot">.</span>UGC</p>
          <h2 className="ft-statement">{t('footer.title')}</h2>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ft-cta"
          >
            {t('footer.primaryCta')}
            <span className="ft-cta-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>

        {/* Demoted link columns */}
        <div className="ft-links">
          <nav className="ft-col" aria-label={t('footer.servicesTitle')}>
            <p className="ft-col-label">{t('footer.servicesTitle')}</p>
            {serviceLinks.map((link) => (
              <Link key={link.href} to={link.href} className="ft-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className="ft-col" aria-label={connectTitle}>
            <p className="ft-col-label">{connectTitle}</p>
            {connectLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ft-col ft-col--studio">
            <p className="ft-col-label">{studioTitle}</p>
            <p className="ft-meta">{t('footer.description')}</p>
            <p className="ft-meta">
              {t('footer.studioFactLocation')} · {t('footer.studioFactLanguages')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ft-bar">
          <p className="ft-bar-copy">{t('footer.copyright', { year: currentYear })}</p>
          <nav className="ft-bar-legal" aria-label={t('footer.legalTitle')}>
            {legalLinks.map((link, index) => (
              <Fragment key={link.href}>
                <Link to={link.href} className="ft-bar-link">
                  {link.label}
                </Link>
                {index < legalLinks.length - 1 ? (
                  <span className="ft-bar-divider" aria-hidden="true">/</span>
                ) : null}
              </Fragment>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
