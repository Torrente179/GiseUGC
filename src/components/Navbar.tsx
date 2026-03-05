import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useMotionProfile } from '@/components/motion/profile';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';

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
  const motionProfile = useMotionProfile('hero');
  const desktopCtaClass = motionProfile.mobile || motionProfile.reduce ? 'btn-primary-nordic px-5 py-2.5' : 'btn-primary-nordic btn-shimmer px-5 py-2.5';
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

    const updateScrollProgress = () => {
      scrollRafRef.current = null;
      const p = Math.min(1, Math.max(0, window.scrollY / SCROLL_RANGE));
      if (Math.abs(scrollProgressRef.current - p) < 0.01) return;
      scrollProgressRef.current = p;
      applyScrollProgressStyles(p);
    };
    const handleScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(updateScrollProgress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    applyScrollProgressStyles(scrollProgressRef.current);
    updateScrollProgress();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    document.body.classList.toggle('mobile-menu-open', mobileMenuOpen);
    return () => {
      document.body.style.overflow = '';
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
        className={`fixed inset-0 z-[100] md:hidden transition-[opacity] duration-150 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-background/96 transition-opacity duration-150 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={mobileMenuOpen ? { opacity: mobileMenuBackdropOpacity } : undefined}
          onClick={closeMobileMenu}
        />

        <div
          className="relative flex h-full flex-col px-6 pt-24 [touch-action:pan-x]"
          style={{
            transform: `translate3d(0, ${mobileMenuDragOffset}px, 0) scale(${mobileMenuPanelScale})`,
            opacity: mobileMenuPanelOpacity,
            transition: isMobileMenuDragging
              ? 'none'
              : isMobileMenuSwipeDismissing
                ? 'transform 220ms cubic-bezier(0.3, 0, 0.2, 1), opacity 160ms ease-out'
                : 'transform 220ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity 150ms ease-out',
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
                className={`group flex items-center justify-between rounded-2xl border border-border/70 bg-card px-5 py-4 transition-[transform,opacity,border-color] duration-200 ${
                  mobileMenuOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-mono">{link.number}</span>
                  <span className="section-label text-foreground transition-colors group-hover:text-primary">
                    {t(link.key)}
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 text-primary/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            ))}
          </nav>

          <div
            className={`pb-10 transition-[transform,opacity] duration-200 ${
              mobileMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
            }`}
          >
            <div className="rounded-[1.7rem] border border-border/80 bg-card p-4 shadow-[0_18px_36px_-28px_hsl(var(--foreground)/0.6)]">
              <p className="section-label text-muted-foreground">{t('navbar.hireMe')}</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {contactPlatforms.map((platform) => (
                  <a
                    key={platform.key}
                    href={platform.href}
                    aria-label={t(platform.ariaKey)}
                    onClick={closeMobileMenu}
                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-background px-2 py-2.5 text-center transition-[transform,border-color,box-shadow] duration-180 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_24px_-20px_hsl(var(--foreground)/0.7)]"
                  >
                    <span
                      className={`absolute inset-x-2 top-0 h-0.5 rounded-full bg-gradient-to-r ${platform.glowClass} opacity-0 transition-opacity duration-180 group-hover:opacity-100`}
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

      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[110]"
        style={{ padding: '20px 0' }}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <div
            ref={navShellRef}
            className="flex items-center justify-between rounded-[1.15rem] px-4 md:px-6 transition-[box-shadow,border-color,background-color] duration-200"
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
              <a
                href="#contact"
                onClick={handleHashLinkClick}
                className={desktopCtaClass}
              >
                {t('navbar.hireMe')}
              </a>
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
                data-testid="nav-menu-toggle"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-[color,border-color] duration-150 hover:border-primary/40 hover:text-primary"
                aria-label={mobileMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
                aria-expanded={mobileMenuOpen}
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 w-6 h-6 transition-[transform,opacity] duration-150 ${
                      mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                  <X
                    className={`absolute inset-0 w-6 h-6 transition-[transform,opacity] duration-150 ${
                      mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
