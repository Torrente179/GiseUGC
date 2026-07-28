import { useTranslation } from '@/lib/locale-context';
import { ChevronDown } from 'lucide-react';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const { t, locale } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const revealRef = useScrollReveal<HTMLDivElement>();

  const items = t('faq.items', { returnObjects: true }) as FAQItem[];

  const stillQuestion = locale === 'es' ? '¿No encuentras tu respuesta?' : 'Still can’t find your answer?';
  const talkLabel = locale === 'es' ? 'Hablemos' : 'Let’s talk';

  return (
    <section id="faq" className="studio-section bg-background border-t border-border/40">
      <div className="studio-container">
        <div ref={revealRef} className="svc-reveal grid gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16 xl:gap-24">
          {/* Left — editorial header, sticky on desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="section-label text-muted-foreground mb-4">
              {t('faq.sectionSubtitle')}
            </p>
            <h2 className="studio-title mb-6">
              <SplitTextReveal text={t('faq.sectionTitle')} delay={0.08} />
            </h2>
            <div className="flex flex-col items-start gap-2">
              <p className="studio-subtitle">{stillQuestion}</p>
              <a
                href="#contact"
                onClick={handleHashLinkClick}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-primary"
              >
                {talkLabel}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Right — answers as clean hairline rows */}
          <div>
            <div className="w-full border-t border-border/60">
              {Array.isArray(items) &&
                items.map((item, index) => (
                  <div key={index}>
                    <details className="faq-native faq-answer group border-b border-border/60">
                      <summary className="type-marketing-display flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-semibold leading-[1.35] tracking-tight-marketing transition-colors duration-300 hover:text-primary md:py-6 md:text-[1.125rem]">
                        <span>{item.question}</span>
                        <ChevronDown
                          className="h-4 w-4 shrink-0 text-primary/70 transition-transform duration-300 group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="faq-native__answer-grid">
                        <div className="overflow-hidden">
                          <p className="max-w-2xl pb-6 font-sans text-[0.95rem] leading-[1.7] text-foreground/75 md:text-base">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </details>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
