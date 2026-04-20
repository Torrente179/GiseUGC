import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { Analytics, track } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useTranslation } from 'react-i18next';
import { LazyMotion, domAnimation } from 'framer-motion';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import VerticalLandingPage from '@/components/VerticalLandingPage';
import ResourcePage from '@/components/ResourcePage';
import LegalPage from '@/components/LegalPage';
import ThemeRuntimeSync from '@/components/ThemeRuntimeSync';
import {
  getLocaleFromPath,
  getLegalPageRouteEntries,
  getResourcePageRouteEntries,
  getServicePageRouteEntries,
  getVerticalPageRouteEntries,
  isHomePath,
  normalizePathname,
} from '@/lib/locale-path';
import { getChatGptReferralContext } from '@/lib/referral-attribution';
import { startMobileMediaPressureObserver } from '@/lib/perf-debug';
import { getLenis } from '@/lib/smooth-scroll';

// Persist scroll positions across SPA navigations, keyed by React Router location.key
const scrollPositions = new Map<string, number>();
let hasTrackedChatGptLanding = false;

// Track the latest scroll Y in real time so we can save it before leaving a page
let latestScrollY = 0;
window.addEventListener('scroll', () => { latestScrollY = window.scrollY; }, { passive: true });

// All route entries — computed once at module level
const serviceRouteEntries = getServicePageRouteEntries();
const verticalRouteEntries = getVerticalPageRouteEntries();
const resourceRouteEntries = getResourcePageRouteEntries();
const legalRouteEntries = getLegalPageRouteEntries();

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
  const [keepHomeMounted, setKeepHomeMounted] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(max-width: 767px)').matches;
  });

  const onHome = isHomePath(location.pathname);
  const locale = getLocaleFromPath(location.pathname);

  // Find the matching service route entry for the current URL (null when on home/404)
  const currentServiceEntry = useMemo(() => {
    if (onHome) return null;
    const normalized = normalizePathname(location.pathname);
    return serviceRouteEntries.find(e => normalizePathname(e.path) === normalized) ?? null;
  }, [location.pathname, onHome]);

  const currentVerticalEntry = useMemo(() => {
    if (onHome) return null;
    const normalized = normalizePathname(location.pathname);
    return verticalRouteEntries.find(e => normalizePathname(e.path) === normalized) ?? null;
  }, [location.pathname, onHome]);

  const currentResourceEntry = useMemo(() => {
    if (onHome) return null;
    const normalized = normalizePathname(location.pathname);
    return resourceRouteEntries.find(e => normalizePathname(e.path) === normalized) ?? null;
  }, [location.pathname, onHome]);

  const currentLegalEntry = useMemo(() => {
    if (onHome) return null;
    const normalized = normalizePathname(location.pathname);
    return legalRouteEntries.find((entry) => normalizePathname(entry.path) === normalized) ?? null;
  }, [location.pathname, onHome]);

  const isKnownRoute = onHome || currentServiceEntry !== null || currentVerticalEntry !== null || currentResourceEntry !== null || currentLegalEntry !== null;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const syncKeepHomeMounted = () => setKeepHomeMounted(!mediaQuery.matches);

    syncKeepHomeMounted();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncKeepHomeMounted);
      return () => mediaQuery.removeEventListener('change', syncKeepHomeMounted);
    }

    mediaQuery.addListener(syncKeepHomeMounted);
    return () => mediaQuery.removeListener(syncKeepHomeMounted);
  }, []);

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
      // Browser back / forward — restore exact saved scroll position.
      // Two rAF hops let the browser finish layout (especially display:none→block
      // for the homepage) before we set scroll, preventing the main-thread freeze
      // on mobile where layout and scroll restoration would otherwise compete.
      const savedY = scrollPositions.get(location.key) ?? 0;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          jumpToY(savedY);
        });
      });
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
        Keep home mounted on desktop for instant returns.
        On mobile, unmount it off-route so hidden video-heavy sections do not
        keep consuming media resources while browsing service pages.
      */}
      {keepHomeMounted ? (
        <div
          style={{ display: onHome ? 'block' : 'none' }}
          aria-hidden={!onHome ? true : undefined}
        >
          <Index locale={locale} />
        </div>
      ) : (
        onHome ? <Index locale={locale} /> : null
      )}

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

      {currentVerticalEntry && (
        <div key={location.pathname} className="page-enter">
          <VerticalLandingPage
            verticalId={currentVerticalEntry.verticalId}
            locale={currentVerticalEntry.locale}
          />
        </div>
      )}

      {currentResourceEntry && (
        <div key={location.pathname} className="page-enter">
          <ResourcePage
            resourceId={currentResourceEntry.resourceId}
            locale={currentResourceEntry.locale}
          />
        </div>
      )}

      {currentLegalEntry && (
        <div key={location.pathname} className="page-enter">
          <LegalPage
            pageId={currentLegalEntry.pageId}
            locale={currentLegalEntry.locale}
          />
        </div>
      )}

      {!isKnownRoute && <NotFound />}
    </>
  );
};

const App = () => {
  useEffect(() => {
    const stopMobileMediaObserver = startMobileMediaPressureObserver();
    return () => stopMobileMediaObserver?.();
  }, []);

  useEffect(() => {
    if (hasTrackedChatGptLanding) return;

    const referral = getChatGptReferralContext(window.location.href, document.referrer);
    if (!referral) return;

    let attempts = 0;

    const sendChatGptLandingEvent = () => {
      const va = (window as Window & { va?: (...args: unknown[]) => void }).va;
      if (typeof va === 'function') {
        track('ChatGPT Referral Landing', referral);
        hasTrackedChatGptLanding = true;
        return;
      }

      attempts += 1;
      if (attempts < 10) {
        window.setTimeout(sendChatGptLandingEvent, 150);
      }
    };

    window.setTimeout(sendChatGptLandingEvent, 0);
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <ThemeRuntimeSync />
      <AppRoutes />
      <Analytics />
      <SpeedInsights />
    </LazyMotion>
  );
};

export default App;
