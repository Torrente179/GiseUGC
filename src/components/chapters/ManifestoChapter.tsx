import { useTranslation } from '@/lib/locale-context';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

/**
 * Chapter 2 — Manifesto. The studio statement and the locked proof numeral.
 * Count-up used to prerender 0+ / 0M+ / 0%, which contradicted llms proof
 * (28+ campañas, Fiverr 4.8/173). Only 28+ is a locked quotable; vistas and
 * satisfaction are not baked because they are not in source-of-truth copy.
 */

const ManifestoChapter = () => {
  const { t } = useTranslation();
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative bg-background">
      <div ref={revealRef} className="svc-reveal container mx-auto px-6 py-24 md:px-12 md:py-36">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
          <h2 className="dc-statement max-w-[18ch]">
            <PretextLineReveal text={t('hero.introduction.title')} delay={0.05} stagger={0.09} className="block" />
          </h2>
          <p className="strategic-body max-w-[34rem] text-base font-normal leading-[1.7] text-foreground/70 md:text-lg lg:pb-2">
            {t('hero.introduction.description')}
          </p>
        </div>

        <div
          className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent md:mt-24"
          aria-hidden="true"
        />

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-16 lg:grid-cols-4">
          <div>
            <div className="dc-numeral">
              <span className="tabular-nums">28+</span>
            </div>
            <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground md:text-[11px]">
              {t('socialProof.campaigns')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoChapter;
