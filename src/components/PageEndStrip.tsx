import { useTranslation } from '@/lib/locale-context';
import { Link, useLocation } from 'react-router-dom';
import { HUB_LABELS } from '@/data/hub-labels';
import { getHubIdsInOrder, getHubPath, getLegalPath, normalizePathname } from '@/lib/locale-path';

const pillClass =
  'inline-flex h-8 min-h-0 items-center justify-center rounded-full px-3 text-[10px] font-sans font-medium tracking-[0.08em] text-muted-foreground shadow-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground/90 aria-[current=page]:text-foreground/90';

type StripLink = { href: string; label: string };

const PillRail = ({ links, label, currentPath }: { links: StripLink[]; label: string; currentPath: string }) => (
  <nav className="page-end-legal-rail nav-control-rail inline-flex w-fit items-center gap-0 p-0.5" aria-label={label}>
    {links.map((link, index) => (
      <span key={link.href} className="inline-flex items-center">
        {index > 0 ? <span className="mx-0.5 h-3.5 w-px shrink-0 bg-border/35" aria-hidden="true" /> : null}
        <Link
          to={link.href}
          className={pillClass}
          aria-current={normalizePathname(link.href) === currentPath ? 'page' : undefined}
        >
          {link.label}
        </Link>
      </span>
    ))}
  </nav>
);

const PageEndStrip = () => {
  const { t, locale } = useTranslation();
  const currentPath = normalizePathname(useLocation().pathname);

  // Every page links to the three hub indexes from here, so /servicios/,
  // /verticales/ and /recursos/ are one click from Home, not only from each other.
  const hubLinks = getHubIdsInOrder().map((hubId) => ({
    href: getHubPath(hubId, locale),
    label: HUB_LABELS[hubId][locale],
  }));

  const legalLinks = [
    { href: getLegalPath('privacy-policy', locale), label: t('footer.privacyPolicy') },
    { href: getLegalPath('terms-content-use', locale), label: t('footer.termsContentUse') },
  ];

  return (
    <footer id="contact" className="page-end-strip border-t border-border/20 bg-background" role="contentinfo">
      <div className="studio-container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:py-9">
        <p className="font-sans text-[10px] font-medium tracking-[0.04em] text-muted-foreground">
          GiselaSaldarriaga.com <span className="text-muted-foreground/70">·</span> {new Date().getFullYear()}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <PillRail
            links={hubLinks}
            label={locale === 'es' ? 'Secciones del sitio' : 'Site sections'}
            currentPath={currentPath}
          />
          <PillRail
            links={legalLinks}
            label={locale === 'es' ? 'Enlaces legales' : 'Legal links'}
            currentPath={currentPath}
          />
        </div>
      </div>
    </footer>
  );
};

export default PageEndStrip;
