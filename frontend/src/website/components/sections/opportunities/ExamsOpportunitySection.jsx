import { BookOpenCheck, Brain, Calculator, Languages, ListChecks, Sigma } from 'lucide-react'
import OpportunityDirectorySection from './OpportunityDirectorySection.jsx'

const examIcons = { ielts: Languages, toefl: BookOpenCheck, duolingo: Brain, sat: Calculator, gre: Sigma, gmat: ListChecks }

function ExamsOpportunitySection({ content, exams }) {
  const cards = exams.map((exam) => ({ ...exam, href: `/opportunities/exams/${exam.slug}`, icon: examIcons[exam.slug] || BookOpenCheck }))
  return <OpportunityDirectorySection content={content} cards={cards} title={content.guideLinksTitle} />
}

export default ExamsOpportunitySection
