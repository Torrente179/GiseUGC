import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/lib/locale-context';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { getLocalizedPathForCurrentRoute, type SiteLocale } from '@/lib/locale-path';

const LOCALES: SiteLocale[] = ['es', 'en'];

type NavbarControlsProps = {
  compact?: boolean;
  currentLocale: SiteLocale;
};

const NavbarControls = ({ compact = false, currentLocale }: NavbarControlsProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const segmentClass = cn(
    'relative z-10 inline-flex items-center justify-center rounded-full font-sans font-medium uppercase no-underline transition-colors duration-200',
    compact
      ? 'h-8 min-w-[2rem] px-2 text-[10px] tracking-[0.08em]'
      : 'h-9 min-w-[2.35rem] px-2.5 text-[11px] tracking-[0.1em]',
  );

  return (
    <div
      className={cn(
        'nav-control-rail inline-flex items-center',
        compact ? 'h-9 gap-0 p-0.5' : 'h-10 gap-0 p-0.5',
      )}
      role="group"
      aria-label={t('languageSwitcher.changeLanguage', { defaultValue: 'Language and theme' })}
    >
      <div className="relative flex items-center">
        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-full bg-foreground/[0.07] transition-transform duration-300 dark:bg-white/[0.09]',
            currentLocale === 'en' && 'translate-x-full',
          )}
          style={{ transitionTimingFunction: 'var(--ease-premium)' }}
          aria-hidden="true"
        />
        {LOCALES.map((locale) => {
          const isActive = currentLocale === locale;
          const href = getLocalizedPathForCurrentRoute(location.pathname, locale, location.hash);

          return (
            <a
              key={locale}
              href={href}
              {...{ hreflang: locale }}
              className={cn(
                segmentClass,
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/90',
              )}
              aria-label={
                locale === 'es'
                  ? `${t('languageSwitcher.changeLanguage', { defaultValue: 'Change language' })} a Español`
                  : `${t('languageSwitcher.changeLanguage', { defaultValue: 'Change language' })} to English`
              }
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="relative">{locale}</span>
            </a>
          );
        })}
      </div>

      <span
        className={cn('shrink-0 bg-border/35', compact ? 'mx-0.5 h-4 w-px' : 'mx-0.5 h-4 w-px')}
        aria-hidden="true"
      />

      <ThemeToggle variant="segment" compact={compact} />
    </div>
  );
};

export default NavbarControls;
