interface SectionSkeletonProps {
  id?: string;
  minHeightClass?: string;
  /** Visual variant — determines the skeleton shape */
  variant?: 'default' | 'cards' | 'hero-intro' | 'testimonial' | 'footer';
}

const SectionSkeleton = ({
  id,
  minHeightClass = 'min-h-[240px]',
  variant = 'default',
}: SectionSkeletonProps) => (
  <section
    id={id}
    aria-hidden="true"
    className={`${minHeightClass} relative overflow-hidden`}
  >
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
      {variant === 'cards' && (
        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer h-32 md:h-44 rounded-2xl bg-muted/30"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      )}
      {variant === 'testimonial' && (
        <div className="w-full max-w-3xl">
          <div className="skeleton-shimmer h-48 md:h-64 rounded-2xl bg-muted/30" />
          <div className="mt-4 flex gap-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="skeleton-shimmer h-12 w-16 rounded-lg bg-muted/25"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      )}
      {variant === 'hero-intro' && (
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="skeleton-shimmer h-3 w-24 rounded bg-muted/30" />
            <div className="skeleton-shimmer h-10 w-3/4 rounded bg-muted/30" style={{ animationDelay: '80ms' }} />
          </div>
          <div className="space-y-2">
            <div className="skeleton-shimmer h-4 w-full rounded bg-muted/25" style={{ animationDelay: '160ms' }} />
            <div className="skeleton-shimmer h-4 w-5/6 rounded bg-muted/25" style={{ animationDelay: '240ms' }} />
          </div>
        </div>
      )}
      {variant === 'footer' && (
        <div className="w-full max-w-lg text-center space-y-4">
          <div className="skeleton-shimmer mx-auto h-10 w-48 rounded bg-muted/30" />
          <div className="skeleton-shimmer mx-auto h-4 w-72 rounded bg-muted/25" style={{ animationDelay: '100ms' }} />
          <div className="flex gap-2 justify-center mt-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="skeleton-shimmer h-9 w-9 rounded-full bg-muted/25"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>
      )}
      {variant === 'default' && (
        <div className="w-full max-w-3xl space-y-4">
          <div className="skeleton-shimmer h-3 w-20 rounded bg-muted/30" />
          <div className="skeleton-shimmer h-8 w-2/3 rounded bg-muted/30" style={{ animationDelay: '100ms' }} />
          <div className="skeleton-shimmer h-px w-full bg-muted/20 mt-6" style={{ animationDelay: '200ms' }} />
        </div>
      )}
    </div>
  </section>
);

export default SectionSkeleton;
