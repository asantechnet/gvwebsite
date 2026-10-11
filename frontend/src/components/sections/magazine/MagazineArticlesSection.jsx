import Container from '@ui/Container.jsx'
import PostCard from '@ui/PostCard.jsx'
import Section from '@ui/Section.jsx'

function MagazineArticlesSection({ content }) {
  return (
    <Section aria-labelledby="magazine-articles-title" className="bg-surface-muted dark:bg-[#182230]">
      <Container>
        <div className="mb-8 text-center">
          <h2 id="magazine-articles-title" className="font-heading text-xl font-extrabold text-foreground md:text-2xl">{content.title}</h2>
        </div>
        <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
          {content.items.map((item) => <PostCard key={item.title} post={item} readMore={content.readMore} variant="featured" />)}
        </div>
      </Container>
    </Section>
  )
}

export default MagazineArticlesSection
