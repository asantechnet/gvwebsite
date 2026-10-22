import SkeletonBlock from '@ui/SkeletonBlock.jsx'

const list = (count) => Array.from({ length: count }, (_, index) => index)
const Lines = () => <div className="space-y-3"><SkeletonBlock className="h-3.5 w-full" /><SkeletonBlock className="h-3.5 w-[90%]" /><SkeletonBlock className="h-3.5 w-[68%]" /></div>
const Heading = ({ start = false }) => <div className={`flex max-w-2xl flex-col gap-4 ${start ? 'items-start' : 'mx-auto items-center'}`}><SkeletonBlock className="h-3 w-28 bg-primary/20" /><SkeletonBlock className="h-9 w-3/4" /><SkeletonBlock className="h-4 w-2/3" /></div>

function HeaderSkeleton() {
  return <header className="h-15 border-b border-border bg-surface xl:h-18"><div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 xl:px-8"><SkeletonBlock className="h-11 w-16 shrink-0 rounded-2xl bg-primary/20 xl:h-13 xl:w-19" /><div className="hidden items-center gap-2 xl:flex">{list(6).map((item) => <SkeletonBlock key={item} className="h-10 w-20 rounded-xl" />)}</div><div className="flex shrink-0 items-center gap-2 xl:gap-3"><SkeletonBlock className="h-10 w-14 rounded-xl" /><SkeletonBlock className="size-10 rounded-xl" /><SkeletonBlock className="size-10 rounded-xl" /><SkeletonBlock className="hidden h-10 w-28 rounded-xl bg-primary/20 xl:block" /><SkeletonBlock className="size-10 rounded-xl xl:hidden" /></div></div></header>
}

function FooterSkeleton() {
  return <footer className="border-t border-border bg-surface px-5 py-12"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">{list(4).map((column) => <div key={column} className="space-y-4"><SkeletonBlock className="h-6 w-32 bg-primary/15" />{list(column ? 6 : 3).map((row) => <SkeletonBlock key={row} className="h-3.5 w-full max-w-44" />)}</div>)}</div><SkeletonBlock className="mx-auto mt-10 h-px max-w-7xl rounded-none" /></footer>
}

function PageHero() {
  return <section className="bg-background px-4 py-6 md:px-6 md:py-10 lg:pb-20 lg:pt-12"><div className="mx-auto flex min-h-52 max-w-7xl flex-col items-center justify-center gap-4 rounded-4xl border border-border bg-surface px-6 md:min-h-56"><SkeletonBlock className="h-4 w-28 bg-secondary/15" /><SkeletonBlock className="h-10 w-full max-w-xl" /><SkeletonBlock className="h-4 w-full max-w-2xl" /><SkeletonBlock className="h-4 w-2/3 max-w-xl" /><SkeletonBlock className="mt-2 h-px w-full max-w-2xl rounded-none" /><SkeletonBlock className="h-4 w-48" /></div></section>
}

function Card({ media = true, compact = false }) {
  return <div className="overflow-hidden rounded-3xl border border-border bg-surface">{media && <SkeletonBlock className={`${compact ? 'aspect-[1.45]' : 'h-52'} w-full rounded-none`} />}<div className={compact ? 'flex h-36 flex-col space-y-3 px-4 py-3 md:h-40' : 'space-y-4 p-5'}><SkeletonBlock className="h-6 w-2/3 bg-primary/15" /><Lines />{!compact && <SkeletonBlock className="h-10 w-28" />}</div></div>
}

