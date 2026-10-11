import Container from '@ui/Container.jsx'
import PostCarousel from '@ui/PostCarousel.jsx'
import Section from '@ui/Section.jsx'

function MagazineNewsSection({ content, language, titleId = 'magazine-news-title' }) {
  return (
    <Section aria-labelledby={titleId} className="bg-background pt-0">
      <Container>
        <div className="mb-8 text-center">
          <h2 id={titleId} className="font-heading text-xl font-extrabold text-foreground md:text-2xl">{content.title}</h2>
        </div>
        <PostCarousel items={content.items} language={language} labels={{ previous: content.previousLabel, next: content.nextLabel, pagination: content.paginationLabel, page: content.pageLabel, viewsLabel: content.viewsLabel }} />
      </Container>
    </Section>
  )
}

export default MagazineNewsSection
