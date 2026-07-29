import { type MouseEvent } from 'react';
import { useTranslation } from '@/lib/locale-context';
import { useLocation } from 'react-router-dom';
import { Home, Film, LayoutGrid, MessageCircle } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useActiveSection } from '@/hooks/use-active-section';
import { getHomeSectionHref, getLocaleFromPath, isHomePath } from '@/lib/locale-path';

type TabId = 'home' | 'portfolio' | 'services' | 'contact';

const SECTION_TABS: { id: Exclude<TabId, 'contact'>; labelKey: string; Icon: typeof Home }[] = [
  { id: 'home', labelKey: 'navbar.home', Icon: Home },
  { id: 'portfolio', labelKey: 'navbar.portfolio', Icon: Film },
  { id: 'services', labelKey: 'navbar.services', Icon: LayoutGrid },
];

const SPY_IDS = ['home', 'portfolio', 'services'];

type MobileTabBarProps = {
  contactOpen: boolean;
  onContact: () => void;
  /** Slide the bar away while a bottom sheet owns the screen. */
  hidden?: boolean;
};

/**
 * Persistent app-style bottom tab bar (mobile, every route). Inicio / Trabajo /
 * Servicios scroll to (or cross-navigate to) home sections; Contacto opens the
 * contact sheet. The active tab tracks scroll position on the home page (and
 * the contact tab while its sheet is open) with a spring-animated indicator.
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

  return (
    <nav
      className={`mtabbar${hidden ? ' is-hidden' : ''}`}
      aria-label={t('navbar.openMenu', { defaultValue: 'Navegación' })}
      aria-hidden={hidden}
    >
      <div className="mtabbar-inner">
        <span
          className="mtab-pill mtab-pill--shared"
          style={{ '--mtab-index': SECTION_TABS.findIndex(({ id }) => id === activeTab) >= 0
            ? SECTION_TABS.findIndex(({ id }) => id === activeTab)
            : 3 } as React.CSSProperties}
          aria-hidden="true"
        />
        {SECTION_TABS.map(({ id, labelKey, Icon }) => {
          const isActive = activeTab === id;
          return (
            <a
              key={id}
              href={onHome ? `#${id}` : getHomeSectionHref(locale, id)}
              onClick={handleSectionClick}
              className={`mtab${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="mtab-icon" strokeWidth={2} aria-hidden="true" />
              <span className="mtab-label">{t(labelKey)}</span>
            </a>
          );
        })}

        <button
          type="button"
          onClick={onContact}
          className={`mtab${activeTab === 'contact' ? ' is-active' : ''}`}
          aria-haspopup="dialog"
          aria-expanded={contactOpen}
        >
          <MessageCircle className="mtab-icon" strokeWidth={2} aria-hidden="true" />
          <span className="mtab-label">{t('navbar.contact')}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileTabBar;
