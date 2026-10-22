import Container from "@ui/Container.jsx";
import Section from "@ui/Section.jsx";
import SectionHeading from "@ui/SectionHeading.jsx";
import TestimonialCard from "@ui/TestimonialCard.jsx";

function TestimonialsSection({ content }) {
  return (
    <Section
      aria-labelledby="home-testimonials-heading"
      className="bg-background"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            id="home-testimonials-heading"
            titleBefore={content.titleBefore}
            titleHighlight={content.titleHighlight}
          />
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
          {content.items.map((item) => (
            <TestimonialCard key={item.id} {...item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default TestimonialsSection;
