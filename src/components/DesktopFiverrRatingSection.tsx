import FiverrRatingCard from '@/components/FiverrRatingCard';

const DesktopFiverrRatingSection = () => {
  return (
    <section id="desktop-rating-card" className="studio-section bg-background pt-2 pb-6 hidden md:block">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <FiverrRatingCard />
      </div>
    </section>
  );
};

export default DesktopFiverrRatingSection;
