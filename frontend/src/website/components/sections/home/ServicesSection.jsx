import {
  BadgeCheck,
  FileCheck2,
  GraduationCap,
  MessagesSquare,
} from "lucide-react";
import ActionLink from "@ui/ActionLink.jsx";
import Container from "@ui/Container.jsx";
import Section from "@ui/Section.jsx";
import SectionHeading from "@ui/SectionHeading.jsx";
import ServiceCard from "@ui/ServiceCard.jsx";

const serviceIcons = {
  consultation: MessagesSquare,
  scholarshipRegistration: GraduationCap,
  documentPreparation: FileCheck2,
  studyVisa: BadgeCheck,
};

function ServicesSection({ content }) {
  return (
    <Section id="services" aria-labelledby="home-services-heading" className="scroll-mt-24 bg-background">
      <Container>
        <div className="relative overflow-hidden rounded-4xl border border-border bg-surface-muted/50 p-5 dark:border-gray-600 dark:bg-gray-800/40 sm:p-8 lg:p-10">
          <span
            aria-hidden="true"
            className="absolute -inset-s-20 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-14">
            <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-start">
          <SectionHeading
                id="home-services-heading"
                titleBefore={content.titleBefore}
                titleHighlight={content.titleHighlight}
              />
              <p className="mt-4 text-sm leading-8 text-foreground-muted dark:text-gray-300 sm:text-base">
                {content.description}
              </p>
              <ActionLink href={content.viewAllHref || "/services/consultation"} className="mt-7 min-h-12">
                {content.viewAll}
              </ActionLink>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.cards.map((item) => (
                <ServiceCard
                  key={item.id}
                  {...item}
                  icon={serviceIcons[item.id]}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default ServicesSection;
