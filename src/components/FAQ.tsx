import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { revealUp, staggerContainer } from '@/components/motion/variants';

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
        <motion.div
          className="mb-10 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12, 0.04)}
        >
          <motion.p
            className="section-label text-muted-foreground mb-3"
            variants={revealUp(14, 0.56)}
          >
            {t('faq.sectionSubtitle')}
          </motion.p>
          <h2 className="studio-title">
            <SplitTextReveal text={t('faq.sectionTitle')} delay={0.08} />
          </h2>
        </motion.div>

        <motion.div
          className="studio-rule mb-8 md:mb-10"
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.62 }}
        />

        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 22 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.68 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {Array.isArray(items) &&
              items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="faq-answer border-b border-border/60"
                >
                  <AccordionTrigger className="text-left text-base md:text-lg font-medium py-5 hover:no-underline hover:text-primary transition-colors [&[data-state=open]]:text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
