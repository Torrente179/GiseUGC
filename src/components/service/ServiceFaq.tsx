import { Plus } from 'lucide-react';
import type { ServiceFaq as ServiceFaqType } from '@/data/service-pages';

type ServiceFaqProps = {
  faqTitle: string;
  navLabel: string;
  faqs: ServiceFaqType[];
};

export default function ServiceFaq({
  faqTitle,
  navLabel,
  faqs,
}: ServiceFaqProps) {
  return (
    <div className="studio-container max-w-4xl">
      <div className="mb-10 md:mb-14 text-center">
        <p className="section-label mb-4">{faqTitle}</p>
        <h2 className="studio-title">{navLabel}</h2>
      </div>

      <div>
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            className={`svc-faq-item group py-6 md:py-7 ${
              index === 0 ? '' : 'border-t border-border/40'
            }`}
          >
            <summary
              className="font-sans flex cursor-pointer list-none items-start justify-between gap-5 text-base font-medium tracking-[-0.005em] leading-[1.45] text-foreground md:text-lg"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}>{faq.question}</span>
              <span className="svc-faq-toggle shrink-0 mt-0.5">
                <Plus className="h-4 w-4" />
              </span>
            </summary>
            <p
              className="mt-4 max-w-3xl font-sans text-[0.95rem] font-normal leading-[1.8] text-foreground/68 md:text-base"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
