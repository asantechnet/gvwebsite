import BlogPostPage from '@pages/BlogPostPage.jsx'
import ExamGuideSection from '@sections/posts/ExamGuideSection.jsx'

function GuidePostPage({ guide, content, type, postShell }) {
  if (type === 'exam') return <ExamGuideSection exam={guide} content={content} />

  const isScholarshipGuide = type === 'scholarship'
  const title = isScholarshipGuide ? `${content.ui.scholarshipGuide} ${guide.name}` : guide.name
  const facts = [
    `${content.ui.currency}: ${guide.currency}`,
    `${content.ui.languages}: ${guide.languages}`,
    `${content.ui.population}: ${guide.population}`,
    `${content.ui.capital}: ${guide.capital}`,
  ]
  const post = { slug: guide.slug, category: content.ui.countries, title, description: guide.summary, image: guide.image, imageAlt: guide.name }
  const guideContent = {
    ...postShell,
    countries: undefined,
    countriesTitle: undefined,
    parentHref: '/opportunities/country',
    parentLabel: content.breadcrumbs.countries,
    backHref: isScholarshipGuide ? `/opportunities/country/${guide.slug}` : '/opportunities/country',
    backLabel: isScholarshipGuide ? guide.name : content.ui.backCountries,
    highlight: content.ui.disclaimer,
    sections: isScholarshipGuide ? [{ title: content.ui.scholarships, body: guide.summary, items: guide.scholarships }] : [
      { title: content.ui.facts, body: guide.summary, items: facts },
      { title: content.ui.scholarships, body: content.ui.disclaimer, items: guide.scholarships, links: [{ label: content.ui.viewScholarships, href: `/opportunities/country/${guide.slug}/scholarships` }] },
    ],
    sources: [],
  }

  return <BlogPostPage post={post} content={guideContent} />
}

export default GuidePostPage
