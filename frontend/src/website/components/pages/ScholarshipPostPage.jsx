import BlogPostPage from '@pages/BlogPostPage.jsx'
import useWebsiteLanguage from '@website/hooks/useWebsiteLanguage.js'
import { formatScholarshipDeadline } from '@website/utils/scholarshipDate.js'

function ScholarshipPostPage({ scholarship, content, postShell }) {
  const language = useWebsiteLanguage()
  const isCmsManaged = Boolean(scholarship.cmsManaged)
  const post = {
    ...scholarship,
    slug: scholarship.slug,
    category: content.detail.parentLabel,
    title: scholarship.title,
    description: isCmsManaged ? '' : scholarship.summary,
    image: scholarship.image,
    imageAlt: scholarship.title,
    content: scholarship.overview || '',
    facts: [
      { label: content.filters.degree, value: scholarship.degree },
      { label: content.filters.funding, value: scholarship.funding },
      { label: content.filters.deadline, value: formatScholarshipDeadline(scholarship.deadline, language, scholarship.slug) },
      { label: content.filters.country, value: scholarship.country },
    ].filter((fact) => fact.value),
  }
  const detailContent = {
    ...postShell,
    countries: undefined,
    countriesTitle: undefined,
    parentHref: '/scholarships',
    parentLabel: content.detail.parentLabel,
    backHref: '/scholarships',
    backLabel: content.detail.backLabel,
    highlight: content.detail.highlight,
    sections: isCmsManaged ? [] : [
      {
        title: content.detail.overview,
        body: scholarship.overview,
        items: [scholarship.provider],
      },
      { title: content.detail.eligibility, body: scholarship.summary, items: scholarship.eligibility },
      { title: content.detail.benefits, body: scholarship.overview, items: scholarship.benefits },
      { title: content.detail.documents, body: content.detail.highlight, items: scholarship.documents },
    ],
    sourcesTitle: content.detail.officialSources,
    sourcesNote: content.detail.officialNote,
    sources: isCmsManaged ? [] : [{ label: `${scholarship.provider}؛ ${content.detail.officialSite}`, href: scholarship.officialHref }],
  }

  return <BlogPostPage post={post} content={detailContent} hideSidebar={isCmsManaged} />
}

export default ScholarshipPostPage
