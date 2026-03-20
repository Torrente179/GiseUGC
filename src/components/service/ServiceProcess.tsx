import type { ServiceStep } from '@/data/service-pages';
import type { ProcessVariant } from './layouts';

type ServiceProcessProps = {
  processTitle: string;
  processSteps: ServiceStep[];
  variant: ProcessVariant;
};

/* ── SCROLL-TRACK (bilingual-ugc-creator) — Horizontal snap-scroll cards (mobile) / 4-col grid (desktop) ── */
function ScrollTrackProcess({ processTitle, processSteps }: ServiceProcessProps) {
  return (
    <div className="studio-container">
      <div className="mb-10 md:mb-14 max-w-3xl">
        <p className="section-label mb-4">{processTitle}</p>
        <h2 className="studio-title">{processTitle}</h2>
      </div>
      {/* Mobile: horizontal snap scroll, Desktop: 4-column grid */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:gap-5">
        {processSteps.map((step, index) => (
          <article
            key={step.title}
            className="min-w-[75vw] snap-start rounded-2xl border border-border/30 bg-card/40 p-5 md:min-w-0 md:p-6"
          >
            <span className="block font-serif text-3xl font-bold text-primary/25 mb-4 md:text-4xl">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-serif text-xl font-medium tracking-tight text-foreground mb-3 md:text-2xl">
              {step.title}
            </h3>
            <p className="text-sm font-light leading-[1.85] text-foreground/65 md:text-base">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ── CENTERED-TIMELINE (spokesperson-videos) — Steps alternate left/right of center line ── */
function CenteredTimelineProcess({ processTitle, processSteps }: ServiceProcessProps) {
  return (
    <div className="studio-container max-w-4xl mx-auto">
      <div className="mb-10 md:mb-14 text-center">
        <p className="section-label mb-4">{processTitle}</p>
        <h2 className="studio-title">{processTitle}</h2>
      </div>
      <div className="relative">
        {/* Center line (desktop only) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/30 -translate-x-1/2" aria-hidden="true" />
        <div className="space-y-8 md:space-y-12">
          {processSteps.map((step, index) => {
            const isRight = index % 2 === 1;
            return (
              <article
                key={step.title}
                className={`relative md:w-[calc(50%-2rem)] ${
                  isRight ? 'md:ml-auto md:pl-0' : 'md:mr-auto md:pr-0'
                } ${index > 0 ? 'pl-6 border-l-2 border-border/20 md:border-l-0 md:pl-0' : 'pl-6 border-l-2 border-primary/25 md:border-l-0 md:pl-0'}`}
              >
                {/* Center dot (desktop) */}
                <div
                  className={`hidden md:flex absolute top-2 h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background text-xs font-bold text-foreground/40 ${
                    isRight ? '-left-[calc(50%+1rem+16px)]' : 'left-[calc(100%+2rem-16px)]'
                  }`}
                >
                  {index + 1}
                </div>
                {/* Mobile: inline number */}
                <span className="md:hidden block text-xs font-bold uppercase tracking-prestige text-foreground/30 mb-2">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-xl font-medium tracking-tight text-foreground mb-3 md:text-2xl">
                  {step.title}
                </h3>
                <p className="text-sm font-light leading-[1.85] text-foreground/65 md:text-base">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── ROW-BLOCKS (ugc-ads-tiktok-meta) — Compact numbered blocks in a single row ── */
function RowBlocksProcess({ processTitle, processSteps }: ServiceProcessProps) {
  return (
    <div className="studio-container">
      <div className="mb-10 md:mb-14 max-w-3xl">
        <p className="section-label mb-4">{processTitle}</p>
        <h2 className="studio-title">{processTitle}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:flex-row md:overflow-visible md:pb-0">
        {processSteps.map((step, index) => (
          <article
            key={step.title}
            className="min-w-[70vw] snap-start flex-shrink-0 md:min-w-0 md:flex-1 border-t-2 border-primary/30 pt-5"
          >
            <span className="block text-xs font-bold uppercase tracking-prestige text-primary/50 mb-3">
              Step {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-serif text-lg font-medium tracking-tight text-foreground mb-2 md:text-xl">
              {step.title}
            </h3>
            <p className="text-sm font-light leading-[1.75] text-foreground/62">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ServiceProcess(props: ServiceProcessProps) {
  switch (props.variant) {
    case 'scroll-track':
      return <ScrollTrackProcess {...props} />;
    case 'centered-timeline':
      return <CenteredTimelineProcess {...props} />;
    case 'row-blocks':
      return <RowBlocksProcess {...props} />;
    default:
      return <ScrollTrackProcess {...props} />;
  }
}
