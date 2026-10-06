import {
  BadgeCheck,
  ClipboardCheck,
  Compass,
  MessagesSquare,
} from "lucide-react";
import Container from "@ui/Container.jsx";
import ProcessStep from "@ui/ProcessStep.jsx";
import Section from "@ui/Section.jsx";
import SectionHeading from "@ui/SectionHeading.jsx";

const processIcons = {
  consultation: MessagesSquare,
  assessment: Compass,
  preparation: ClipboardCheck,
  followUp: BadgeCheck,
};

function ProcessSection({ content }) {
  return (
    <Section
      aria-labelledby="home-process-heading"
      className="bg-background"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            id="home-process-heading"
            titleBefore={content.titleBefore}
            titleHighlight={content.titleHighlight}
          />
        </div>

        <div className="relative mt-10">
          <div
            aria-hidden="true"
            className="absolute inset-x-[calc((100%-3.75rem)/8)] top-6 hidden h-px bg-border dark:bg-gray-600 md:block"
          />
          <ol className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {content.steps.map((item) => (
              <ProcessStep key={item.id} icon={processIcons[item.id]} {...item} />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

export default ProcessSection;
