import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/locale-context';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import NavbarControls from '@/components/NavbarControls';
import { useActiveSection } from '@/hooks/use-active-section';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import {
  getHomeSectionHref,
  getLocaleFromPath,
  getServicePageIdFromPath,
  isHomePath,
} from '@/lib/locale-path';
import { navigateToRoute } from '@/lib/route-navigation';
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 18;

// Desktop pill, in the order the sections appear on Home. The monogram is
// Home and the CTA is contact, so neither repeats here.
const DESKTOP_PILL_LINKS = [
  { id: 'portfolio', key: 'navbar.portfolio' },
  { id: 'services', key: 'navbar.services' },
  { id: 'testimonials', key: 'navbar.testimonials' },
  { id: 'faq', key: 'navbar.faq' },
] as const;
const DESKTOP_SPY_IDS = ['home', ...DESKTOP_PILL_LINKS.map((link) => link.id)];

type NavbarProps = {
  compactMobile?: boolean;
};

const Navbar = ({ compactMobile = false }: NavbarProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const currentLocale = getLocaleFromPath(location.pathname);
  const onHomePage = isHomePath(location.pathname);
  const onServicePage = Boolean(getServicePageIdFromPath(location.pathname));
  // Home and service landings open on a dark cinematic hero. Reuse the same
  // overlay palette and lift it after the first scroll, matching Home.
  const useHeroOverlayNav = (onHomePage || onServicePage) && !isScrolled;
  const activeSection = useActiveSection(DESKTOP_SPY_IDS, onHomePage);

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

  const homeSectionHref = (sectionId: string) =>
    onHomePage ? `#${sectionId}` : getHomeSectionHref(currentLocale, sectionId);

  return (
    <nav
      className={cn(
        'site-nav fixed top-0 left-0 w-full z-[110] transition-[background-color,border-color,box-shadow] duration-300',
        isScrolled
          ? 'border-b border-border/40 bg-background/95 shadow-[0_14px_36px_-30px_hsl(var(--foreground)/0.5)]'
          : 'border-b border-border/15 bg-background/75',
        'md:pointer-events-none md:border-b-0 md:bg-transparent md:shadow-none',
        useHeroOverlayNav && 'title-sequence-nav',
      )}
    >
      {!isScrolled && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/55 to-transparent dark:from-background/65 md:hidden"
          aria-hidden="true"
        />
      )}
      {/* Mobile: a slim header (logo, language, theme, plus Back off Home).
          Section navigation and contact live in the bottom tab bar. */}
      <div className="container relative mx-auto px-4 sm:px-6 md:hidden">
        <div
          className={cn(
            'flex items-center justify-between transition-[padding] duration-300',
            isScrolled
              ? compactMobile
                ? 'py-2 md:py-2.5'
                : 'py-2.5 md:py-3'
              : compactMobile
                ? 'py-3 md:py-4'
                : 'py-4 md:py-5',
          )}
        >
          <div className="flex items-center gap-1.5">
            {!onHomePage && (
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) window.history.back();
                  else navigateToRoute(homeSectionHref('home'));
                }}
                className={cn('btn-icon-pill md:hidden', compactMobile ? 'h-9 w-9' : 'h-10 w-10')}
                aria-label={t('navbar.back', { defaultValue: currentLocale === 'es' ? 'Volver' : 'Back' })}
              >
                <ChevronLeft className={compactMobile ? 'h-[18px] w-[18px]' : 'h-5 w-5'} aria-hidden="true" />
              </button>
            )}
            <a
              href={homeSectionHref('home')}
              className={cn(
                'brand-logo md:text-2xl text-accent',
                compactMobile ? 'text-lg' : 'text-xl',
              )}
              onClick={(event) => {
                if (onHomePage) handleHashLinkClick(event);
              }}
            >
              Gisela<span className="text-foreground font-medium">.UGC</span>
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <NavbarControls compact={compactMobile} currentLocale={currentLocale} />
          </div>
        </div>
      </div>

      {/* Desktop: a floating pill, centred, with language and theme in a
          matching pill on the right. Same look on every route. */}
      <div className="site-nav-desktop">
        <div className="site-nav-pill" aria-label={t('navbar.desktopLabel')} role="group">
          <a
            href={homeSectionHref('home')}
            className="site-nav-pill__mark"
            aria-label={t('navbar.homeAria')}
            onClick={(event) => {
              if (onHomePage) handleHashLinkClick(event);
            }}
          >
            g<span className="site-nav-pill__dot" aria-hidden="true">.</span>
          </a>
          {DESKTOP_PILL_LINKS.map((link) => {
            const isActive = onHomePage && activeSection === link.id;
            return (
              <a
                key={link.id}
                href={homeSectionHref(link.id)}
                className={cn('site-nav-pill__link', isActive && 'is-active')}
                aria-current={isActive ? 'true' : undefined}
                onClick={(event) => {
                  if (onHomePage) handleHashLinkClick(event);
                }}
              >
                {t(link.key)}
              </a>
            );
          })}
          <a
            href={homeSectionHref('contact')}
            className="site-nav-pill__cta"
            onClick={(event) => {
              if (onHomePage) handleHashLinkClick(event);
            }}
          >
            {t('navbar.messageMe')}
          </a>
        </div>
        <div className="site-nav-tools">
          <NavbarControls currentLocale={currentLocale} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
