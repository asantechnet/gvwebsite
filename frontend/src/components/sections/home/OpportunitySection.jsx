import {
  ArrowLeft,
  BriefcaseBusiness,
  GraduationCap,
  Plane,
  Sparkles,
} from "lucide-react";

const opportunityIcons = {
  academic: GraduationCap,
  migration: Plane,
  work: BriefcaseBusiness,
};

const focusClasses =
  "focus:outline-none focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-md";

function OpportunityCard({ item }) {
  const Icon = opportunityIcons[item.id];

  return (
    <article className="group relative min-h-80 overflow-hidden rounded-3xl border border-border border-t-2 border-t-primary/30 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:border-t-primary hover:shadow-xl dark:border-gray-600 dark:border-t-primary/40 dark:bg-gray-700 dark:hover:border-primary/60 dark:hover:border-t-primary">
      <div className="flex min-h-80 flex-col p-6 sm:p-7">
        <div className="relative flex items-start justify-between gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-white">
            <Icon aria-hidden="true" className="size-7" />
          </span>
          <span className="rounded-full border border-border bg-surface-muted px-3 py-1 font-heading text-xs font-bold text-foreground-muted dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
            {item.number}
          </span>
        </div>
        <div className="relative mt-auto">
          <h3 className="font-heading text-xl font-extrabold text-foreground dark:text-gray-100 sm:text-2xl">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-foreground-muted dark:text-gray-300">
            {item.description}
          </p>
          <a
            href={item.href}
            className={`mt-6 inline-flex min-h-11 w-full items-center justify-between gap-2 border-t border-border px-2 pt-4 text-sm font-bold text-primary transition-colors hover:text-primary-hover dark:border-gray-600 dark:hover:text-primary ${focusClasses}`}
          >
            {item.action}
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
            />
          </a>
        </div>
      </div>
    </article>
  );
}

function OpportunitySection({ content }) {
  return (
    <section
      aria-labelledby="home-opportunities-heading"
      className="border-t border-border bg-surface-muted/30 dark:border-gray-600 dark:bg-gray-800/30"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-20 xl:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles aria-hidden="true" className="size-4" />
            {content.eyebrow}
          </span>
          <h2
            id="home-opportunities-heading"
            className="font-heading mt-4 text-3xl font-extrabold leading-tight text-foreground dark:text-gray-50 sm:text-4xl lg:text-5xl"
          >
            {content.titleBefore}{" "}
            <span className="text-primary">{content.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-foreground-muted dark:text-gray-300 sm:text-base">
            {content.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.cards.map((item) => (
            <OpportunityCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="/opportunities"
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-brand-white shadow-md transition-colors hover:bg-primary-hover ${focusClasses}`}
          >
            {content.viewAll}
            <ArrowLeft aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default OpportunitySection;
