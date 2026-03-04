const OPEN_CONTACT_DOCK_EVENT = 'ugc:open-contact-dock';
const CONTACT_DOCK_PENDING_ATTR = 'data-contact-dock-open-pending';

export const openContactDock = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  document.body.setAttribute(CONTACT_DOCK_PENDING_ATTR, 'true');
  window.dispatchEvent(new Event(OPEN_CONTACT_DOCK_EVENT));
};

export const onOpenContactDock = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleOpen = () => callback();
  window.addEventListener(OPEN_CONTACT_DOCK_EVENT, handleOpen);

  return () => {
    window.removeEventListener(OPEN_CONTACT_DOCK_EVENT, handleOpen);
  };
};

export const consumePendingContactDockOpen = () => {
  if (typeof document === 'undefined') {
    return false;
  }

  const hasPendingRequest = document.body.getAttribute(CONTACT_DOCK_PENDING_ATTR) === 'true';
  if (hasPendingRequest) {
    document.body.removeAttribute(CONTACT_DOCK_PENDING_ATTR);
  }

  return hasPendingRequest;
};

export const isMobileViewport = () =>
  typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false;
