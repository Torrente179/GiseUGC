import { lazy, Suspense, useEffect, useState } from 'react';
import MobileTabBar from '@/components/mobile/MobileTabBar';
import {
  consumePendingContactDockAction,
  isMobileViewport,
  onContactDockAction,
} from '@/lib/contact-dock';

const MobileContactSheet = lazy(() => import('@/components/mobile/MobileContactSheet'));

/**
 * The mobile app shell: a persistent bottom tab bar + the contact bottom sheet,
 * mounted once site-wide (App gates it to mobile). Bridges the existing
 * contact-dock event so every "Contactar" CTA opens the contact sheet on mobile
 * (the desktop floating dock handles desktop).
 *
 * The secondary "more" menu remains the navbar's existing swipe-dismissable
 * overlay; converting that to a vaul sheet is a tracked follow-up.
 */
const MobileAppShell = () => {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const handle = () => {
      if (isMobileViewport()) setContactOpen(true);
      consumePendingContactDockAction();
    };
    const unsubscribe = onContactDockAction(handle);
    if (consumePendingContactDockAction()) handle();
    return unsubscribe;
  }, []);

  return (
    <>
      <MobileTabBar
        contactOpen={contactOpen}
        onContact={() => setContactOpen(true)}
        hidden={contactOpen}
      />
      {contactOpen ? (
        <Suspense fallback={null}>
          <MobileContactSheet open onOpenChange={setContactOpen} />
        </Suspense>
      ) : null}
    </>
  );
};

export default MobileAppShell;
