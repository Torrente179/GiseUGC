
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <p className="text-white/80 text-lg mb-4 animate-fade-in">
            UGC Content Creator
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-playfair mb-8 leading-tight animate-slide-down">
            Turning <span className="text-shadow">Products</span> into<br/>
            <span className="relative inline-block animate-slide-up" style={{ animationDelay: '0.3s' }}>
              Compelling Stories
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-white/60 rounded-full"></span>
            </span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Premium UGC content that drives engagement and converts viewers into customers. Elevate your brand with professional, eye-catching content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <a 
              href="#portfolio" 
              className="px-8 py-3.5 rounded-full bg-white text-primary font-medium hover-grow"
            >
              View My Work
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3.5 rounded-full bg-transparent border border-white text-white font-medium hover-grow"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
        <a href="#services" className="flex flex-col items-center text-white/70 hover:text-white transition-colors">
          <span className="text-sm mb-2">Scroll Down</span>
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
