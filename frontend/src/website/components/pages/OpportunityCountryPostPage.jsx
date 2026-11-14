import BlogPostPage from '@pages/BlogPostPage.jsx'

function OpportunityCountryPostPage({ country, opportunity, type }) {
  const category = opportunity.post.category
  const post = country.cmsManaged
    ? { ...country, category, title: country.title || country.name, description: country.description || country.summary, imageAlt: country.imageAlt || country.title || country.name }
    : { ...opportunity.post, slug: `${type}-${country.slug}`, title: `${category} در ${country.name}`, description: `${opportunity.post.description} ${country.summary}`, image: country.image, imageAlt: country.name }
  const facts = [country.capital, country.languages, country.currency].filter(Boolean)
  const content = { ...opportunity.postDetail, countries: undefined, countriesTitle: undefined, parentHref: `/opportunities/${type}`, parentLabel: category, backHref: `/opportunities/${type}`, sections: [{ title: country.name, body: country.summary, items: facts }, ...(opportunity.postDetail.sections || [])] }
  return <BlogPostPage post={post} content={content} />
}

export default OpportunityCountryPostPage
