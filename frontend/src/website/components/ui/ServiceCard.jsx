import { ArrowLeft } from "lucide-react";
import { useLocalizedHref } from "@website/hooks/useWebsiteLanguage.js";

const focusClasses =
  "focus:outline-none focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-md";

function ServiceCard({ icon: Icon, number, title, description, action, href }) {
  const localizedHref = useLocalizedHref(href);
  return (
    <article className="group relative flex min-h-56 flex-col overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md dark:border-gray-600 dark:bg-gray-700 dark:hover:border-primary/60 sm:p-6">
      <span aria-hidden="true" className="absolute -end-8 -top-10 size-24 rounded-full bg-primary/10 blur-2xl transition-colors duration-300 group-hover:bg-primary/20" />
      <div className="relative flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-white">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <span className="font-heading rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">
          {number}
        </span>
      </div>
      <h3 className="relative mt-5 font-heading text-lg font-extrabold text-foreground dark:text-gray-100">
        {title}
      </h3>
      <p className="relative mt-2 text-sm leading-7 text-foreground-muted dark:text-gray-300">
        {description}
      </p>
      <a
        href={localizedHref}
        className={`relative mt-auto inline-flex min-h-10 items-center gap-2 self-start pt-4 text-sm font-bold text-primary transition-colors hover:text-primary-hover dark:hover:text-primary ${focusClasses}`}
      >
        {action}
        <ArrowLeft
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
        />
      </a>
    </article>
  );
}

export default ServiceCard;
