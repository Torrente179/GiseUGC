import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { blurRevealUp, staggerContainer } from '@/components/motion/variants';
import { getLocaleFromPath } from '@/lib/locale-path';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const { t } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);

  const items = t('faq.items', { returnObjects: true }) as FAQItem[];

  const stillQuestion = locale === 'es' ? '¿No encuentras tu respuesta?' : 'Still can’t find your answer?';
  const talkLabel = locale === 'es' ? 'Hablemos' : 'Let’s talk';

  return (
    <section id="faq" className="studio-section bg-background border-t border-border/40">
      <div className="studio-container">
        <div className="grid gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16 xl:gap-24">
          {/* Left — editorial header, sticky on desktop */}
          <m.div
            className="lg:sticky lg:top-28 lg:self-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer(0.12, 0.04)}
          >
            <m.p
              className="section-label text-muted-foreground mb-4"
              variants={blurRevealUp(14, 0.56)}
            >
              {t('faq.sectionSubtitle')}
            </m.p>
            <h2 className="studio-title text-[clamp(2.2rem,5.5vw,3.4rem)] leading-[1.08] mb-6">
              <SplitTextReveal text={t('faq.sectionTitle')} delay={0.08} />
            </h2>
            <m.div className="flex flex-col items-start gap-2" variants={blurRevealUp(14, 0.54)}>
              <p className="studio-subtitle">{stillQuestion}</p>
              <a
                href="#contact"
                onClick={handleHashLinkClick}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-primary"
              >
                {talkLabel}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </a>
            </m.div>
          </m.div>

          {/* Right — answers as clean hairline rows */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer(0.06, 0.05)}
          >
            <Accordion type="single" collapsible className="w-full border-t border-border/60">
              {Array.isArray(items) &&
                items.map((item, index) => (
                  <m.div key={index} variants={blurRevealUp(12, 0.5)}>
                    <AccordionItem
                      value={`item-${index}`}
                      className="faq-answer border-b border-border/60"
                    >
                      <AccordionTrigger className="group type-marketing-display gap-6 text-left text-[1.2rem] md:text-[1.34rem] font-semibold leading-[1.15] tracking-tight-marketing py-5 md:py-6 hover:no-underline hover:text-primary transition-colors duration-300 [&[data-state=open]]:text-primary [&>svg]:text-primary/70 [&>svg]:transition-transform [&>svg]:duration-300">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-sans text-foreground/75 text-[0.95rem] md:text-base leading-[1.7] pb-6 max-w-2xl">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </m.div>
                ))}
            </Accordion>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
