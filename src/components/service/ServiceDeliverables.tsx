import { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import type { ServiceFeature } from '@/data/service-pages';
import type { DeliverablesVariant } from './layouts';

type ServiceDeliverablesProps = {
  deliverablesTitle: string;
  navLabel: string;
  deliverables: ServiceFeature[];
  variant: DeliverablesVariant;
};

/* ── MAGAZINE (bilingual-ugc-creator) — Full-width rows with watermark numerals ── */
function MagazineDeliverables({ deliverablesTitle, navLabel, deliverables }: ServiceDeliverablesProps) {
  return (
    <div className="studio-container">
      <div className="mb-10 md:mb-14">
        <p className="section-label mb-4">{deliverablesTitle}</p>
        <h2 className="studio-title max-w-3xl">{navLabel}</h2>
      </div>
      <div className="space-y-0">
        {deliverables.map((item, index) => (
          <div
            key={item.title}
            className="relative border-t border-border/40 py-8 md:py-12"
          >
            {/* Watermark numeral */}
            <span
              className="pointer-events-none absolute top-4 right-4 font-serif text-[4.5rem] md:text-[5.5rem] font-bold leading-none text-foreground/[0.04] select-none"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="relative flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
              <h3 className="font-serif text-xl font-medium tracking-tight text-foreground md:text-2xl md:min-w-[280px] lg:text-[1.7rem]">
                {item.title}
              </h3>
              <p className="text-sm font-light leading-[1.85] text-foreground/62 md:text-base md:flex-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── BENTO (spokesperson-videos) — 2x2 grid, first card spans 2 columns ── */
function BentoDeliverables({ deliverablesTitle, navLabel, deliverables }: ServiceDeliverablesProps) {
  return (
    <div className="studio-container">
      <div className="mb-10 md:mb-14">
        <p className="section-label mb-4">{deliverablesTitle}</p>
        <h2 className="studio-title max-w-3xl">{navLabel}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {deliverables.map((item, index) => (
          <div
            key={item.title}
            className={`rounded-2xl border border-border/30 bg-card/40 p-6 md:p-8 ${
              index === 0 ? 'md:col-span-2' : ''
            }`}
          >
            <div className="mb-4 h-1 w-8 rounded-full bg-primary/40" />
            <span className="block text-xs font-semibold uppercase tracking-prestige text-foreground/30 mb-3">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-serif text-xl font-medium tracking-tight text-foreground mb-3 md:text-2xl">
              {item.title}
            </h3>
            <p className="text-sm font-light leading-[1.85] text-foreground/62 md:text-base">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── DASHBOARD (ugc-ads-tiktok-meta) — 4-card grid with teal indicators ── */
function DashboardDeliverables({ deliverablesTitle, navLabel, deliverables }: ServiceDeliverablesProps) {
  return (
    <div className="studio-container">
      <div className="mb-10 md:mb-14">
        <p className="section-label mb-4">{deliverablesTitle}</p>
        <h2 className="studio-title max-w-3xl">{navLabel}</h2>
      </div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {deliverables.map((item, index) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border/30 bg-card/40 p-5 md:p-6"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-bold uppercase tracking-prestige text-foreground/35">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-serif text-lg font-medium tracking-tight text-foreground mb-2 md:text-xl">
              {item.title}
            </h3>
            <p className="text-sm font-light leading-[1.75] text-foreground/62">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiceDeliverables(props: ServiceDeliverablesProps) {
  switch (props.variant) {
    case 'magazine':
      return <MagazineDeliverables {...props} />;
    case 'bento':
      return <BentoDeliverables {...props} />;
    case 'dashboard':
      return <DashboardDeliverables {...props} />;
    default:
      return <MagazineDeliverables {...props} />;
  }
}
