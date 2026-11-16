import StudyOpportunitySection from '@sections/opportunities/StudyOpportunitySection.jsx'

function StudyOpportunityPage({ content, countries, title, cmsManaged = false }) {
  return <StudyOpportunitySection content={content} countries={countries} title={title} cmsManaged={cmsManaged} />
}

export default StudyOpportunityPage
