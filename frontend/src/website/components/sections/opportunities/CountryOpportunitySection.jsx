import OpportunityDirectorySection from './OpportunityDirectorySection.jsx'

function CountryOpportunitySection({ content, countries, type, title }) {
  const cards = countries.map((country) => ({ ...country, href: `/opportunities/${type}/${country.slug}` }))
  return <OpportunityDirectorySection content={content} cards={cards} title={title} />
}

export default CountryOpportunitySection
