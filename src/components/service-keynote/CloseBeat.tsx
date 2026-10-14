import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  ChevronRight,
  Clapperboard,
  Cpu,
  Heart,
  Info,
  Languages,
  LayoutGrid,
  Lightbulb,
  Megaphone,
  MessageSquare,
  Mic,
  Play,
  Repeat,
  ShoppingBag,
  Shirt,
  Sparkles,
  Sun,
  CirclePlay,
  CircleDollarSign,
  type LucideIcon,
} from 'lucide-react';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import type { ServiceLandingRouteData } from '@/data/landing-route-types';
import {
  getResourcePath,
  getServicePath,
  getVerticalPath,
  type ServicePageId,
  type VerticalPageId,
  type ResourcePageId,
} from '@/lib/locale-path';
import { getClipById } from '@/lib/service-clips';
import ContactChoice from './ContactChoice';
import { KEYNOTE_LABELS } from './labels';
import { useRail } from './hooks';
import KnPhone from './KnPhone';
import SegmentedControl from './SegmentedControl';
import type { KeynoteBeatProps, KeynoteLabelProps, KeynoteResourceLink } from './types';

type CloseBeatProps = KeynoteBeatProps & {
  labels: KeynoteLabelProps;
  updated: string;
  relevantVerticals: ServiceLandingRouteData['relevantVerticals'];
  resourceLinks: KeynoteResourceLink[];
  relatedPages: ServiceLandingRouteData['relatedPages'];
  allOtherServices: ServiceLandingRouteData['allOtherServices'];
};

const pad = (value: number) => String(value).padStart(2, '0');

const VERTICAL_ICON: Record<VerticalPageId, LucideIcon> = {
  'beauty-ugc': Sparkles,
  'fashion-ugc': Shirt,
  'tech-saas-ugc': Cpu,
  'ecommerce-ugc': ShoppingBag,
  'lifestyle-wellness-ugc': Heart,
};

const RESOURCE_ICON: Record<ResourcePageId, LucideIcon> = {
  'what-is-ugc': Info,
  'how-to-hire-ugc-creator': Briefcase,
  'how-much-ugc-creator-charge': CircleDollarSign,
  'ugc-vs-influencer-marketing': Repeat,
  'ugc-ad-formats-guide': LayoutGrid,
};

const SERVICE_ICON: Record<ServicePageId, LucideIcon> = {
  'bilingual-ugc-creator': Languages,
  'spokesperson-videos': Mic,
  'ugc-ads-tiktok-meta': Megaphone,
  'ugc-testimonials-reviews': MessageSquare,
  'ugc-product-demo': CirclePlay,
  'ugc-problem-solution': Lightbulb,
  'ugc-lifestyle': Sun,
  'ugc-broll-footage': Clapperboard,
};

type ExploreItem = { key: string; href: string; title: string; Icon: LucideIcon };
type ExploreColumn = { key: string; label: string; items: ExploreItem[] };

/** The three link lists. A service already shown as an "Also offered" tile is not listed again. */
const buildExploreColumns = ({
  labels,
  locale,
  relevantVerticals,
  resourceLinks,
  allOtherServices,
  alsoOfferedIds,
}: Pick<CloseBeatProps, 'labels' | 'relevantVerticals' | 'resourceLinks' | 'allOtherServices'> & {
  locale: KeynoteBeatProps['locale'];
  alsoOfferedIds: ServicePageId[];
}): ExploreColumn[] => {
  const columns: (ExploreColumn | false)[] = [
    relevantVerticals.length > 0 && {
      key: 'industry',
      label: labels.byIndustry,
      items: relevantVerticals.map((vertical) => ({
        key: vertical.id,
        href: getVerticalPath(vertical.id, locale),
        title: vertical.navLabel,
        Icon: VERTICAL_ICON[vertical.id],
      })),
    },
    resourceLinks.length > 0 && {
      key: 'resources',
      label: labels.resources,
      items: resourceLinks.map((resource) => ({
        key: resource.id,
        href: getResourcePath(resource.id, locale),
        title: resource.label,
        Icon: RESOURCE_ICON[resource.id],
      })),
    },
    (() => {
      const services = allOtherServices.filter((service) => !alsoOfferedIds.includes(service.id));
      return (
        services.length > 0 && {
          key: 'services',
          label: labels.moreServices,
          items: services.map((service) => ({
            key: service.id,
            href: getServicePath(service.id, locale),
            title: service.navLabel,
            Icon: SERVICE_ICON[service.id],
          })),
        }
      );
    })(),
  ];
  return columns.filter((column): column is ExploreColumn => Boolean(column));
};

