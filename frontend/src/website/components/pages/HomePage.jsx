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
      {content.hero.visible !== false && <HeroSection content={content.hero} />}
      {content.opportunities.visible !== false && <OpportunitySection content={content.opportunities} />}
      {content.destinations.visible !== false && <DestinationsSection content={content.destinations} />}
      {content.process.visible !== false && <ProcessSection content={content.process} />}
      {content.services.visible !== false && <ServicesSection content={content.services} />}
      {content.testimonials.visible !== false && <TestimonialsSection content={content.testimonials} />}
      {content.consultation.visible !== false && <ConsultationSection content={content.consultation} />}
    </>
  );
}

export default HomePage;
