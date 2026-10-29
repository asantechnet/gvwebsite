import { BriefcaseBusiness, GraduationCap, Plane } from "lucide-react";
import ActionLink from "@ui/ActionLink.jsx";
import Container from "@ui/Container.jsx";
import OpportunityCard from "@ui/OpportunityCard.jsx";
import Section from "@ui/Section.jsx";
import SectionHeading from "@ui/SectionHeading.jsx";

const opportunityIcons = {
  study: GraduationCap,
  migration: Plane,
  work: BriefcaseBusiness,
};

function OpportunitySection({ content }) {
  return (
    <Section
      aria-labelledby="home-opportunities-heading"
      className="border-t border-border bg-surface-muted/30 dark:border-gray-600 dark:bg-gray-800/30"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            id="home-opportunities-heading"
            titleBefore={content.titleBefore}
            titleHighlight={content.titleHighlight}
          />
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-6xl justify-items-center gap-5 md:grid-cols-3">
          {content.cards.map((item) => (
            <OpportunityCard key={item.id} icon={opportunityIcons[item.id]} {...item} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <ActionLink href="/opportunities/study">
            {content.viewAll}
          </ActionLink>
        </div>

      </Container>
    </Section>
  );
}

export default OpportunitySection;
