import { ArrowLeft, Check, Sparkles } from "lucide-react";

const focusClasses =
  "focus:outline-none focus-visible:outline-none focus-visible:border-secondary focus-visible:shadow-md";

function HeroVisual({ content }) {
  return (
    <div className="relative mx-auto flex w-full max-w-xl items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute size-72 rounded-full bg-primary/10 blur-3xl sm:size-96"
      />
      <img
        src="/home-hero-globe.webp"
        alt={content.imageAlt}
        width="1536"
        height="1536"
        className="relative z-10 h-auto w-full object-contain drop-shadow-xl"
      />
    </div>
  );
}

function HeroSection({ content }) {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-4 pb-12 pt-8 sm:px-6 md:pb-16 md:pt-10 lg:grid-cols-2 lg:gap-8 xl:px-8 xl:pb-20 xl:pt-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-right">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-surface/80 px-4 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md dark:border-primary/50 dark:bg-gray-800/70 dark:text-gray-100 sm:text-sm">
            <span className="grid size-6 place-items-center rounded-full bg-primary text-brand-white">
              <Sparkles aria-hidden="true" className="size-3.5" />
            </span>
            {content.eyebrow}
          </div>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-[#333] dark:text-gray-50 sm:text-6xl xl:text-7xl">
            {content.titleBefore}{" "}
            <span className="text-primary">{content.titleHighlight}</span>{" "}
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
            <a
              href="/contact"
              className={`group inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-primary bg-primary px-7 text-sm font-extrabold text-brand-white shadow-lg transition-colors hover:border-primary-hover hover:bg-primary-hover sm:text-base ${focusClasses}`}
            >
              {content.primaryAction}
              <ArrowLeft
                aria-hidden="true"
                className="size-4 transition-transform group-hover:-translate-x-1"
              />
            </a>
            <a
              href="/opportunities"
              className={`inline-flex min-h-13 items-center justify-center rounded-2xl border border-border bg-surface/80 px-7 text-sm font-extrabold text-[#333] shadow-sm backdrop-blur-md transition-colors hover:border-primary hover:bg-primary/10 dark:border-gray-500 dark:bg-gray-700/70 dark:text-gray-100 dark:hover:border-primary dark:hover:bg-gray-700 sm:text-base ${focusClasses}`}
            >
              {content.secondaryAction}
            </a>
          </div>

          <ul className="mt-8 flex w-full max-w-xl flex-wrap justify-center gap-x-5 gap-y-3 text-xs font-medium text-foreground-muted dark:text-gray-200 lg:justify-start">
            {content.assurances.map((item) => (
              <li
                key={item}
                className="flex items-center justify-center gap-2 lg:justify-start"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual content={content.visual} />
      </div>
    </section>
  );
}

export default HeroSection;
