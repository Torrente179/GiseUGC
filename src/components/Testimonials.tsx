
import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  // Store keys and static data, text will come from t()
  const testimonialData = [
    {
      id: 1,
      nameKey: 'testimonials.testimonial1.name',
      companyKey: 'testimonials.testimonial1.company',
      roleKey: 'testimonials.testimonial1.role',
      textKey: 'testimonials.testimonial1.text',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      stars: 5,
    },
    {
      id: 2,
      nameKey: 'testimonials.testimonial2.name',
      companyKey: 'testimonials.testimonial2.company',
      roleKey: 'testimonials.testimonial2.role',
      textKey: 'testimonials.testimonial2.text',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      stars: 5,
    },
    {
      id: 3,
      nameKey: 'testimonials.testimonial3.name',
      companyKey: 'testimonials.testimonial3.company',
      roleKey: 'testimonials.testimonial3.role',
      textKey: 'testimonials.testimonial3.text',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      stars: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialData.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonialData.length) % testimonialData.length);
  };

  return (
    <section id="testimonials" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary/60 mb-3 uppercase tracking-wider">{t('testimonials.sectionSubtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">{t('testimonials.sectionTitle')}</h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonialData.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <div className="bg-white rounded-xl p-8 md:p-10 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center mb-6 gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={testimonial.image} 
                          alt={t(testimonial.nameKey)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-xl">{t(testimonial.nameKey)}</h3>
                        <p className="text-muted-foreground">{t(testimonial.roleKey)}, {t(testimonial.companyKey)}</p>
                        <div className="flex mt-2">
                          {[...Array(5)].map((_, index) => (
                            <Star 
                              key={index} 
                              className={`w-4 h-4 ${
                                index < testimonial.stars 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-lg md:text-xl italic text-primary">
                      "{t(testimonial.textKey)}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover-grow"
              aria-label={t('testimonials.ariaPrev')}
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <div className="flex gap-2">
              {testimonialData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === index ? 'bg-primary scale-125' : 'bg-primary/30'
                  }`}
                  aria-label={t('testimonials.ariaGoTo', { index: index + 1 })}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover-grow"
              aria-label={t('testimonials.ariaNext')}
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
