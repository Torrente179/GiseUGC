import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Video, Image, ShoppingBag, MessageSquare, Award, TrendingUp, X } from 'lucide-react';

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
      icon: <Video className="h-10 w-10 mb-6 text-primary/80" />,
      titleKey: 'services.service1.title',
      descriptionKey: 'services.service1.description'
    },
    {
      icon: <Image className="h-10 w-10 mb-6 text-primary/80" />,
      titleKey: 'services.service2.title',
      descriptionKey: 'services.service2.description'
    },
    {
      icon: <ShoppingBag className="h-10 w-10 mb-6 text-primary/80" />,
      titleKey: 'services.service3.title',
      descriptionKey: 'services.service3.description'
    },
    {
      icon: <MessageSquare className="h-10 w-10 mb-6 text-primary/80" />,
      titleKey: 'services.service4.title',
      descriptionKey: 'services.service4.description'
    },
    {
      icon: <Award className="h-10 w-10 mb-6 text-primary/80" />,
      titleKey: 'services.service5.title',
      descriptionKey: 'services.service5.description'
    },
    {
      icon: <TrendingUp className="h-10 w-10 mb-6 text-primary/80" />,
      titleKey: 'services.service6.title',
      descriptionKey: 'services.service6.description'
    }
  ];

  const serviceTitleKeys = [
    'services.service1.title',
    'services.service2.title',
    'services.service3.title',
    'services.service4.title',
    'services.service5.title',
    'services.service6.title'
  ];

  const serviceVideoCards: ServiceVideoCard[] = [
    {
      titleKey: serviceTitleKeys[0],
      videoSrc: 'https://cdn.pixabay.com/video/2021/08/04/83869-584870610_tiny.mp4',
      poster: 'https://cdn.pixabay.com/video/2021/08/04/83869-584870610_tiny.jpg'
    },
    {
      titleKey: serviceTitleKeys[1],
      videoSrc: 'https://cdn.pixabay.com/video/2024/05/30/214582_tiny.mp4',
      poster: 'https://cdn.pixabay.com/video/2024/05/30/214582_tiny.jpg'
    },
    {
      titleKey: serviceTitleKeys[2],
      videoSrc: 'https://cdn.pixabay.com/video/2022/02/12/107492-678970856_tiny.mp4',
      poster: 'https://cdn.pixabay.com/video/2022/02/12/107492-678970856_tiny.jpg'
    },
    {
      titleKey: serviceTitleKeys[3],
      videoSrc: 'https://cdn.pixabay.com/video/2021/08/30/86911-594991432_tiny.mp4',
      poster: 'https://cdn.pixabay.com/video/2021/08/30/86911-594991432_tiny.jpg'
    },
    {
      titleKey: serviceTitleKeys[4],
      videoSrc: 'https://cdn.pixabay.com/video/2024/03/26/205691-927672681_tiny.mp4',
      poster: 'https://cdn.pixabay.com/video/2024/03/26/205691-927672681_tiny.jpg'
    },
    {
      titleKey: serviceTitleKeys[5],
      videoSrc: 'https://cdn.pixabay.com/video/2023/11/28/191126-889267474_tiny.mp4',
      poster: 'https://cdn.pixabay.com/video/2023/11/28/191126-889267474_tiny.jpg'
    }
  ];

  const serviceCards = [...serviceVideoCards, ...serviceVideoCards];

  return (
    <section id="services" className="section-padding bg-background">

      <div className="container relative z-10 mx-auto">
        <div className="text-center mb-16">
          <p className="section-label text-muted-foreground mb-3">{t('services.sectionSubtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-[-0.04em] mb-6">{t('services.sectionTitle')}</h2>
          <div className="w-24 h-1 signature-line mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceData.map((service, index) => (
            <div
              key={index}
              className="cafe-card p-8 group"
            >
              <div className="relative mb-4">
                <div className="absolute -top-1 -left-1 w-16 h-16 bg-secondary rounded-xl -z-10 group-hover:scale-105 transition-transform" />
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 font-serif text-foreground tracking-[-0.02em]">{t(service.titleKey)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(service.descriptionKey)}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-5xl font-serif font-normal tracking-[-0.04em] leading-tight max-w-4xl mx-auto">
              {t('services.motionTitle')}
            </h3>
            <p className="relative z-20 text-sm text-muted-foreground mt-4">
              {t('services.motionSubtitle')}
            </p>
          </div>

          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-background to-secondary/60" />
            <div className="absolute inset-y-0 left-0 w-16 md:w-28 z-20 bg-gradient-to-r from-background via-background/95 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-16 md:w-28 z-20 bg-gradient-to-l from-background via-background/95 to-transparent" />

            <div className="relative z-10">
              <div className="service-marquee flex w-max gap-5 lg:gap-6 py-5 md:py-7">
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

            <p className="section-label text-xs text-muted-foreground mb-1">
              {t('services.videoPreviewLabel')}
            </p>
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
