import CountryOpportunitySection from '@sections/opportunities/CountryOpportunitySection.jsx'

function WorkOpportunityPage({ content, countries, title }) {
  return <CountryOpportunitySection content={content} countries={countries} type="work" title={title} />
}

export default WorkOpportunityPage
