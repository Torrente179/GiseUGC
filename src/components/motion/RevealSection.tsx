import type { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

// Section wrapper that reveals its children on scroll via the
// `svc-reveal` + `is-visible` CSS classes. Shared by the service / vertical /
// resource landing-page templates (previously duplicated in each).
export function RevealSection({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} id={id} className={`svc-reveal ${className}`}>
      {children}
    </section>
  );
}
