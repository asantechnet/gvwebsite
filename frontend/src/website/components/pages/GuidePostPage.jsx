import BlogPostPage from '@pages/BlogPostPage.jsx'
import examImages from '@website/data/examImages.js'

function GuidePostPage({ guide, content, postShell }) {
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
    parentHref: '/opportunities/study',
    parentLabel: content.ui.opportunities,
    backHref: '/opportunities/study',
    backLabel: content.ui.opportunities,
    highlight: content.ui.examIntro,
    sections: [{ title: guide.name, body: guide.summary, items: guide.sections }],
    sourcesTitle: content.ui.officialSite,
    sourcesNote: content.ui.examIntro,
    sources: [{ label: `${guide.name}؛ ${content.ui.officialSite}`, href: guide.officialHref }],
  }

  return <BlogPostPage post={post} content={guideContent} />
}

export default GuidePostPage
