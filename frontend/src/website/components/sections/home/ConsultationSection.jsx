import { MessagesSquare } from "lucide-react";
import ActionLink from "@ui/ActionLink.jsx";
import Container from "@ui/Container.jsx";
import Section from "@ui/Section.jsx";

function ConsultationSection({ content }) {
  return (
    <Section className="bg-background">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-surface px-5 py-10 text-center shadow-[0_20px_50px_rgba(41,23,18,0.08)] dark:border-gray-600 dark:bg-gray-700 sm:px-10 sm:py-12 lg:px-16">
          <span
            aria-hidden="true"
            className="absolute -right-24 -top-28 -z-10 size-72 rounded-full bg-primary/10 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-28 -left-24 -z-10 size-72 rounded-full bg-primary/10 blur-3xl"
          />
          <span className="relative mx-auto grid size-14 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-accent-text shadow-sm">
            <MessagesSquare aria-hidden="true" className="size-7" />
          </span>

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-heading mt-5 text-2xl font-extrabold leading-tight text-foreground dark:text-gray-50 sm:text-3xl lg:text-4xl">
              {content.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-foreground-muted dark:text-gray-300 sm:text-base">
              {content.description}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ActionLink
                href="/contact"
                variant="secondary"
                className="min-h-12 rounded-xl px-6"
              >
                {content.primaryAction}
              </ActionLink>
              <ActionLink
                href="/opportunities/study"
                variant="outline"
                icon={null}
                className="min-h-12 rounded-xl px-6"
              >
                {content.secondaryAction}
              </ActionLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default ConsultationSection;
