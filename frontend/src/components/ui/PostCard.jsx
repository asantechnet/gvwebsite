import { Eye } from 'lucide-react'

import { getStablePostViews } from '@/utils/postViews.js'

function formatRelativeDate(value, language = document.documentElement.lang) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const differenceInSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  const [unit, seconds] = units.find(([, unitSeconds]) => Math.abs(differenceInSeconds) >= unitSeconds) || ['second', 1]
  if (language === 'ps') {
    const amount = Math.abs(Math.round(differenceInSeconds / seconds))
    const pashtoDigits = String(amount).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit])
    const pashtoUnits = {
      year: 'کال مخکې',
      month: 'میاشت مخکې',
      week: 'اوونۍ مخکې',
      day: 'ورځ مخکې',
      hour: 'ساعت مخکې',
      minute: 'دقیقه مخکې',
      second: 'ثانیې مخکې',
    }

    if (differenceInSeconds === 0) return 'همدا اوس'
    if (unit === 'day' && amount === 1) return 'پرون'
    return `${pashtoDigits} ${pashtoUnits[unit]}`
  }

  const relativeTime = new Intl.RelativeTimeFormat('fa-AF', { numeric: 'auto' })

  return relativeTime.format(Math.round(differenceInSeconds / seconds), unit)
}

function PostCard({ post, readMore = '', variant = 'default', language, viewsLabel = '' }) {
  const isFeatured = variant === 'featured'
  const views = post.views || getStablePostViews(post.title)

  return (
    <a href={post.href === '/magazine' ? '/magazine/post/1' : (post.href || '/magazine')} className={`group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface text-right transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:border-gray-700 dark:bg-[#2b3442] ${isFeatured ? 'md:rounded-[2rem]' : ''}`}>
      {post.image && (
        <div className="relative aspect-[1.45] overflow-hidden">
          <img src={post.image} alt={post.imageAlt || post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" aria-hidden="true" />
        </div>
      )}
      <div className="flex h-48 flex-col p-3 md:p-4">
        <div className="flex items-center justify-between gap-3 text-xs text-foreground-muted">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{post.category}</span>
          {post.date && <span className="inline-flex items-center justify-center gap-1"><Eye aria-hidden="true" size={14} />{views}</span>}
        </div>
        <h3 className={`mt-5 line-clamp-2 font-heading font-extrabold leading-7 text-foreground ${isFeatured ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground-muted">{post.description}</p>
      </div>
    </a>
  )
}

export default PostCard