type FanSlot = 'left' | 'center' | 'right';

const FAN_CLASS: Record<FanSlot, string> = {
  left: 'knc-fan-phone knc-fan-phone--l',
  center: 'knc-fan-phone knc-fan-phone--c',
  right: 'knc-fan-phone knc-fan-phone--r',
};

/** The close's phone fan: the page's own three featured clips, left to right, with counters. */
const PhoneFan = ({
  page,
  locale,
  shellQuery,
  isMobile,
}: {
  page: KeynoteBeatProps['page'];
  locale: KeynoteBeatProps['locale'];
  shellQuery: string;
  isMobile: boolean;
}) => {
  const labels = KEYNOTE_LABELS[locale];
  const examples = page.featuredExamples
    .slice(0, 3)
    .flatMap((example) => {
      const clip = getClipById(example.clipId);
      return clip ? [{ example, clip }] : [];
    });
  // The lead clip is the page's strongest, so it takes the centre; the other two flank it.
  const slots: FanSlot[] = ['center', 'left', 'right'];

  return (
    <div className="knc-stage" aria-hidden="true">
      <div className="knc-spot" />
      <div className="knc-floor" />
      {examples.map(({ example, clip }, index) => (
        <KnPhone key={clip.id} className={FAN_CLASS[slots[index]]}>
          <ResponsivePosterImage
            clip={clip}
            className="knc-poster"
            alt=""
            sizes={isMobile ? '214px' : '312px'}
            media={shellQuery}
          />
          <span className="knc-shade" />
          <span className="knc-cap">
            <b>
              <Play fill="currentColor" strokeWidth={0} />
              <span>{example.title}</span>
            </b>
            <span>{labels.featuredCounter(index + 1, examples.length)}</span>
          </span>
        </KnPhone>
      ))}
    </div>
  );
};

