import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import ServicesMarquee from '@/components/ServicesMarquee';
import Footer from '@/components/Footer';
import FloatingContactDock from '@/components/FloatingContactDock';
import { clearUrlHash } from '@/hooks/use-hashless-section-navigation';

const Index = () => {
  useEffect(() => {
    clearUrlHash();
  }, []);

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
