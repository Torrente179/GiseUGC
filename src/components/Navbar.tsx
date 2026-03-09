import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Menu,
  X,
  ArrowRight,
  Send,
  Instagram,
  Linkedin,
  Facebook,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { springSnappy } from '@/components/motion/variants';
import { getCanonicalLocaleHref, getLocaleFromPath, type SiteLocale } from '@/lib/locale-path';

const SCROLL_RANGE = 80; // px over which the glass effect intensifies

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

const MENU_SWIPE_CLOSE_DISTANCE = 94;
const MENU_SWIPE_CLOSE_VELOCITY = 0.48;
const MENU_MAX_DRAG_DISTANCE = 220;
const MENU_AXIS_LOCK_THRESHOLD = 8;
const MENU_SWIPE_DISMISS_DURATION_MS = 220;

type MobileMenuSwipeState = {
  startX: number;
  startY: number;
  lastY: number;
  lastTimestamp: number;
  velocityY: number;
  axis: 'pending' | 'horizontal' | 'vertical';
};

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuDragOffset, setMobileMenuDragOffset] = useState(0);
  const [isMobileMenuDragging, setIsMobileMenuDragging] = useState(false);
  const [isMobileMenuSwipeDismissing, setIsMobileMenuSwipeDismissing] = useState(false);
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const mobileMenuSwipeRef = useRef<MobileMenuSwipeState | null>(null);
  const swipeDismissTimeoutRef = useRef<number | null>(null);
  const ignoreNextMenuButtonClickRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const navShellRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef(0);
  const targetScrollProgressRef = useRef(0);

  useEffect(() => {
    const applyScrollProgressStyles = (p: number) => {
      const nav = navRef.current;
      const shell = navShellRef.current;
      if (!nav || !shell) return;

      nav.style.padding = `${20 - p * 8}px 0`;
      shell.style.padding = `${12 - p * 4}px 16px`;
      shell.style.backgroundColor = `hsl(var(--card) / ${0.45 + p * 0.47})`;
      shell.style.backdropFilter = `blur(${4 + p * 8}px)`;
      shell.style.setProperty('-webkit-backdrop-filter', `blur(${4 + p * 8}px)`);
      shell.style.borderColor = `hsl(var(--border) / ${p * 0.9})`;
      shell.style.boxShadow =
        p > 0.05
          ? `0 ${16 * p}px ${36 * p}px -28px hsl(var(--foreground) / ${0.7 * p})`
          : 'none';
    };

    const animateScrollProgress = () => {
      scrollRafRef.current = null;
      const current = scrollProgressRef.current;
      const target = targetScrollProgressRef.current;
      const next = current + (target - current) * 0.18;
      const resolved = Math.abs(target - next) < 0.008 ? target : next;

      scrollProgressRef.current = resolved;
      applyScrollProgressStyles(resolved);

      if (Math.abs(target - resolved) >= 0.008) {
        scrollRafRef.current = requestAnimationFrame(animateScrollProgress);
      }
    };

    const queueScrollProgress = () => {
      targetScrollProgressRef.current = Math.min(1, Math.max(0, window.scrollY / SCROLL_RANGE));
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(animateScrollProgress);
    };

    window.addEventListener('scroll', queueScrollProgress, { passive: true });
    applyScrollProgressStyles(scrollProgressRef.current);
    queueScrollProgress();

    return () => {
      window.removeEventListener('scroll', queueScrollProgress);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    document.body.style.overscrollBehavior = mobileMenuOpen ? 'contain' : '';
    document.body.classList.toggle('mobile-menu-open', mobileMenuOpen);
    return () => {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  const clearSwipeDismissTimeout = useCallback(() => {
    if (swipeDismissTimeoutRef.current !== null) {
      window.clearTimeout(swipeDismissTimeoutRef.current);
      swipeDismissTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearSwipeDismissTimeout();
    };
  }, [clearSwipeDismissTimeout]);

  const resetMobileMenuSwipe = useCallback(() => {
    mobileMenuSwipeRef.current = null;
    setIsMobileMenuDragging(false);
    setIsMobileMenuSwipeDismissing(false);
    setMobileMenuDragOffset(0);
  }, []);

  const closeMobileMenu = useCallback(() => {
    clearSwipeDismissTimeout();
    resetMobileMenuSwipe();
    setMobileMenuOpen(false);
  }, [clearSwipeDismissTimeout, resetMobileMenuSwipe]);

  const toggleMobileMenu = useCallback(() => {
    clearSwipeDismissTimeout();
    resetMobileMenuSwipe();
    setMobileMenuOpen((prev) => !prev);
  }, [clearSwipeDismissTimeout, resetMobileMenuSwipe]);

  const handleMobileMenuButtonPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType !== 'touch') return;
      ignoreNextMenuButtonClickRef.current = true;
      event.preventDefault();
      toggleMobileMenu();
    },
    [toggleMobileMenu],
  );

  const handleMobileMenuButtonClick = useCallback(() => {
    if (ignoreNextMenuButtonClickRef.current) {
      ignoreNextMenuButtonClickRef.current = false;
      return;
    }
    toggleMobileMenu();
  }, [toggleMobileMenu]);

  const closeMobileMenuWithSwipe = useCallback(() => {
    clearSwipeDismissTimeout();
    setIsMobileMenuDragging(false);
    setIsMobileMenuSwipeDismissing(true);
    const dismissDistance =
      typeof window === 'undefined'
        ? -MENU_MAX_DRAG_DISTANCE
        : -Math.max(MENU_MAX_DRAG_DISTANCE, Math.round(window.innerHeight * 0.28));
    setMobileMenuDragOffset(dismissDistance);
    swipeDismissTimeoutRef.current = window.setTimeout(() => {
      setMobileMenuOpen(false);
      resetMobileMenuSwipe();
      swipeDismissTimeoutRef.current = null;
    }, MENU_SWIPE_DISMISS_DURATION_MS);
  }, [clearSwipeDismissTimeout, resetMobileMenuSwipe]);

  const handleMobileMenuTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!mobileMenuOpen || isMobileMenuSwipeDismissing) return;
      const touch = event.touches[0];
      mobileMenuSwipeRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        lastY: touch.clientY,
        lastTimestamp: performance.now(),
        velocityY: 0,
        axis: 'pending',
      };
      setIsMobileMenuDragging(false);
    },
    [mobileMenuOpen, isMobileMenuSwipeDismissing],
  );

  const handleMobileMenuTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const swipeState = mobileMenuSwipeRef.current;
      if (!swipeState || !mobileMenuOpen || isMobileMenuSwipeDismissing) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - swipeState.startX;
      const deltaY = touch.clientY - swipeState.startY;

      if (
        swipeState.axis === 'pending' &&
        Math.max(Math.abs(deltaX), Math.abs(deltaY)) > MENU_AXIS_LOCK_THRESHOLD
      ) {
        swipeState.axis = Math.abs(deltaY) >= Math.abs(deltaX) ? 'vertical' : 'horizontal';
      }

      if (swipeState.axis === 'horizontal' || deltaY >= 0) {
        if (deltaY >= 0 && mobileMenuDragOffset !== 0) {
          setMobileMenuDragOffset(0);
          setIsMobileMenuDragging(false);
        }
        return;
      }

      const now = performance.now();
      const elapsed = Math.max(1, now - swipeState.lastTimestamp);
      swipeState.velocityY = (touch.clientY - swipeState.lastY) / elapsed;
      swipeState.lastY = touch.clientY;
      swipeState.lastTimestamp = now;

      const dragDistance = Math.min(MENU_MAX_DRAG_DISTANCE, Math.abs(deltaY) * 0.92);
      setIsMobileMenuDragging(true);
      setMobileMenuDragOffset(-dragDistance);
      event.preventDefault();
    },
    [mobileMenuDragOffset, mobileMenuOpen, isMobileMenuSwipeDismissing],
  );

  const handleMobileMenuTouchEnd = useCallback(() => {
    const swipeState = mobileMenuSwipeRef.current;
    mobileMenuSwipeRef.current = null;
    if (!swipeState || !mobileMenuOpen || isMobileMenuSwipeDismissing) return;

    const dragDistance = Math.abs(mobileMenuDragOffset);
    const releaseVelocity = Math.max(0, -swipeState.velocityY);
    const shouldClose =
      dragDistance >= MENU_SWIPE_CLOSE_DISTANCE || releaseVelocity >= MENU_SWIPE_CLOSE_VELOCITY;

    if (shouldClose) {
      closeMobileMenuWithSwipe();
      return;
    }

    setIsMobileMenuDragging(false);
    setMobileMenuDragOffset(0);
  }, [
    closeMobileMenuWithSwipe,
    mobileMenuDragOffset,
    mobileMenuOpen,
    isMobileMenuSwipeDismissing,
  ]);

  const swipeProgress = Math.min(1, Math.abs(mobileMenuDragOffset) / MENU_MAX_DRAG_DISTANCE);
  const mobileMenuBackdropOpacity = mobileMenuOpen ? Math.max(0, 1 - swipeProgress * 0.6) : 0;
  const mobileMenuPanelScale = 1 - swipeProgress * 0.035;
  const mobileMenuPanelOpacity = mobileMenuOpen ? Math.max(0, 1 - swipeProgress * 0.26) : 0;

  const desktopNavLinkKeys = [
    { key: 'navbar.home', href: '#home', number: '01' },
    { key: 'navbar.services', href: '#services', number: '02' },
    { key: 'navbar.portfolio', href: '#portfolio', number: '03' },
    { key: 'navbar.testimonials', href: '#testimonials', number: '04' },
    { key: 'navbar.contact', href: '#contact', number: '05' },
  ];
  const mobileNavLinkKeys = desktopNavLinkKeys.filter((link) => link.key !== 'navbar.contact');

  const contactPlatforms = [
    {
      key: 'floatingContact.whatsappLabel',
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
          className="h-8 w-8 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
        />
      ),
      iconClass: 'bg-white/90 dark:bg-white/95',
      glowClass: 'from-emerald-400/70 via-emerald-500/40 to-emerald-600/70',
    },
    {
      key: 'floatingContact.telegramLabel',
      ariaKey: 'floatingContact.telegramAria',
      href: telegramUrl,
      icon: <Send className="h-[18px] w-[18px] -rotate-12" />,
      iconClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
      glowClass: 'from-sky-400/70 via-sky-500/40 to-blue-600/70',
    },
    {
      key: 'floatingContact.fiverrLabel',
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
          className="h-8 w-8 rounded-full object-cover shadow-[0_5px_12px_-7px_rgba(0,0,0,0.45)]"
        />
      ),
      iconClass: 'bg-white/90 dark:bg-white/95',
      glowClass: 'from-green-400/70 via-green-500/40 to-emerald-600/70',
    },
    {
      key: 'floatingContact.instagramLabel',
      ariaKey: 'floatingContact.instagramAria',
      href: instagramUrl,
      icon: <Instagram className="h-[18px] w-[18px]" />,
      iconClass: 'bg-pink-500/15 text-pink-600 dark:text-pink-300',
      glowClass: 'from-pink-400/70 via-fuchsia-500/45 to-rose-500/70',
    },
    {
      key: 'floatingContact.tiktokLabel',
      fallbackLabel: 'TikTok',
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
          className="h-9 w-9 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.28)]"
        />
      ),
      iconClass: 'bg-white/90 dark:bg-white/95',
      glowClass: 'from-zinc-500/70 via-zinc-700/45 to-zinc-900/70',
    },
    {
      key: 'floatingContact.threadsLabel',
      ariaKey: 'floatingContact.threadsAria',
      href: threadsUrl,
      icon: <ThreadsIcon className="text-[18px] font-black leading-none" />,
      iconClass: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-200',
      glowClass: 'from-zinc-400/70 via-zinc-500/45 to-zinc-600/70',
    },
    {
      key: 'floatingContact.linkedinLabel',
      ariaKey: 'floatingContact.linkedinAria',
      href: linkedinUrl,
      icon: <Linkedin className="h-[18px] w-[18px]" />,
      iconClass: 'bg-blue-600/15 text-blue-700 dark:text-blue-300',
      glowClass: 'from-blue-400/70 via-blue-600/45 to-indigo-600/70',
    },
    {
      key: 'floatingContact.facebookLabel',
      ariaKey: 'floatingContact.facebookAria',
      href: facebookUrl,
      icon: <Facebook className="h-[18px] w-[18px]" />,
      iconClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
      glowClass: 'from-indigo-400/70 via-indigo-500/45 to-blue-600/70',
    },
  ];

  const changeLanguage = (lng: SiteLocale) => {
    const currentLocale = getLocaleFromPath(window.location.pathname);
    if (currentLocale === lng) return;

    window.location.assign(getCanonicalLocaleHref(lng, window.location.hash));
  };

  const languageButtonClass = (language: string) =>
    `inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.32em] ${
      i18n.resolvedLanguage === language
        ? 'bg-primary/22 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]'
        : 'text-foreground/85 hover:text-primary'
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-background/96 backdrop-blur-md transition-opacity duration-500 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={mobileMenuOpen ? { opacity: mobileMenuBackdropOpacity } : undefined}
          onClick={closeMobileMenu}
        />

        <div
          className="relative h-full flex flex-col pt-24 px-6 [touch-action:pan-x] will-change-transform"
          style={{
            transform: `translate3d(0, ${mobileMenuDragOffset}px, 0) scale(${mobileMenuPanelScale})`,
            opacity: mobileMenuPanelOpacity,
            transition: isMobileMenuDragging
              ? 'none'
              : isMobileMenuSwipeDismissing
                ? 'transform 220ms cubic-bezier(0.3, 0, 0.2, 1), opacity 180ms ease-out'
                : 'transform 460ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease-out',
          }}
          onTouchStart={handleMobileMenuTouchStart}
          onTouchMove={handleMobileMenuTouchMove}
          onTouchEnd={handleMobileMenuTouchEnd}
          onTouchCancel={handleMobileMenuTouchEnd}
        >
          <nav className="flex-1 flex flex-col justify-center gap-3">
            {mobileNavLinkKeys.map((link, index) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(event) => handleHashLinkClick(event, closeMobileMenu)}
                className={`group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-[opacity,transform] duration-500 ${
                  mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                }`}
                style={{
                  transitionTimingFunction: 'var(--ease-out-expo)',
                  transitionDelay: mobileMenuOpen
                    ? `${120 + index * 60}ms`
                    : `${(mobileNavLinkKeys.length - 1 - index) * 40}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-mono">{link.number}</span>
                  <span className="section-label text-foreground group-hover:text-primary transition-colors">
                    {t(link.key)}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform] duration-[250ms]" />
              </a>
            ))}
          </nav>

          <div
            className={`pb-10 transition-[opacity,transform] duration-500 ${
              mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{
              transitionTimingFunction: 'var(--ease-out-expo)',
              transitionDelay: mobileMenuOpen ? '460ms' : '80ms',
            }}
          >
            <div className="relative overflow-hidden rounded-[1.7rem] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/55 p-4 shadow-[0_28px_46px_-34px_hsl(var(--foreground)/0.85)]">
              <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-primary/15 blur-2xl" />
              <div className="pointer-events-none absolute -right-6 -bottom-8 h-20 w-20 rounded-full bg-accent/15 blur-2xl" />
              <p className="section-label text-muted-foreground">{t('navbar.hireMe')}</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {contactPlatforms.map((platform) => (
                  <a
                    key={platform.key}
                    href={platform.href}
                    aria-label={t(platform.ariaKey)}
                    onClick={closeMobileMenu}
                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-background/75 px-2 py-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_28px_-20px_hsl(var(--foreground)/0.9)]"
                  >
                    <span
                      className={`absolute inset-x-2 top-0 h-0.5 rounded-full bg-gradient-to-r ${platform.glowClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <span className={`mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full ${platform.iconClass}`}>
                      {platform.icon}
                    </span>
                    <span className="mt-1.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground/85">
                      {t(platform.key, { defaultValue: platform.fallbackLabel ?? platform.key })}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-5 border-t border-border text-center">
              <span className="brand-logo text-2xl text-accent">
                Gisela<span className="text-foreground font-normal">.UGC</span>
              </span>
              <p className="section-label text-muted-foreground mt-2">{t('navbar.studioLabel')}</p>
            </div>
          </div>
        </div>
      </div>

      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[110]"
        style={{ padding: '20px 0' }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <div
            ref={navShellRef}
            className="flex items-center justify-between rounded-[1.15rem] px-4 md:px-6 transition-[box-shadow] duration-300"
            style={{
              padding: '12px 16px',
              backgroundColor: 'hsl(var(--card) / 0.45)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'hsl(var(--border) / 0)',
              boxShadow: 'none',
            }}
          >
            <a
              href="#home"
              className="brand-logo text-xl md:text-2xl text-accent"
              onClick={(event) => handleHashLinkClick(event, closeMobileMenu)}
            >
              Gisela<span className="text-foreground font-medium">.UGC</span>
            </a>

            <div className="hidden md:flex items-center gap-7">
              {desktopNavLinkKeys.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={handleHashLinkClick}
                  className="section-label text-foreground/80 transition-colors hover:text-primary nav-link-underline"
                >
                  {t(link.key)}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2.5">
              <div className="flex items-center gap-1 rounded-full border border-border bg-card px-1 py-1">
                <button
                  onClick={() => changeLanguage('es')}
                  className={languageButtonClass('es')}
                  aria-label={t('languageSwitcher.changeLanguage') + ' a Español'}
                >
                  ES
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={languageButtonClass('en')}
                  aria-label={t('languageSwitcher.changeLanguage') + ' to English'}
                >
                  EN
                </button>
              </div>
              <ThemeToggle />
              <motion.a
                href="#contact"
                onClick={handleHashLinkClick}
                className="btn-primary-nordic btn-shimmer px-5 py-2.5"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.04, y: -1 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                transition={springSnappy}
              >
                {t('navbar.hireMe')}
              </motion.a>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full border border-border bg-card px-1 py-1">
                <button
                  onClick={() => changeLanguage('es')}
                  className={languageButtonClass('es')}
                  aria-label={t('languageSwitcher.changeLanguage') + ' a Español'}
                >
                  ES
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={languageButtonClass('en')}
                  aria-label={t('languageSwitcher.changeLanguage') + ' to English'}
                >
                  EN
                </button>
              </div>
              <ThemeToggle />
              <button
                onPointerDown={handleMobileMenuButtonPointerDown}
                onClick={handleMobileMenuButtonClick}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:text-primary"
                aria-label={mobileMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
                aria-expanded={mobileMenuOpen}
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                  <X
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
