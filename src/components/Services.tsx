import { useRef, useState } from 'react';
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

  return (
    <section id="services" className="studio-section bg-background pt-16 md:pt-20">
      <div className="studio-container">
        <div className="studio-header mb-12">
          <div className="text-center md:text-left">
            <p className="section-label text-muted-foreground mb-4">{t('services.sectionSubtitle')}</p>
            <h2 className="studio-title">{t('services.sectionTitle')}</h2>
          </div>
          <p className="studio-subtitle lg:justify-self-end text-center md:text-right max-w-lg">
            {t('services.motionSubtitle')}
          </p>
        </div>

        <div className="studio-rule mb-16 md:mb-20" />

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
          {serviceData.map((service, index) => (
            <article
              key={index}
              className="group rounded-[1.25rem] md:rounded-[1.5rem] border border-border/70 bg-card/50 p-5 md:p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-4 md:mb-6 inline-flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl border border-border/60 bg-background/80 text-primary transition-transform duration-500 group-hover:scale-110">
                {service.icon}
              </div>
              <h3 className="text-lg md:text-2xl font-sans font-medium tracking-tight text-foreground mb-3 md:mb-4 leading-tight">
                {t(service.titleKey)}
              </h3>
              <p className="strategic-body text-muted-foreground text-sm md:text-base line-clamp-3 md:line-clamp-none">
                {t(service.descriptionKey)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};


export default Services;
