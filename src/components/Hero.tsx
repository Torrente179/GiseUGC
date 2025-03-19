
import { ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-white to-secondary/30">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1575223970966-76ae61ee7838?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-center bg-no-repeat bg-fixed"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-primary/90 text-sm font-medium tracking-wider">
                UGC Creator & Content Specialist
              </p>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-playfair mb-6 leading-tight animate-slide-down">
              Gisela <span className="relative inline-block">
                <span className="text-primary italic">Saldarriaga</span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full"></span>
              </span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Creating authentic, elegant UGC content that showcases your brand's unique story and connects with your audience on a deeper level.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Button 
                variant="default" 
                size="lg" 
                className="rounded-full px-8 py-6 font-medium hover-grow text-base"
                asChild
              >
                <a href="#portfolio">View My Work</a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 py-6 font-medium hover-grow text-primary border-primary text-base"
                asChild
              >
                <a href="#contact">Get In Touch</a>
              </Button>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative glow">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary/20 via-white to-secondary/50 blur-xl opacity-70"></div>
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/60 shadow-xl max-w-sm mx-auto transform rotate-2 hover:rotate-0 transition-all duration-500">
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
