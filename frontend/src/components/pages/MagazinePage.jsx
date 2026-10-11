import PageHero from '@shared/PageHero.jsx'
import MagazineArticlesSection from '@sections/magazine/MagazineArticlesSection.jsx'
import MagazineNewsSection from '@sections/magazine/MagazineNewsSection.jsx'

function MagazinePage({ content }) {
  return (
    <>
      <PageHero {...content.hero} />
      <MagazineNewsSection content={content.news} />
      <MagazineArticlesSection content={content.articles} />
    </>
  )
}

export default MagazinePage
