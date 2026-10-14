import { sectionTitleClass } from './title-class';
import type { KeynoteBeatProps } from './types';

/** 5 · Questions: a centred accordion of native details, the first one open. */
const QuestionsBeat = ({ page, kicker, titleId }: KeynoteBeatProps) => (
  <>
    <p className="kn-k">{kicker}</p>
    <h2 id={titleId} className={sectionTitleClass(page.faqTitle)}>
      {page.faqTitle}
    </h2>
    <div className="kn-acc">
      {page.faqs.map((faq, index) => (
        <details key={faq.question} {...(index === 0 ? { open: true } : {})}>
          <summary>
            <h3 className="section-label">{faq.question}</h3>
            <span className="kn-plus" aria-hidden="true" />
          </summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  </>
);

export default QuestionsBeat;
