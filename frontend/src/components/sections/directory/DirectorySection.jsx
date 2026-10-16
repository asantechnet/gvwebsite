import { ArrowLeft, Sparkles } from 'lucide-react'

import PageHero from '@shared/PageHero.jsx'
import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function DirectorySection({ title, description, homeLabel, items, actionLabel }) {
  return <>
    <PageHero title={title} description={description} breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]} />
    <Section className="bg-background pt-0"><Container>
      <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-surface to-surface p-6 shadow-sm dark:border-primary/20 dark:from-primary/10 dark:via-[#2b3442] dark:to-[#222d3b] md:p-8">
        <div className="pointer-events-none absolute -left-14 -top-16 size-44 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4 text-right">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-[#fff8f3] shadow-lg shadow-primary/20"><Sparkles aria-hidden="true" size={23} /></span>
            <div><p className="text-sm font-bold text-primary">Global Vision</p><h2 className="mt-1 font-heading text-xl font-extrabold text-foreground md:text-2xl">{title}</h2></div>
          </div>
          <p className="max-w-xl text-right text-sm leading-8 text-foreground-muted md:text-left">{description}</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={item.href} className="group relative flex min-h-[25rem] flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 dark:border-gray-600 dark:bg-[#2b3442]">
        <div className="relative h-52 overflow-hidden"><img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" /><span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-xl border border-white/25 bg-black/30 font-heading text-sm font-extrabold text-white backdrop-blur-sm">{String(index + 1).padStart(2, '0')}</span><h2 className="absolute inset-x-5 bottom-4 text-right font-heading text-xl font-extrabold text-white drop-shadow-md">{item.title}</h2></div>
        <div className="flex flex-1 flex-col p-5 text-right"><p className="line-clamp-3 text-sm leading-7 text-foreground-muted">{item.description}</p><a href={item.href} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-primary transition-colors hover:text-primary-hover focus-visible:text-primary-hover">{actionLabel}<ArrowLeft aria-hidden="true" size={17} className="transition-transform duration-300 group-hover:-translate-x-1" /></a></div><span className="pointer-events-none absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" aria-hidden="true" />
      </article>)}</div>
    </Container></Section>
  </>
}

export default DirectorySection
