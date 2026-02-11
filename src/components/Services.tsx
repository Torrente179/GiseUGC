import { useTranslation } from 'react-i18next';
import { Award, Image, MessageSquare, ShoppingBag, TrendingUp, Video } from 'lucide-react';

interface ServiceVideoCard {
  titleKey: string;
  descriptionKey: string;
  videoSrc: string;
  poster: string;
}

const Services = () => {
  const { t } = useTranslation();

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

  const serviceVideoCards: ServiceVideoCard[] = [
    {
      titleKey: 'services.service1.title',
      descriptionKey: 'services.service1.description',
      videoSrc: 'https://assets.mixkit.co/videos/50423/50423-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50423/50423-thumb-720-0.jpg',
    },
    {
      titleKey: 'services.service2.title',
      descriptionKey: 'services.service2.description',
      videoSrc: 'https://assets.mixkit.co/videos/50417/50417-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50417/50417-thumb-720-0.jpg',
    },
    {
      titleKey: 'services.service3.title',
      descriptionKey: 'services.service3.description',
      videoSrc: 'https://assets.mixkit.co/videos/50406/50406-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50406/50406-thumb-720-0.jpg',
    },
    {
      titleKey: 'services.service4.title',
      descriptionKey: 'services.service4.description',
      videoSrc: 'https://assets.mixkit.co/videos/42308/42308-720.mp4',
      poster: 'https://assets.mixkit.co/videos/42308/42308-thumb-720-0.jpg',
    },
    {
      titleKey: 'services.service5.title',
      descriptionKey: 'services.service5.description',
      videoSrc: 'https://assets.mixkit.co/videos/42293/42293-720.mp4',
      poster: 'https://assets.mixkit.co/videos/42293/42293-thumb-720-0.jpg',
    },
    {
      titleKey: 'services.service6.title',
      descriptionKey: 'services.service6.description',
      videoSrc: 'https://assets.mixkit.co/videos/34479/34479-720.mp4',
      poster: 'https://assets.mixkit.co/videos/34479/34479-thumb-720-0.jpg',
    },
  ];

  const marqueeCards = [...serviceVideoCards, ...serviceVideoCards];

  return (
    <section id="services" className="studio-section bg-background pt-24 md:pt-32">
      <div className="studio-container">
        <div className="studio-header mb-12">
          <div className="text-center md:text-left">
            <p className="section-label text-muted-foreground mb-4">{t('services.sectionSubtitle')}</p>
            <h2 className="studio-title text-4xl md:text-5xl lg:text-6xl">{t('services.sectionTitle')}</h2>
          </div>
          <p className="studio-subtitle lg:justify-self-end text-center md:text-right max-w-lg">
            {t('services.motionSubtitle')}
          </p>
        </div>

        <div className="studio-rule mb-16 md:mb-20" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceData.map((service, index) => (
            <article
              key={index}
              className="group rounded-[1.5rem] border border-border/70 bg-card/50 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-background/80 text-primary transition-transform duration-500 group-hover:scale-110">
                {service.icon}
              </div>
              <h3 className="text-2xl font-serif font-normal tracking-[-0.03em] text-foreground mb-4 leading-tight">
                {t(service.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">{t(service.descriptionKey)}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-32 md:mt-44 mb-20 md:mb-28">
        <div className="studio-container">
          <div className="px-4 mb-12 md:mb-20 text-center mx-auto">
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif font-normal tracking-[-0.04em] leading-tight text-foreground max-w-5xl mx-auto">
              {t('services.motionTitle')}
            </h3>
            <p className="text-base md:text-xl text-muted-foreground mt-6 max-w-3xl mx-auto leading-relaxed">
              {t('services.motionSubtitle')}
            </p>
          </div>
        </div>

        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 via-transparent to-secondary/40" />
          <div className="absolute inset-y-0 left-0 w-20 md:w-60 z-20 bg-gradient-to-r from-background via-background/95 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-60 z-20 bg-gradient-to-l from-background via-background/95 to-transparent" />

          <div className="service-marquee relative z-10 flex w-max gap-10 lg:gap-16 py-16 md:py-24">
            {marqueeCards.map((card, index) => (
              <div
                key={`${card.titleKey}-${index}`}
                className="group relative shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] flex flex-col items-center"
              >
                {/* TikTok Style Vertical Frame */}
                <div className="relative aspect-[9/15] w-full overflow-hidden rounded-[3rem] border border-border/60 shadow-xl bg-card transition-all duration-700 ease-out group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:border-primary/25 group-hover:-translate-y-3">
                  <video
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    src={card.videoSrc}
                    poster={card.poster}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>

                {/* Symmetrical Writing with Hover Reveal */}
                <div className="w-full mt-10 px-8 text-center h-[120px] relative">
                  <div className="transition-transform duration-500 ease-out group-hover:-translate-y-8">
                    <h3 className="text-2xl md:text-3xl font-serif text-foreground leading-tight tracking-[-0.02em] mb-4">
                      {t(card.titleKey)}
                    </h3>

                    <div className="relative w-full flex justify-center overflow-hidden">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0">
                        <p className="text-base leading-relaxed text-muted-foreground px-2 max-w-[280px]">
                          {t(card.descriptionKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aesthetic Detail Line */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-12 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 transform translate-y-6 group-hover:translate-y-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
