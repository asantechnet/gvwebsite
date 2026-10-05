import { ArrowLeft } from "lucide-react";

const variants = {
  primary:
    "border-primary bg-primary text-brand-white shadow-md hover:border-primary-hover hover:bg-primary-hover",
  secondary:
    "border-primary bg-surface text-primary shadow-sm hover:bg-primary hover:text-brand-white dark:bg-gray-700 dark:hover:bg-primary",
  outline:
    "border-border bg-surface/80 text-foreground shadow-sm backdrop-blur-md hover:border-primary hover:bg-primary/10 dark:border-gray-500 dark:bg-gray-700/70 dark:text-gray-100 dark:hover:border-primary dark:hover:bg-gray-700",
};

const focusClasses =
  "focus:outline-none focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-md";

function ActionLink({
  href,
  children,
  variant = "primary",
  className = "",
  icon: Icon = ArrowLeft,
}) {
  return (
    <a
      href={href}
      className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-6 text-sm font-bold transition-colors duration-300 ${variants[variant]} ${focusClasses} ${className}`.trim()}
    >
      {children}
      {Icon && (
        <Icon
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
        />
      )}
    </a>
  );
}

export default ActionLink;
