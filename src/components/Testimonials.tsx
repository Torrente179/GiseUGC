import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const Testimonials = () => {
  const { t } = useTranslation();

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
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialData.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonialData.length) % testimonialData.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextTestimonial();
    } else if (distance < -minSwipeDistance) {
      prevTestimonial();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const panelVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="testimonials" className="studio-section bg-background">
      <div className="studio-container">
        <motion.div
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10 md:mb-12"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div>
            <p className="section-label text-muted-foreground mb-3">{t('testimonials.sectionSubtitle')}</p>
            <h2 className="studio-title">{t('testimonials.sectionTitle')}</h2>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-11 w-11 rounded-full bg-card border border-primary/20 flex items-center justify-center shadow-sm"
              aria-label={t('testimonials.ariaPrev')}
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </motion.button>
            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-11 w-11 rounded-full bg-card border border-primary/20 flex items-center justify-center shadow-sm"
              aria-label={t('testimonials.ariaNext')}
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </motion.button>
          </div>
        </motion.div>

        <div className="studio-rule mb-8 md:mb-10" />

        <motion.div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonialData.map((testimonial) => (
              <article key={testimonial.id} className="min-w-full">
                <div className="studio-panel p-6 md:p-8 lg:p-10">
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-start">
                    <div className="rounded-2xl border border-border/70 bg-background/55 p-5 md:p-6">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border border-border">
                          <img
                            src={testimonial.image}
                            alt={t(testimonial.nameKey)}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium leading-tight text-foreground">{t(testimonial.nameKey)}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{t(testimonial.roleKey)}</p>
                          <p className="text-sm text-muted-foreground">{t(testimonial.companyKey)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${index < testimonial.stars ? 'text-primary fill-primary' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <blockquote className="relative text-lg md:text-[1.45rem] font-sans font-light italic text-foreground/90 leading-[1.8]">
                      <span className="absolute -top-5 md:-top-7 -left-2 text-5xl md:text-6xl text-primary/20 not-italic leading-none">“</span>
                      <span className="relative z-10">{t(testimonial.textKey)}</span>
                    </blockquote>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-center mt-7 md:mt-8 gap-2.5">
          {testimonialData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-primary' : 'w-2.5 bg-primary/30'}`}
              aria-label={t('testimonials.ariaGoTo', { index: index + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
