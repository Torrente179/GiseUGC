import { useTranslation } from 'react-i18next';
import {
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Star,
  MapPin,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';

const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';

const fiverrRatingDistribution = [
  { stars: 5, count: 143 },
  { stars: 4, count: 9 },
  { stars: 3, count: 3 },
  { stars: 2, count: 0 },
  { stars: 1, count: 3 },
];

const fiverrRatingBreakdown = [
  { labelKey: 'footer.fiverr.metricCommunication', value: '4.8' },
  { labelKey: 'footer.fiverr.metricQuality', value: '4.8' },
  { labelKey: 'footer.fiverr.metricValue', value: '4.8' },
];

const Footer = () => {
  const { t } = useTranslation();
  const maxRatingCount = fiverrRatingDistribution[0]?.count ?? 1;

  return (
    <footer id="contact" className="bg-[#F6F3EE] text-foreground pt-12 md:pt-14 pb-8 md:pb-10">
      <div className="studio-container">
        <div className="grid gap-8 lg:gap-10 xl:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] xl:items-start mb-8">
          <div>
            <h3 className="brand-logo text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] mb-4 text-primary">
              {t('footer.brandName')}<span className="text-accent">.</span>
            </h3>
            <p className="strategic-body text-foreground/72 text-[clamp(1.2rem,1.8vw,1.85rem)] leading-[1.5] max-w-2xl">
              {t('footer.description')}
            </p>

            <div className="hidden md:flex gap-3 mt-7">
              <button type="button" aria-label="Instagram" className="h-12 w-12 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Twitter" className="h-12 w-12 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </button>
              <button type="button" aria-label="LinkedIn" className="h-12 w-12 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Facebook" className="h-12 w-12 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm p-4 md:p-5">
            <div className="grid grid-cols-[auto_1fr] gap-3.5 md:gap-4 items-start">
              <img
                src="/uploads/gisela-avatar-160.webp"
                alt={t('footer.fiverr.profileAlt')}
                className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover object-[center_18%] border border-border/60"
                width={160}
                height={200}
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-[1.7rem] md:text-[1.95rem] leading-none font-semibold tracking-tight text-foreground">
                  {t('footer.fiverr.name')}{' '}
                  <span className="text-foreground/62 font-normal text-[1.5rem] md:text-[1.7rem]">
                    {t('footer.fiverr.handle')}
                  </span>
                </p>

                <div className="mt-1.5 flex items-center gap-2.5 text-foreground/85">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-xl font-semibold leading-none">4.8</span>
                  <span className="text-xl text-foreground/55 leading-none">(158)</span>
                </div>

                <p className="text-sm md:text-[15px] leading-[1.45] text-foreground/82 mt-2.5">
                  {t('footer.fiverr.profileTitle')}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-foreground/75">
                  <span className="inline-flex items-center gap-1.5 text-sm md:text-[15px]">
                    <MapPin className="h-4 w-4" />
                    {t('footer.fiverr.country')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm md:text-[15px]">
                    <MessageCircle className="h-4 w-4" />
                    {t('footer.fiverr.language')}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/60 my-4" />

            <div className="grid gap-4 md:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)]">
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">{t('footer.fiverr.reviewsTitle')}</p>
                <div className="space-y-2">
                  {fiverrRatingDistribution.map((item) => {
                    const width = `${Math.round((item.count / maxRatingCount) * 100)}%`;
                    const muted = item.count === 0;

                    return (
                      <div key={item.stars} className="grid grid-cols-[2.2rem_1fr_auto] items-center gap-2.5">
                        <span className={`text-sm ${muted ? 'text-foreground/32' : 'text-foreground/78'}`}>{item.stars}★</span>
                        <span className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                          <span
                            className={`block h-full rounded-full ${muted ? 'bg-foreground/18' : 'bg-foreground/85'}`}
                            style={{ width }}
                          />
                        </span>
                        <span className={`text-sm ${muted ? 'text-foreground/32' : 'text-foreground/72'}`}>({item.count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">{t('footer.fiverr.ratingBreakdown')}</p>
                  <span className="inline-flex items-center gap-0.5 text-foreground">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                    <span className="ml-1 text-sm font-semibold">4.8</span>
                  </span>
                </div>
                <div className="space-y-2.5">
                  {fiverrRatingBreakdown.map((item) => (
                    <div key={item.labelKey} className="flex items-center justify-between text-sm">
                      <span className="text-foreground/62">{t(item.labelKey)}</span>
                      <span className="inline-flex items-center gap-1 text-foreground/88 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-[11px] uppercase tracking-[0.17em] font-bold text-primary hover:text-accent transition-colors"
            >
              {t('footer.fiverr.visitProfile')}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            </div>

            <div className="flex md:hidden gap-3 mt-5 justify-center">
              <button type="button" aria-label="Instagram" className="h-12 w-12 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Twitter" className="h-12 w-12 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </button>
              <button type="button" aria-label="LinkedIn" className="h-12 w-12 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Facebook" className="h-12 w-12 rounded-full border border-foreground/15 bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/15 pt-8 text-center">
          <p className="text-xs text-foreground/55 tracking-wider">
            © 2026 Portafolio UGC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
