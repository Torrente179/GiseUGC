import { Send, Instagram, Linkedin, Facebook } from 'lucide-react';
import { CHANNEL_LOGO_SRC, type ContactChannelId } from '@/lib/contact-channels';

/** White-on-brand (or logo) glyph for a contact channel, sized by font-size. */
const ContactChannelGlyph = ({ id }: { id: ContactChannelId }) => {
  const logo = CHANNEL_LOGO_SRC[id];
  if (logo) {
    return (
      <img
        src={logo}
        alt=""
        width={24}
        height={24}
        loading="lazy"
        decoding="async"
        className="h-[1.15em] w-[1.15em] rounded-full object-cover"
      />
    );
  }
  switch (id) {
    case 'telegram':
      return <Send className="h-[1em] w-[1em] -rotate-12" />;
    case 'instagram':
      return <Instagram className="h-[1em] w-[1em]" />;
    case 'linkedin':
      return <Linkedin className="h-[1em] w-[1em]" />;
    case 'facebook':
      return <Facebook className="h-[1em] w-[1em]" />;
    case 'threads':
      return <span className="text-[1.1em] font-black leading-none" aria-hidden="true">@</span>;
    default:
      return null;
  }
};

export default ContactChannelGlyph;
