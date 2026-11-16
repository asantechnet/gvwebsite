import BlogPostPage from '@pages/BlogPostPage.jsx'
import useWebsiteLanguage from '@website/hooks/useWebsiteLanguage.js'
import { getTourismCategory } from '@/shared/utils/contentCategories.js'

function TourismPage({ content, card }) {
  const language = useWebsiteLanguage()
  const locale = language === 'dr' ? 'prs' : language
  const category = getTourismCategory(content.id, locale)
  const post = card.cmsManaged
    ? { ...card, category, title: card.title || card.name, imageAlt: card.imageAlt || card.title || card.name }
    : { ...content.post, ...card, category, title: card.name, imageAlt: card.imageAlt || card.name }
  const postContent = {
    ...content.postDetail,
    parentHref: `/tourism/${content.id}`,
    sections: [{ title: card.name, body: card.description, items: card.highlights }, ...content.postDetail.sections],
  }

  return <BlogPostPage post={post} content={postContent} />
}

export default TourismPage
