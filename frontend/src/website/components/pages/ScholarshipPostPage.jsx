import BlogPostPage from '@pages/BlogPostPage.jsx'

function ScholarshipPostPage({ scholarship, content, postShell }) {
  const post = {
    ...scholarship,
    slug: scholarship.slug,
    category: content.detail.parentLabel,
    title: scholarship.title,
    description: scholarship.summary,
    image: scholarship.image,
    imageAlt: scholarship.title,
    content: scholarship.overview || '',
    facts: [
      { label: content.filters.degree, value: scholarship.degree },
      { label: content.filters.funding, value: scholarship.funding },
      { label: content.filters.deadline, value: scholarship.deadline },
      { label: content.filters.country, value: scholarship.country },
    ],
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
    sections: [
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
    sources: [{ label: `${scholarship.provider}؛ ${content.detail.officialSite}`, href: scholarship.officialHref }],
  }

  return <BlogPostPage post={post} content={detailContent} />
}

export default ScholarshipPostPage
