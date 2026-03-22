import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useTranslation } from 'react-i18next';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import ThemeRuntimeSync from '@/components/ThemeRuntimeSync';
import {
  getLocaleFromPath,
  getServicePageRouteEntries,
  isHomePath,
  normalizePathname,
} from '@/lib/locale-path';
import { getLenis } from '@/lib/smooth-scroll';

// Persist scroll positions across SPA navigations, keyed by React Router location.key
const scrollPositions = new Map<string, number>();

// Track the latest scroll Y in real time so we can save it before leaving a page
let latestScrollY = 0;
window.addEventListener('scroll', () => { latestScrollY = window.scrollY; }, { passive: true });

// All service route entries — computed once at module level
const serviceRouteEntries = getServicePageRouteEntries();

// Scroll to a Y position, using Lenis when available for an immediate (non-animated) jump
const jumpToY = (y: number) => {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo({ top: y, left: 0, behavior: 'auto' });
  }
};

// Smooth-scroll to a section element by ID, retrying until it appears in the DOM.
// Required because some sections are lazily mounted and may not exist yet.
const scrollToSection = (sectionId: string, attempts = 0) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(element, { duration: 0.75, offset: -80 });
    } else {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, y), left: 0, behavior: 'smooth' });
    }
    // Clear the hash from the URL without triggering a React Router navigation
    const cleanPath = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', cleanPath);
    return;
  }
  if (attempts < 15) {
    setTimeout(() => scrollToSection(sectionId, attempts + 1), 80);
  }
};

const AppRoutes = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { i18n } = useTranslation();
  const prevLocationKeyRef = useRef<string | null>(null);

  const onHome = isHomePath(location.pathname);

  // Find the matching service route entry for the current URL (null when on home/404)
  const currentServiceEntry = useMemo(() => {
    if (onHome) return null;
    const normalized = normalizePathname(location.pathname);
    return serviceRouteEntries.find(e => normalizePathname(e.path) === normalized) ?? null;
  }, [location.pathname, onHome]);

  const isKnownRoute = onHome || currentServiceEntry !== null;

  useEffect(() => {
    // Keep locale in sync with the current path
    const locale = getLocaleFromPath(location.pathname);
    if (i18n.resolvedLanguage !== locale) {
      void i18n.changeLanguage(locale);
    }

    // Save the scroll position of the page we're leaving before updating the ref
    if (prevLocationKeyRef.current !== null && prevLocationKeyRef.current !== location.key) {
      scrollPositions.set(prevLocationKeyRef.current, latestScrollY);
    }
    prevLocationKeyRef.current = location.key;

    if (navigationType === 'POP') {
      // Browser back / forward — restore exact saved scroll position
      const savedY = scrollPositions.get(location.key) ?? 0;
      jumpToY(savedY);
    } else if (location.hash) {
      // Navigating to a hash section (e.g. /#services from a service page)
      jumpToY(0);
      requestAnimationFrame(() => scrollToSection(location.hash.slice(1)));
    } else {
      // Normal forward navigation — start at the top
      jumpToY(0);
    }
  }, [i18n, location, navigationType]);

  return (
    <>
      {/*
        Index is kept mounted for the entire session and never unmounts.
        CSS display:none hides it when on other pages, which preserves all
        React state: hero video position, animation states, deferred section
        mounts, scroll position — so returning to the homepage is instant
        with zero re-render cascade and zero skeleton flash.
      */}
      <div
        style={{ display: onHome ? 'block' : 'none' }}
        aria-hidden={!onHome ? true : undefined}
      >
        <Index />
      </div>

      {/*
        Service pages mount on first visit and unmount when navigating away.
        A new key per pathname ensures a fresh instance for each service URL.
        The wrapper carries a CSS fade-in so the page appears smoothly.
      */}
      {currentServiceEntry && (
        <div key={location.pathname} className="page-enter">
          <ServiceLandingPage
            serviceId={currentServiceEntry.serviceId}
            locale={currentServiceEntry.locale}
          />
        </div>
      )}

      {!isKnownRoute && <NotFound />}
    </>
  );
};

const App = () => {
  return (
    <>
      <ThemeRuntimeSync />
      <AppRoutes />
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
