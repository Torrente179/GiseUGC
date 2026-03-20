import type { IntroVariant } from './layouts';

type ServiceEditorialIntroProps = {
  variant: IntroVariant;
  sectionIntroTitle: string;
  sectionIntroText: string;
  marketTitle: string;
  marketItems: string[];
};

/* ── WIDE (bilingual-ugc-creator) — Full-width statement, market items as pill grid ── */
function WideIntro({ sectionIntroTitle, sectionIntroText, marketTitle, marketItems }: ServiceEditorialIntroProps) {
  return (
    <div className="studio-container">
      <div className="mb-14 md:mb-16">
        <p className="section-label mb-7">{sectionIntroTitle}</p>
        <p className="font-serif text-[clamp(1.5rem,3vw,2.8rem)] font-light leading-[1.4] tracking-tight text-foreground max-w-4xl">
          {sectionIntroText}
        </p>
      </div>
      <div>
        <p className="section-label mb-6">{marketTitle}</p>
        <div className="flex flex-wrap gap-3 md:grid md:grid-cols-3 md:gap-5">
          {marketItems.map((item, i) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-border/30 bg-card/40 px-4 py-3 md:rounded-2xl md:px-5 md:py-4"
            >
              <span className="shrink-0 pt-0.5 text-[11px] font-bold uppercase tracking-prestige text-accent/50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm font-light leading-[1.65] text-foreground/72 md:text-base">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── CENTERED (spokesperson-videos) — Pull-quote with vertical left line ── */
function CenteredIntro({ sectionIntroTitle, sectionIntroText, marketTitle, marketItems }: ServiceEditorialIntroProps) {
  return (
    <div className="studio-container max-w-3xl mx-auto">
      <p className="section-label mb-7 text-center">{sectionIntroTitle}</p>
      <div className="border-l-2 border-primary/25 pl-8 md:pl-10">
        <p className="font-serif italic text-[clamp(1.35rem,2.4vw,2.2rem)] font-light leading-[1.5] tracking-tight text-foreground">
          {sectionIntroText}
        </p>
      </div>
      <div className="mt-12 md:mt-16">
        <p className="section-label mb-6 text-center">{marketTitle}</p>
        <div className="space-y-4">
          {marketItems.map((item, i) => (
            <div key={item} className="flex items-start gap-5">
              <span className="shrink-0 pt-0.5 text-[11px] font-bold uppercase tracking-prestige text-accent/50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-base font-light leading-[1.75] text-foreground/72">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── DARK (ugc-ads-tiktok-meta) — Full-width dark section ── */
function DarkIntro({ sectionIntroTitle, sectionIntroText, marketTitle, marketItems }: ServiceEditorialIntroProps) {
  return (
    <div className="svc-intro-dark rounded-[2rem] mx-4 md:mx-8 lg:mx-auto lg:max-w-[1400px] px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
      <div className="max-w-4xl">
        <p className="section-label mb-7 !text-white/40">{sectionIntroTitle}</p>
        <p className="font-serif text-[clamp(1.4rem,2.6vw,2.3rem)] font-light leading-[1.45] tracking-tight text-white/90">
          {sectionIntroText}
        </p>
      </div>
      <div className="mt-12 md:mt-14">
        <p className="section-label mb-8 !text-white/40">{marketTitle}</p>
        <div className="space-y-0">
          {marketItems.map((item, i) => (
            <div
              key={item}
              className={`flex items-start gap-5 ${i > 0 ? 'border-t border-white/10 pt-5 mt-5' : ''}`}
            >
              <span className="shrink-0 pt-0.5 text-lg font-serif font-bold text-primary/60">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-base font-light leading-[1.75] text-white/65">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServiceEditorialIntro(props: ServiceEditorialIntroProps) {
  switch (props.variant) {
    case 'wide':
      return <WideIntro {...props} />;
    case 'centered':
      return <CenteredIntro {...props} />;
    case 'dark':
      return <DarkIntro {...props} />;
    default:
      return <WideIntro {...props} />;
  }
}
