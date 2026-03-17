import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Send,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { blurRevealUp, springSmooth, staggerContainer } from '@/components/motion/variants';
import { getLocaleFromPath, getServicePath, type ServicePageId } from '@/lib/locale-path';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/+573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/sm_gisela/';
const linkedinUrl =
  import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/in/gisela-saldarriaga-molina-0417b8199/';
const tiktokUrl = import.meta.env.VITE_TIKTOK_URL ?? 'https://www.tiktok.com/@giselasaldarriaga';
const threadsUrl = import.meta.env.VITE_THREADS_URL ?? 'https://www.threads.com/@sm_gisela';
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/gisela.saldarriaga';
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

  const profilePlatforms = [
    {
      id: 'instagram',
      href: instagramUrl,
      label: t('floatingContact.instagramLabel'),
      icon: <Instagram className="h-5 w-5" />,
    },
    {
      id: 'tiktok',
      href: tiktokUrl,
      label: t('floatingContact.tiktokLabel'),
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.12z" />
        </svg>
      ),
    },
    {
      id: 'threads',
      href: threadsUrl,
      label: t('floatingContact.threadsLabel'),
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.773.776c-1.048-3.76-3.678-5.478-7.563-5.502-2.792.019-4.86.936-6.144 2.725C4.863 7.222 4.18 9.376 4.156 12c.024 2.627.707 4.78 1.893 6.436 1.285 1.79 3.352 2.706 6.145 2.725 2.307-.016 4.006-.587 5.2-1.74.94-.912 1.553-2.164 1.553-3.895-.006-.96-.183-1.755-.529-2.362a3.805 3.805 0 0 0-1.473-1.533c-.293 1.755-.942 3.07-1.94 3.908-1.108.932-2.528 1.384-4.2 1.34-1.292-.034-2.4-.467-3.217-1.26-.876-.846-1.34-1.975-1.34-3.268 0-2.8 2.14-4.71 5.326-4.753 1.107.013 2.137.154 3.067.422-.023-1.147-.376-2.016-1.055-2.586-.744-.623-1.823-.942-3.212-.942l-.072.001c-1.063.016-1.98.293-2.644.799-.585.445-1 1.08-1.196 1.828l-2.716-.714C6.1 3.645 8.476 2.215 11.77 2.168h.102c1.985 0 3.614.523 4.845 1.555 1.168.98 1.862 2.363 2.068 4.103a9.353 9.353 0 0 1 2.39 1.32c.86.66 1.544 1.51 2.033 2.524.531 1.1.8 2.39.8 3.836 0 2.39-.86 4.308-2.491 5.534C19.905 22.222 17.59 22.982 14.79 23h-.002c-.88.66-1.75 1-2.602 1zm-.523-8.817c1.098.028 1.968-.28 2.583-.915.615-.636.965-1.583 1.04-2.816a7.42 7.42 0 0 0-2.13-.313c-2.038.027-3.044 1.09-3.044 2.2 0 .567.207 1.045.602 1.385.368.317.876.483 1.5.498l-.551-.039z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      href: linkedinUrl,
      label: t('floatingContact.linkedinLabel'),
      icon: <Linkedin className="h-5 w-5" />,
    },
    {
      id: 'facebook',
      href: facebookUrl,
      label: t('floatingContact.facebookLabel'),
      icon: <Facebook className="h-5 w-5" />,
    },
  ];

  const proofItems = [
    t('footer.proofBrands'),
    t('footer.proofMarkets'),
    t('footer.proofLanguages'),
  ];

  const studioFacts = [
    t('footer.studioFactLocation'),
    t('footer.studioFactLanguages'),
    t('footer.studioFactTurnaround'),
  ];

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-border/50 bg-[#F7F2E9] text-foreground pt-12 md:pt-16 pb-8 md:pb-10 transition-colors duration-300 dark:bg-background"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-accent/12 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background/70 to-transparent dark:from-card/20" />
      </div>

      <div className="studio-container">
        <motion.div
          className="relative overflow-hidden rounded-[1.65rem] border border-foreground/10 bg-background/88 px-4 py-6 shadow-[0_32px_90px_-56px_hsl(var(--foreground)/0.7)] backdrop-blur-sm dark:bg-card/85 sm:px-5 sm:py-7 md:rounded-[2rem] md:px-10 md:py-10 lg:px-12 lg:py-12"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.1, 0.08)}
        >
          <motion.div
            className="grid gap-6 sm:gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-12"
            variants={staggerContainer(0.08, 0.08)}
          >
            <motion.div className="order-2 space-y-5 lg:order-1 lg:space-y-6" variants={blurRevealUp(16, 0.65)}>
              <div className="flex flex-wrap items-center gap-3">
                <p className="brand-logo text-[1.65rem] leading-none sm:text-[1.8rem]">Gisela.UGC</p>
                <span className="section-label">{t('footer.eyebrow')}</span>
              </div>

              <div className="space-y-4">
                <h2 className="max-w-3xl text-[2.1rem] leading-[0.94] text-balance sm:text-[2.45rem] md:text-[clamp(2.4rem,5vw,4.75rem)] md:leading-[0.92]">
                  {t('footer.title')}
                </h2>
                <p className="strategic-body max-w-2xl text-[15px] leading-[1.7] text-foreground/72 sm:text-base md:text-lg">
                  {t('footer.description')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
                {proofItems.map((item, index) => (
                  <span
                    key={item}
                    className={`flex items-center justify-center rounded-full border border-foreground/10 bg-background/76 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/68 dark:bg-card/72 sm:inline-flex sm:justify-start sm:px-3.5 sm:py-1.5 ${
                      index === proofItems.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <p className="max-w-xl text-sm leading-[1.8] text-foreground/62 md:text-[15px]">
                {t('footer.studioSummary')}
              </p>
            </motion.div>

            <motion.div
              className="order-1 rounded-[1.45rem] border border-foreground/10 bg-gradient-to-b from-background/96 via-background/92 to-secondary/30 p-5 shadow-[0_28px_70px_-48px_hsl(var(--foreground)/0.55)] dark:from-card/96 dark:via-card/92 dark:to-secondary/20 sm:p-6 md:rounded-[1.75rem] md:p-7 lg:order-2"
              variants={blurRevealUp(18, 0.68)}
            >
              <p className="section-label mb-4">{t('footer.contactCardEyebrow')}</p>
              <h3 className="text-[1.55rem] leading-[1.06] text-foreground sm:text-[1.8rem] md:text-[clamp(1.7rem,2.4vw,2.35rem)] md:leading-[1.02]">
                {t('footer.contactCardTitle')}
              </h3>
              <p className="mt-3.5 strategic-body text-sm leading-[1.7] text-foreground/72 md:mt-4 md:text-[15px]">
                {t('footer.contactCardDescription')}
              </p>

              <div className="mt-5 flex flex-col gap-2.5 md:mt-6 md:gap-3">
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[3.25rem] items-center justify-between rounded-full bg-primary px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_20px_45px_-28px_hsl(var(--primary)/0.95)] transition-all hover:-translate-y-[1px] hover:bg-primary/92 sm:px-5 sm:text-[11px]"
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
                      className="h-5 w-5 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
                    />
                    {t('footer.primaryCta')}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </motion.a>

                <motion.a
                  href={fiverrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[3.25rem] items-center justify-between rounded-full border border-foreground/12 bg-background/92 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary/35 hover:text-primary dark:bg-card/92 sm:px-5 sm:text-[11px]"
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
                      className="h-5 w-5 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
                    />
                    {t('footer.fiverr.visitProfile')}
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.a>
              </div>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-foreground/66 transition-colors hover:text-primary md:mt-5"
              >
                <Send className="h-4 w-4 -rotate-12" />
                <span>{t('footer.telegramPrompt')}</span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 grid gap-4 border-t border-foreground/10 pt-6 md:mt-10 md:gap-8 md:pt-8 md:grid-cols-3"
            variants={staggerContainer(0.05, 0.06)}
          >
            <motion.div
              className="rounded-[1.2rem] border border-foreground/8 bg-background/72 p-4 dark:bg-card/70 md:rounded-none md:border-0 md:bg-transparent md:p-0"
              variants={blurRevealUp(14, 0.45)}
            >
              <p className="section-label mb-4">{t('footer.servicesTitle')}</p>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex min-h-[2.8rem] items-center gap-2 text-sm text-foreground/72 transition-colors hover:text-primary md:min-h-0 md:text-[15px]"
                    >
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="rounded-[1.2rem] border border-foreground/8 bg-background/72 p-4 dark:bg-card/70 md:rounded-none md:border-0 md:bg-transparent md:p-0"
              variants={blurRevealUp(14, 0.5)}
            >
              <p className="section-label mb-4">{t('footer.studioTitle')}</p>
              <ul className="space-y-3 text-sm text-foreground/68 md:text-[15px]">
                {studioFacts.map((fact) => (
                  <li key={fact} className="flex items-start gap-3">
                    <span className="mt-[0.55rem] h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="rounded-[1.2rem] border border-foreground/8 bg-background/72 p-4 dark:bg-card/70 md:rounded-none md:border-0 md:bg-transparent md:p-0"
              variants={blurRevealUp(14, 0.55)}
            >
              <p className="section-label mb-4">{t('footer.profilesTitle')}</p>
              <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap">
                {profilePlatforms.map((platform) => (
                  <motion.a
                    key={platform.id}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-foreground/10 bg-background/82 px-3.5 py-2 text-[13px] text-foreground/68 transition-colors hover:border-primary/30 hover:text-primary dark:bg-card/80 md:min-h-11 md:justify-start md:px-4 md:text-sm"
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                    transition={springSmooth}
                  >
                    <span className="text-current">{platform.icon}</span>
                    <span>{platform.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-6 flex flex-col gap-3 border-t border-foreground/10 pt-5 text-sm text-foreground/58 md:flex-row md:items-center md:justify-between"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7, delay: 0.18 }}
        >
          <p>{t('footer.copyright', { year: currentYear })}</p>
          <p className="max-w-2xl md:text-right">{t('footer.bottomNote')}</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
