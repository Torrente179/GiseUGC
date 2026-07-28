import { lazy, Suspense } from 'react';
import SectionSkeleton from '@/components/motion/SectionSkeleton';
import { useDeferredMount } from '@/hooks/use-deferred-mount';

const ServicesMarquee = lazy(() => import('@/components/ServicesMarquee'));

type DeferredServicesMarqueeProps = {
  liteMobile?: boolean;
  sectionId?: string;
};

/**
 * The toolkit rail is intentionally below the route's primary content. Keep
 * its 36-card desktop loop out of prerender/hydration and mount it only when
 * the visitor approaches it. The visual experience is unchanged once visible.
 */
const DeferredServicesMarquee = ({
  liteMobile = false,
  sectionId,
}: DeferredServicesMarqueeProps) => {
  const { shouldMount, placeholderRef } = useDeferredMount({
    enabled: true,
    mountId: `template-marquee-${sectionId ?? 'default'}`,
    rootMargin: '700px 0px',
    queueDelayMs: 80,
  });
  const skeleton = (
    <SectionSkeleton
      id={sectionId}
      minHeightClass="min-h-[520px]"
      variant="cards"
    />
  );

  if (!shouldMount) {
    return <div ref={placeholderRef}>{skeleton}</div>;
  }

  return (
    <Suspense fallback={skeleton}>
      <ServicesMarquee sectionId={sectionId} liteMobile={liteMobile} />
    </Suspense>
  );
};

export default DeferredServicesMarquee;
