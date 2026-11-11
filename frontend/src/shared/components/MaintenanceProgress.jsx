import SkeletonBlock from './SkeletonBlock.jsx'

function MaintenanceProgress() {
  return <main className="grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-10" role="status" aria-live="polite" aria-busy="true" aria-label="Loading maintenance page">
    <span className="sr-only">Loading maintenance page</span>
    <section className="relative isolate flex w-full max-w-2xl items-center justify-center overflow-visible rounded-[2rem] border border-border bg-surface px-6 pt-28 pb-8 shadow-2xl shadow-brand-orange/10 sm:px-12 sm:pt-28 sm:pb-10 lg:py-10">
      <span className="pointer-events-none absolute -end-20 -top-24 -z-10 size-64 rounded-full bg-brand-orange/15 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-28 -start-20 -z-10 size-64 rounded-full bg-brand-red/10 blur-3xl" />
      <div className="absolute left-4 top-4 z-10 flex gap-2"><SkeletonBlock className="h-10 w-[6.5rem] rounded-xl" /><SkeletonBlock className="size-10 rounded-xl" /></div>
      <div className="relative z-0 mx-auto w-full max-w-xl text-center"><SkeletonBlock className="mx-auto h-12 w-52 rounded-none bg-primary/15" /><SkeletonBlock className="mx-auto mt-7 h-4 w-24 rounded-full bg-primary/20" /><SkeletonBlock className="mx-auto mt-3 h-11 w-[min(100%,24rem)] rounded-xl bg-foreground/15" /><SkeletonBlock className="mx-auto mt-5 h-8 w-[min(100%,25rem)] rounded-xl" /><SkeletonBlock className="mx-auto mt-7 h-4 w-52 rounded-full bg-primary/15" /></div>
    </section>
  </main>
}

export default MaintenanceProgress
