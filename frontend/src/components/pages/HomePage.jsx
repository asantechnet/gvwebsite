import DestinationsSection from "@sections/home/DestinationsSection.jsx";
import HeroSection from "@sections/home/HeroSection.jsx";
import OpportunitySection from "@sections/home/OpportunitySection.jsx";
import ProcessSection from "@sections/home/ProcessSection.jsx";

function HomePage({ content }) {
  return (
    <>
      <HeroSection content={content.hero} />
      <OpportunitySection content={content.opportunities} />
      <DestinationsSection content={content.destinations} />
      <ProcessSection content={content.process} />
    </>
  );
}

export default HomePage;
