import { useTranslation } from '@/lib/locale-context';
import { Link } from 'react-router-dom';
import { getLegalPath } from '@/lib/locale-path';
import { cn } from '@/lib/utils';

const pillClass =
  'inline-flex h-8 min-h-0 items-center justify-center rounded-full px-3 text-[10px] font-sans font-medium tracking-[0.08em] text-muted-foreground shadow-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground/90';

const PageEndStrip = () => {
  const { t, locale } = useTranslation();

  const legalLinks = [
    { href: getLegalPath('privacy-policy', locale), label: t('footer.privacyPolicy') },
    { href: getLegalPath('terms-content-use', locale), label: t('footer.termsContentUse') },
  ] as const;

  return (
    <footer className="page-end-strip border-t border-border/20 bg-background" role="contentinfo">
      <div className="studio-container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:py-9">
        <p className="font-sans text-[10px] font-medium tracking-[0.04em] text-muted-foreground">
          GiselaSaldarriaga.com <span className="text-muted-foreground/70">·</span> {new Date().getFullYear()}
        </p>

        <nav
          className="page-end-legal-rail nav-control-rail inline-flex w-fit items-center gap-0 p-0.5"
          aria-label={locale === 'es' ? 'Enlaces legales' : 'Legal links'}
        >
          {legalLinks.map((link, index) => (
            <span key={link.href} className="inline-flex items-center">
              {index > 0 ? (
                <span className="mx-0.5 h-3.5 w-px shrink-0 bg-border/35" aria-hidden="true" />
              ) : null}
              <Link to={link.href} className={pillClass}>
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default PageEndStrip;
