
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-white to-secondary/20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1575223970966-76ae61ee7838?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-center bg-no-repeat bg-fixed"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <p className="text-primary/80 text-lg mb-4 animate-fade-in tracking-wider uppercase font-light">
              UGC Creator & Content Specialist
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-cormorant mb-6 leading-tight animate-slide-down">
              Gisela <span className="text-primary italic">Saldarriaga</span>
            </h1>
            <div className="w-32 h-1 signature-line mb-8"></div>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Creating authentic, elegant UGC content that showcases your brand's unique story and connects with your audience on a deeper level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <a 
                href="#portfolio" 
                className="px-8 py-3.5 rounded-full bg-primary text-white font-medium hover-grow"
              >
                View My Work
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3.5 rounded-full bg-transparent border border-primary text-primary font-medium hover-grow"
              >
                Get In Touch
              </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary blur-lg opacity-50"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/40 shadow-xl max-w-sm mx-auto">
                <img 
                  src="/lovable-uploads/1bceae6e-5154-4d2e-b3fb-2957b86796a7.png" 
                  alt="Gisela Saldarriaga" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
        <a href="#services" className="flex flex-col items-center text-primary/70 hover:text-primary transition-colors">
          <span className="text-sm mb-2 font-light">Explore My Services</span>
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
