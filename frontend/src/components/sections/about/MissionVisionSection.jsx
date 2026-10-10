import { Eye, Target } from "lucide-react";

import Container from "@ui/Container.jsx";
import Section from "@ui/Section.jsx";

function MissionVisionSection({ content }) {
  return (
    <Section aria-labelledby="about-mission-vision-title" className="bg-surface-muted dark:bg-[#182230]">
      <Container>
        <h2 id="about-mission-vision-title" className="sr-only">
          {content.sectionTitle}
        </h2>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {[content.mission, content.vision].map((item, index) => {
            const Icon = index === 0 ? Target : Eye;

            return (
              <article
                key={item.title}
                className={`text-center ${index === 0 ? 'rounded-tr-[6rem] rounded-bl-[6rem] bg-surface dark:bg-[#3a3028]' : 'rounded-tl-[6rem] rounded-br-[6rem] bg-[#ffe3d5] dark:bg-[#3a292d]'} border border-transparent px-8 py-10 md:px-12 md:py-14`}
              >
                <div className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${index === 0 ? 'bg-brand-orange/15 text-brand-orange' : 'bg-brand-red/15 text-brand-red'}`}>
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
