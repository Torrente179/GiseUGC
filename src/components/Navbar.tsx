import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { m, useReducedMotion } from 'framer-motion';
import {
  Menu,
  X,
  ArrowRight,
  Send,
  Instagram,
  Linkedin,
  Facebook,
} from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { springSnappy } from '@/components/motion/variants';
import {
  getHomeSectionHref,
  getLocalizedPathForCurrentRoute,
  getLocaleFromPath,
  isHomePath,
  type SiteLocale,
} from '@/lib/locale-path';
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 18;

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

type NavbarProps = {
  compactMobile?: boolean;
};

const Navbar = ({ compactMobile = false }: NavbarProps) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuDragOffset, setMobileMenuDragOffset] = useState(0);
  const [isMobileMenuDragging, setIsMobileMenuDragging] = useState(false);
  const [isMobileMenuSwipeDismissing, setIsMobileMenuSwipeDismissing] = useState(false);
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const mobileMenuSwipeRef = useRef<MobileMenuSwipeState | null>(null);
  const swipeDismissTimeoutRef = useRef<number | null>(null);
  const ignoreNextMenuButtonClickRef = useRef(false);
  const currentLocale = getLocaleFromPath(location.pathname);
  const onHomePage = isHomePath(location.pathname);

  useEffect(() => {
    const syncScrolledState = () => {
      const nextIsScrolled = window.scrollY > SCROLL_THRESHOLD;
      setIsScrolled((previousValue) =>
        previousValue === nextIsScrolled ? previousValue : nextIsScrolled,
      );
    };

    syncScrolledState();
    window.addEventListener('scroll', syncScrolledState, { passive: true });
    window.addEventListener('resize', syncScrolledState);

    return () => {
      window.removeEventListener('scroll', syncScrolledState);
      window.removeEventListener('resize', syncScrolledState);
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

  const homeSectionHref = (sectionId: string) =>
    onHomePage ? `#${sectionId}` : getHomeSectionHref(currentLocale, sectionId);

  const desktopNavLinkKeys = [
    { key: 'navbar.home', href: homeSectionHref('home'), number: '01' },
    { key: 'navbar.services', href: homeSectionHref('services'), number: '02' },
    { key: 'navbar.portfolio', href: homeSectionHref('portfolio'), number: '03' },
    { key: 'navbar.testimonials', href: homeSectionHref('testimonials'), number: '04' },
    { key: 'navbar.contact', href: homeSectionHref('contact'), number: '05' },
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

  const navigate = useNavigate();

  const changeLanguage = (lng: SiteLocale) => {
    if (currentLocale === lng) return;

    const targetPath = getLocalizedPathForCurrentRoute(location.pathname, lng, window.location.hash);
    navigate(targetPath);
  };

  const languageButtonClass = (language: string, compact = false) =>
    cn(
      'inline-flex items-center justify-center rounded-full font-bold uppercase',
      compact
        ? 'min-h-8 min-w-8 px-1.5 py-1 text-[9px] tracking-[0.22em]'
        : 'min-h-10 min-w-10 px-2.5 py-2 text-[11px] tracking-[0.32em]',
      i18n.resolvedLanguage === language
        ? 'bg-primary/22 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]'
        : 'text-foreground/85 hover:text-primary',
    );

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
                onClick={(event) => {
                  if (onHomePage) {
                    handleHashLinkClick(event, closeMobileMenu);
                    return;
                  }

                  event.preventDefault();
                  closeMobileMenu();
                  navigate(link.href);
                }}
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

      <m.nav
        className={cn(
          'fixed top-0 left-0 w-full z-[110] transition-[padding] duration-300',
          isScrolled
            ? compactMobile
              ? 'py-0 md:py-3'
              : 'py-3'
            : compactMobile
              ? 'py-0 md:py-5'
              : 'py-5',
        )}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <div
            className={cn(
              'flex items-center justify-between border px-4 md:px-6 transition-[background-color,border-color,box-shadow,padding,border-radius] duration-300',
              compactMobile ? 'rounded-[0.9rem] md:rounded-[1.15rem]' : 'rounded-[1.15rem]',
              isScrolled
                ? compactMobile
                  ? 'border-border/80 bg-card/95 py-1 md:py-2 shadow-[0_16px_36px_-28px_hsl(var(--foreground)/0.22)]'
                  : 'border-border/80 bg-card/95 py-2 shadow-[0_16px_36px_-28px_hsl(var(--foreground)/0.22)]'
                : compactMobile
                  ? 'border-border/40 bg-card/85 py-1.5 md:py-3 shadow-sm'
                  : 'border-border/40 bg-card/85 py-3 shadow-sm',
            )}
          >
            <a
              href={homeSectionHref('home')}
              className={cn(
                'brand-logo md:text-2xl text-accent',
                compactMobile ? 'text-lg' : 'text-xl',
              )}
              onClick={(event) => {
                if (onHomePage) {
                  handleHashLinkClick(event, closeMobileMenu);
                } else {
                  event.preventDefault();
                  closeMobileMenu();
                  navigate(homeSectionHref('home'));
                }
              }}
            >
              Gisela<span className="text-foreground font-medium">.UGC</span>
            </a>

            <div className="hidden md:flex items-center gap-7">
              {desktopNavLinkKeys.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={(event) => {
                    if (onHomePage) {
                      handleHashLinkClick(event);
                    } else {
                      event.preventDefault();
                      navigate(link.href);
                    }
                  }}
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
              <m.a
                href={homeSectionHref('contact')}
                onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                  if (onHomePage) {
                    handleHashLinkClick(event);
                  } else {
                    event.preventDefault();
                    navigate(homeSectionHref('contact'));
                  }
                }}
                className="btn-primary-nordic px-5 py-2.5"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.04, y: -1 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                transition={springSnappy}
              >
                {t('navbar.hireMe')}
              </m.a>
            </div>

            <div className={cn('md:hidden flex items-center', compactMobile ? 'gap-1' : 'gap-2')}>
              <div
                className={cn(
                  'flex items-center rounded-full border border-border bg-card',
                  compactMobile ? 'gap-0.5 px-0.5 py-0.5' : 'gap-1 px-1 py-1',
                )}
              >
                <button
                  onClick={() => changeLanguage('es')}
                  className={languageButtonClass('es', compactMobile)}
                  aria-label={t('languageSwitcher.changeLanguage') + ' a Español'}
                >
                  ES
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={languageButtonClass('en', compactMobile)}
                  aria-label={t('languageSwitcher.changeLanguage') + ' to English'}
                >
                  EN
                </button>
              </div>
              <ThemeToggle compact={compactMobile} />
              <button
                onPointerDown={handleMobileMenuButtonPointerDown}
                onClick={handleMobileMenuButtonClick}
                className={cn(
                  'inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:text-primary',
                  compactMobile ? 'h-9 w-9' : 'h-11 w-11',
                )}
                aria-label={mobileMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
                aria-expanded={mobileMenuOpen}
              >
                <div className={cn('relative', compactMobile ? 'w-[18px] h-[18px]' : 'w-6 h-6')}>
                  <Menu
                    className={cn(
                      'absolute inset-0 transition-all duration-300',
                      compactMobile ? 'w-[18px] h-[18px]' : 'w-6 h-6',
                      mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100',
                    )}
                  />
                  <X
                    className={cn(
                      'absolute inset-0 transition-all duration-300',
                      compactMobile ? 'w-[18px] h-[18px]' : 'w-6 h-6',
                      mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50',
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </m.nav>
    </>
  );
};

export default Navbar;