/** 6 · Get started: the headline, the CTA, the fan of her work, then where else to go. */
const CloseBeat = ({
  page,
  locale,
  variant,
  kicker,
  titleId,
  labels,
  updated,
  relevantVerticals,
  resourceLinks,
  relatedPages,
  allOtherServices,
}: CloseBeatProps) => {
  const isMobile = variant === 'mobile';
  const copy = KEYNOTE_LABELS[locale];
  const shellQuery = isMobile ? '(max-width: 767px)' : '(min-width: 768px)';
  const [tab, setTab] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const related = page.relatedServiceIds.flatMap((relatedId, index) => {
    const summary = relatedPages[index];
    if (!summary) return [];
    return [{ id: relatedId, summary, clip: getClipById(summary.leadClipId) }];
  });
  const { index: railIndex } = useRail(railRef, related.length);

  const exploreColumns = buildExploreColumns({
    labels,
    locale,
    relevantVerticals,
    resourceLinks,
    allOtherServices,
    alsoOfferedIds: related.map((item) => item.id),
  });
  const exploreTotal = exploreColumns.reduce((sum, column) => sum + column.items.length, 0);

  // The CTA opens the same "Escríbeme" choice as the rest of the site (WhatsApp, Telegram),
  // with the service named in the message. Without scripts it is still a link to the footer's contact block.
  const cta = (
    <ContactChoice page={page}>
      {(trigger) => (
        <a {...trigger} className="knc-cta">
          {page.primaryCtaLabel}
          <i>
            <ArrowRight aria-hidden="true" />
          </i>
        </a>
      )}
    </ContactChoice>
  );

  const tile = (item: (typeof related)[number]) => (
    <Link key={item.id} to={getServicePath(item.id, locale)} className="knc-tile">
      {item.clip ? (
        <ResponsivePosterImage
          clip={item.clip}
          className="knc-tile-img"
          alt=""
          sizes={isMobile ? '262px' : '300px'}
          media={shellQuery}
        />
      ) : null}
      <span className="knc-tile-t">{item.summary.title}</span>
      <span className="knc-tile-a" aria-hidden="true">
        <ArrowRight />
      </span>
    </Link>
  );

  return (
    <div className="knc">
      <div className="knc-orb knc-orb--a" aria-hidden="true" />
      <div className="knc-orb knc-orb--b" aria-hidden="true" />

      <div className="knc-wrap">
        {isMobile ? (
          <>
            <p className="knc-pill">
              <span className="knc-dot" />
              {kicker}
            </p>
            <h2 id={titleId} className="knc-title section-label">
              {page.ctaTitle}
            </h2>
            <PhoneFan page={page} locale={locale} shellQuery={shellQuery} isMobile />
            <p className="knc-lead">{page.ctaText}</p>
            {cta}
            <p className="knc-updated">{updated}</p>

            {related.length > 0 ? (
              <section className="knc-sec" aria-label={labels.alsoOffered}>
                <div className="knc-head">
                  <p className="knc-label">{labels.alsoOffered}</p>
                  <span className="knc-count">{copy.alsoOfferedCount(railIndex + 1, related.length)}</span>
                </div>
                <div className="knc-rail" ref={railRef}>
                  {related.map(tile)}
                </div>
                <div className="knc-dots" aria-hidden="true">
                  {related.map((item, index) => (
                    <i key={item.id} className={index === railIndex ? 'is-on' : undefined} />
                  ))}
                </div>
              </section>
            ) : null}

            {exploreColumns.length > 0 ? (
              <nav className="knc-sec" aria-label={labels.explore}>
                <div className="knc-head">
                  <p className="knc-label">{labels.explore}</p>
                  <span className="knc-count">{copy.explorePages(exploreTotal)}</span>
                </div>
                <SegmentedControl
                  className="knc-seg"
                  ariaLabel={labels.explore}
                  idPrefix="kn-explore-m"
                  items={exploreColumns.map((column) => ({ id: column.key, label: column.label }))}
                  value={tab}
                  onChange={setTab}
                />
                {exploreColumns.map((column, index) => (
                  <div
                    key={column.key}
                    id={`kn-explore-m-panel-${index}`}
                    role="tabpanel"
                    aria-labelledby={`kn-explore-m-tab-${index}`}
                    className="knc-panel"
                    hidden={index !== tab}
                  >
                    {column.items.map(({ key, href, title, Icon }) => (
                      <Link key={key} to={href} className="knc-row">
                        <i className="knc-ic" aria-hidden="true">
                          <Icon />
                        </i>
                        <span className="knc-t">{title}</span>
                        <ChevronRight className="knc-chev" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            ) : null}
          </>
        ) : (
          <>
            <div className="knc-top">
              <div>
                <p className="knc-pill">
                  <span className="knc-dot" />
                  {kicker}
                </p>
                <h2 id={titleId} className="knc-title section-label">
                  {page.ctaTitle}
                </h2>
                <p className="knc-lead">{page.ctaText}</p>
                <div className="knc-actions">
                  {cta}
                  <p className="knc-updated">{updated}</p>
                </div>
              </div>
              <PhoneFan page={page} locale={locale} shellQuery={shellQuery} isMobile={false} />
            </div>

            <nav className="knc-index" aria-label={labels.explore}>
              {related.length > 0 ? (
                <div className={related.length > 1 ? 'knc-span' : 'knc-span knc-span--one'}>
                  <div className="knc-gh">
                    <p className="knc-label">
                      <b>01</b>
                      {labels.alsoOffered}
                    </p>
                    <span className="knc-count">{pad(related.length)}</span>
                  </div>
                  {related.map(tile)}
                </div>
              ) : null}
              {exploreColumns.map((column, index) => (
                <div key={column.key}>
                  <div className="knc-gh">
                    <p className="knc-label">
                      <b>{pad(index + 2)}</b>
                      {column.label}
                    </p>
                    <span className="knc-count">{pad(column.items.length)}</span>
                  </div>
                  {column.items.map(({ key, href, title }) => (
                    <Link key={key} to={href} className="knc-row">
                      <span>{title}</span>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default CloseBeat;
