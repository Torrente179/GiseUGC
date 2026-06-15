import { type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
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
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { handleHashLinkClick } = useHashlessSectionNavigation();

  const onHome = isHomePath(location.pathname);
  const locale = getLocaleFromPath(location.pathname);
  const spiedSection = useActiveSection(SPY_IDS, onHome);

  const activeTab: TabId = contactOpen
    ? 'contact'
    : onHome
      ? ((spiedSection as TabId) ?? 'home')
      : 'services'; // off-home, treat as the services/work area

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (onHome) {
      handleHashLinkClick(event);
      return;
    }
    event.preventDefault();
    navigate(getHomeSectionHref(locale, id));
  };

  return (
    <nav
      className={`mtabbar${hidden ? ' is-hidden' : ''}`}
      aria-label={t('navbar.openMenu', { defaultValue: 'Navegación' })}
      aria-hidden={hidden}
    >
      <div className="mtabbar-inner">
        {SECTION_TABS.map(({ id, labelKey, Icon }) => {
          const isActive = activeTab === id;
          return (
            <a
              key={id}
              href={onHome ? `#${id}` : getHomeSectionHref(locale, id)}
              onClick={(event) => handleSectionClick(event, id)}
              className={`mtab${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && !shouldReduceMotion && (
                <m.span layoutId="mtab-active" className="mtab-pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />
              )}
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
          {activeTab === 'contact' && !shouldReduceMotion && (
            <m.span layoutId="mtab-active" className="mtab-pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />
          )}
          <MessageCircle className="mtab-icon" strokeWidth={2} aria-hidden="true" />
          <span className="mtab-label">{t('navbar.contact')}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileTabBar;