function DestinationSkeleton({ wide }) {
  return <SkeletonBlock className={`${wide ? 'md:col-span-3' : 'md:col-span-2'} relative h-56 rounded-2xl border border-border/60 bg-[#eadfd7] shadow-sm after:bg-[linear-gradient(105deg,transparent_18%,transparent_38%,rgba(255,255,255,.78)_50%,transparent_62%)] dark:border-gray-600 dark:bg-gray-700 dark:after:bg-[linear-gradient(105deg,transparent_18%,transparent_38%,rgba(255,255,255,.16)_50%,transparent_62%)] md:h-60`}><span className="absolute inset-x-0 top-0 z-[2] flex items-center gap-3 p-5"><span className="size-8 rounded-full border-2 border-white/40 bg-foreground/10 dark:border-white/15 dark:bg-white/10" /><span className="h-8 w-24 rounded-xl bg-foreground/10 dark:bg-white/10 sm:w-28" /></span></SkeletonBlock>
}

function HomeSkeleton() {
  return <>
    <section className="bg-background px-4 py-4 md:px-6 lg:py-10"><div className="mx-auto grid min-h-[34rem] max-w-7xl items-center gap-8 lg:min-h-screen lg:grid-cols-2"><div className="order-2 flex flex-col items-center gap-5 lg:order-1 lg:items-start"><SkeletonBlock className="h-14 w-full max-w-xl" /><SkeletonBlock className="h-14 w-4/5 max-w-lg bg-primary/20" /><div className="w-full max-w-xl"><Lines /></div><div className="flex w-full max-w-sm gap-3"><SkeletonBlock className="h-12 flex-1" /><SkeletonBlock className="h-12 flex-1" /></div></div><SkeletonBlock className="order-1 mx-auto aspect-square w-full max-w-md rounded-full bg-primary/15 lg:order-2" /></div></section>
    <section className="border-t border-border bg-surface-muted/30 px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto max-w-6xl"><Heading /><div className="mt-10 grid gap-5 md:grid-cols-3">{list(3).map((item) => <div key={item} className="flex min-h-72 flex-col rounded-3xl border border-border border-t-2 border-t-primary/30 bg-surface p-5"><div className="flex justify-between"><SkeletonBlock className="size-14 rounded-2xl bg-primary/15" /><SkeletonBlock className="h-7 w-12 rounded-full" /></div><div className="mt-auto"><SkeletonBlock className="h-8 w-2/3" /><div className="mt-4"><Lines /></div><SkeletonBlock className="mt-6 h-px rounded-none" /><SkeletonBlock className="mt-4 h-6 w-full" /></div></div>)}</div><SkeletonBlock className="mx-auto mt-8 h-12 w-36" /></div></section>
    <section className="bg-background px-4 py-16 md:px-6 md:py-20 xl:px-8"><div className="mx-auto max-w-7xl"><SkeletonBlock className="mx-auto h-9 w-72 max-w-[80%]" /><div className="mt-10 grid gap-2 md:grid-cols-6">{list(7).map((item) => <DestinationSkeleton key={item} wide={item < 2 || item > 4} />)}</div><SkeletonBlock className="mx-auto mt-8 h-12 w-36 rounded-xl bg-secondary/20" /></div></section>
    <section className="bg-background px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto max-w-7xl"><Heading /><div className="relative mt-10"><SkeletonBlock className="absolute inset-x-[12.5%] top-8 hidden h-px rounded-none md:block" /><div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">{list(4).map((item) => <div key={item} className="relative z-10 flex flex-col items-center"><SkeletonBlock className="size-16 rounded-full bg-primary/20" /><div className="mt-5 flex min-h-52 w-full flex-col rounded-3xl border border-border bg-surface p-5"><div className="flex justify-between border-b border-border pb-4"><SkeletonBlock className="h-6 w-10 rounded-full" /><SkeletonBlock className="h-1.5 w-12" /></div><SkeletonBlock className="mx-auto mt-5 h-7 w-2/3" /><div className="mt-4"><Lines /></div><div className="mt-auto flex gap-1.5 pt-5"><SkeletonBlock className="h-1 flex-1" /><SkeletonBlock className="h-1 w-2" /><SkeletonBlock className="h-1 w-2" /></div></div></div>)}</div></div></div></section>
    <section className="bg-background px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto grid max-w-7xl gap-10 rounded-4xl border border-border bg-surface-muted/50 p-6 lg:grid-cols-[.72fr_1.28fr] lg:p-10"><div className="self-center"><Heading start /><SkeletonBlock className="mt-7 h-12 w-36" /></div><div className="grid gap-4 sm:grid-cols-2">{list(4).map((item) => <div key={item} className="rounded-3xl border border-border bg-surface p-5"><SkeletonBlock className="size-12 rounded-2xl bg-primary/15" /><SkeletonBlock className="mt-4 h-6 w-2/3" /><div className="mt-4"><Lines /></div></div>)}</div></div></section>
    <section className="bg-background px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto max-w-6xl"><Heading /><div className="mt-10 grid gap-5 md:grid-cols-3">{list(3).map((item) => <div key={item} className="flex min-h-72 flex-col rounded-3xl border border-border bg-surface p-6"><div className="flex justify-between"><SkeletonBlock className="size-11 rounded-2xl bg-primary/15" /><div className="flex gap-1">{list(5).map((star) => <SkeletonBlock key={star} className="size-3.5 bg-primary/20" />)}</div></div><div className="mt-6"><Lines /></div><div className="mt-auto flex items-center gap-3 border-t border-border pt-4"><SkeletonBlock className="size-10 rounded-full" /><div className="space-y-2"><SkeletonBlock className="h-4 w-24" /><SkeletonBlock className="h-3 w-16" /></div></div></div>)}</div></div></section>
    <CtaSkeleton />
  </>
}

