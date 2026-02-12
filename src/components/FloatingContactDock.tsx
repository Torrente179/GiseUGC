import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronUp,
  MessageCircle,
  Send,
  Instagram,
  Linkedin,
  Facebook,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';
const fiverrLogoSrc = '/uploads/fiverr-logo-png_seeklogo-376328.png';
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/';
const xUrl = import.meta.env.VITE_X_URL ?? import.meta.env.VITE_TWITTER_URL ?? 'https://x.com/';
const threadsUrl = import.meta.env.VITE_THREADS_URL ?? 'https://www.threads.net/';
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/';
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/';

const XBrandIcon = ({ className }: { className?: string }) => (
  <span className={className} aria-hidden="true">
    X
  </span>
);

const ThreadsIcon = ({ className }: { className?: string }) => (
  <span className={className} aria-hidden="true">
    @
  </span>
);

const FloatingContactDock = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleOutsideTap = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-mobile-contact-dock]')) return;
      setMobileOpen(false);
    };

    document.addEventListener('pointerdown', handleOutsideTap);
    return () => document.removeEventListener('pointerdown', handleOutsideTap);
  }, [mobileOpen]);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };

    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, []);

  const contactPlatforms = [
    {
      id: 'whatsapp',
      ariaKey: 'floatingContact.whatsappAria',
      href: whatsappUrl,
      icon: <MessageCircle className="h-5 w-5" />,
      toneClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
      hoverToneClass: 'hover:bg-emerald-500/25',
    },
    {
      id: 'telegram',
      ariaKey: 'floatingContact.telegramAria',
      href: telegramUrl,
      icon: <Send className="h-5 w-5 -rotate-12" />,
      toneClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
      hoverToneClass: 'hover:bg-sky-500/25',
    },
    {
      id: 'fiverr',
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
      id: 'instagram',
      ariaKey: 'floatingContact.instagramAria',
      href: instagramUrl,
      icon: <Instagram className="h-5 w-5" />,
      toneClass: 'bg-pink-500/15 text-pink-600 dark:text-pink-300',
      hoverToneClass: 'hover:bg-pink-500/25',
    },
    {
      id: 'x',
      ariaKey: 'floatingContact.twitterAria',
      href: xUrl,
      icon: <XBrandIcon className="text-[16px] font-black leading-none tracking-[-0.02em]" />,
      toneClass: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
      hoverToneClass: 'hover:bg-slate-500/25',
    },
    {
      id: 'threads',
      ariaKey: 'floatingContact.threadsAria',
      href: threadsUrl,
      icon: <ThreadsIcon className="text-[18px] font-black leading-none" />,
      toneClass: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-200',
      hoverToneClass: 'hover:bg-zinc-500/25',
    },
    {
      id: 'linkedin',
      ariaKey: 'floatingContact.linkedinAria',
      href: linkedinUrl,
      icon: <Linkedin className="h-5 w-5" />,
      toneClass: 'bg-blue-600/15 text-blue-700 dark:text-blue-300',
      hoverToneClass: 'hover:bg-blue-600/25',
    },
    {
      id: 'facebook',
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
      {/* Mobile: toggle + vertical reveal */}
      <div data-mobile-contact-dock className="pointer-events-auto md:hidden flex flex-col items-end">
        <div
          className={`mb-2.5 flex flex-col items-end gap-2 transition-all duration-300 ${
            mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {contactPlatforms.map((platform, index) => (
            <a
              key={platform.id}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(platform.ariaKey)}
              onClick={() => setMobileOpen(false)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 ${platform.toneClass} ${platform.hoverToneClass} shadow-[0_14px_28px_-18px_hsl(var(--foreground)/0.95)] transition-all duration-300 hover:-translate-y-0.5`}
              style={{
                transitionDelay: mobileOpen ? `${index * 25}ms` : '0ms',
              }}
            >
              {platform.icon}
            </a>
          ))}
        </div>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? t('floatingContact.toggleCloseAria') : t('floatingContact.toggleOpenAria')}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-card/95 text-foreground shadow-[0_18px_34px_-20px_hsl(var(--foreground)/0.95)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary"
        >
          <MessageCircle
            className={`absolute h-5 w-5 transition-all duration-300 ${
              mobileOpen ? 'opacity-0 scale-75 rotate-12' : 'opacity-100 scale-100 rotate-0'
            }`}
          />
          <ChevronUp
            className={`absolute h-5 w-5 transition-all duration-300 ${
              mobileOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'
            }`}
          />
        </button>
      </div>

      {/* Desktop: horizontal row */}
      <div className="hidden md:flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2.5 shadow-lg pointer-events-auto">
        {contactPlatforms.map((platform) => (
          <a
            key={platform.id}
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
