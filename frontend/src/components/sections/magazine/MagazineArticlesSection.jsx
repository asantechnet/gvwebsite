import { useEffect, useState } from 'react'

import Container from '@ui/Container.jsx'
import PostCard from '@ui/PostCard.jsx'
import PostPagination from '@ui/PostPagination.jsx'
import Section from '@ui/Section.jsx'

function getPostsPerPage() {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth >= 1536) return 9
  if (window.innerWidth >= 1024) return 8
  if (window.innerWidth >= 768) return 6
  return 4
}

function MagazineArticlesSection({ content }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(getPostsPerPage)
  const totalPages = Math.ceil(content.items.length / postsPerPage)
  const visiblePosts = content.items.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  useEffect(() => {
    const handleResize = () => { setPostsPerPage(getPostsPerPage()); setCurrentPage(1) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Section aria-labelledby="magazine-articles-title" className="bg-surface-muted dark:bg-[#182230]">
      <Container>
        <div className="mb-8 text-center">
          <h2 id="magazine-articles-title" className="font-heading text-xl font-extrabold text-foreground md:text-2xl">{content.title}</h2>
        </div>
        <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {visiblePosts.map((item) => <PostCard key={item.title} post={item} variant="featured" />)}
        </div>
        <PostPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} labels={content.pagination} />
      </Container>
    </Section>
  )
}

export default MagazineArticlesSection
