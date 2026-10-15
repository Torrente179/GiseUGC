import ChannelIcon from '@/components/contact/ChannelIcon';
import { CONTACT_URLS } from '@/lib/contact-channels';
import type { SiteLocale } from '@/lib/locale-path';
import { serviceContactMessage, whatsappLinkWithText } from '@/lib/service-contact';
import { KEYNOTE_LABELS } from './labels';
import type { KeynotePage } from './types';

type WantCtaProps = {
  page: KeynotePage;
  locale: SiteLocale;
  /** Spelled out in full at each call site, so Tailwind's purge keeps the rules. */
  className: string;
};

/**
 * "Quiero este servicio": the portfolio's WhatsApp pill, repeated through the
 * service page (hero, sample player, the key beats). WhatsApp opens with a
 * message that names the service. Base styles: "Service CTA" in templates.css;
 * the in-beat colours: "Service CTA in the beats" in service-keynote.css.
 */
const WantCta = ({ page, locale, className }: WantCtaProps) => (
  <a
    className={className}
    href={whatsappLinkWithText(CONTACT_URLS.whatsapp, serviceContactMessage(locale, page.navLabel))}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="svc-want-wa">
      <ChannelIcon id="whatsapp" />
    </span>
    {KEYNOTE_LABELS[locale].wantThisService}
  </a>
);

export default WantCta;
