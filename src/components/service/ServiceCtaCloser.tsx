import type { CtaVariant } from './layouts';

type ServiceCtaCloserProps = {
  ctaTitle: string;
  ctaText: string;
  labels: {
    useWhatsApp: string;
    useFiverr: string;
  };
  variant: CtaVariant;
};

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';

function CtaButtons({ labels }: { labels: { useWhatsApp: string; useFiverr: string } }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-white/12 border border-white/20 px-8 py-3.5 text-[10px] font-bold uppercase tracking-prestige text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/35 hover:-translate-y-[1px]"
      >
        {labels.useWhatsApp}
      </a>
      <a
        href={fiverrUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full border border-white/12 px-7 py-3.5 text-[10px] font-bold uppercase tracking-prestige text-white/65 transition-all duration-200 hover:text-white hover:border-white/30"
      >
        {labels.useFiverr}
      </a>
    </div>
  );
}

/* ── DEFAULT (bilingual-ugc-creator) — Centered dark sign-off ── */
function DefaultCta({ ctaTitle, ctaText, labels }: ServiceCtaCloserProps) {
  return (
    <div className="studio-container relative z-10 text-center">
      <p className="section-label mb-6 !text-white/40">{ctaTitle}</p>
      <p className="mx-auto max-w-3xl font-serif text-[clamp(1.4rem,3vw,2.6rem)] font-light leading-[1.45] tracking-tight text-white/90">
        {ctaText}
      </p>
      <CtaButtons labels={labels} />
      <div className="mt-12 md:mt-16">
        <div className="signature-line mx-auto mb-6 max-w-[200px] !bg-gradient-to-r !from-transparent !via-white/15 !to-transparent" />
        <span className="svc-signature">Gisela Saldarriaga</span>
      </div>
    </div>
  );
}

/* ── PERSONAL (spokesperson-videos) — Asymmetric with avatar ── */
function PersonalCta({ ctaTitle, ctaText, labels }: ServiceCtaCloserProps) {
  return (
    <div className="studio-container relative z-10">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12 lg:gap-16">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src="/uploads/gisela-hero-400.webp"
            alt="Gisela Saldarriaga"
            className="h-24 w-24 rounded-full object-cover border-2 border-white/15 md:h-32 md:w-32"
            loading="lazy"
          />
        </div>
        {/* Text */}
        <div className="text-center md:text-left">
          <p className="section-label mb-6 !text-white/40">{ctaTitle}</p>
          <p className="max-w-2xl font-serif text-[clamp(1.3rem,2.5vw,2.2rem)] font-light leading-[1.45] tracking-tight text-white/90">
            {ctaText}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/12 border border-white/20 px-8 py-3.5 text-[10px] font-bold uppercase tracking-prestige text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/35 hover:-translate-y-[1px]"
            >
              {labels.useWhatsApp}
            </a>
            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/12 px-7 py-3.5 text-[10px] font-bold uppercase tracking-prestige text-white/65 transition-all duration-200 hover:text-white hover:border-white/30"
            >
              {labels.useFiverr}
            </a>
          </div>
          <div className="mt-8">
            <span className="svc-signature">Gisela Saldarriaga</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TEAL-GRADIENT (ugc-ads-tiktok-meta) — Coastal-teal gradient accent ── */
function TealGradientCta({ ctaTitle, ctaText, labels }: ServiceCtaCloserProps) {
  return (
    <div className="studio-container relative z-10 text-center">
      {/* Teal gradient glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(193 64% 48% / 0.08), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <p className="section-label mb-6 !text-white/40">{ctaTitle}</p>
      <p className="mx-auto max-w-3xl font-serif text-[clamp(1.4rem,3vw,2.6rem)] font-light leading-[1.45] tracking-tight text-white/90">
        {ctaText}
      </p>
      <CtaButtons labels={labels} />
      <div className="mt-12 md:mt-16">
        <div className="signature-line mx-auto mb-6 max-w-[200px] !bg-gradient-to-r !from-transparent !via-primary/20 !to-transparent" />
        <span className="svc-signature">Gisela Saldarriaga</span>
      </div>
    </div>
  );
}

export default function ServiceCtaCloser(props: ServiceCtaCloserProps) {
  switch (props.variant) {
    case 'default':
      return <DefaultCta {...props} />;
    case 'personal':
      return <PersonalCta {...props} />;
    case 'teal-gradient':
      return <TealGradientCta {...props} />;
    default:
      return <DefaultCta {...props} />;
  }
}
