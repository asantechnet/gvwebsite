import OpportunityDirectorySection from '@sections/opportunities/OpportunityDirectorySection.jsx'

function TourismDirectorySection({ content, sidebarContent, type }) {
  const cards = content.cards.map((card) => ({ ...card, href: `/tourism/${type}/${card.slug}` }))
  return <OpportunityDirectorySection content={sidebarContent} cards={cards} title={content.cardsTitle} />
}

export default TourismDirectorySection
