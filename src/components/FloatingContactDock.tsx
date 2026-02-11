import { createPortal } from 'react-dom';
import { MessageCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/';

const FloatingContactDock = () => {
  const { t } = useTranslation();

  return createPortal(
    <div
      className="fixed right-5 bottom-5 md:right-8 md:bottom-8 z-[9999] flex flex-col items-end gap-3 pointer-events-none"
      style={{
        paddingRight: 'env(safe-area-inset-right, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('floatingContact.whatsappAria')}
        className="group pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-border bg-card p-2.5 md:pl-4 md:pr-5 md:py-3 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-foreground/25"
      >
        <span className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
          <MessageCircle className="h-[18px] w-[18px] md:h-5 md:w-5" />
        </span>
        <span className="hidden section-label text-sm text-foreground/80 group-hover:text-foreground md:inline">
          {t('floatingContact.whatsappLabel')}
        </span>
      </a>

      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('floatingContact.telegramAria')}
        className="group pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-border bg-card p-2.5 md:pl-4 md:pr-5 md:py-3 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-foreground/25"
      >
        <span className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-300">
          <Send className="h-[18px] w-[18px] md:h-5 md:w-5 -rotate-12" />
        </span>
        <span className="hidden section-label text-sm text-foreground/80 group-hover:text-foreground md:inline">
          {t('floatingContact.telegramLabel')}
        </span>
      </a>
    </div>,
    document.body
  );
};

export default FloatingContactDock;
