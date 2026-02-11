import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Image, MessageSquare, ShoppingBag, TrendingUp, Video, X } from 'lucide-react';

interface ServiceVideoCard {
  titleKey: string;
  videoSrc: string;
  poster: string;
}

const Services = () => {
  const { t } = useTranslation();
  const [activePreview, setActivePreview] = useState<ServiceVideoCard | null>(null);

  const serviceData = [
    {
      icon: <Video className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service1.title',
      descriptionKey: 'services.service1.description',
    },
    {
      icon: <Image className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service2.title',
      descriptionKey: 'services.service2.description',
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service3.title',
      descriptionKey: 'services.service3.description',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service4.title',
      descriptionKey: 'services.service4.description',
    },
    {
      icon: <Award className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service5.title',
      descriptionKey: 'services.service5.description',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service6.title',
      descriptionKey: 'services.service6.description',
    },
  ];

  const serviceTitleKeys = [
    'services.service1.title',
    'services.service2.title',
    'services.service3.title',
    'services.service4.title',
    'services.service5.title',
    'services.service6.title',
  ];

  const serviceVideoCards: ServiceVideoCard[] = [
    {
      titleKey: serviceTitleKeys[0],
      videoSrc: 'https://assets.mixkit.co/videos/50423/50423-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50423/50423-thumb-720-0.jpg',
    },
    {
      titleKey: serviceTitleKeys[1],
      videoSrc: 'https://assets.mixkit.co/videos/50417/50417-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50417/50417-thumb-720-0.jpg',
    },
    {
      titleKey: serviceTitleKeys[2],
      videoSrc: 'https://assets.mixkit.co/videos/50406/50406-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50406/50406-thumb-720-0.jpg',
    },
    {
      titleKey: serviceTitleKeys[3],
      videoSrc: 'https://assets.mixkit.co/videos/42308/42308-720.mp4',
      poster: 'https://assets.mixkit.co/videos/42308/42308-thumb-720-0.jpg',
    },
    {
      titleKey: serviceTitleKeys[4],
      videoSrc: 'https://assets.mixkit.co/videos/42293/42293-720.mp4',
      poster: 'https://assets.mixkit.co/videos/42293/42293-thumb-720-0.jpg',
    },
    {
      titleKey: serviceTitleKeys[5],
      videoSrc: 'https://assets.mixkit.co/videos/34479/34479-720.mp4',
      poster: 'https://assets.mixkit.co/videos/34479/34479-thumb-720-0.jpg',
    },
  ];

  const serviceCards = [...serviceVideoCards, ...serviceVideoCards];

  return (
    <section id="services" className="studio-section bg-background">
      <div className="studio-container">
        <div className="studio-header">
          <div>
            <p className="section-label text-muted-foreground mb-3">{t('services.sectionSubtitle')}</p>
            <h2 className="studio-title">{t('services.sectionTitle')}</h2>
          </div>
          <p className="studio-subtitle lg:justify-self-end">{t('services.motionSubtitle')}</p>
        </div>

        <div className="studio-rule mb-10 md:mb-12" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceData.map((service, index) => (
            <article
              key={index}
              className="group rounded-[1.35rem] border border-border/75 bg-card/78 p-7 backdrop-blur-sm transition-colors hover:border-primary/30"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 bg-background/70">
                {service.icon}
              </div>
              <h3 className="text-[1.55rem] font-serif font-normal tracking-[-0.03em] text-foreground mb-3 leading-tight">
                {t(service.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-[0.96rem]">{t(service.descriptionKey)}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-16 md:mt-20">
        <div className="studio-container">
          <div className="px-1 md:px-2 mb-6 md:mb-8">
            <h3 className="text-2xl md:text-[2.2rem] font-serif font-normal tracking-[-0.04em] leading-tight text-foreground max-w-4xl">
              {t('services.motionTitle')}
            </h3>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl">{t('services.motionSubtitle')}</p>
          </div>
        </div>

        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-background to-secondary/60" />
          <div className="absolute inset-y-0 left-0 w-12 md:w-28 z-20 bg-gradient-to-r from-background via-background/95 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-12 md:w-28 z-20 bg-gradient-to-l from-background via-background/95 to-transparent" />

          <div className="service-marquee relative z-10 flex w-max gap-5 lg:gap-6 py-5 md:py-7">
            {serviceCards.map((card, index) => (
              <button
                type="button"
                key={`${card.titleKey}-${index}`}
                className="shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm text-left hover:border-primary/40 transition-colors"
                aria-label={t(card.titleKey)}
                onClick={() => setActivePreview(card)}
              >
                <div className="h-[170px] sm:h-[200px] lg:h-[220px] w-full bg-secondary overflow-hidden">
                  <video
                    className="h-full w-full object-cover"
                    src={card.videoSrc}
                    poster={card.poster}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>
                <div className="px-4 py-3 sm:px-5 sm:py-4">
                  <p className="text-2xl sm:text-[2rem] font-serif text-foreground text-center leading-tight tracking-[-0.03em]">
                    {t(card.titleKey)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activePreview && (
        <div
          className="fixed inset-0 z-50 bg-foreground/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-3 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 h-8 w-8 rounded-full border border-border bg-card/90 flex items-center justify-center hover:bg-secondary"
              onClick={() => setActivePreview(null)}
              aria-label={t('services.videoPreviewClose')}
            >
              <X className="h-4 w-4 text-foreground" />
            </button>

            <p className="section-label text-xs text-muted-foreground mb-1">{t('services.videoPreviewLabel')}</p>
            <h4 className="text-lg font-serif font-normal tracking-[-0.03em] pr-10 mb-3">{t(activePreview.titleKey)}</h4>

            <div className="rounded-xl overflow-hidden bg-black">
              <video
                className="w-full aspect-[9/16] object-contain"
                src={activePreview.videoSrc}
                poster={activePreview.poster}
                controls
                autoPlay
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
