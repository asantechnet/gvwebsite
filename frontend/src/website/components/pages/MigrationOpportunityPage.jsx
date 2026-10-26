import CountryOpportunitySection from '@sections/opportunities/CountryOpportunitySection.jsx'

function MigrationOpportunityPage({ content, countries, title }) {
  return <CountryOpportunitySection content={content} countries={countries} type="migration" title={title} />
}

export default MigrationOpportunityPage
