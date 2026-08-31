import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ThemeProvider } from 'next-themes';
import App, { type AppRouteComponents } from '@/App';
import { LocaleProvider } from '@/lib/locale-context';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import VerticalLandingPage from '@/components/VerticalLandingPage';
import ResourcePage from '@/components/ResourcePage';
import LegalPage from '@/components/LegalPage';
import HubPage from '@/components/HubPage';
import {
  buildResourceLandingRouteData,
  buildServiceLandingRouteData,
  buildVerticalLandingRouteData,
} from '@/data/landing-route-data.server';
import type {
  ServicePageId,
  ResourcePageId,
  SiteLocale,
  VerticalPageId,
} from '@/lib/locale-path';

const ServerResourcePage = ({
  resourceId,
  locale,
}: {
  resourceId: ResourcePageId;
  locale: SiteLocale;
}) => (
  <ResourcePage
    resourceId={resourceId}
    locale={locale}
    routeData={buildResourceLandingRouteData(resourceId, locale)}
  />
);

const ServerServiceLandingPage = ({
  serviceId,
  locale,
}: {
  serviceId: ServicePageId;
  locale: SiteLocale;
}) => (
  <ServiceLandingPage
    serviceId={serviceId}
    locale={locale}
    routeData={buildServiceLandingRouteData(serviceId, locale)}
  />
);

const ServerVerticalLandingPage = ({
  verticalId,
  locale,
}: {
  verticalId: VerticalPageId;
  locale: SiteLocale;
}) => (
  <VerticalLandingPage
    verticalId={verticalId}
    locale={locale}
    routeData={buildVerticalLandingRouteData(verticalId, locale)}
  />
);

const routeComponents: AppRouteComponents = {
  Index,
  NotFound,
  HubPage,
  ServiceLandingPage: ServerServiceLandingPage,
  VerticalLandingPage: ServerVerticalLandingPage,
  ResourcePage: ServerResourcePage,
  LegalPage,
};

export const render = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    let settled = false;
    const output = new PassThrough();
    const chunks: Buffer[] = [];

    output.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    output.on('end', () => {
      settled = true;
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    output.on('error', reject);

    const stream = renderToPipeableStream(
      <StaticRouter location={url}>
        <LocaleProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <App routeComponents={routeComponents} />
          </ThemeProvider>
        </LocaleProvider>
      </StaticRouter>,
      {
        onAllReady() {
          stream.pipe(output);
        },
        onShellError(error) {
          if (!settled) reject(error);
        },
        onError(error) {
          console.error(error);
        },
      },
    );
  });
