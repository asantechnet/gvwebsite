import CountryOpportunitySection from '@sections/opportunities/CountryOpportunitySection.jsx'

function CountryOpportunityPage({ content, countries, title }) {
  return <CountryOpportunitySection content={content} countries={countries} type="country" title={title} />
}

export default CountryOpportunityPage
