import { Eye, Target } from "lucide-react";

import Container from "@ui/Container.jsx";
import Section from "@ui/Section.jsx";

function MissionVisionSection({ content }) {
  return (
    <Section
      aria-labelledby="about-mission-vision-title"
      className="bg-surface-muted dark:bg-[#182230]"
    >
      <Container>
        <h2 id="about-mission-vision-title" className="sr-only">
          {content.sectionTitle}
        </h2>
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {[content.mission, content.vision].map((item, index) => {
            const Icon = index === 0 ? Target : Eye;

            return (
              <article
                key={item.title}
                className={`text-center ${index === 0 ? "rounded-tr-[50%] rounded-bl-[50%]" : "rounded-tl-[50%] rounded-br-[50%]"} bg-surface px-12 py-10 dark:bg-[#2b3442] md:p-16`}
              >
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
                </div>
                <h3 className="mx-auto mt-5 max-w-xs font-heading text-2xl font-extrabold text-foreground md:max-w-xl md:text-3xl">
                  {item.title}
                </h3>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-8 text-foreground-muted md:max-w-xl md:text-base md:leading-9">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export default MissionVisionSection;
