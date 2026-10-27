import OpportunityDirectorySection from './OpportunityDirectorySection.jsx'

function StudyOpportunitySection({ content, countries, title }) {
  const cards = countries.slice(0, 3).map((country) => ({ ...country, href: `/opportunities/study/${country.slug}` }))
  return <OpportunityDirectorySection content={content} cards={cards} title={title} />
}

export default StudyOpportunitySection
