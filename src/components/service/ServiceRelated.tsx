import { ArrowRight } from 'lucide-react';
import type { ServicePageId, SiteLocale } from '@/lib/locale-path';
import { getServicePath } from '@/lib/locale-path';
import type { RelatedServiceSummary } from '@/data/service-pages';

type ServiceRelatedProps = {
  relatedTitle: string;
  relatedServiceIds: ServicePageId[];
  relatedPages: RelatedServiceSummary[];
  labels: {
    relatedLink: string;
  };
  locale: SiteLocale;
};

export default function ServiceRelated({
  relatedTitle,
  relatedServiceIds,
  relatedPages,
  labels,
  locale,
}: ServiceRelatedProps) {
  return (
    <div className="studio-container">
      <div className="mb-10 md:mb-14">
        <p className="section-label mb-4">{relatedTitle}</p>
        <h2 className="studio-title">{relatedTitle}</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {relatedServiceIds.map((relatedId, index) => {
          const relatedPage = relatedPages[index];
          if (!relatedPage) return null;

          return (
            <a
              key={relatedId}
              href={getServicePath(relatedId, locale)}
              className="svc-related-card group block p-7 md:p-8"
            >
              <p className="section-label mb-3">{relatedPage.eyebrow}</p>
              <h3 className="font-serif text-2xl font-medium tracking-tight text-foreground mb-3 md:text-[1.6rem]">
                {relatedPage.title}
              </h3>
              <p className="text-sm font-light leading-[1.75] text-foreground/62 mb-5">
                {relatedPage.summary}
              </p>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-prestige text-primary transition-colors group-hover:text-accent">
                {labels.relatedLink}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
