import type { SiteLocale } from '@/lib/locale-path';
import { getHomePath, getHomeSectionHref } from '@/lib/locale-path';
import type { HeroVariant } from './layouts';

type ServiceHeroProps = {
  heroEyebrow: string;
  heroTitle: string;
  heroSummary: string;
  heroPoints: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  breadcrumbLabel: string;
  locale: SiteLocale;
  labels: {
    home: string;
    services: string;
  };
  variant: HeroVariant;
};

/* ── Hero background sources per variant (no new assets) ── */
const HERO_CONFIG = {
  'split-world': {
    imageSrc: '/uploads/gisela-hero-desktop-2048.webp',
    imageFallback: '/uploads/gisela-hero-desktop-2048.jpg',
  },
  stage: {
    imageSrc: 'https://media.giselasaldarriaga.com/videos/posters/ugc-brand-spokesperson-poster.jpg',
    imageFallback: 'https://media.giselasaldarriaga.com/videos/posters/ugc-brand-spokesperson-poster.jpg',
  },
  lab: {
    videoSrc: 'https://media.giselasaldarriaga.com/videos/previews/ugc-lifestyle-review-preview.mp4',
    posterSrc: 'https://media.giselasaldarriaga.com/videos/posters/ugc-lifestyle-review-poster.jpg',
  },
} as const;

function Breadcrumb({
  locale,
  labels,
  breadcrumbLabel,
}: {
  locale: SiteLocale;
  labels: { home: string; services: string };
  breadcrumbLabel: string;
}) {
  return (
    <nav className="svc-breadcrumb mb-8 md:mb-10 sr-only md:not-sr-only md:flex" aria-label="Breadcrumb">
      <a href={getHomePath(locale)}>{labels.home}</a>
      <span className="opacity-40">/</span>
      <a href={getHomeSectionHref(locale, 'services')}>{labels.services}</a>
      <span className="opacity-40">/</span>
      <span className="text-white/70">{breadcrumbLabel}</span>
    </nav>
  );
}

function HeroContent({
  heroEyebrow,
  heroTitle,
  heroSummary,
  heroPoints,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: Pick<
  ServiceHeroProps,
  | 'heroEyebrow'
  | 'heroTitle'
  | 'heroSummary'
  | 'heroPoints'
  | 'primaryCtaLabel'
  | 'primaryCtaHref'
  | 'secondaryCtaLabel'
  | 'secondaryCtaHref'
>) {
  return (
    <>
      <p className="svc-hero-tagline mb-5 md:mb-6">{heroEyebrow}</p>
      <h1 className="svc-hero-title max-w-[12ch] md:max-w-5xl">{heroTitle}</h1>
      <p className="svc-hero-summary sr-only mt-6 text-base md:not-sr-only md:text-lg">{heroSummary}</p>
      <div className="mt-6 sr-only md:not-sr-only md:mt-8 md:flex md:flex-wrap md:gap-2">
        {heroPoints.map((point) => (
          <span key={point} className="svc-hero-chip">
            {point}
          </span>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
        <a href={primaryCtaHref} className="svc-hero-cta-primary">
          {primaryCtaLabel}
        </a>
        <a href={secondaryCtaHref} className="svc-hero-cta-secondary">
          {secondaryCtaLabel}
        </a>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   SPLIT-WORLD — bilingual-ugc-creator
   Vertically-split tint overlay (teal left / khaki right)
   Uses homepage hero image with different object-position
   ═══════════════════════════════════════════════════════════ */
function SplitWorldHero(props: ServiceHeroProps) {
  const config = HERO_CONFIG['split-world'];
  return (
    <section className="svc-hero svc-hero--split-world">
      <img
        className="svc-hero-media"
        src={config.imageSrc}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
        aria-hidden="true"
      />
      {/* Split-tint overlays: teal on left, khaki on right */}
      <div className="svc-hero-overlay svc-hero-overlay--split" />
      <div className="svc-hero-content">
        <Breadcrumb locale={props.locale} labels={props.labels} breadcrumbLabel={props.breadcrumbLabel} />
        <HeroContent {...props} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAGE — spokesperson-videos
   Portrait-oriented, phone-frame silhouette mask on desktop
   Spokesperson clip poster as background
   ═══════════════════════════════════════════════════════════ */
function StageHero(props: ServiceHeroProps) {
  const config = HERO_CONFIG.stage;
  return (
    <section className="svc-hero svc-hero--stage">
      <img
        className="svc-hero-media svc-hero-media--stage"
        src={config.imageSrc}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
        aria-hidden="true"
      />
      {/* Centered vertical gradient for "stage spotlight" */}
      <div className="svc-hero-overlay svc-hero-overlay--stage" />
      <div className="svc-hero-content svc-hero-content--stage">
        <Breadcrumb locale={props.locale} labels={props.labels} breadcrumbLabel={props.breadcrumbLabel} />
        <HeroContent {...props} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   LAB — ugc-ads-tiktok-meta
   Split: left 55% text on solid deep-ebony, right 45% live video
   No cinematic photo — the content IS the ad
   ═══════════════════════════════════════════════════════════ */
function LabHero(props: ServiceHeroProps) {
  const config = HERO_CONFIG.lab;
  return (
    <section className="svc-hero svc-hero--lab">
      <div className="svc-hero-content svc-hero-content--lab">
        {/* Left: text content */}
        <div className="svc-hero-lab-text">
          <Breadcrumb locale={props.locale} labels={props.labels} breadcrumbLabel={props.breadcrumbLabel} />
          <HeroContent {...props} />
        </div>
        {/* Right: live video preview */}
        <div className="svc-hero-lab-video">
          <div className="svc-hero-lab-phone">
            <video
              className="svc-hero-lab-phone-video"
              src={config.videoSrc}
              poster={config.posterSrc}
              muted
              loop
              playsInline
              autoPlay
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServiceHero(props: ServiceHeroProps) {
  switch (props.variant) {
    case 'split-world':
      return <SplitWorldHero {...props} />;
    case 'stage':
      return <StageHero {...props} />;
    case 'lab':
      return <LabHero {...props} />;
    default:
      return <SplitWorldHero {...props} />;
  }
}
