import { Play } from 'lucide-react';
import type { FeaturedExample } from '@/data/service-pages';
import type { ReelClip } from '@/data/portfolio-clips';

type FeaturedWorkVariant = 'asymmetric' | 'phone-frames' | 'strip';

type ProofExample = {
  example: FeaturedExample;
  clip: ReelClip;
};

type ServiceFeaturedWorkProps = {
  proofExamples: ProofExample[];
  labels: {
    openSample: string;
    featuredWorkLabel: string;
    featuredWorkSubtitle: string;
  };
  navLabel: string;
  featuredTitle: string;
  featuredIntro: string;
  variant: FeaturedWorkVariant;
  onOpenClip: (index: number) => void;
};

const formatDuration = (seconds?: number) => (seconds ? `${Math.round(seconds)}s` : null);

export default function ServiceFeaturedWork({
  proofExamples,
  labels,
  navLabel,
  featuredTitle,
  featuredIntro,
  onOpenClip,
}: ServiceFeaturedWorkProps) {
  if (proofExamples.length === 0) return null;

  return (
    <>
      {/* ═══════════════════════════════════════════
          PROOF GALLERY — Editorial numbered showcase
          ═══════════════════════════════════════════ */}
      <div className="studio-container">
        <div className="mb-12 md:mb-16">
          <p className="section-label mb-4">{featuredTitle}</p>
          <h2 className="studio-title max-w-3xl">{featuredIntro}</h2>
        </div>

        {/* Lead featured example — cinematic card */}
        {proofExamples.length > 0 && (() => {
          const { example: leadExample, clip: leadClip } = proofExamples[0];
          const leadDuration = formatDuration(leadClip.durationSeconds);
          return (
            <button
              key={leadExample.clipId}
              type="button"
              onClick={() => onOpenClip(0)}
              aria-label={`${labels.openSample}: ${leadExample.title}`}
              className="svc-proof-lead group relative mb-4 block w-full overflow-hidden rounded-2xl border-0 bg-transparent p-0 text-left md:mb-5 md:rounded-3xl"
            >
              <div className="relative aspect-[16/10] md:aspect-[21/9]">
                <img
                  src={leadClip.posterSrc}
                  alt={leadExample.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="eager"
                  decoding="async"
                />
                {/* Gradient overlay — always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Number badge */}
                <div className="absolute top-5 left-5 md:top-7 md:left-7">
                  <span className="text-[10px] font-bold uppercase tracking-prestige text-white/50">01</span>
                </div>
                {/* Play indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:bg-white/20">
                  <Play className="h-6 w-6 md:h-8 md:w-8 ml-1" />
                </div>
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-prestige text-white/80 backdrop-blur-md">
                      {navLabel}
                    </span>
                    {leadDuration && (
                      <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-prestige text-white/60 backdrop-blur-md">
                        {leadDuration}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-medium leading-tight tracking-tight text-white">
                    {leadExample.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-white/65">
                    {leadExample.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })()}

        {/* Secondary examples — numbered editorial cards */}
        {proofExamples.length > 1 && (
          <div className={`grid gap-4 md:gap-5 ${
            proofExamples.length <= 2
              ? 'md:grid-cols-1 max-w-2xl'
              : proofExamples.length === 3
                ? 'md:grid-cols-2'
                : 'md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {proofExamples.slice(1).map(({ example, clip }, index) => {
              const duration = formatDuration(clip.durationSeconds);
              return (
                <button
                  key={example.clipId}
                  type="button"
                  onClick={() => onOpenClip(index + 1)}
                  aria-label={`${labels.openSample}: ${example.title}`}
                  className="svc-proof-card group relative block w-full overflow-hidden rounded-2xl border-0 bg-transparent p-0 text-left"
                >
                  <div className="relative aspect-[4/5] md:aspect-[5/4]">
                    <img
                      src={clip.posterSrc}
                      alt={example.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    {/* Number */}
                    <div className="absolute top-4 left-4 md:top-5 md:left-5">
                      <span className="text-[10px] font-bold uppercase tracking-prestige text-white/45">
                        {String(index + 2).padStart(2, '0')}
                      </span>
                    </div>
                    {/* Play indicator */}
                    <div className="absolute top-4 right-4 md:top-5 md:right-5 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/25 text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_-4px_rgba(0,0,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white">
                      <Play className="h-4 w-4 md:h-5 md:w-5 ml-1" />
                    </div>
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {duration && (
                          <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-prestige text-white/55 backdrop-blur-md">
                            {duration}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base md:text-lg font-serif font-medium leading-tight tracking-tight text-white">
                        {example.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/60">
                        {example.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   FEATURED WORK GRID — Numbered text grid
   ═══════════════════════════════════════════ */

type ServiceFeaturedWorkGridProps = {
  proofExamples: ProofExample[];
  labels: {
    openSample: string;
    featuredWorkLabel: string;
    featuredWorkSubtitle: string;
  };
  onOpenClip: (index: number) => void;
};

export function ServiceFeaturedWorkGrid({
  proofExamples,
  labels,
  onOpenClip,
}: ServiceFeaturedWorkGridProps) {
  if (proofExamples.length === 0) return null;

  return (
    <div className="studio-container">
      <p className="section-label mb-3">{labels.featuredWorkLabel}</p>
      <p className="mb-10 md:mb-14 font-sans text-sm font-light text-foreground/55 max-w-2xl">
        {labels.featuredWorkSubtitle}
      </p>
      <div
        className={`grid border-t border-border/40 divide-x divide-border/40 ${
          proofExamples.length === 2
            ? 'grid-cols-2'
            : proofExamples.length >= 4
              ? 'grid-cols-4'
              : 'grid-cols-3'
        }`}
      >
        {proofExamples.map(({ example }, index) => (
          <button
            key={example.clipId}
            type="button"
            onClick={() => onOpenClip(index)}
            aria-label={`${labels.openSample}: ${example.title}`}
            className="group flex w-full flex-col justify-between gap-6 border-0 border-b border-border/40 bg-transparent px-5 py-8 text-left transition-colors duration-200 hover:bg-accent/[0.03] md:px-7 md:py-9"
          >
            <div>
              <span className="block text-xs font-semibold uppercase tracking-prestige text-foreground/30 mb-4">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-lg md:text-xl font-medium tracking-tight text-foreground leading-snug">
                {example.title}
              </h3>
            </div>
            <span className="text-foreground/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-foreground/60 text-xl leading-none">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
