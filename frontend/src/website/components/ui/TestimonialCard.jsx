import { Quote, Star } from "lucide-react";

function TestimonialCard({ quote, name, role, avatar, avatarAlt }) {
  return (
    <figure className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-5 shadow-sm transition-colors duration-300 hover:border-primary/40 hover:bg-primary/[0.015] dark:border-gray-600 dark:bg-gray-700 dark:hover:border-primary/60 dark:hover:bg-gray-700/70 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-white">
          <Quote aria-hidden="true" className="size-5" />
        </span>
        <span className="flex gap-0.5 text-primary" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} aria-hidden="true" className="size-3.5 fill-current" />
          ))}
        </span>
      </div>

      <blockquote className="mt-6 flex-1 text-sm leading-8 text-foreground-muted dark:text-gray-200">
        «{quote}»
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4 dark:border-gray-600">
        <img
          src={avatar}
          alt={avatarAlt}
          width="40"
          height="40"
          className="size-10 shrink-0 rounded-full object-cover"
        />
        <span className="flex flex-col gap-0.5">
          <span className="font-heading text-sm font-extrabold text-foreground dark:text-gray-100">
            {name}
          </span>
          <span className="text-xs text-foreground-muted dark:text-gray-300">
            {role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export default TestimonialCard;