function CtaSkeleton() {
  return <section className="bg-background px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto flex max-w-7xl flex-col items-center rounded-[2rem] border border-border bg-surface px-6 py-12"><SkeletonBlock className="size-14 rounded-2xl bg-primary/15" /><SkeletonBlock className="mt-5 h-10 w-full max-w-lg" /><SkeletonBlock className="mt-4 h-4 w-full max-w-xl" /><div className="mt-8 flex gap-3"><SkeletonBlock className="h-12 w-36" /><SkeletonBlock className="h-12 w-36" /></div></div></section>
}

function AboutSkeleton() {
  return <><PageHero />
    <section className="bg-background px-4 pb-20 md:px-6"><div className="mx-auto max-w-4xl"><Heading /><div className="mt-10 grid grid-cols-3 gap-3">{list(3).map((item) => <div key={item} className="flex flex-col items-center gap-3"><SkeletonBlock className="size-9 rounded-full bg-primary/15" /><SkeletonBlock className="h-5 w-24" /><SkeletonBlock className="h-3 w-full" /></div>)}</div></div></section>
    <section className="bg-surface-muted px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">{list(2).map((item) => <div key={item} className={`flex min-h-80 flex-col items-center justify-center border border-border bg-surface p-10 ${item ? 'rounded-tl-[10rem] rounded-br-[10rem]' : 'rounded-tr-[10rem] rounded-bl-[10rem]'}`}><SkeletonBlock className="size-16 rounded-2xl bg-primary/15" /><SkeletonBlock className="mt-5 h-9 w-40" /><div className="mt-5 w-full"><Lines /></div></div>)}</div></section>
    <section className="bg-background px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto max-w-5xl"><Heading /><div className="mt-12 grid gap-8 md:grid-cols-3">{list(3).map((item) => <div key={item} className="flex flex-col items-center"><SkeletonBlock className="size-10 rounded-full bg-primary/20" /><SkeletonBlock className="mt-5 h-6 w-28" /><div className="mt-3 w-full"><Lines /></div></div>)}</div></div></section>
    <section className="bg-surface-muted px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto max-w-7xl"><Heading /><div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-5">{list(5).map((item) => <div key={item} className="rounded-[2rem] border border-border bg-surface p-5"><SkeletonBlock className="mx-auto size-28 rounded-full md:size-32" /><SkeletonBlock className="mx-auto mt-4 h-5 w-24" /><SkeletonBlock className="mx-auto mt-3 h-7 w-20 rounded-full" /></div>)}</div></div></section>
    <section className="bg-surface-muted px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto max-w-3xl"><Heading /><div className="mt-10 space-y-3">{list(5).map((item) => <div key={item} className="flex min-h-16 items-center justify-between rounded-2xl border border-border bg-surface px-6"><SkeletonBlock className="h-5 w-2/3" /><SkeletonBlock className="size-5" /></div>)}</div></div></section><CtaSkeleton />
  </>
}

