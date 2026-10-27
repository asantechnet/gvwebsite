import OpportunityDirectorySection from './OpportunityDirectorySection.jsx'
import examImages from '@website/data/examImages.js'

function ExamsOpportunitySection({ content, exams }) {
  const cards = exams.map((exam) => ({
    ...exam,
    image: examImages[exam.slug] || exam.image,
    imageAlt: exam.name,
    href: `/opportunities/exams/${exam.slug}`,
  }))
  return <OpportunityDirectorySection content={content} cards={cards} title={content.guideLinksTitle} />
}

export default ExamsOpportunitySection
