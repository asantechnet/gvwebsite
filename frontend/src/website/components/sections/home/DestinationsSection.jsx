import ActionLink from "@ui/ActionLink.jsx";
import Container from "@ui/Container.jsx";
import DestinationCard from "@ui/DestinationCard.jsx";
import Section from "@ui/Section.jsx";
import SectionHeading from "@ui/SectionHeading.jsx";

function DestinationsSection({ content }) {
  return (
    <Section
      aria-labelledby="home-destinations-heading"
      className="bg-background"
    >
      <Container>
        <SectionHeading
          id="home-destinations-heading"
          titleBefore={content.titleBefore}
          titleHighlight={content.titleHighlight}
          className="text-center"
        />

        <div className="mt-10 grid gap-2 md:grid-cols-6">
          {content.countries.map((item) => (
            <DestinationCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <ActionLink
            href={content.viewAllHref || "/opportunities/study"}
            variant="secondary"
            className="min-h-12"
          >
            {content.viewAll}
          </ActionLink>
        </div>
      </Container>
    </Section>
  );
}

export default DestinationsSection;
