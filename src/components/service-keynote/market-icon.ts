/**
 * The icon on each "Mercados y formatos" glass tile (mobile). The three lines
 * are free copy per service and locale, so the icon follows what a line says,
 * checked in this order (the first match wins):
 *   globe:    where the brands are (a country or region is named)
 *   audience: who watches ("Público que…", "Cold audiences…")
 *   target:   campaigns ("Campañas…", "Campaigns…", "Conversion…")
 *   layers:   what it is ordered with ("junto con", "together with")
 *   voice:    talking to camera
 *   social:   content for social feeds
 *   video:    the video itself ("Video vertical…", "Testimoniales…", "B-roll…", "Anuncios…")
 *   page:     where the videos get reused (product pages, landing pages, web, email)
 * market-icon.test.ts checks that no page shows the same icon twice.
 */
export type MarketIconKind = 'globe' | 'audience' | 'target' | 'layers' | 'voice' | 'social' | 'video' | 'page';

const RULES: Array<[MarketIconKind, RegExp]> = [
  ['globe', /Estados Unidos|España|Latinoam|Oceanía|Australia|\bthe US\b|\bUS,|\bSpain\b|Latin America|Oceania/u],
  ['audience', /^(Público que|Cold audiences)/u],
  ['target', /^(Campañas|Campaigns|Conversion)/u],
  ['layers', /junto con|together with/iu],
  ['voice', /hablando a cámara|talking-to-camera/iu],
  ['social', /^(Contenido para redes|Social content)/u],
  ['video', /^(Video\s|Vertical video|Testimoniales|Video testimonials|B-roll|Lanzamientos|Launches|Anuncios|Educational)/u],
  ['page', /página|page|web|email|landing/iu],
];

const BY_POSITION: MarketIconKind[] = ['globe', 'video', 'page'];

export const marketIconFor = (line: string, index: number): MarketIconKind =>
  RULES.find(([, pattern]) => pattern.test(line))?.[0] ?? BY_POSITION[index] ?? 'video';
