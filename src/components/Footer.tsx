import { useTranslation } from 'react-i18next';
import {
  Instagram,
  Linkedin,
  Facebook,
  Send,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { blurRevealUp, revealUp, staggerContainer } from '@/components/motion/variants';
import { MOTION_BUDGETS, useMotionProfile } from '@/components/motion/profile';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/+573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';
const instagramUrl = 'https://www.instagram.com/sm_gisela/';
const linkedinUrl = 'https://www.linkedin.com/in/gisela-saldarriaga-molina-0417b8199/';
const tiktokUrl = 'https://www.tiktok.com/@giselasaldarriaga';
const threadsUrl = 'https://www.threads.com/@sm_gisela';
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/gisela.saldarriaga';
const fiverrLogoSrc = '/uploads/fiverr-logo-56.webp';
const whatsappLogoSrc = '/uploads/whatsapp.png';

const Footer = () => {
  const { t } = useTranslation();
  const motionProfile = useMotionProfile();
  const footerReveal = motionProfile.blurAllowed
    ? blurRevealUp(18, MOTION_BUDGETS.section)
    : revealUp(18, MOTION_BUDGETS.section);
  const footerContactPlatforms = [
    {
      id: 'whatsapp',
      href: whatsappUrl,
      ariaLabel: 'WhatsApp',
      icon: (
        <img
          src={whatsappLogoSrc}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-5 w-5 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
        />
      ),
    },
    {
      id: 'telegram',
      href: telegramUrl,
      ariaLabel: 'Telegram',
      icon: <Send className="h-5 w-5 -rotate-12" />,
    },
    {
      id: 'fiverr',
      href: fiverrUrl,
      ariaLabel: 'Fiverr',
      icon: (
        <img
          src={fiverrLogoSrc}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-5 w-5 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
        />
      ),
    },
    {
      id: 'instagram',
      href: instagramUrl,
      ariaLabel: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
    },
    {
      id: 'tiktok',
      href: tiktokUrl,
      ariaLabel: 'TikTok',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.12z" />
        </svg>
      ),
    },
    {
      id: 'threads',
      href: threadsUrl,
      ariaLabel: 'Threads',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.773.776c-1.048-3.76-3.678-5.478-7.563-5.502-2.792.019-4.86.936-6.144 2.725C4.863 7.222 4.18 9.376 4.156 12c.024 2.627.707 4.78 1.893 6.436 1.285 1.79 3.352 2.706 6.145 2.725 2.307-.016 4.006-.587 5.2-1.74.94-.912 1.553-2.164 1.553-3.895-.006-.96-.183-1.755-.529-2.362a3.805 3.805 0 0 0-1.473-1.533c-.293 1.755-.942 3.07-1.94 3.908-1.108.932-2.528 1.384-4.2 1.34-1.292-.034-2.4-.467-3.217-1.26-.876-.846-1.34-1.975-1.34-3.268 0-2.8 2.14-4.71 5.326-4.753 1.107.013 2.137.154 3.067.422-.023-1.147-.376-2.016-1.055-2.586-.744-.623-1.823-.942-3.212-.942l-.072.001c-1.063.016-1.98.293-2.644.799-.585.445-1 1.08-1.196 1.828l-2.716-.714C6.1 3.645 8.476 2.215 11.77 2.168h.102c1.985 0 3.614.523 4.845 1.555 1.168.98 1.862 2.363 2.068 4.103a9.353 9.353 0 0 1 2.39 1.32c.86.66 1.544 1.51 2.033 2.524.531 1.1.8 2.39.8 3.836 0 2.39-.86 4.308-2.491 5.534C19.905 22.222 17.59 22.982 14.79 23h-.002c-.88.66-1.75 1-2.602 1zm-.523-8.817c1.098.028 1.968-.28 2.583-.915.615-.636.965-1.583 1.04-2.816a7.42 7.42 0 0 0-2.13-.313c-2.038.027-3.044 1.09-3.044 2.2 0 .567.207 1.045.602 1.385.368.317.876.483 1.5.498l-.551-.039z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      href: linkedinUrl,
      ariaLabel: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
    },
    {
      id: 'facebook',
      href: facebookUrl,
      ariaLabel: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
    },
  ];

  return (
    <footer
      id="contact"
      className="bg-[#F6F3EE] dark:bg-background text-foreground pt-12 md:pt-14 pb-8 md:pb-10 transition-colors duration-300"
    >
      <div className="studio-container">
        <motion.div
          className="mb-8 text-center"
          initial={motionProfile.sectionMode === 'none' ? undefined : 'hidden'}
          whileInView={motionProfile.sectionMode === 'none' ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.08, 0.02)}
        >
          <motion.h3
            className="brand-logo text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] mb-4 text-primary"
            variants={footerReveal}
          >
            {t('footer.brandName')}<span className="text-accent">.</span>
          </motion.h3>
          <motion.p
            className="strategic-body text-foreground/72 text-[clamp(1.2rem,1.8vw,1.85rem)] leading-[1.5] max-w-2xl mx-auto"
            variants={revealUp(14, MOTION_BUDGETS.section, 0.04)}
          >
            {t('footer.description')}
          </motion.p>

          <motion.div className="mt-7 flex flex-wrap items-center justify-center gap-2 md:gap-3" variants={revealUp(12, MOTION_BUDGETS.section, 0.06)}>
            {footerContactPlatforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform.ariaLabel}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5 text-foreground/70 transition-[transform,color,background-color,border-color] duration-180 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground md:h-12 md:w-12"
              >
                {platform.icon}
              </a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-foreground/15 pt-8 text-center"
          initial={motionProfile.sectionMode === 'none' ? undefined : { opacity: 0, y: 10 }}
          whileInView={motionProfile.sectionMode === 'none' ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: MOTION_BUDGETS.section, delay: 0.08 }}
        >
          <p className="text-xs text-foreground/55 tracking-wider">
            © 2026 Portafolio UGC. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
