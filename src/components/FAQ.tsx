import { useTranslation } from 'react-i18next';
import { m, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { blurRevealUp, springSmooth, staggerContainer } from '@/components/motion/variants';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const items = t('faq.items', { returnObjects: true }) as FAQItem[];

  return (
    <section id="faq" className="studio-section bg-muted/30">
      <div className="studio-container">
        <m.div
          className="mb-8 md:mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12, 0.04)}
        >
          <m.p
            className="section-label text-muted-foreground mb-3"
            variants={blurRevealUp(14, 0.56)}
          >
            {t('faq.sectionSubtitle')}
          </m.p>
          <h2 className="studio-title text-[clamp(2.2rem,7vw,3.6rem)] leading-[0.94]">
            <SplitTextReveal text={t('faq.sectionTitle')} delay={0.08} />
          </h2>
        </m.div>

        <m.div
          className="studio-rule mb-8 md:mb-10"
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.62 }}
        />

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer(0.06, 0.08)}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-4xl mx-auto rounded-[1.25rem] border border-border/70 bg-card/92 px-5 md:px-7"
          >
            {Array.isArray(items) &&
              items.map((item, index) => (
                <m.div
                  key={index}
                  variants={blurRevealUp(14, 0.52)}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="faq-answer border-b border-border/70 last:border-b-0"
                  >
                    <AccordionTrigger className="font-serif text-left text-[1.26rem] md:text-[1.4rem] lg:text-[1.48rem] font-semibold leading-[1.08] tracking-tight text-foreground py-5 md:py-6 hover:no-underline hover:text-primary transition-colors duration-300 [&[data-state=open]]:text-primary [&>svg]:text-foreground/70 [&>svg]:transition-transform [&>svg]:duration-300">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-sans text-foreground/80 text-sm md:text-base leading-relaxed pb-5 md:pb-6">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </m.div>
              ))}
          </Accordion>
        </m.div>
      </div>
    </section>
  );
};

export default FAQ;
