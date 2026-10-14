import { type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { useTranslation } from '@/lib/locale-context';
import { useLocation } from 'react-router-dom';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useActiveSection } from '@/hooks/use-active-section';
import { getHomeSectionHref, getLocaleFromPath, isHomePath } from '@/lib/locale-path';
import '@/styles/app-chrome.css';

type TabId = 'home' | 'portfolio' | 'services' | 'contact';

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

const SECTION_TABS: { id: Exclude<TabId, 'contact'>; labelKey: string; icon: ReactNode }[] = [
  {
    id: 'home',
    labelKey: 'navbar.home',
    icon: (
      <svg {...iconProps}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
      </svg>
    ),
  },
  {
    id: 'portfolio',
    labelKey: 'navbar.portfolio',
    icon: (
      <svg {...iconProps}>
        <rect x="5" y="2.5" width="14" height="19" rx="3" />
        <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'services',
    labelKey: 'navbar.services',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
      </svg>
    ),
  },
];

const SPY_IDS = ['home', 'portfolio', 'services'];

type MobileTabBarProps = {
  contactOpen: boolean;
  onContact: () => void;
  /** Slide the bar away while a bottom sheet owns the screen. */
  hidden?: boolean;
};

/**
 * Persistent app-style bottom tab bar (phones, every route), in the Liquid
 * glass pattern: a frosted capsule with Inicio / Portafolio / Servicios and a
 * glass lens that springs to the active one, plus Contacto as its own round
 * button beside it, which opens the contact sheet. The section tabs scroll to
 * (or cross-navigate to) home sections; the lens tracks scroll position on
 * the home page. Styles in src/styles/app-chrome.css.
 */
const MobileTabBar = ({ contactOpen, onContact, hidden = false }: MobileTabBarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();

  const onHome = isHomePath(location.pathname);
  const locale = getLocaleFromPath(location.pathname);
  const spiedSection = useActiveSection(SPY_IDS, onHome);

  const activeTab: TabId = contactOpen
    ? 'contact'
    : onHome
      ? ((spiedSection as TabId) ?? 'home')
      : 'services'; // off-home, treat as the services/work area

  // Off-home tabs point at another prerendered document, so the runtime's
  // anchor interception owns the navigation. Pushing the route client-side as
  // well only renders a blank frame before the document load lands.
  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onHome) handleHashLinkClick(event);
  };

  const sectionIndex = SECTION_TABS.findIndex(({ id }) => id === activeTab);
  // While the contact sheet is open the lens stays on the section underneath.
  const lensIndex = sectionIndex >= 0 ? sectionIndex : SECTION_TABS.findIndex(({ id }) => id === (spiedSection ?? 'home'));

  return (
    <nav
      className={`lgbar${hidden ? ' is-hidden' : ''}`}
      aria-label={t('navbar.mobileNavLabel')}
      aria-hidden={hidden}
    >
      <div className="lgbar-tabs chrome-glass chrome-rim">
        <span
          className="lgbar-lens"
          style={{ '--lg-index': Math.max(0, lensIndex) } as CSSProperties}
          aria-hidden="true"
        />
        {SECTION_TABS.map(({ id, labelKey, icon }) => {
          const isActive = activeTab === id;
          return (
            <a
              key={id}
              href={onHome ? `#${id}` : getHomeSectionHref(locale, id)}
              onClick={handleSectionClick}
              className="lgbar-tab"
              aria-current={isActive ? 'page' : undefined}
            >
              {icon}
              <span>{t(labelKey)}</span>
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onContact}
        className="lgbar-contact"
        aria-label={t('navbar.contact')}
        aria-haspopup="dialog"
        aria-expanded={contactOpen}
      >
        <svg {...iconProps}>
          <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.7A8.4 8.4 0 1 1 21 11.5z" />
          <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
        </svg>
      </button>
    </nav>
  );
};

export default MobileTabBar;
