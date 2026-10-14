import type { ContactChannelId } from '@/lib/contact-channels';

/**
 * One-colour line glyphs for the contact channels, drawn in `currentColor`
 * so each surface (desktop contact panel, mobile contact sheet) tints them.
 * Sized by the parent through `width`/`height` on the svg (1em by default).
 * The brand logos stay out on purpose: eight full-colour marks side by side
 * read as noise; WhatsApp gets its colour from the tile it sits on.
 */
const ChannelIcon = ({ id, className }: { id: ContactChannelId; className?: string }) => {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };

  switch (id) {
    case 'whatsapp':
      return (
        <svg {...common} strokeWidth={1.9}>
          <path d="M20.5 11.7a8.6 8.6 0 0 1-12.7 7.6L3.5 20.5l1.3-4.1a8.6 8.6 0 1 1 15.7-4.7z" />
          <path
            d="M9.2 8.4c.3-.4.6-.4.9-.4h.4c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.6c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.4c0 .3-.1.6-.5.9-.6.3-1.3.5-2.1.3-2.3-.6-4.3-2.6-4.9-4.9-.2-.8 0-1.5.3-2.1z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case 'telegram':
      return (
        <svg {...common} strokeWidth={1.9}>
          <path d="M21 3 3 10.5l6.5 2.5L12 20l3.2-4.6L20 19z" />
          <path d="M9.5 13 21 3" />
        </svg>
      );
    case 'fiverr':
      return (
        <svg {...common} stroke="none" fill="currentColor">
          <text x="12" y="16.5" textAnchor="middle" fontSize="14" fontWeight="800" fontFamily="inherit" letterSpacing="-0.6">
            fi
          </text>
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common} strokeWidth={1.8}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...common} strokeWidth={1.9}>
          <path d="M14.5 3.5v11a3.75 3.75 0 1 1-3.75-3.75" />
          <path d="M14.5 3.5c.4 2.6 2.2 4.3 5 4.5" />
        </svg>
      );
    case 'threads':
      return (
        <svg {...common} stroke="none" fill="currentColor">
          <text x="12" y="17" textAnchor="middle" fontSize="17" fontWeight="700" fontFamily="inherit">
            @
          </text>
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common} strokeWidth={1.8}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
          <path d="M8 10.5V16" />
          <path d="M8 7.6v.01" />
          <path d="M11.5 16v-3.2a2 2 0 0 1 4 0V16" />
          <path d="M11.5 10.5V16" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common} strokeWidth={1.8}>
          <path d="M14.5 21v-7.5H17l.4-3h-2.9V8.7c0-.9.3-1.5 1.5-1.5h1.5V4.6c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.2H9v3h2.6V21" />
        </svg>
      );
    default:
      return null;
  }
};

export default ChannelIcon;
