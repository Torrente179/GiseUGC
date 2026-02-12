
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import ServicesMarquee from '@/components/ServicesMarquee';
import Footer from '@/components/Footer';
import FloatingContactDock from '@/components/FloatingContactDock';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SocialProof />
      <Services />
      <Portfolio />
      <Testimonials />
      <ServicesMarquee />
      <Footer />
      <FloatingContactDock />
    </div>
  );
};

export default Index;
