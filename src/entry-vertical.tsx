import VerticalLandingPage from '@/components/VerticalLandingPage';
import {
  bootstrapApp,
  readEmbeddedRouteData,
} from '@/client-runtime';
import type { VerticalLandingRouteData } from '@/data/landing-route-types';

const routeData = readEmbeddedRouteData<VerticalLandingRouteData>();

bootstrapApp({
  VerticalLandingPage: (props) => (
    <VerticalLandingPage {...props} routeData={routeData} />
  ),
});
