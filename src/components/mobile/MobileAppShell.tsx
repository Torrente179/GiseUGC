import { useEffect, useState } from 'react';
import MobileTabBar from '@/components/mobile/MobileTabBar';
import MobileContactSheet from '@/components/mobile/MobileContactSheet';
import {
  consumePendingContactDockAction,
  isMobileViewport,
  onContactDockAction,
} from '@/lib/contact-dock';

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
      <MobileTabBar contactOpen={contactOpen} onContact={() => setContactOpen(true)} hidden={contactOpen} />
      <MobileContactSheet open={contactOpen} onOpenChange={setContactOpen} />
    </>
  );
};

export default MobileAppShell;
