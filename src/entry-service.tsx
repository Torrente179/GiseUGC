import ServiceLandingPage from '@/components/ServiceLandingPage';
import {
  bootstrapApp,
  readEmbeddedRouteData,
} from '@/client-runtime';
import type { ServiceLandingRouteData } from '@/data/landing-route-types';

const routeData = readEmbeddedRouteData<ServiceLandingRouteData>();

bootstrapApp({
  ServiceLandingPage: (props) => (
    <ServiceLandingPage {...props} routeData={routeData} />
  ),
});
