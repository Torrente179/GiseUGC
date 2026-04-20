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
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springSnappy } from '@/components/motion/variants';
import {
  consumePendingContactDockAction,
  isMobileViewport,
  onContactDockAction,
} from '@/lib/contact-dock';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/+573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';
const fiverrLogoSrc = '/uploads/fiverr-logo-56.webp';
const whatsappLogoSrc = '/uploads/whatsapp.png';
const tiktokLogoSrc = '/uploads/TikTok-Icon-Logo.wine.svg';
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/sm_gisela/';
const tiktokUrl = import.meta.env.VITE_TIKTOK_URL ?? 'https://www.tiktok.com/@giselasaldarriaga';
const threadsUrl = import.meta.env.VITE_THREADS_URL ?? 'https://www.threads.com/@sm_gisela';
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/in/gisela-saldarriaga-molina-0417b8199/';
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/gisela.saldarriaga';

const ThreadsIcon = ({ className }: { className?: string }) => (
  <span className={className} aria-hidden="true">
    @
  </span>
);

const FloatingContactDock = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktopDockGhosted, setIsDesktopDockGhosted] = useState(false);
  const [hasEntrance, setHasEntrance] = useState(false);

  // Delayed entrance — dock slides up after page settles
  useEffect(() => {
    const delay = shouldReduceMotion ? 200 : 1500;
    const timeoutId = window.setTimeout(() => setHasEntrance(true), delay);
    return () => window.clearTimeout(timeoutId);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const handleDockAction = (action: 'open' | 'toggle') => {
      if (!isMobileViewport()) {
        consumePendingContactDockAction();
        return;
      }

      if (action === 'toggle') {
        setMobileOpen((previous) => !previous);
      } else {
        setMobileOpen(true);
      }

      consumePendingContactDockAction();
    };

    const unsubscribe = onContactDockAction(handleDockAction);

    const pendingAction = consumePendingContactDockAction();
    if (pendingAction) {
      handleDockAction(pendingAction);
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };

    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, []);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia('(min-width: 768px)');
    let rafId: number | null = null;
    let cachedFooter: HTMLElement | null = null;

    // Forced-reflow mitigation: the previous version re-queried `#contact` and
    // read `offsetHeight` on every scroll tick. Now we cache the visible footer
    // reference and only refresh it on resize / DOM mutations. Scroll handlers
    // only read `getBoundingClientRect` (still a layout read, but cheaper and
    // unavoidable for bottom-of-page detection).
    // Cache hit path skips `offsetHeight` (layout read) — only validates on
    // resize/DOM-detach. This keeps scroll-tick work to a single `getBoundingClientRect`.
    const resolveFooter = (): HTMLElement | null => {
      if (cachedFooter && cachedFooter.isConnected) {
        return cachedFooter;
      }
      const candidates = document.querySelectorAll<HTMLElement>('#contact');
      for (const candidate of candidates) {
        if (candidate.offsetHeight > 0) {
          cachedFooter = candidate;
          return candidate;
        }
      }
      cachedFooter = null;
      return null;
    };

    const invalidateFooter = () => {
      cachedFooter = null;
    };

    const evaluateDockState = () => {
      rafId = null;

      if (!desktopMediaQuery.matches) {
        setIsDesktopDockGhosted(false);
        return;
      }

      const footer = resolveFooter();
      const isAtAbsoluteBottom = footer
        ? footer.getBoundingClientRect().bottom <= window.innerHeight + 2
        : (() => {
            const scrollingElement = document.scrollingElement ?? document.documentElement;
            const maxScrollTop = Math.max(0, scrollingElement.scrollHeight - window.innerHeight);
            return window.scrollY >= maxScrollTop - 2;
          })();

      setIsDesktopDockGhosted((previous) =>
        previous === isAtAbsoluteBottom ? previous : isAtAbsoluteBottom
      );
    };

    const requestDockStateUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(evaluateDockState);
    };

    const handleResize = () => {
      invalidateFooter();
      requestDockStateUpdate();
    };

    const handleMediaChange = () => {
      requestDockStateUpdate();
    };

    window.addEventListener('scroll', requestDockStateUpdate, { passive: true });
    window.addEventListener('resize', handleResize);
    if (typeof desktopMediaQuery.addEventListener === 'function') {
      desktopMediaQuery.addEventListener('change', handleMediaChange);
    } else {
      desktopMediaQuery.addListener(handleMediaChange);
    }
    requestDockStateUpdate();

    return () => {
      window.removeEventListener('scroll', requestDockStateUpdate);
      window.removeEventListener('resize', handleResize);
      if (typeof desktopMediaQuery.removeEventListener === 'function') {
        desktopMediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        desktopMediaQuery.removeListener(handleMediaChange);
      }

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const contactPlatforms = [
    {
      id: 'whatsapp',
      ariaKey: 'floatingContact.whatsappAria',
      href: whatsappUrl,
      icon: (
        <img
          src={whatsappLogoSrc}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-[22px] w-[22px] rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
        />
      ),
      toneClass: 'bg-white/72 dark:bg-white/80',
      hoverToneClass: 'hover:bg-emerald-500/25',
    },
    {
      id: 'telegram',
      ariaKey: 'floatingContact.telegramAria',
      href: telegramUrl,
      icon: <Send className="h-5 w-5 -rotate-12" />,
      toneClass: 'bg-sky-500/22 text-sky-700 dark:text-sky-200',
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
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-[22px] w-[22px] rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
        />
      ),
      toneClass: 'bg-white/78 dark:bg-white/88',
      hoverToneClass: 'hover:bg-emerald-500/25',
    },
    {
      id: 'instagram',
      ariaKey: 'floatingContact.instagramAria',
      href: instagramUrl,
      icon: <Instagram className="h-5 w-5" />,
      toneClass: 'bg-pink-500/22 text-pink-700 dark:text-pink-200',
      hoverToneClass: 'hover:bg-pink-500/25',
    },
    {
      id: 'tiktok',
      ariaKey: 'floatingContact.tiktokAria',
      href: tiktokUrl,
      icon: (
        <img
          src={tiktokLogoSrc}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-[26px] w-[26px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.28)]"
        />
      ),
      toneClass: 'bg-white/78 dark:bg-white/88',
      hoverToneClass: 'hover:bg-white',
    },
    {
      id: 'threads',
      ariaKey: 'floatingContact.threadsAria',
      href: threadsUrl,
      icon: <ThreadsIcon className="text-[18px] font-black leading-none" />,
      toneClass: 'bg-zinc-500/22 text-zinc-800 dark:text-zinc-100',
      hoverToneClass: 'hover:bg-zinc-500/25',
    },
    {
      id: 'linkedin',
      ariaKey: 'floatingContact.linkedinAria',
      href: linkedinUrl,
      icon: <Linkedin className="h-5 w-5" />,
      toneClass: 'bg-blue-600/22 text-blue-800 dark:text-blue-200',
      hoverToneClass: 'hover:bg-blue-600/25',
    },
    {
      id: 'facebook',
      ariaKey: 'floatingContact.facebookAria',
      href: facebookUrl,
      icon: <Facebook className="h-5 w-5" />,
      toneClass: 'bg-indigo-500/22 text-indigo-700 dark:text-indigo-200',
      hoverToneClass: 'hover:bg-indigo-500/25',
    },
  ];

  return createPortal(
    <motion.div
      className="floating-contact-dock fixed bottom-5 md:bottom-8 right-5 md:right-8 z-[9999] pointer-events-none"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={hasEntrance ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.8 }}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Mobile: toggle + vertical reveal */}
      <div className="pointer-events-auto md:hidden flex flex-col items-end">
        <div
          className={`mb-2.5 rounded-[1.3rem] border border-white/45 bg-card/62 backdrop-blur-xl supports-[backdrop-filter]:bg-card/58 p-2.5 shadow-[0_20px_38px_-22px_hsl(var(--foreground)/0.85)] flex flex-col items-end gap-2 transition-all duration-300 ${
            mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {contactPlatforms.map((platform, index) => (
            <a
              key={platform.id}
              href={platform.href}
              aria-label={t(platform.ariaKey)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/45 ${platform.toneClass} ${platform.hoverToneClass} backdrop-blur-xl shadow-[0_12px_24px_-18px_hsl(var(--foreground)/0.9)] transition-all duration-300 hover:-translate-y-0.5`}
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
          className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-card/80 supports-[backdrop-filter]:bg-card/66 backdrop-blur-xl text-foreground shadow-[0_24px_46px_-22px_hsl(var(--foreground)/0.95),0_0_0_1px_hsl(var(--primary)/0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:text-primary"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1 rounded-full bg-primary/18 blur-md opacity-70 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
          />
          <MessageCircle
            className={`absolute h-[22px] w-[22px] transition-all duration-300 ${
              mobileOpen ? 'opacity-0 scale-75 rotate-12' : 'opacity-100 scale-100 rotate-0'
            }`}
          />
          <ChevronUp
            className={`absolute h-[22px] w-[22px] transition-all duration-300 ${
              mobileOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'
            }`}
          />
        </button>
      </div>

      {/* Desktop: horizontal row */}
      <div
        className={`hidden md:flex dock-breathe items-center gap-3 rounded-full border border-white/40 bg-card/62 supports-[backdrop-filter]:bg-card/48 backdrop-blur-2xl px-3 py-2.5 shadow-[0_22px_42px_-28px_hsl(var(--foreground)/0.9)] transition-[opacity,transform,filter] duration-500 ${
          isDesktopDockGhosted
            ? 'opacity-10 scale-[0.94] translate-y-2 blur-[1.5px] pointer-events-none'
            : 'opacity-100 scale-100 translate-y-0 blur-0 pointer-events-auto'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        {contactPlatforms.map((platform, index) => (
          <motion.a
            key={platform.id}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(platform.ariaKey)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${platform.toneClass} ${platform.hoverToneClass} transition-colors duration-300`}
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
            animate={hasEntrance ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22, delay: index * 0.04 }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.15, y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          >
            {platform.icon}
          </motion.a>
        ))}
      </div>
    </motion.div>,
    document.body
  );
};

export default FloatingContactDock;
