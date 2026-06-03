import { useTranslation } from 'react-i18next';
import { MapPin, MessageCircle, Star } from 'lucide-react';

interface FiverrRatingCardProps {
  className?: string;
}

const fiverrRatingDistribution = [
  { stars: 5, count: 158 },
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

const FiverrRatingCard = ({ className = '' }: FiverrRatingCardProps) => {
  const { t } = useTranslation();
  const maxRatingCount = fiverrRatingDistribution[0]?.count ?? 1;

  return (
    <div className={`rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm p-4 md:p-5 ${className}`}>
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
          <p className="text-[1.7rem] md:text-[1.95rem] leading-none font-semibold tracking-tight text-primary">
            {t('footer.fiverr.name')}{' '}
            <span className="text-accent/90 dark:text-accent/80 font-normal text-[1.5rem] md:text-[1.7rem]">
              {t('footer.fiverr.handle')}
            </span>
          </p>

          <div className="mt-1.5 flex items-center gap-2.5">
            <Star className="h-4 w-4 fill-current text-accent dark:text-accent/80" />
            <span className="text-xl font-semibold leading-none text-primary">4.8</span>
            <span className="text-xl text-accent/85 dark:text-accent/75 leading-none">(173)</span>
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
          <p className="text-sm font-semibold text-primary mb-2">{t('footer.fiverr.reviewsTitle')}</p>
          <div className="space-y-2">
            {fiverrRatingDistribution.map((item) => {
              const width = `${Math.round((item.count / maxRatingCount) * 100)}%`;
              const muted = item.count === 0;

              return (
                <div key={item.stars} className="grid grid-cols-[2.2rem_1fr_auto] items-center gap-2.5">
                  <span className={`text-sm ${muted ? 'text-foreground/32' : 'text-accent/95 dark:text-accent/80 font-medium'}`}>{item.stars}★</span>
                  <span className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                    <span
                      className={`block h-full rounded-full ${muted ? 'bg-foreground/18' : 'bg-primary/85 dark:bg-primary/75'}`}
                      style={{ width }}
                    />
                  </span>
                  <span className={`text-sm ${muted ? 'text-foreground/32' : 'text-primary/72 dark:text-primary/88'}`}>({item.count})</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-primary">{t('footer.fiverr.ratingBreakdown')}</p>
          </div>
          <div className="space-y-2.5">
            {fiverrRatingBreakdown.map((item) => (
              <div key={item.labelKey} className="flex items-center justify-between text-sm">
                <span className="text-accent/95 dark:text-accent/80">{t(item.labelKey)}</span>
                <span className="inline-flex items-center gap-1 text-primary font-semibold">
                  <span className="inline-flex items-center gap-0.5 text-accent dark:text-accent/80">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                  <span className="text-primary">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiverrRatingCard;
