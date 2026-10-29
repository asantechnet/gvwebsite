import { ArrowLeft } from "lucide-react";
import { useLocalizedHref } from "@website/hooks/useWebsiteLanguage.js";

const focusClasses =
  "focus:outline-none focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-md";

function OpportunityCard({ icon: Icon, number, title, description, action, href }) {
  const localizedHref = useLocalizedHref(href);
  return (
    <article className="home-opportunity-card group relative min-h-72 min-w-0 w-full max-w-md overflow-hidden rounded-3xl border border-border border-t-2 border-t-primary/30 bg-surface shadow-sm transition-all duration-300 hover:border-primary/50 hover:border-t-primary hover:shadow-xl dark:border-gray-600 dark:border-t-primary/40 dark:bg-gray-700 dark:hover:border-primary/60 dark:hover:border-t-primary">
      <div className="flex min-h-72 flex-col p-4 sm:p-5">
        <div className="relative flex items-start justify-between gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-white">
            <Icon aria-hidden="true" className="size-7" />
          </span>
          <span className="rounded-full border border-border bg-surface-muted px-3 py-1 font-heading text-xs font-bold text-foreground-muted dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
            {number}
          </span>
        </div>
        <div className="relative mt-auto">
          <h3 className="font-heading text-xl font-extrabold text-foreground dark:text-gray-100 sm:text-2xl">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-foreground-muted dark:text-gray-300">
            {description}
          </p>
          <a
            href={localizedHref}
            className={`mt-6 inline-flex min-h-11 w-full items-center justify-between gap-2 border-t border-border px-2 pt-4 text-sm font-bold text-primary transition-colors hover:text-primary-hover dark:border-gray-600 dark:hover:text-primary ${focusClasses}`}
          >
            {action}
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

export default OpportunityCard;
