
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sara Jiménez',
      company: 'Marca de Moda S.L.',
      role: 'Directora de Marketing',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      stars: 5,
      text: 'El contenido UGC creado para nuestra campaña de verano superó todas las expectativas. Nuestro engagement aumentó un 45% y vimos un aumento significativo en las ventas. Muy recomendable para cualquiera que busque elevar la presencia de su marca.'
    },
    {
      id: 2,
      name: 'Miguel Chen',
      company: 'TechGadget Inc.',
      role: 'Gerente de E-commerce',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      stars: 5,
      text: 'Me quedé impresionado por la calidad y creatividad del contenido. Los videos de productos mostraron perfectamente nuestros nuevos gadgets tecnológicos y nos ayudaron a conectar con nuestro público objetivo de una manera que no habíamos logrado antes.'
    },
    {
      id: 3,
      name: 'Emma García',
      company: 'BellezaRadiante',
      role: 'Dueña de la Marca',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      stars: 5,
      text: 'Trabajar con esta creadora de UGC ha transformado nuestra marca de cuidado de la piel. El enfoque auténtico para mostrar nuestros productos resultó en un aumento del 60% en las conversiones. El profesionalismo y la atención al detalle no tienen comparación.'
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary/60 mb-3 uppercase tracking-wider">Comentarios de Clientes</p>
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">Testimonios</h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <div className="bg-white rounded-xl p-8 md:p-10 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center mb-6 gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-xl">{testimonial.name}</h3>
                        <p className="text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
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
                      "{testimonial.text}"
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
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === index ? 'bg-primary scale-125' : 'bg-primary/30'
                  }`}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover-grow"
              aria-label="Siguiente testimonio"
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
