import { ArrowLeft, Clock3 } from 'lucide-react'

function PostHero({ post, content, compact = false }) {
  return <header className={`relative overflow-hidden ${compact ? 'h-[6rem] md:h-[8rem]' : 'aspect-[16/8] md:aspect-[16/7]'}`}>
    <img src={post.image} alt={post.imageAlt || post.title} className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,31,43,.9),rgba(20,31,43,.38),rgba(20,31,43,.08))]" />
    <div className={`relative flex h-full max-w-3xl flex-col justify-end overflow-hidden text-start text-white ${compact ? 'min-h-0 p-3 md:p-4' : 'p-6 md:min-h-full md:p-10'}`}>
      <span className={`w-fit rounded-full border border-white/25 bg-white/10 font-bold backdrop-blur-sm ${compact ? 'mb-1 px-2.5 py-0.5 text-[.6875rem]' : 'mb-4 px-3 py-1.5 text-xs'}`}>{post.category}</span>
      <h1 className={`max-w-3xl font-heading font-extrabold leading-[1.2] ${compact ? 'text-xl md:text-2xl' : 'text-3xl md:text-5xl'}`}>{post.title}</h1>
      {!compact && <p className="mt-4 max-w-2xl text-sm leading-8 text-white/80 md:text-base">{post.description}</p>}
      <div className={`flex flex-wrap items-center justify-start text-xs font-semibold text-white/80 ${compact ? 'mt-2 gap-2' : 'mt-6 gap-3'}`}>
        <span className={`inline-flex items-center rounded-full bg-black/20 ${compact ? 'gap-1.5 px-2.5 py-1' : 'gap-2 px-3 py-2'}`}><Clock3 size={compact ? 13 : 16} />{content.readTime}</span>
        <a href="#opportunity-content" className={`inline-flex items-center rounded-full bg-primary text-white transition hover:bg-primary-hover ${compact ? 'gap-1.5 px-2.5 py-1' : 'gap-2 px-4 py-2'}`}>{content.backLabel}<ArrowLeft size={compact ? 13 : 15} /></a>
      </div>
    </div>
  </header>
}

export default PostHero
