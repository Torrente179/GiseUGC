import { MessageCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/';

const FloatingContactDock = () => {
  const { t } = useTranslation();

  return (
    <div
      className="fixed right-4 bottom-4 z-[150] flex flex-col gap-2.5 pointer-events-none"
      style={{
        right: 'calc(1rem + env(safe-area-inset-right, 0px))',
        bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('floatingContact.whatsappAria')}
        className="group pointer-events-auto inline-flex items-center justify-center rounded-full border border-border/75 bg-card/88 p-2.5 sm:px-4 sm:py-2.5 backdrop-blur-md shadow-[0_24px_44px_-34px_hsl(var(--foreground)/0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
          <MessageCircle className="h-4 w-4" />
        </span>
        <span className="ml-2 hidden section-label text-foreground/80 group-hover:text-foreground sm:inline">
          {t('floatingContact.whatsappLabel')}
        </span>
      </a>

      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('floatingContact.telegramAria')}
        className="group pointer-events-auto inline-flex items-center justify-center rounded-full border border-border/75 bg-card/88 p-2.5 sm:px-4 sm:py-2.5 backdrop-blur-md shadow-[0_24px_44px_-34px_hsl(var(--foreground)/0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-300">
          <Send className="h-4 w-4 -rotate-12" />
        </span>
        <span className="ml-2 hidden section-label text-foreground/80 group-hover:text-foreground sm:inline">
          {t('floatingContact.telegramLabel')}
        </span>
      </a>
    </div>
  );
};

export default FloatingContactDock;
