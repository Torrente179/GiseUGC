import FiverrRatingCard from '@/components/FiverrRatingCard';

const MobileFiverrRatingSection = () => {
  return (
    <section id="mobile-rating-card" className="studio-section bg-[#F5F0E9] pt-2 pb-6 md:hidden">
      <div className="studio-container">
        <FiverrRatingCard />
      </div>
    </section>
  );
};

export default MobileFiverrRatingSection;
