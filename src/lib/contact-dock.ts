type ContactDockAction = 'open' | 'toggle';

const CONTACT_DOCK_ACTION_EVENT = 'ugc:contact-dock-action';
const CONTACT_DOCK_PENDING_ATTR = 'data-contact-dock-pending-action';

const dispatchContactDockAction = (action: ContactDockAction) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  document.body.setAttribute(CONTACT_DOCK_PENDING_ATTR, action);
  window.dispatchEvent(
    new CustomEvent<ContactDockAction>(CONTACT_DOCK_ACTION_EVENT, {
      detail: action,
    }),
  );
};

export const openContactDock = () => {
  dispatchContactDockAction('open');
};

export const toggleContactDock = () => {
  dispatchContactDockAction('toggle');
};

// Mounted contact surfaces: the desktop FloatingContactDock and the mobile app
// shell's contact sheet. Routes without one (legal pages on desktop) fall back
// to scrolling to the page-end strip.
let listenerCount = 0;

export const hasContactDockListener = () => listenerCount > 0;

export const onContactDockAction = (callback: (action: ContactDockAction) => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleAction = (event: Event) => {
    const customEvent = event as CustomEvent<ContactDockAction>;
    callback(customEvent.detail ?? 'open');
  };
  window.addEventListener(CONTACT_DOCK_ACTION_EVENT, handleAction);
  listenerCount += 1;

  return () => {
    window.removeEventListener(CONTACT_DOCK_ACTION_EVENT, handleAction);
    listenerCount -= 1;
  };
};

export const consumePendingContactDockAction = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  const pendingAction = document.body.getAttribute(CONTACT_DOCK_PENDING_ATTR) as ContactDockAction | null;
  if (pendingAction === 'open' || pendingAction === 'toggle') {
    document.body.removeAttribute(CONTACT_DOCK_PENDING_ATTR);
    return pendingAction;
  }

  return null;
};

export const isMobileViewport = () =>
  typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false;
