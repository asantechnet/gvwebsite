import { useLocalizedHref } from '@website/hooks/useWebsiteLanguage.js'

function PostCard({ post, variant = 'default' }) {
  const isFeatured = variant === 'featured'
  const postHref = useLocalizedHref(post.slug ? `/magazine/post/${post.slug}` : (post.href || '/magazine'))

  return (
    <a href={postHref} className={`group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface text-start transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:border-gray-600 dark:bg-[#2b3442] ${isFeatured ? 'md:rounded-[2rem]' : ''}`}>
      {post.image && (
        <div className="relative aspect-[1.45] overflow-hidden">
          <img src={post.image} alt={post.imageAlt || post.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" aria-hidden="true" />
          <span className="absolute left-0 top-6 rounded-r-lg border-y border-r border-primary/20 bg-white/95 px-4 py-1.5 text-xs font-bold text-accent-text shadow-md backdrop-blur-sm dark:bg-[#2b3442]/95">
            <span className="absolute left-0 top-full h-2 w-2 border-r-8 border-t-8 border-r-transparent border-t-[#9a5a0a]" aria-hidden="true" />
            {post.category}
          </span>
        </div>
      )}
      <div className="flex h-36 flex-col px-3 py-2.5 md:h-40 md:px-4 md:py-3">
        <h3 className={`mt-1 line-clamp-2 font-heading font-extrabold leading-7 text-foreground ${isFeatured ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground-muted">{post.description}</p>
      </div>
    </a>
  )
}

export default PostCard
