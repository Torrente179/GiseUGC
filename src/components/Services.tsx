import { useTranslation } from 'react-i18next';
import { Video, Image, ShoppingBag, MessageSquare, Award, TrendingUp } from 'lucide-react';

const Services = () => {
  const { t } = useTranslation();

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

  const serviceVideoCards = [
    {
      titleKey: serviceTitleKeys[0],
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1100&q=80'
    },
    {
      titleKey: serviceTitleKeys[1],
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1100&q=80'
    },
    {
      titleKey: serviceTitleKeys[2],
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      poster: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=80'
    },
    {
      titleKey: serviceTitleKeys[3],
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      poster: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=80'
    },
    {
      titleKey: serviceTitleKeys[4],
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      poster: 'https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&fit=crop&w=1100&q=80'
    },
    {
      titleKey: serviceTitleKeys[5],
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      poster: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1100&q=80'
    }
  ];

  const serviceCards = [...serviceVideoCards, ...serviceVideoCards];

  return (
    <section id="services" className="section-padding bg-background">

      <div className="container relative z-10 mx-auto">
        <div className="text-center mb-16">
          <p className="text-muted-foreground mb-3 uppercase tracking-[0.18em] font-semibold">{t('services.sectionSubtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">{t('services.sectionTitle')}</h2>
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
              <h3 className="text-2xl font-semibold mb-3 font-cormorant text-foreground">{t(service.titleKey)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(service.descriptionKey)}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-5xl font-playfair leading-tight max-w-4xl mx-auto">
              {t('services.motionTitle')}
            </h3>
          </div>

          <div className="cafe-panel relative overflow-hidden min-h-[260px] p-5 md:p-7">
            <div className="absolute inset-0 bg-card" />
            <div className="absolute inset-y-0 left-0 w-14 md:w-20 z-20 bg-gradient-to-r from-card via-card/90 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-14 md:w-20 z-20 bg-gradient-to-l from-card via-card/90 to-transparent" />

            <div className="relative z-10 service-corner-drift">
              <div className="service-marquee flex w-max gap-4 py-5">
                {serviceCards.map((card, index) => (
                  <article
                    key={`${card.titleKey}-${index}`}
                    className="shrink-0 w-[220px] sm:w-[260px] rounded-2xl border border-border bg-card p-3 shadow-sm"
                    aria-label={t(card.titleKey)}
                  >
                    <div className="h-[130px] sm:h-[150px] rounded-xl bg-secondary mb-3 overflow-hidden">
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
                    <p className="text-xl sm:text-2xl font-cormorant text-foreground text-center leading-tight">
                      {t(card.titleKey)}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <p className="relative z-20 text-center text-sm text-muted-foreground mt-3">
              {t('services.motionSubtitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
