import type { HubPageId, SiteLocale } from '@/lib/locale-path';

/**
 * Short name of each hub index (/servicios/, /verticales/, /recursos/ and EN twins).
 * One source for every link that names a hub: the hub's own breadcrumb, the middle
 * breadcrumb on its child pages (visible trail and BreadcrumbList JSON-LD), and the
 * hub rail in the page-end strip. Kept apart from hub-pages.ts so sitewide chrome
 * can import it without pulling in the hub copy.
 */
export const HUB_LABELS: Record<HubPageId, Record<SiteLocale, string>> = {
  services: { es: 'Servicios', en: 'Services' },
  verticals: { es: 'Industrias', en: 'Industries' },
  resources: { es: 'Recursos', en: 'Resources' },
};
