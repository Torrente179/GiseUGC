import { createPortal } from 'react-dom';
import { MessageCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/';
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/';

const FiverrIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.39 3H3.61A.61.61 0 003 3.61v16.78c0 .34.27.61.61.61h16.78c.34 0 .61-.27.61-.61V3.61c0-.34-.27-.61-.61-.61zM17.12 17.07H14.4v-4.46h-1.13v4.46H7.74V9.4h2.72v1.13h.04A2.8 2.8 0 0112.94 9c1.56 0 2.54.96 2.54 2.65v1.97h1.64v3.45zm-4.18-7.4a1.58 1.58 0 01-1.63 1.28h-.04V9.4h.04c.87 0 1.5.5 1.63 1.27z" />
  </svg>
);

const FloatingContactDock = () => {
  const { t } = useTranslation();

  return createPortal(
    <div
      className="fixed bottom-5 md:bottom-8 left-0 right-0 z-[9999] pointer-events-none"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-end gap-3">
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

      <a
        href={fiverrUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('floatingContact.fiverrAria')}
        className="group pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-border bg-card p-2.5 md:pl-4 md:pr-5 md:py-3 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-foreground/25"
      >
        <span className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-300">
          <FiverrIcon className="h-[18px] w-[18px] md:h-5 md:w-5" />
        </span>
        <span className="hidden section-label text-sm text-foreground/80 group-hover:text-foreground md:inline">
          {t('floatingContact.fiverrLabel')}
        </span>
      </a>
      </div>
    </div>,
    document.body
  );
};

export default FloatingContactDock;
