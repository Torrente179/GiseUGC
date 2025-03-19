
import { Video, Image, ShoppingBag, MessageSquare, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Services = () => {
  const services = [
    {
      icon: <Video className="h-10 w-10 mb-6 text-primary" />,
      title: 'UGC Video Content',
      description: 'Authentic product videos that showcase your products in real-life settings, driving engagement and conversions.'
    },
    {
      icon: <Image className="h-10 w-10 mb-6 text-primary" />,
      title: 'Product Photography',
      description: 'Professional, lifestyle-focused product photos that tell your brand story and connect with your audience.'
    },
    {
      icon: <ShoppingBag className="h-10 w-10 mb-6 text-primary" />,
      title: 'E-commerce Content',
      description: 'Specialized content optimized for marketplace platforms to boost visibility and drive sales.'
    },
    {
      icon: <MessageSquare className="h-10 w-10 mb-6 text-primary" />,
      title: 'Review Videos',
      description: 'Authentic, detailed product reviews that build trust and showcase benefits to potential customers.'
    },
    {
      icon: <Award className="h-10 w-10 mb-6 text-primary" />,
      title: 'Brand Collaborations',
      description: 'Strategic partnerships to expand your reach and connect with new, relevant audiences.'
    },
    {
      icon: <TrendingUp className="h-10 w-10 mb-6 text-primary" />,
      title: 'Social Media Strategy',
      description: 'Expert guidance on content deployment to maximize engagement and ROI across platforms.'
    },
  ];

  return (
    <section id="services" className="section-padding bg-gradient-to-br from-secondary/50 via-white to-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary/80 mb-3 uppercase tracking-wider font-light">What I Offer</p>
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">My Services</h2>
          <div className="w-20 h-1 signature-line mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="border-none bg-white/80 backdrop-blur-sm p-1 hover-grow group elegant-shadow overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-primary/50 to-primary group-hover:w-full transition-all duration-500"></div>
              <CardContent className="p-8">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-16 h-16 bg-secondary/80 rounded-lg -z-10 group-hover:scale-110 transition-transform"></div>
                  <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-primary/10 animate-pulse"></div>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 font-playfair">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
