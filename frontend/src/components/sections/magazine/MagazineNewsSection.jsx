import Container from '@ui/Container.jsx'
import PostCarousel from '@ui/PostCarousel.jsx'
import Section from '@ui/Section.jsx'

function MagazineNewsSection({ content, language }) {
  return (
    <Section aria-labelledby="magazine-news-title" className="bg-background pt-0">
      <Container>
        <div className="mb-8 text-center">
          <h2 id="magazine-news-title" className="font-heading text-xl font-extrabold text-foreground md:text-2xl">{content.title}</h2>
        </div>
        <PostCarousel items={content.items} language={language} labels={{ previous: content.previousLabel, next: content.nextLabel, pagination: content.paginationLabel, page: content.pageLabel }} />
      </Container>
    </Section>
  )
}

export default MagazineNewsSection
