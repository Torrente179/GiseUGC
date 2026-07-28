import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import ThemeRuntimeSync from '@/components/ThemeRuntimeSync';
import { useIsMobile } from '@/hooks/use-mobile';
import ErrorBoundary from '@/components/ErrorBoundary';
import { MediaSessionProvider } from '@/components/media/MediaSessionProvider';

import {
  type LegalPageId,
  type ResourcePageId,
  type ServicePageId,
  type SiteLocale,
  type VerticalPageId,
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
import { scrollToY } from '@/lib/motion/native-scroll';

const MobileAppShell = lazy(() => import('@/components/mobile/MobileAppShell'));

// Persist scroll positions across SPA navigations, keyed by React Router location.key
const scrollPositions = new Map<string, number>();
let hasTrackedChatGptLanding = false;

// Track the latest scroll Y in real time so we can save it before leaving a page
let latestScrollY = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => { latestScrollY = window.scrollY; }, { passive: true });
}

const DeferredEditorialFonts = () => {
  useEffect(() => {
    let cancelled = false;
    let started = false;
    const load = () => {
      if (started || cancelled) return;
      started = true;

      if (typeof FontFace === 'undefined') {
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = '/fonts/editorial-fonts.css';
        stylesheet.dataset.editorialFonts = 'true';
        document.head.appendChild(stylesheet);
        return;
      }

      const faces = [
        new FontFace(
          'Cormorant Garamond',
          "url('/fonts/cormorant-garamond-latin-var.woff2') format('woff2')",
          { style: 'normal', weight: '300 700', display: 'swap' },
        ),
        new FontFace(
          'Cormorant Garamond',
          "url('/fonts/cormorant-garamond-latin-italic-var.woff2') format('woff2')",
          { style: 'italic', weight: '300 700', display: 'swap' },
        ),
      ];
      void Promise.all(faces.map((face) => face.load())).then((loadedFaces) => {
        if (cancelled) return;
        loadedFaces.forEach((face) => document.fonts.add(face));
      });
    };

    const intentEvents: Array<keyof WindowEventMap> = [
      'pointermove',
      'pointerdown',
      'touchstart',
      'keydown',
    ];
    intentEvents.forEach((eventName) => {
      window.addEventListener(eventName, load, { once: true, passive: true });
    });
    const fallbackTimer = window.setTimeout(load, 8000);
    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      intentEvents.forEach((eventName) => window.removeEventListener(eventName, load));
    };
  }, []);

  return null;
};

const ClientInsights = () => {
  const [insights, setInsights] = useState<{
    Analytics: ComponentType;
    SpeedInsights: ComponentType;
  } | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return;

    let cancelled = false;
    const enable = () => {
      void Promise.all([
        import('@vercel/analytics/react'),
        import('@vercel/speed-insights/react'),
      ]).then(([analyticsModule, speedInsightsModule]) => {
        if (cancelled) return;
        setInsights({
          Analytics: analyticsModule.Analytics,
          SpeedInsights: speedInsightsModule.SpeedInsights,
        });
      });
    };
    const intentEvents: Array<keyof WindowEventMap> = [
      'pointerdown',
      'touchstart',
      'keydown',
      'scroll',
    ];
    intentEvents.forEach((eventName) => {
      window.addEventListener(eventName, enable, { once: true, passive: true });
    });
    const fallbackTimer = window.setTimeout(enable, 30_000);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      intentEvents.forEach((eventName) => window.removeEventListener(eventName, enable));
    };
  }, []);

  if (!insights) return null;
  const { Analytics, SpeedInsights } = insights;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

// All route entries — computed once at module level
const serviceRouteEntries = getServicePageRouteEntries();
const verticalRouteEntries = getVerticalPageRouteEntries();
const resourceRouteEntries = getResourcePageRouteEntries();
const legalRouteEntries = getLegalPageRouteEntries();

export type AppRouteComponents = {
  Index?: ComponentType<{ locale: SiteLocale }>;
  NotFound?: ComponentType;
  ServiceLandingPage?: ComponentType<{ serviceId: ServicePageId; locale: SiteLocale }>;
  VerticalLandingPage?: ComponentType<{ verticalId: VerticalPageId; locale: SiteLocale }>;
  ResourcePage?: ComponentType<{ resourceId: ResourcePageId; locale: SiteLocale }>;
  LegalPage?: ComponentType<{ pageId: LegalPageId; locale: SiteLocale }>;
};

