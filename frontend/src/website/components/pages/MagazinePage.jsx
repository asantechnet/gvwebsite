import PageHero from '@shared/PageHero.jsx'
import MagazineArticlesSection from '@sections/magazine/MagazineArticlesSection.jsx'
import MagazineNewsSection from '@sections/magazine/MagazineNewsSection.jsx'

function MagazinePage({ content, language }) {
  return (
    <>
      <PageHero {...content.hero} />
      <MagazineNewsSection content={content.news} language={language} />
      <MagazineArticlesSection content={{ ...content.articles, items: content.news.items }} />
      <MagazineNewsSection content={{ ...content.news, title: content.popular.title }} language={language} titleId="magazine-popular-title" />
    </>
  )
}

export default MagazinePage