function DirectorySkeleton({ count }) {
  return <><PageHero /><section className="bg-background px-4 pb-20 md:px-6"><div className="mx-auto max-w-7xl"><div className="mb-8 flex min-h-32 flex-col justify-between gap-5 rounded-[2rem] border border-primary/20 bg-primary/10 p-6 md:flex-row md:items-center md:p-8"><div className="flex items-center gap-4"><SkeletonBlock className="size-12 rounded-2xl bg-primary/25" /><div className="space-y-2"><SkeletonBlock className="h-3 w-24" /><SkeletonBlock className="h-7 w-48" /></div></div><div className="w-full max-w-xl"><Lines /></div></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list(count).map((item) => <div key={item} className="min-h-[25rem]"><Card /></div>)}</div></div></section></>
}

function ContactSkeleton() {
  return <><PageHero /><section className="bg-background px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto max-w-5xl"><div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24"><div><SkeletonBlock className="h-9 w-52" /><div className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">{list(3).map((item) => <div key={item} className="flex gap-4"><SkeletonBlock className="size-12 shrink-0 rounded-full bg-primary/15" /><div className="flex-1 space-y-2"><SkeletonBlock className="h-3 w-20" /><SkeletonBlock className="h-5 w-full max-w-44" /></div></div>)}</div><div className="mt-10 flex gap-3">{list(4).map((item) => <SkeletonBlock key={item} className="size-10 rounded-full" />)}</div></div><div className="space-y-5">{list(3).map((item) => <div key={item} className="space-y-2"><SkeletonBlock className="h-4 w-24" /><SkeletonBlock className="h-12" /></div>)}<div className="space-y-2"><SkeletonBlock className="h-4 w-24" /><SkeletonBlock className="h-32" /></div><SkeletonBlock className="h-10 w-full sm:w-32" /></div></div><SkeletonBlock className="mt-12 h-72 w-full rounded-3xl sm:h-96" /></div></section></>
}

function Carousel() {
  return <section className="bg-background px-4 pb-16 md:px-6 lg:pb-24"><div className="mx-auto max-w-7xl"><SkeletonBlock className="mx-auto mb-8 h-8 w-48" /><div className="relative px-12"><SkeletonBlock className="absolute start-0 top-1/2 size-10 -translate-y-1/2 rounded-full" /><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">{list(5).map((item) => <div key={item} className={item === 0 ? '' : item === 1 ? 'hidden md:block' : item < 4 ? 'hidden lg:block' : 'hidden xl:block'}><Card compact /></div>)}</div><SkeletonBlock className="absolute end-0 top-1/2 size-10 -translate-y-1/2 rounded-full" /></div><div className="mt-5 flex justify-center gap-2">{list(7).map((item) => <SkeletonBlock key={item} className="size-2 rounded-full" />)}</div></div></section>
}

function MagazineSkeleton() {
  return <><PageHero /><Carousel /><section className="bg-surface-muted px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto max-w-7xl"><SkeletonBlock className="mx-auto mb-8 h-8 w-48" /><div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">{list(9).map((item) => <Card key={item} compact />)}</div></div></section><Carousel /></>
}

function SearchSkeleton() {
  return <><PageHero /><section className="bg-background px-4 pb-20 md:px-6"><div className="mx-auto max-w-5xl"><SkeletonBlock className="h-7 w-64" /><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list(6).map((item) => <Card key={item} media={false} />)}</div></div></section></>
}

