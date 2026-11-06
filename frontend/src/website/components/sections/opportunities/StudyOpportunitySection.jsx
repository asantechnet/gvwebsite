import OpportunityDirectorySection from './OpportunityDirectorySection.jsx'
import { STUDY_DIRECTORY_CARD_LIMIT } from '@website/utils/cardCounts.js'

function StudyOpportunitySection({ content, countries, title }) {
  const cards = countries.slice(0, STUDY_DIRECTORY_CARD_LIMIT).map((country) => ({ ...country, href: `/opportunities/study/${country.slug}` }))
  return <OpportunityDirectorySection content={content} cards={cards} title={title} />
}

export default StudyOpportunitySection
