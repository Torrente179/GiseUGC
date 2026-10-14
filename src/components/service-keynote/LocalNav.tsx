import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useTranslation } from '@/lib/locale-context';
import type { InnerBeat } from '@/lib/service-inner-argument';
import ContactChoice from './ContactChoice';
import { KEYNOTE_LABELS } from './labels';
import type { KeynoteBeatProps } from './types';

type LocalNavProps = Pick<KeynoteBeatProps, 'page' | 'locale' | 'variant'> & {
  /** The beats that get a link (the close is reached by scrolling, not from here). */
  beats: InnerBeat[];
  /** Beat id → DOM id for this shell. */
  idFor: (id: InnerBeat['id']) => string;
  activeId: string;
};

/**
 * The slim local nav at the top of the section: the page name on the left, the
 * section names on the right, the current one marked by the beat spy. On a
 * phone the names fold into a "current section" menu.
 *
 * It is drawn once at rest, not stuck to the viewport: the site's floating nav
 * pill (desktop) and the language/theme pill (phone) already own the top edge.
 */
const LocalNav = ({ page, locale, variant, beats, idFor, activeId }: LocalNavProps) => {
  const copy = KEYNOTE_LABELS[locale];
  const { t } = useTranslation();
  const isMobile = variant === 'mobile';
  // A bare #hash link is a history entry to the app's router, which restores the
  // saved scroll (the top). The shared handler eases to the section and leaves the URL clean.
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const current = beats.find((beat) => idFor(beat.id) === activeId) ?? beats[0];
  const menuId = `kn-lnav-menu-${variant}`;

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <nav className="kn-lnav" aria-label={copy.onThisPage} ref={rootRef}>
      <p className="kn-lnav-t">{page.navLabel}</p>
      <div className="kn-lnav-end">
        {isMobile ? (
          <>
            <button
              type="button"
              className="kn-lnav-btn"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={copy.sectionsMenu(current.chip)}
              onClick={() => setOpen((value) => !value)}
            >
              {current.chip}
              <ChevronDown aria-hidden="true" className={open ? 'is-open' : undefined} />
            </button>
            <ul id={menuId} className="kn-lnav-menu" hidden={!open}>
              {beats.map((beat) => (
                <li key={beat.id}>
                  <a
                    href={`#${idFor(beat.id)}`}
                    aria-current={idFor(beat.id) === activeId ? 'true' : undefined}
                    onClick={(event) => handleHashLinkClick(event, () => setOpen(false))}
                  >
                    {beat.chip}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ul className="kn-lnav-list">
            {beats.map((beat) => (
              <li key={beat.id}>
                <a
                  href={`#${idFor(beat.id)}`}
                  aria-current={idFor(beat.id) === activeId ? 'true' : undefined}
                  onClick={handleHashLinkClick}
                >
                  {beat.spine}
                </a>
              </li>
            ))}
          </ul>
        )}
        <ContactChoice page={page}>
          {(trigger) => (
            <a {...trigger} className="kn-lnav-cta" aria-label={`${t('navbar.messageMe')}: ${page.navLabel}`}>
              <MessageCircle aria-hidden="true" />
              <span>{t('navbar.messageMe')}</span>
            </a>
          )}
        </ContactChoice>
      </div>
    </nav>
  );
};

export default LocalNav;
