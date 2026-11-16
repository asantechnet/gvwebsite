import BlogPostPage from '@pages/BlogPostPage.jsx'

function ServicePostPage({ service, content, postShell }) {
  const post = { ...service, category: content.ui.services, imageAlt: service.imageAlt || service.title }
  const postContent = {
    ...postShell,
    countries: undefined,
    countriesTitle: undefined,
    parentLabel: content.ui.services,
    parentHref: '/services',
    backLabel: content.ui.back,
    backHref: '/services',
    highlight: content.ui.important,
    sections: [
      { title: content.ui.whoFor, body: service.audience },
      { title: content.ui.included, body: service.description, items: service.included },
      { title: content.ui.process, body: content.ui.processIntro, items: service.process },
      { title: content.ui.prepare, body: content.ui.prepareIntro, items: service.prepare },
    ],
    sources: [],
  }

  return <BlogPostPage post={post} content={postContent} />
}

export default ServicePostPage
