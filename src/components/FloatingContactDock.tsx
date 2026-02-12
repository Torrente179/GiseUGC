import { createPortal } from 'react-dom';
import {
  MessageCircle,
  Send,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';
const fiverrLogoSrc = '/uploads/fiverr-logo-png_seeklogo-376328.png';
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/';
const twitterUrl = import.meta.env.VITE_TWITTER_URL ?? 'https://twitter.com/';
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/';
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/';

const FloatingContactDock = () => {
  const { t } = useTranslation();
  const contactPlatforms = [
    {
      ariaKey: 'floatingContact.whatsappAria',
      href: whatsappUrl,
      icon: <MessageCircle className="h-5 w-5" />,
      toneClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
      hoverToneClass: 'hover:bg-emerald-500/25',
    },
    {
      ariaKey: 'floatingContact.telegramAria',
      href: telegramUrl,
      icon: <Send className="h-5 w-5 -rotate-12" />,
      toneClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
      hoverToneClass: 'hover:bg-sky-500/25',
    },
    {
      ariaKey: 'floatingContact.fiverrAria',
      href: fiverrUrl,
      icon: (
        <img
          src={fiverrLogoSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[22px] w-[22px] rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
        />
      ),
      toneClass: 'bg-white/90 dark:bg-white/95',
      hoverToneClass: 'hover:bg-white',
    },
    {
      ariaKey: 'floatingContact.instagramAria',
      href: instagramUrl,
      icon: <Instagram className="h-5 w-5" />,
      toneClass: 'bg-pink-500/15 text-pink-600 dark:text-pink-300',
      hoverToneClass: 'hover:bg-pink-500/25',
    },
    {
      ariaKey: 'floatingContact.twitterAria',
      href: twitterUrl,
      icon: <Twitter className="h-5 w-5" />,
      toneClass: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
      hoverToneClass: 'hover:bg-slate-500/25',
    },
    {
      ariaKey: 'floatingContact.linkedinAria',
      href: linkedinUrl,
      icon: <Linkedin className="h-5 w-5" />,
      toneClass: 'bg-blue-600/15 text-blue-700 dark:text-blue-300',
      hoverToneClass: 'hover:bg-blue-600/25',
    },
    {
      ariaKey: 'floatingContact.facebookAria',
      href: facebookUrl,
      icon: <Facebook className="h-5 w-5" />,
      toneClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
      hoverToneClass: 'hover:bg-indigo-500/25',
    },
  ];

  return createPortal(
    <div
      className="floating-contact-dock fixed bottom-5 md:bottom-8 right-5 md:right-8 z-[9999] pointer-events-none transition-all duration-300"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Mobile: compact bubble panel */}
      <div className="pointer-events-auto md:hidden rounded-[1.35rem] border border-border/90 bg-card/95 p-2.5 shadow-[0_20px_38px_-28px_hsl(var(--foreground)/0.9)] backdrop-blur-md">
        <div className="grid grid-cols-4 gap-2">
          {contactPlatforms.map((platform) => (
            <a
              key={platform.ariaKey}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(platform.ariaKey)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 ${platform.toneClass} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
            >
              {platform.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Desktop: horizontal row */}
      <div className="hidden md:flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2.5 shadow-lg pointer-events-auto">
        {contactPlatforms.map((platform) => (
          <a
            key={platform.ariaKey}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(platform.ariaKey)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${platform.toneClass} ${platform.hoverToneClass} transition-all duration-300 hover:scale-110`}
          >
            {platform.icon}
          </a>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default FloatingContactDock;