// Scroll to a Y position immediately (non-animated jump)
const jumpToY = (y: number) => {
  scrollToY(y, { immediate: true });
};

// Smooth-scroll to a section element by ID, retrying until it appears in the DOM.
// Required because some sections are lazily mounted and may not exist yet.
const scrollToSection = (sectionId: string, attempts = 0) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - 80;
    scrollToY(Math.max(0, y));
    // Clear the hash from the URL without triggering a React Router navigation
    const cleanPath = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', cleanPath);
    return;
  }
  if (attempts < 15) {
    setTimeout(() => scrollToSection(sectionId, attempts + 1), 80);
  }
};

const AppRoutes = ({ routeComponents }: { routeComponents: AppRouteComponents }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevLocationKeyRef = useRef<string | null>(null);
  const onHome = isHomePath(location.pathname);
  const locale = getLocaleFromPath(location.pathname);
  const isMobile = useIsMobile();

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
  const {
    Index,
    NotFound,
    ServiceLandingPage,
    VerticalLandingPage,
    ResourcePage,
    LegalPage,
  } = routeComponents;

  useEffect(() => {
    // Save the scroll position of the page we're leaving before updating the ref
    if (prevLocationKeyRef.current !== null && prevLocationKeyRef.current !== location.key) {
      scrollPositions.set(prevLocationKeyRef.current, latestScrollY);
    }
    prevLocationKeyRef.current = location.key;

    if (navigationType === 'POP') {
      // Browser back / forward — restore exact saved scroll position.
      // Two rAF hops let the browser finish route layout before restoring scroll,
      // preventing main-thread contention on media-heavy pages.
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
  }, [location, navigationType]);

  return (
    <>
      {/* Unmount home off-route so hidden video-heavy sections release media resources.
          Keyed by locale so the route cross-fade fires on navigation/locale change,
          not on in-page section scrolling. */}
      {onHome && Index ? (
        <div key={`home-${locale}`} className="page-enter">
          <Index locale={locale} />
        </div>
      ) : null}

      {/*
        Service pages mount on first visit and unmount when navigating away.
        A new key per pathname ensures a fresh instance for each service URL.
        The wrapper remains immediately paintable; each page owns its finer
        compositor-only entrance choreography.
      */}
      {currentServiceEntry && ServiceLandingPage && (
          <div key={location.pathname} className="page-enter">
            <ServiceLandingPage
              serviceId={currentServiceEntry.serviceId}
              locale={currentServiceEntry.locale}
            />
          </div>
      )}

      {currentVerticalEntry && VerticalLandingPage && (
          <div key={location.pathname} className="page-enter">
            <VerticalLandingPage
              verticalId={currentVerticalEntry.verticalId}
              locale={currentVerticalEntry.locale}
            />
          </div>
      )}

      {currentResourceEntry && ResourcePage && (
          <div key={location.pathname} className="page-enter">
            <ResourcePage
              resourceId={currentResourceEntry.resourceId}
              locale={currentResourceEntry.locale}
            />
          </div>
      )}

      {currentLegalEntry && LegalPage && (
          <div key={location.pathname} className="page-enter">
            <LegalPage
              pageId={currentLegalEntry.pageId}
              locale={currentLegalEntry.locale}
            />
          </div>
      )}

      {!isKnownRoute && NotFound && <NotFound />}

      {/* App-like mobile chrome: bottom tab bar + contact/menu sheets, site-wide */}
      {isMobile ? (
        <Suspense fallback={null}>
          <MobileAppShell />
        </Suspense>
      ) : null}
    </>
  );
};

const App = ({ routeComponents = {} }: { routeComponents?: AppRouteComponents }) => {
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
        va('event', 'ChatGPT Referral Landing', referral);
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
    <MediaSessionProvider>
      <ThemeRuntimeSync />
      <DeferredEditorialFonts />
      <ErrorBoundary section="app">
        <AppRoutes routeComponents={routeComponents} />
      </ErrorBoundary>
      <ClientInsights />
    </MediaSessionProvider>
  );
};

export default App;
