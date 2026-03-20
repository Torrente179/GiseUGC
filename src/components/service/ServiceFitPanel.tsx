import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { FitPanelVariant } from './layouts';

type ServiceFitPanelProps = {
  bestFitTitle: string;
  bestFitItems: string[];
  notFitTitle: string;
  notFitItems: string[];
  variant: FitPanelVariant;
};

/* ── SPLIT-DIAGONAL (bilingual-ugc-creator) — Side-by-side with diagonal clip-path ── */
function SplitDiagonalFitPanel({ bestFitTitle, bestFitItems, notFitTitle, notFitItems }: ServiceFitPanelProps) {
  return (
    <div className="studio-container">
      <div className="overflow-hidden rounded-[2rem]">
        <div className="grid lg:grid-cols-2">
          <article className="svc-split-fit relative p-7 md:p-10 lg:p-12" style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}>
            <p className="section-label mb-6">{bestFitTitle}</p>
            <ul className="space-y-5">
              {bestFitItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.35rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm font-light leading-[1.75] text-foreground/75 md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="svc-split-notfit relative p-7 md:p-10 lg:p-12 lg:-ml-[5%]" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)' }}>
            <p className="section-label mb-6 !text-white/45">{notFitTitle}</p>
            <ul className="space-y-5">
              {notFitItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.35rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/45">
                    <X className="h-3 w-3" />
                  </span>
                  <span className="text-sm font-light leading-[1.75] opacity-75 md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </div>
  );
}

/* ── STACKED (spokesperson-videos) — Best-fit light, not-fit dark, stacked vertically ── */
function StackedFitPanel({ bestFitTitle, bestFitItems, notFitTitle, notFitItems }: ServiceFitPanelProps) {
  return (
    <div className="studio-container max-w-3xl mx-auto">
      <article className="rounded-t-[2rem] border border-border/30 bg-card/40 p-7 md:p-10">
        <p className="section-label mb-6">{bestFitTitle}</p>
        <ul className="space-y-5">
          {bestFitItems.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[0.35rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-sm font-light leading-[1.75] text-foreground/75 md:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </article>
      <article className="svc-split-notfit rounded-b-[2rem] p-7 md:p-10">
        <p className="section-label mb-6 !text-white/45">{notFitTitle}</p>
        <ul className="space-y-5">
          {notFitItems.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[0.35rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/45">
                <X className="h-3 w-3" />
              </span>
              <span className="text-sm font-light leading-[1.75] opacity-75 md:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

/* ── TABS (ugc-ads-tiktok-meta) — Tab interface with animated underline ── */
function TabsFitPanel({ bestFitTitle, bestFitItems, notFitTitle, notFitItems }: ServiceFitPanelProps) {
  const [activeTab, setActiveTab] = useState<'fit' | 'notfit'>('fit');

  return (
    <div className="studio-container max-w-3xl mx-auto">
      {/* Tab bar */}
      <div className="flex border-b border-border/40 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('fit')}
          className={`relative px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'fit' ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/60'
          }`}
        >
          {bestFitTitle}
          {activeTab === 'fit' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notfit')}
          className={`relative px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'notfit' ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/60'
          }`}
        >
          {notFitTitle}
          {activeTab === 'notfit' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground/40 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'fit' ? (
        <ul className="space-y-5">
          {bestFitItems.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[0.35rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-sm font-light leading-[1.75] text-foreground/75 md:text-base">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-5">
          {notFitItems.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[0.35rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/8 text-foreground/40">
                <X className="h-3 w-3" />
              </span>
              <span className="text-sm font-light leading-[1.75] text-foreground/60 md:text-base">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ServiceFitPanel(props: ServiceFitPanelProps) {
  switch (props.variant) {
    case 'split-diagonal':
      return <SplitDiagonalFitPanel {...props} />;
    case 'stacked':
      return <StackedFitPanel {...props} />;
    case 'tabs':
      return <TabsFitPanel {...props} />;
    default:
      return <SplitDiagonalFitPanel {...props} />;
  }
}
