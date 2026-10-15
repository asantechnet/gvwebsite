import { ArrowLeft } from 'lucide-react'

import PageHero from '@shared/PageHero.jsx'
import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function DirectorySection({ title, description, homeLabel, items, actionLabel }) {
  return <>
    <PageHero title={title} description={description} breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]} />
    <Section className="bg-background pt-0"><Container><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.href} className="flex min-h-64 flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-colors hover:border-primary dark:border-gray-600 dark:bg-[#2b3442]"><img src={item.image} alt="" className="h-36 w-full object-cover" /><div className="flex flex-1 flex-col p-5 text-right"><h2 className="font-heading text-xl font-extrabold text-foreground">{item.title}</h2><p className="mt-2 text-sm leading-7 text-foreground-muted">{item.description}</p><a href={item.href} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary transition-colors hover:text-primary-hover">{actionLabel}<ArrowLeft aria-hidden="true" size={17} /></a></div></article>)}</div></Container></Section>
  </>
}

export default DirectorySection