function ArticleSkeleton() {
  return <section className="bg-background px-4 py-8 md:px-6 lg:py-14"><div className="mx-auto max-w-5xl"><SkeletonBlock className="mb-5 h-4 w-52" /><div className="overflow-hidden rounded-[2rem] border border-border bg-surface"><SkeletonBlock className="aspect-[16/8] w-full rounded-none md:aspect-[16/7]" /><div className="grid gap-8 p-5 md:p-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:p-14"><div className="space-y-8"><SkeletonBlock className="h-7 w-full" /><Lines /><SkeletonBlock className="h-24 w-full rounded-2xl bg-primary/10" />{list(4).map((item) => <div key={item} className="space-y-4 border-b border-border pb-8"><div className="flex gap-3"><SkeletonBlock className="size-11 rounded-xl bg-primary/15" /><SkeletonBlock className="h-8 w-1/2" /></div><Lines /><div className="grid gap-3 sm:grid-cols-2"><SkeletonBlock className="h-12" /><SkeletonBlock className="h-12" /></div></div>)}</div><aside className="space-y-5 border-b border-border pb-5 lg:border-b-0 lg:border-r lg:pr-6"><SkeletonBlock className="h-7 w-24 rounded-full" /><SkeletonBlock className="h-px rounded-none" /><SkeletonBlock className="h-6 w-32" /><div className="grid grid-cols-2 gap-2">{list(6).map((item) => <SkeletonBlock key={item} className="h-16 rounded-xl" />)}</div></aside></div></div></div></section>
}

function ExamSkeleton() {
  return <section className="bg-background px-4 py-8 md:px-6 lg:py-14"><div className="mx-auto max-w-4xl"><SkeletonBlock className="mb-5 h-4 w-64" /><div className="overflow-hidden rounded-[2rem] border border-border bg-surface"><SkeletonBlock className="aspect-[16/7] w-full rounded-none" /><div className="space-y-6 p-5 md:p-10 lg:p-14"><Lines /><SkeletonBlock className="h-24 rounded-2xl bg-primary/10" />{list(3).map((item) => <div key={item} className="flex gap-3"><SkeletonBlock className="size-5 rounded-full bg-primary/20" /><SkeletonBlock className="h-5 flex-1" /></div>)}<SkeletonBlock className="h-11 w-36" /><SkeletonBlock className="h-px rounded-none" /><SkeletonBlock className="h-6 w-40" /></div></div></div></section>
}

function NotFoundSkeleton() {
  return <section className="bg-background px-4 py-16 md:px-6 lg:py-24"><div className="mx-auto flex max-w-2xl flex-col items-center rounded-4xl border border-border bg-surface p-10"><SkeletonBlock className="h-20 w-36 bg-primary/15" /><SkeletonBlock className="mt-5 h-10 w-3/4" /><SkeletonBlock className="mt-4 h-4 w-full" /><SkeletonBlock className="mt-2 h-4 w-2/3" /><SkeletonBlock className="mt-7 h-12 w-36" /></div></section>
}

function Content({ path }) {
  if (path === '/') return <HomeSkeleton />
  if (path === '/about') return <AboutSkeleton />
  if (path === '/contact') return <ContactSkeleton />
  if (path === '/magazine') return <MagazineSkeleton />
  if (path === '/services') return <DirectorySkeleton count={7} />
  if (path === '/opportunities') return <DirectorySkeleton count={5} />
  if (path === '/search') return <SearchSkeleton />
  if (path.startsWith('/opportunities/exams/')) return <ExamSkeleton />
  if (path.startsWith('/services/') || path.startsWith('/opportunities/') || path.startsWith('/magazine/post/')) return <ArticleSkeleton />
  return <NotFoundSkeleton />
}

export default function RouteProgress({ path }) {
  return <div className="overflow-hidden bg-background" role="status" aria-live="polite" aria-busy="true" aria-label="در حال بارگذاری محتوای وب‌سایت"><span className="sr-only">در حال بارگذاری محتوای وب‌سایت</span><HeaderSkeleton /><Content path={path} /><FooterSkeleton /></div>
}
