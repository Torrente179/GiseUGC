import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { blurRevealUp, springSmooth } from '@/components/motion/variants';
import { getLocaleFromPath, getServicePath, type ServicePageId } from '@/lib/locale-path';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';
const fiverrLogoSrc = '/uploads/fiverr-logo-56.webp';
const whatsappLogoSrc = '/uploads/whatsapp.png';

const servicePageIds: ServicePageId[] = [
  'bilingual-ugc-creator',
  'spokesperson-videos',
  'ugc-ads-tiktok-meta',
];

const Footer = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);
  const currentYear = new Date().getFullYear();

  const serviceLinks = servicePageIds.map((serviceId) => ({
    href: getServicePath(serviceId, locale),
    label: t(`footer.services.${serviceId}`),
  }));

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-border/50 bg-[#F7F2E9] pb-8 pt-8 text-foreground transition-colors duration-300 dark:bg-background md:pb-10 md:pt-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/60 to-transparent dark:from-card/10" />
      </div>

      <div className="studio-container">
        <motion.div
          className="relative overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background/90 px-4 py-5 shadow-[0_28px_70px_-54px_hsl(var(--foreground)/0.45)] backdrop-blur-sm dark:bg-card/88 sm:px-5 sm:py-7 md:rounded-[1.85rem] md:px-8 md:py-8 lg:px-10"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(290px,0.42fr)] lg:items-end lg:gap-10">
            <motion.div className="space-y-3.5 md:space-y-5" variants={blurRevealUp(12, 0.52)}>
              <p className="brand-logo text-[1.28rem] leading-none sm:text-[1.65rem]">Gisela.UGC</p>
              <h2 className="max-w-none text-[1.6rem] leading-[0.98] tracking-[-0.03em] text-balance sm:max-w-[15ch] sm:text-[2.2rem] md:max-w-2xl md:text-[3rem] md:leading-[0.94]">
                {t('footer.title')}
              </h2>
              <p className="max-w-[34rem] text-[14px] leading-[1.58] text-foreground/68 md:text-base md:leading-[1.68]">
                {t('footer.description')}
              </p>
            </motion.div>

            <motion.div className="flex flex-col gap-2 md:gap-3" variants={blurRevealUp(14, 0.56)}>
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[3rem] w-full items-center justify-between rounded-full bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-[0_18px_40px_-30px_hsl(var(--primary)/0.95)] transition-all hover:-translate-y-[1px] hover:bg-primary/92 sm:px-5 sm:text-[13px]"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                transition={springSmooth}
              >
                <span className="inline-flex items-center gap-2.5">
                  <img
                    src={whatsappLogoSrc}
                    alt=""
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                    className="h-4.5 w-4.5 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)] sm:h-5 sm:w-5"
                  />
                  {t('footer.primaryCta')}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </motion.a>

              <motion.a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[2.8rem] w-full items-center justify-between rounded-full border border-foreground/12 bg-background/92 px-4 py-2.5 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/35 hover:text-primary dark:bg-card/92 sm:px-5 sm:text-[13px]"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                transition={springSmooth}
              >
                <span className="inline-flex items-center gap-2.5">
                  <img
                    src={fiverrLogoSrc}
                    alt=""
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                    className="h-4.5 w-4.5 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)] sm:h-5 sm:w-5"
                  />
                  {t('footer.fiverr.visitProfile')}
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            className="mt-6 border-t border-foreground/10 pt-4 md:mt-9 md:pt-6"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <nav className="flex flex-wrap gap-x-4 gap-y-2.5 sm:items-center sm:gap-x-5 sm:gap-y-2">
              {serviceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 text-[14px] leading-6 text-foreground/72 transition-colors hover:text-primary md:text-[15px]"
                >
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-1.5 text-[13px] leading-[1.55] text-foreground/58 md:mt-4 md:flex-row md:items-center md:justify-between md:text-sm">
              <p>{t('footer.bottomNote')}</p>
              <p>{t('footer.copyright', { year: currentYear })}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
