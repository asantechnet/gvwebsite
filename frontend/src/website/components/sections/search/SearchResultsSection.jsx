import { ArrowLeft, SearchX } from 'lucide-react'

import PageHero from '@shared/PageHero.jsx'
import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function SearchResultsSection({ content, query, results }) {
  return <><PageHero title={content.title} description={content.description} /><Section className="bg-background pt-0"><Container><div className="mx-auto max-w-5xl"><h2 className="font-heading text-xl font-extrabold text-foreground">{query ? `${content.resultsFor}: ${query}` : content.prompt}</h2>{query && results.length === 0 ? <div className="mt-8 flex flex-col items-center rounded-3xl border border-border bg-surface p-10 text-center dark:border-gray-600 dark:bg-[#2b3442]"><SearchX aria-hidden="true" size={40} className="text-accent-text" /><p className="mt-4 text-foreground-muted">{content.empty}</p></div> : <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map((result) => <article key={result.href} className="flex flex-col rounded-3xl border border-border bg-surface p-5 text-start dark:border-gray-600 dark:bg-[#2b3442]"><h3 className="font-heading text-lg font-extrabold text-foreground">{result.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-7 text-foreground-muted">{result.description}</p><a href={result.href} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-accent-text">{content.view}<ArrowLeft aria-hidden="true" size={16} /></a></article>)}</div>}</div></Container></Section></>
}

export default SearchResultsSection
