import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useTranslation } from 'react-i18next';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import { getLocaleFromPath, getServicePageRouteEntries } from '@/lib/locale-path';

const AppRoutes = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const locale = getLocaleFromPath(location.pathname);
    if (i18n.resolvedLanguage !== locale) {
      void i18n.changeLanguage(locale);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [i18n, location.pathname]);

  return (
    <Routes>
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
  );
};

const App = () => {
  return (
    <>
      <AppRoutes />
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
