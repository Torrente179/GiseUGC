
import { Video, Image, ShoppingBag, MessageSquare, Award, TrendingUp } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Video className="h-10 w-10 mb-6 text-primary" />,
      title: 'Videos UGC',
      description: 'Videos de productos auténticos que muestran tus productos en entornos reales, impulsando el engagement y las conversiones.'
    },
    {
      icon: <Image className="h-10 w-10 mb-6 text-primary" />,
      title: 'Fotografía de Productos',
      description: 'Fotos de productos profesionales, enfocadas en el estilo de vida que cuentan la historia de tu marca y conectan con tu audiencia.'
    },
    {
      icon: <ShoppingBag className="h-10 w-10 mb-6 text-primary" />,
      title: 'Contenido para E-commerce',
      description: 'Contenido especializado optimizado para plataformas de mercados para aumentar la visibilidad e impulsar las ventas.'
    },
    {
      icon: <MessageSquare className="h-10 w-10 mb-6 text-primary" />,
      title: 'Videos de Reseñas',
      description: 'Reseñas de productos auténticas y detalladas que generan confianza y muestran los beneficios a los clientes potenciales.'
    },
    {
      icon: <Award className="h-10 w-10 mb-6 text-primary" />,
      title: 'Colaboraciones con Marcas',
      description: 'Alianzas estratégicas para expandir tu alcance y conectar con nuevas audiencias relevantes.'
    },
    {
      icon: <TrendingUp className="h-10 w-10 mb-6 text-primary" />,
      title: 'Estrategia de Redes Sociales',
      description: 'Orientación experta sobre el despliegue de contenido para maximizar el engagement y el ROI en todas las plataformas.'
    },
  ];

  return (
    <section id="services" className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary/80 mb-3 uppercase tracking-wider font-light">Lo Que Ofrezco</p>
          <h2 className="text-3xl md:text-4xl font-bold font-cormorant mb-6">Mis Servicios</h2>
          <div className="w-20 h-1 signature-line mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover-grow group elegant-shadow"
            >
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-secondary/80 rounded-lg -z-10 group-hover:scale-110 transition-transform"></div>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 font-cormorant">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
