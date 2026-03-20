import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FeaturedExample } from '@/data/service-pages';
import type { ReelClip } from '@/data/portfolio-clips';
import TheaterVideo from '@/components/media/TheaterVideo';

type ProofItem = {
  example: FeaturedExample;
  clip: ReelClip;
};

type ServiceProofTheaterProps = {
  activeProofItem: ProofItem;
  theaterSources: string[];
  isMobileViewport: boolean;
  labels: {
    previewClose: string;
    previewPrev: string;
    previewNext: string;
  };
  navLabel: string;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
};

const formatDuration = (seconds?: number) => (seconds ? `${Math.round(seconds)}s` : null);

export default function ServiceProofTheater({
  activeProofItem,
  theaterSources,
  isMobileViewport,
  labels,
  navLabel,
  onClose,
  onNavigate,
}: ServiceProofTheaterProps) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 backdrop-blur-[8px] md:backdrop-blur-[14px]"
        style={{ backgroundColor: 'hsl(var(--theater-backdrop) / 0.78)' }}
      />
      {/* Ambient glow — coastal-teal radial gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 30%, hsl(193 64% 48% / 0.06), transparent 70%), radial-gradient(circle at 20% 80%, hsl(var(--theater-backdrop-glow) / 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Main content container */}
      <div className="relative w-full max-w-[430px]">
        {/* Navigation arrows */}
        <button
          type="button"
          className="theater-control theater-control--floating absolute left-0 top-1/2 -translate-x-[118%] -translate-y-1/2 z-[220] h-9 w-9 md:h-10 md:w-10"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onNavigate(-1);
          }}
          aria-label={labels.previewPrev}
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </button>
        <button
          type="button"
          className="theater-control theater-control--floating absolute right-0 top-1/2 translate-x-[118%] -translate-y-1/2 z-[220] h-9 w-9 md:h-10 md:w-10"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onNavigate(1);
          }}
          aria-label={labels.previewNext}
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        {/* Floating glass card */}
        <div
          className="theater-glass-card relative w-full overflow-hidden"
          onClick={(event) => event.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            className="theater-control absolute right-3 top-3 z-30 h-9 w-9"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onClose();
            }}
            aria-label={labels.previewClose}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative">
            <TheaterVideo
              sources={theaterSources}
              poster={activeProofItem.clip.posterSrc}
              enableStartupFallback={isMobileViewport}
              startupFallbackMs={isMobileViewport ? 300 : 420}
            />
          </div>
        </div>

        {/* Detached floating meta bar — below the video card */}
        <div
          className="theater-meta-bar mt-3 mx-auto flex items-center gap-3 rounded-full px-4 py-2.5 max-w-[90%]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="theater-meta-chip shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5">
              {navLabel}
            </span>
            {formatDuration(activeProofItem.clip.durationSeconds) && (
              <span className="theater-meta-chip shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5">
                {formatDuration(activeProofItem.clip.durationSeconds)}
              </span>
            )}
          </div>
          <h4 className="truncate text-sm font-serif font-medium text-white/85 leading-snug">
            {activeProofItem.example.title}
          </h4>
        </div>
      </div>
    </div>
  );
}
