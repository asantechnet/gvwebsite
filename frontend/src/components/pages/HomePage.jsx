import HeroSection from "@sections/home/HeroSection.jsx";
import OpportunitySection from "@sections/home/OpportunitySection.jsx";

function HomePage({ content }) {
  return (
    <>
      <HeroSection content={content.hero} />
      <OpportunitySection content={content.opportunities} />
    </>
  );
}

export default HomePage;
