import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useTranslation } from 'react-i18next';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import ThemeRuntimeSync from '@/components/ThemeRuntimeSync';
import { getLocaleFromPath, getServicePageRouteEntries } from '@/lib/locale-path';
import { getLenis } from '@/lib/smooth-scroll';

// Persist scroll positions across SPA navigations, keyed by React Router location.key
const scrollPositions = new Map<string, number>();

// Track the latest scroll Y in real time so we can save it before leaving a page
let latestScrollY = 0;
window.addEventListener('scroll', () => { latestScrollY = window.scrollY; }, { passive: true });

// Scroll to a Y position, using Lenis when available for immediate (non-animated) jumps
const jumpToY = (y: number) => {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo({ top: y, left: 0, behavior: 'auto' });
  }
};

// Smooth-scroll to a section element, retrying until it appears in the DOM
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
    // Clear the hash from the URL without triggering a navigation
    const cleanPath = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', cleanPath);
    return;
  }
  // Retry: some sections are lazily mounted and may not be in the DOM yet
  if (attempts < 15) {
    setTimeout(() => scrollToSection(sectionId, attempts + 1), 80);
  }
};

const AppRoutes = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { i18n } = useTranslation();
  const prevLocationKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Sync locale with the current path
    const locale = getLocaleFromPath(location.pathname);
    if (i18n.resolvedLanguage !== locale) {
      void i18n.changeLanguage(locale);
    }

    // Save the scroll position of the page we're leaving
    if (prevLocationKeyRef.current !== null && prevLocationKeyRef.current !== location.key) {
      scrollPositions.set(prevLocationKeyRef.current, latestScrollY);
    }
    prevLocationKeyRef.current = location.key;

    if (navigationType === 'POP') {
      // Browser back / forward — restore exact scroll position
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
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } }}
        style={{ willChange: 'opacity' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/en" element={<Index />} />
          {getServicePageRouteEntries().map((routeEntry) => (
            <Route
              key={routeEntry.path}
              path={routeEntry.path}
              element={<ServiceLandingPage serviceId={routeEntry.serviceId} locale={routeEntry.locale} />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
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
