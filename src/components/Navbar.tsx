import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/locale-context';
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

const Navbar = () => {
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
        'site-nav fixed top-0 left-0 z-[110] hidden w-full md:pointer-events-none md:block',
        useHeroOverlayNav && 'title-sequence-nav',
      )}
    >
      {/* Desktop only: a floating pill, centred, with language and theme in a
          matching pill on the right. Same look on every route. Phones have no
          top bar: sections and Contacto are in the bottom tab bar, and
          language and theme live in the Contacto sheet. */}
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
