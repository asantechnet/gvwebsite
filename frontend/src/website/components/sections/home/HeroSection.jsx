import ActionLink from "@ui/ActionLink.jsx";
import Container from "@ui/Container.jsx";
import Section from "@ui/Section.jsx";

function HeroVisual({ content }) {
  return (
    <div className="relative mx-auto flex w-full max-w-xl items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute size-72 rounded-full bg-primary/10 blur-3xl sm:size-96"
      />
      <img
        src="/assets/images/home/hero-globe.webp"
        alt={content.imageAlt}
        width="1536"
        height="1536"
        fetchPriority="high"
        decoding="async"
        className="relative z-10 h-auto w-full object-contain drop-shadow-xl"
      />
    </div>
  );
}

function HeroSection({ content }) {
  return (
    <Section padded={false} className="relative isolate overflow-hidden bg-background">
      <Container className="grid min-h-0 items-center gap-6 pb-0 pt-0 md:gap-8 md:pb-0 md:pt-0 lg:min-h-screen lg:grid-cols-2 lg:gap-8 lg:pb-6 lg:pt-10 xl:pb-8 xl:pt-4">
        <div className="order-2 mx-auto flex max-w-2xl flex-col items-center text-center lg:order-1 lg:mx-0 lg:items-start lg:text-start">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground dark:text-gray-50 sm:text-5xl xl:text-6xl">
            {content.titleBefore}{" "}
            <span className="text-accent-text">{content.titleHighlight}</span>{" "}
            {content.titleAfter}
          </h1>

          <div className="mt-5 flex items-center gap-2" aria-hidden="true">
            <span className="h-1.5 w-16 rounded-full bg-primary" />
            <span className="size-1.5 rounded-full bg-secondary" />
            <span className="size-1.5 rounded-full bg-secondary/50" />
          </div>

          <p className="mt-5 max-w-xl text-sm leading-8 text-foreground-muted dark:text-gray-200 sm:text-base sm:leading-9 lg:text-lg">
            {content.description}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ActionLink
              href="/contact"
            >
              {content.primaryAction}
            </ActionLink>
            <ActionLink
              href="/opportunities/study"
              variant="outline"
              icon={null}
            >
              {content.secondaryAction}
            </ActionLink>
          </div>

        </div>

        <div className="order-1 -mb-16 py-4 md:-mb-10 md:py-0 lg:order-2 lg:mb-0">
          <HeroVisual content={content.visual} />
        </div>
      </Container>
    </Section>
  );
}

export default HeroSection;
