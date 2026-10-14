import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, X } from 'lucide-react';
import ChannelIcon from '@/components/contact/ChannelIcon';
import { CONTACT_CHANNELS, CONTACT_URLS } from '@/lib/contact-channels';
import { useTranslation } from '@/lib/locale-context';
import { serviceContactMessage, whatsappLinkWithText } from '@/lib/service-contact';
import { useIsomorphicLayoutEffect } from './hooks';
import type { KeynotePage } from './types';
import '@/styles/app-chrome.css';

const AVATAR_SRC = '/uploads/gisela-avatar-160.webp';
const WHATSAPP = CONTACT_CHANNELS.find((channel) => channel.id === 'whatsapp');
const TELEGRAM = CONTACT_CHANNELS.find((channel) => channel.id === 'telegram');
const PANEL_WIDTH = 372;
const EDGE = 12;
const FOCUSABLE = 'a[href], button:not([disabled])';

export type ContactTriggerProps = {
  ref: RefObject<HTMLAnchorElement>;
  href: string;
  'aria-haspopup': 'dialog';
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type ContactChoiceProps = {
  page: KeynotePage;
  children: (trigger: ContactTriggerProps) => ReactNode;
};

type Placement = { top: number; left: number } | null;

/**
 * "Escríbeme" for one service: the same two channels the site's contact pill
 * offers (WhatsApp first, then Telegram), read from the shared contact data.
 * WhatsApp opens with a message that names the service in the page's language;
 * Telegram has no prefill for a phone link, so it opens as it does everywhere.
 *
 * The trigger is a real link to this page's footer contact block, so it still
 * works without scripts; with them it opens the panel instead. Desktop anchors the panel to
 * the trigger; a phone gets a card above the tab bar.
 */
const ContactChoice = ({ page, children }: ContactChoiceProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [placement, setPlacement] = useState<Placement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = `${panelId}-title`;

  useEffect(() => setMounted(true), []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Desktop: sit the panel on the trigger, flush with its nearer edge, below it
  // unless there is no room. Phones use fixed CSS and need no measurement.
  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    const isPhone = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 767px)').matches;
    if (!trigger || !panel || isPhone) {
      setPlacement(null);
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const height = panel.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const alignRight = rect.left + rect.width / 2 > viewportWidth / 2;
    const left = Math.min(
      Math.max(EDGE, alignRight ? rect.right - PANEL_WIDTH : rect.left),
      viewportWidth - PANEL_WIDTH - EDGE,
    );
    const below = rect.bottom + 10 + height <= window.innerHeight - EDGE;
    const top = below ? rect.bottom + 10 : Math.max(EDGE, rect.top - 10 - height);
    setPlacement({ left: left + window.scrollX, top: top + window.scrollY });
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const first = panelRef.current?.querySelector<HTMLElement>('a[href]');
    const frame = window.requestAnimationFrame(() => first?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const whatsappHref = whatsappLinkWithText(
    WHATSAPP?.href ?? CONTACT_URLS.whatsapp,
    serviceContactMessage(page.locale, page.navLabel),
  );

  // Without scripts the trigger is a link to this page's own contact block (the footer). It is the
  // same path as the page on purpose: the runtime turns any link to another path into a full page
  // load before React's click handler could run.
  const fallbackHref = `${page.path}#contact`;

  const trigger: ContactTriggerProps = {
    ref: triggerRef,
    href: fallbackHref,
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? panelId : undefined,
    onClick: (event) => {
      event.preventDefault();
      setOpen((value) => !value);
    },
  };

  return (
    <>
      {children(trigger)}
      {mounted && open
        ? createPortal(
            <div className="kn-ctc-layer">
              <div className="kn-ctc-scrim" onPointerDown={() => close(false)} aria-hidden="true" />
              <div
                ref={panelRef}
                id={panelId}
                className="kn-ctc chrome-glass chrome-rim"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                style={placement ? { top: placement.top, left: placement.left } : undefined}
                data-placed={placement ? 'true' : 'false'}
                onKeyDown={onPanelKeyDown}
              >
                <div className="cdock-head">
                  <img className="chrome-avatar" src={AVATAR_SRC} alt="" width={160} height={160} decoding="async" />
                  <div className="cdock-head-text">
                    <p id={titleId} className="cdock-title">
                      {t('navbar.messageMe')}
                    </p>
                    <p className="cdock-sub">{page.navLabel}</p>
                  </div>
                  <button type="button" className="cdock-close" onClick={() => close(true)} aria-label={t('floatingContact.close')}>
                    <X aria-hidden="true" />
                  </button>
                </div>
                <div className="cdock-rows">
                  <a
                    className="cdock-row cdock-row--primary"
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(WHATSAPP?.ariaKey ?? 'floatingContact.whatsappAria')}
                    onClick={() => close(false)}
                  >
                    <span className="cdock-tile">
                      <ChannelIcon id="whatsapp" />
                    </span>
                    <span className="cdock-row-text">{t(WHATSAPP?.labelKey ?? 'floatingContact.whatsappLabel')}</span>
                    <ArrowUpRight className="chrome-arrow" aria-hidden="true" />
                  </a>
                  <a
                    className="cdock-row"
                    href={TELEGRAM?.href ?? CONTACT_URLS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(TELEGRAM?.ariaKey ?? 'floatingContact.telegramAria')}
                    onClick={() => close(false)}
                  >
                    <span className="cdock-tile chrome-tile--telegram">
                      <ChannelIcon id="telegram" />
                    </span>
                    <span className="cdock-row-text">{t(TELEGRAM?.labelKey ?? 'floatingContact.telegramLabel')}</span>
                    <ArrowUpRight className="chrome-arrow" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default ContactChoice;
