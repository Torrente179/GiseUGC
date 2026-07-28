import ResourcePage from '@/components/ResourcePage';
import {
  bootstrapApp,
  readEmbeddedRouteData,
} from '@/client-runtime';
import type { ResourceLandingRouteData } from '@/data/landing-route-types';

const routeData = readEmbeddedRouteData<ResourceLandingRouteData>();

bootstrapApp({
  ResourcePage: (props) => <ResourcePage {...props} routeData={routeData} />,
});
