import PageHero from '@shared/PageHero.jsx'
import MagazineArticlesSection from '@sections/magazine/MagazineArticlesSection.jsx'
import MagazineNewsSection from '@sections/magazine/MagazineNewsSection.jsx'

function MagazinePage({ content, language }) {
  return (
    <>
      {content.hero.visible !== false && <PageHero {...content.hero} />}
      {content.news.visible !== false && <MagazineNewsSection content={content.news} language={language} />}
      {content.articles.visible !== false && <MagazineArticlesSection content={content.articles} />}
    </>
  )
}

export default MagazinePage
