function ProcessStep({ icon: Icon, number, title, description }) {
  return (
    <li className="relative z-10 flex h-full flex-col items-center text-center">
      <div className="relative grid size-16 place-items-center rounded-full border-4 border-surface-muted bg-surface text-primary shadow-md dark:border-gray-800 dark:bg-gray-700">
        <Icon aria-hidden="true" className="size-7" />
        <span className="absolute -top-2 -inset-e-2 grid size-7 place-items-center rounded-full bg-primary font-heading text-xs font-extrabold text-brand-white shadow-sm">{number}</span>
      </div>
      <div className="group relative mt-5 flex min-h-52 h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-surface px-5 py-6 shadow-[0_12px_30px_rgba(41,23,18,0.06)] transition-colors duration-300 ease-out hover:border-primary/30 hover:bg-primary/1.5 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-primary/40 dark:hover:bg-gray-700/60 sm:px-6">
        <span aria-hidden="true" className="absolute -inset-e-10 -top-12 size-32 rounded-full bg-primary/10 blur-2xl transition-colors duration-300 ease-out group-hover:bg-primary/15" />
        <div className="relative flex items-center justify-between border-b border-border/70 pb-4 dark:border-gray-600">
          <span className="font-heading rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">{number}</span>
          <span className="h-1.5 w-12 rounded-full bg-primary/20 transition-colors duration-300 ease-out group-hover:bg-primary/40" />
        </div>
        <h3 className="relative mt-5 font-heading text-xl font-extrabold leading-snug text-foreground dark:text-gray-100">{title}</h3>
        <p className="relative mt-3 text-sm leading-8 text-foreground-muted dark:text-gray-300">{description}</p>
        <div aria-hidden="true" className="relative mt-auto flex gap-1.5 pt-5">
          <span className="h-1 flex-1 rounded-full bg-primary" />
          <span className="h-1 w-2 rounded-full bg-primary/20" />
          <span className="h-1 w-2 rounded-full bg-primary/20" />
        </div>
      </div>
    </li>
  );
}

export default ProcessStep;
