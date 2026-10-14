import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from '@/lib/locale-context';
import { CONTACT_CHANNELS, type ContactChannel, type ContactChannelId } from '@/lib/contact-channels';
import { SITE_PROOF } from '@/data/site-proof';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import ChannelIcon from '@/components/contact/ChannelIcon';
import '@/styles/app-chrome.css';

/**
 * Desktop contact: one glass "Escríbeme" pill (her photo, a WhatsApp badge)
 * that opens a panel ordered by intent — WhatsApp first, then Telegram and
 * Fiverr with its rating, then the social profiles as quiet glyphs. Styles in
 * src/styles/app-chrome.css. Phones use the tab bar's contact sheet instead.
 *
 * It slides in once the hero starts leaving the screen and steps back over
 * the footer, which carries the same links.
 */

const AVATAR_SRC = '/uploads/gisela-avatar-160.webp';
const SOCIAL_IDS: ContactChannelId[] = ['instagram', 'tiktok', 'threads', 'linkedin', 'facebook'];
const CHANNEL_BY_ID = Object.fromEntries(CONTACT_CHANNELS.map((channel) => [channel.id, channel])) as Record<
  ContactChannelId,
  ContactChannel
>;

const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="chrome-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

const FloatingContactDock = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const shouldReduceMotion = usePrefersReducedMotion();
  const [isDesktopDockGhosted, setIsDesktopDockGhosted] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [hasEntrance, setHasEntrance] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Delayed entrance — dock slides up after page settles
  useEffect(() => {
    const delay = shouldReduceMotion ? 200 : 1500;
    const timeoutId = window.setTimeout(() => setHasEntrance(true), delay);
    return () => window.clearTimeout(timeoutId);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia('(min-width: 768px)');
    let rafId: number | null = null;
    let cachedFooter: HTMLElement | null = null;

    // Forced-reflow mitigation: the previous version re-queried `#contact` and
    // read `offsetHeight` on every scroll tick. Now we cache the visible footer
    // reference and only refresh it on resize / DOM mutations. Scroll handlers
    // only read `getBoundingClientRect` (still a layout read, but cheaper and
    // unavoidable for bottom-of-page detection).
    // Cache hit path skips `offsetHeight` (layout read) — only validates on
    // resize/DOM-detach. This keeps scroll-tick work to a single `getBoundingClientRect`.
    const resolveFooter = (): HTMLElement | null => {
      if (cachedFooter && cachedFooter.isConnected) {
        return cachedFooter;
      }
      const candidates = document.querySelectorAll<HTMLElement>('#contact');
      for (const candidate of candidates) {
        if (candidate.offsetHeight > 0) {
          cachedFooter = candidate;
          return candidate;
        }
      }
      cachedFooter = null;
      return null;
    };

    const invalidateFooter = () => {
      cachedFooter = null;
    };

    const evaluateDockState = () => {
      rafId = null;

      // The dock waits only while the hero still fills the screen: once its
      // bottom edge rises above 85% of the viewport (the next section is
      // coming in), it slides up. It used to wait until less than 8% of the
      // hero was left, which put its entrance a whole section late. Routes
      // without a hero show it right away.
      const hero = document.getElementById('home');
      const heroFillsScreen = hero
        ? hero.getBoundingClientRect().bottom > window.innerHeight * 0.85
        : false;
      setIsHeroVisible((previous) => (previous === heroFillsScreen ? previous : heroFillsScreen));

      if (!desktopMediaQuery.matches) {
        setIsDesktopDockGhosted(false);
        return;
      }

      const footer = resolveFooter();
      const isAtAbsoluteBottom = footer
        ? footer.getBoundingClientRect().bottom <= window.innerHeight + 2
        : (() => {
            const scrollingElement = document.scrollingElement ?? document.documentElement;
            const maxScrollTop = Math.max(0, scrollingElement.scrollHeight - window.innerHeight);
            return window.scrollY >= maxScrollTop - 2;
          })();

      setIsDesktopDockGhosted((previous) =>
        previous === isAtAbsoluteBottom ? previous : isAtAbsoluteBottom
      );
    };

    const requestDockStateUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(evaluateDockState);
    };

    const handleResize = () => {
      invalidateFooter();
      requestDockStateUpdate();
    };

    const handleMediaChange = () => {
      requestDockStateUpdate();
    };

    window.addEventListener('scroll', requestDockStateUpdate, { passive: true });
    window.addEventListener('resize', handleResize);
    if (typeof desktopMediaQuery.addEventListener === 'function') {
      desktopMediaQuery.addEventListener('change', handleMediaChange);
    } else {
      desktopMediaQuery.addListener(handleMediaChange);
    }
    requestDockStateUpdate();

    return () => {
      window.removeEventListener('scroll', requestDockStateUpdate);
      window.removeEventListener('resize', handleResize);
      if (typeof desktopMediaQuery.removeEventListener === 'function') {
        desktopMediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        desktopMediaQuery.removeListener(handleMediaChange);
      }

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const isShown = hasEntrance && !isHeroVisible;

  // The panel never outlives the pill: it closes when the pill hides at the
  // top of the page or steps back over the footer.
  useEffect(() => {
    if (!isShown || isDesktopDockGhosted) setIsOpen(false);
  }, [isShown, isDesktopDockGhosted]);

  const close = useCallback((returnFocus: boolean) => {
    setIsOpen(false);
    if (returnFocus) pillRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen, close]);

  if (!isMounted) return null;

  // Mobile contact is handled by the app shell's bottom tab bar + contact sheet.
  if (isMobile) return null;

  const whatsapp = CHANNEL_BY_ID.whatsapp;
  const telegram = CHANNEL_BY_ID.telegram;
  const fiverr = CHANNEL_BY_ID.fiverr;
  const panelId = 'contact-dock-panel';

  return createPortal(
    <div
      ref={rootRef}
      className="cdock"
      data-visible={isShown}
      data-ghost={isDesktopDockGhosted}
    >
      <div
        id={panelId}
        className="cdock-panel chrome-glass chrome-rim"
        role="dialog"
        aria-labelledby="contact-dock-title"
        data-open={isOpen}
      >
        <div className="cdock-head">
          <img className="chrome-avatar" src={AVATAR_SRC} alt="" width={160} height={160} loading="lazy" decoding="async" />
          <div className="cdock-head-text">
            <p id="contact-dock-title" className="cdock-title">{t('navbar.messageMe')}</p>
            <p className="cdock-sub">{t('contact.heading')}</p>
          </div>
          <button type="button" className="cdock-close" onClick={() => close(true)} aria-label={t('floatingContact.close')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="cdock-rows">
          <a
            className="cdock-row cdock-row--primary"
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(whatsapp.ariaKey)}
          >
            <span className="cdock-tile"><ChannelIcon id="whatsapp" /></span>
            <span className="cdock-row-text">{t(whatsapp.labelKey)}</span>
            <ArrowIcon />
          </a>
          <a className="cdock-row" href={telegram.href} target="_blank" rel="noopener noreferrer" aria-label={t(telegram.ariaKey)}>
            <span className="cdock-tile chrome-tile--telegram"><ChannelIcon id="telegram" /></span>
            <span className="cdock-row-text">{t(telegram.labelKey)}</span>
            <ArrowIcon />
          </a>
          <a className="cdock-row" href={fiverr.href} target="_blank" rel="noopener noreferrer">
            <span className="cdock-tile chrome-tile--fiverr"><ChannelIcon id="fiverr" /></span>
            <span className="cdock-row-text">
              {t('floatingContact.fiverrAria')}
              <span className="chrome-proof">
                {SITE_PROOF.fiverrRating}
                <StarIcon />
                · {SITE_PROOF.fiverrReviewCount} {t('hero.feed.reviewsLabel')}
              </span>
            </span>
            <ArrowIcon />
          </a>
        </div>

        <p className="cdock-follow">{t('floatingContact.followMe')}</p>
        <div className="cdock-social">
          {SOCIAL_IDS.map((id) => {
            const channel = CHANNEL_BY_ID[id];
            return (
              <a key={id} href={channel.href} target="_blank" rel="noopener noreferrer" aria-label={t(channel.ariaKey)}>
                <ChannelIcon id={id} />
              </a>
            );
          })}
        </div>
      </div>

      <button
        ref={pillRef}
        type="button"
        className="cdock-pill chrome-glass chrome-rim"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={t(isOpen ? 'floatingContact.toggleCloseAria' : 'floatingContact.toggleOpenAria')}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="cdock-pill-face">
          <img className="chrome-avatar" src={AVATAR_SRC} alt="" width={160} height={160} loading="lazy" decoding="async" />
          <span className="cdock-pill-badge"><ChannelIcon id="whatsapp" /></span>
        </span>
        <span aria-hidden="true">{t('navbar.messageMe')}</span>
        <svg className="cdock-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="m6 15 6-6 6 6" />
        </svg>
      </button>
    </div>,
    document.body
  );
};

export default FloatingContactDock;
