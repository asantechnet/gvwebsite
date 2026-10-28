import BlogPostPage from '@pages/BlogPostPage.jsx'

function TourismPage({ content, card }) {
  const post = { ...content.post, ...card, title: card.name, imageAlt: card.imageAlt || card.name }
  const postContent = {
    ...content.postDetail,
    parentHref: `/tourism/${content.id}`,
    sections: [{ title: card.name, body: card.description, items: card.highlights }, ...content.postDetail.sections],
  }

  return <BlogPostPage post={post} content={postContent} />
}

export default TourismPage
