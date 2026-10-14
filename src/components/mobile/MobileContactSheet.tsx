import { Drawer as DrawerPrimitive } from 'vaul';
import { useTranslation } from '@/lib/locale-context';
import { CONTACT_CHANNELS, type ContactChannel, type ContactChannelId } from '@/lib/contact-channels';
import { SITE_PROOF } from '@/data/site-proof';
import ChannelIcon from '@/components/contact/ChannelIcon';
import '@/styles/app-chrome.css';

type MobileContactSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AVATAR_SRC = '/uploads/gisela-avatar-160.webp';
const SOCIAL_IDS: ContactChannelId[] = ['instagram', 'tiktok', 'threads', 'linkedin', 'facebook'];
const CHANNEL_BY_ID = Object.fromEntries(CONTACT_CHANNELS.map((channel) => [channel.id, channel])) as Record<
  ContactChannelId,
  ContactChannel
>;

/**
 * App-style contact sheet (phones), opened by the tab bar's Contacto button:
 * a floating glass card with WhatsApp as the main action, Telegram and
 * Fiverr (with its rating) side by side, and the social profiles as glass
 * discs. Built on vaul's primitives directly so the sheet can float inset
 * from the screen edges. Styles in src/styles/app-chrome.css.
 */
const MobileContactSheet = ({ open, onOpenChange }: MobileContactSheetProps) => {
  const { t } = useTranslation();
  const whatsapp = CHANNEL_BY_ID.whatsapp;
  const telegram = CHANNEL_BY_ID.telegram;
  const fiverr = CHANNEL_BY_ID.fiverr;
  const closeSheet = () => onOpenChange(false);

  return (
    <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="csheet-overlay" />
        <DrawerPrimitive.Content className="csheet chrome-glass chrome-rim">
          <div className="csheet-grabber" aria-hidden="true" />

          <div className="csheet-head">
            <img className="chrome-avatar" src={AVATAR_SRC} alt="" width={160} height={160} decoding="async" />
            <div className="csheet-head-text">
              <DrawerPrimitive.Title className="csheet-title">{t('contact.sectionTitle')}</DrawerPrimitive.Title>
              <DrawerPrimitive.Description className="csheet-sub">{t('contact.heading')}</DrawerPrimitive.Description>
            </div>
            <DrawerPrimitive.Close className="csheet-close" aria-label={t('floatingContact.close')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </DrawerPrimitive.Close>
          </div>

          <a
            className="csheet-primary"
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeSheet}
          >
            <span className="csheet-primary-tile"><ChannelIcon id="whatsapp" /></span>
            <span className="csheet-primary-text">{t('floatingContact.whatsappCta')}</span>
            <svg className="chrome-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>

          <div className="csheet-pair">
            <a
              className="csheet-tile"
              href={telegram.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(telegram.ariaKey)}
              onClick={closeSheet}
            >
              <span className="cdock-tile chrome-tile--telegram"><ChannelIcon id="telegram" /></span>
              <span className="csheet-tile-text">{t(telegram.labelKey)}</span>
            </a>
            <a
              className="csheet-tile"
              href={fiverr.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t(fiverr.ariaKey)}, ${SITE_PROOF.fiverrRating} · ${SITE_PROOF.fiverrReviewCount} ${t('hero.feed.reviewsLabel')}`}
              onClick={closeSheet}
            >
              <span className="cdock-tile chrome-tile--fiverr"><ChannelIcon id="fiverr" /></span>
              <span className="csheet-tile-text">
                {t(fiverr.labelKey)}
                <span className="chrome-proof">
                  {SITE_PROOF.fiverrRating}
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
                  </svg>
                  · {SITE_PROOF.fiverrReviewCount}
                </span>
              </span>
            </a>
          </div>

          <p className="csheet-follow">{t('floatingContact.followMe')}</p>
          <div className="csheet-social">
            {SOCIAL_IDS.map((id) => {
              const channel = CHANNEL_BY_ID[id];
              return (
                <a
                  key={id}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(channel.ariaKey)}
                  onClick={closeSheet}
                >
                  <span className="csheet-social-disc"><ChannelIcon id={id} /></span>
                  <span className="csheet-social-label" aria-hidden="true">{t(channel.labelKey)}</span>
                </a>
              );
            })}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
};

export default MobileContactSheet;
