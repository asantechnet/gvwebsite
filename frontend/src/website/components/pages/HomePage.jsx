import DestinationsSection from "@sections/home/DestinationsSection.jsx";
import HeroSection from "@sections/home/HeroSection.jsx";
import OpportunitySection from "@sections/home/OpportunitySection.jsx";
import ProcessSection from "@sections/home/ProcessSection.jsx";
import ServicesSection from "@sections/home/ServicesSection.jsx";
import TestimonialsSection from "@sections/home/TestimonialsSection.jsx";
import ConsultationSection from "@sections/home/ConsultationSection.jsx";

function HomePage({ content }) {
  return (
    <>
      <HeroSection content={content.hero} />
      <OpportunitySection content={content.opportunities} />
      <DestinationsSection content={content.destinations} />
      <ProcessSection content={content.process} />
      <ServicesSection content={content.services} />
      <TestimonialsSection content={content.testimonials} />
      <ConsultationSection content={content.consultation} />
    </>
  );
}

export default HomePage;
