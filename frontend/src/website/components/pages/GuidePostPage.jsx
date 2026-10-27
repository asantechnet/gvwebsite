import BlogPostPage from '@pages/BlogPostPage.jsx'
import examImages from '@website/data/examImages.js'

function GuidePostPage({ guide, content, type, postShell }) {
  if (type === 'exam') {
    const post = {
      slug: guide.slug,
      category: content.breadcrumbs.exams,
      title: guide.name,
      description: guide.summary,
      image: examImages[guide.slug] || guide.image,
      imageAlt: guide.name,
    }
    const guideContent = {
      ...postShell,
      countries: undefined,
      countriesTitle: undefined,
      parentHref: '/opportunities/exams',
      parentLabel: content.breadcrumbs.exams,
      backHref: '/opportunities/exams',
      backLabel: content.ui.examGuides,
      highlight: content.ui.examIntro,
      sections: [{ title: guide.name, body: guide.summary, items: guide.sections }],
      sourcesTitle: content.ui.officialSite,
      sourcesNote: content.ui.examIntro,
      sources: [{ label: `${guide.name}؛ ${content.ui.officialSite}`, href: guide.officialHref }],
    }

    return <BlogPostPage post={post} content={guideContent} />
  }

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
