import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Video, Image, ShoppingBag, MessageSquare, Award, TrendingUp } from 'lucide-react';

const Services = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  // Store keys and icons, text will come from t()
  const serviceData = [
    {
      icon: <Video className="h-10 w-10 mb-6 text-primary" />,
      titleKey: 'services.service1.title',
      descriptionKey: 'services.service1.description'
    },
    {
      icon: <Image className="h-10 w-10 mb-6 text-primary" />,
      titleKey: 'services.service2.title',
      descriptionKey: 'services.service2.description'
    },
    {
      icon: <ShoppingBag className="h-10 w-10 mb-6 text-primary" />,
      titleKey: 'services.service3.title',
      descriptionKey: 'services.service3.description'
    },
    {
      icon: <MessageSquare className="h-10 w-10 mb-6 text-primary" />,
      titleKey: 'services.service4.title',
      descriptionKey: 'services.service4.description'
    },
    {
      icon: <Award className="h-10 w-10 mb-6 text-primary" />,
      titleKey: 'services.service5.title',
      descriptionKey: 'services.service5.description'
    },
    {
      icon: <TrendingUp className="h-10 w-10 mb-6 text-primary" />,
      titleKey: 'services.service6.title',
      descriptionKey: 'services.service6.description'
    },
  ];

  return (
    <section id="services" className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary/80 mb-3 uppercase tracking-wider font-light">{t('services.sectionSubtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-bold font-cormorant mb-6">{t('services.sectionTitle')}</h2>
          <div className="w-20 h-1 signature-line mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceData.map((service, index) => (
            <div
              key={index}
              className="glass p-8 rounded-xl shadow-sm hover-grow group elegant-shadow"
            >
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-secondary/80 rounded-lg -z-10 group-hover:scale-110 transition-transform"></div>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 font-cormorant">{t(service.titleKey)}</h3>
              <p className="text-muted-foreground">{t(service.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
