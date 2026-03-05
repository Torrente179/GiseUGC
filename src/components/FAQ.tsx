import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { blurRevealUp, revealUp, staggerContainer } from '@/components/motion/variants';
import { MOTION_BUDGETS, useMotionProfile } from '@/components/motion/profile';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const { t } = useTranslation();
  const motionProfile = useMotionProfile();
  const headerReveal = motionProfile.blurAllowed
    ? blurRevealUp(16, MOTION_BUDGETS.section)
    : revealUp(16, MOTION_BUDGETS.section);

  const items = t('faq.items', { returnObjects: true }) as FAQItem[];

  return (
    <section id="faq" className="studio-section bg-muted/30">
      <div className="studio-container">
        <motion.div
          className="mb-8 md:mb-10"
          initial={motionProfile.sectionMode === 'none' ? undefined : 'hidden'}
          whileInView={motionProfile.sectionMode === 'none' ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.08, 0.02)}
        >
          <motion.p
            className="section-label text-muted-foreground mb-3"
            variants={headerReveal}
          >
            {t('faq.sectionSubtitle')}
          </motion.p>
          <h2 className="studio-title text-[clamp(2.2rem,7vw,3.6rem)] leading-[0.94]">
            {motionProfile.mobile ? t('faq.sectionTitle') : <SplitTextReveal text={t('faq.sectionTitle')} delay={0.04} />}
          </h2>
        </motion.div>

        <motion.div
          className="studio-rule mb-8 md:mb-10"
          initial={motionProfile.sectionMode === 'none' ? undefined : { opacity: 0, scaleX: 0.7 }}
          whileInView={motionProfile.sectionMode === 'none' ? undefined : { opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: MOTION_BUDGETS.section }}
        />

        <motion.div
          initial={motionProfile.sectionMode === 'none' ? undefined : 'hidden'}
          whileInView={motionProfile.sectionMode === 'none' ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.1 }}
          variants={revealUp(14, MOTION_BUDGETS.section)}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-4xl mx-auto rounded-[1.25rem] border border-border/70 bg-card/70 px-5 md:px-7"
          >
            {Array.isArray(items) &&
              items.map((item, index) => (
                <div key={index}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="faq-answer border-b border-border/70 last:border-b-0"
                  >
                    <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-foreground py-5 md:py-6 hover:no-underline hover:text-primary transition-colors duration-200 [&[data-state=open]]:text-primary [&>svg]:text-foreground/70 [&>svg]:transition-transform [&>svg]:duration-200">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 text-sm md:text-base leading-relaxed pb-5 md:pb-6">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
