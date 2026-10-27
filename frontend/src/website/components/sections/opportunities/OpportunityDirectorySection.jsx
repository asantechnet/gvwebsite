import Container from '@ui/Container.jsx'
import ContentSidebar from '@ui/ContentSidebar.jsx'
import Section from '@ui/Section.jsx'

function OpportunityCard({ card }) {
  const Icon = card.icon
  return <a href={card.href} aria-label={card.name} className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200 hover:border-primary hover:shadow-[0_12px_28px_rgba(54,69,77,0.12)] dark:border-gray-600 dark:bg-gray-800"><div className="relative aspect-video overflow-hidden bg-surface-muted dark:bg-gray-700">{Icon ? <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 to-surface-muted text-primary dark:to-gray-700"><Icon className="size-14 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.7} /></div> : <img src={card.image} alt={card.imageAlt || card.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}<span className="absolute inset-x-3 bottom-2 flex items-center justify-between gap-2 rounded-lg bg-black/55 px-3 py-1.5 text-right text-xs font-bold text-white backdrop-blur-sm"><span>{card.name}</span>{card.flag && <img src={card.flag} alt="" aria-hidden="true" className="h-5 w-7 rounded-sm object-cover shadow-sm" />}</span></div></a>
}

function OpportunityDirectorySection({ content, cards, title }) {
  return (
    <Section padded={false} className="bg-background py-6 md:py-10 lg:py-14">
      <Container>
        <article className="mx-auto max-w-6xl rounded-4xl">
          <div className="grid gap-6 p-3 md:p-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:p-8">
            <main className="order-1 h-fit min-w-0 self-start text-right">
              <section aria-label={title}>
                <h1 className="mb-4 text-right font-heading text-lg font-extrabold text-foreground">{title}</h1>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {cards.map((card) => <OpportunityCard key={card.cardKey || card.href} card={card} />)}
                </div>
              </section>
            </main>

            <ContentSidebar content={content} className="border-t border-border pt-5 dark:border-gray-600 lg:border-t-0 lg:pt-0" />
          </div>
        </article>
      </Container>
    </Section>
  )
}

export default OpportunityDirectorySection
