import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import Button from '@ui/Button.jsx'
import PostCard from '@ui/PostCard.jsx'
import { getCarouselVisibleCount } from '@website/utils/cardCounts.js'

function PostCarousel({ items, category, labels, language }) {
  const isLtr = language === 'en'
  const viewportRef = useRef(null)
  const pointerStartRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(getCarouselVisibleCount)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(getCarouselVisibleCount())
  const [paused, setPaused] = useState(false)
  const [resetting, setResetting] = useState(false)
  const first = visibleCount
  const last = visibleCount + items.length - 1
  const loopItems = [...items.slice(-visibleCount), ...items, ...items.slice(0, visibleCount)]
  const current = (activeIndex - first + items.length) % items.length
  const pages = Math.ceil(items.length / visibleCount)
  const gap = 12

  useLayoutEffect(() => {
    const resize = () => { const count = getCarouselVisibleCount(); setVisibleCount(count); setActiveIndex(count); setViewportWidth(viewportRef.current?.clientWidth || 0) }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [items.length, language])

  useEffect(() => {
    if (paused || items.length <= visibleCount) return undefined
    const timer = window.setInterval(() => setActiveIndex((index) => index + 1), 3000)
    return () => window.clearInterval(timer)
  }, [items.length, paused, visibleCount])

  useEffect(() => {
    const leading = activeIndex === first - 1
    const trailing = activeIndex === last + 1
    if (!leading && !trailing) return undefined
    const timer = window.setTimeout(() => {
      setResetting(true)
      setActiveIndex(leading ? last : first)
      window.requestAnimationFrame(() => setResetting(false))
    }, 700)
    return () => window.clearTimeout(timer)
  }, [activeIndex, first, last])

  const move = (direction) => setActiveIndex((index) => index + direction > last ? last + 1 : index + direction < first ? first - 1 : index + direction)
  const availableWidth = Math.max(0, viewportWidth - 16)
  const cardWidth = viewportWidth ? Math.floor((availableWidth - (visibleCount - 1) * gap) / visibleCount) : 0
  const cardStride = cardWidth + gap

  return (
    <div dir={isLtr ? 'ltr' : 'rtl'} className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
      <Button unstyled type="button" aria-label={labels.previous} onClick={() => move(-1)} className="absolute start-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md outline-none hover:border-primary hover:text-accent-text focus:outline-none focus-visible:ring-0 md:size-10 dark:border-gray-600 dark:bg-[#2b3442]"><ChevronRight aria-hidden="true" className="size-4 md:size-5" /></Button>
      <div
        ref={viewportRef}
        className="mx-12 touch-pan-y cursor-grab overflow-hidden px-2 active:cursor-grabbing"
        style={isLtr ? { clipPath: 'inset(0 12px 0 0)' } : undefined}
        onPointerDown={(event) => {
          pointerStartRef.current = event.clientX
          setPaused(true)
        }}
        onPointerUp={(event) => {
          const distance = event.clientX - pointerStartRef.current
          if (pointerStartRef.current !== null && Math.abs(distance) > 40) move(distance > 0 ? 1 : -1)
          pointerStartRef.current = null
          setPaused(false)
        }}
        onPointerCancel={() => {
          pointerStartRef.current = null
          setPaused(false)
        }}
      >
        <div className="flex gap-3 ease-out" style={{ transform: `translateX(${(isLtr ? -1 : 1) * activeIndex * cardStride}px)`, transition: resetting ? 'none' : 'transform 700ms ease-out' }}>
          {loopItems.map((item, index) => <div key={`${item.slug || item.title}-${index}`} className="shrink-0" style={{ width: `${cardWidth}px` }}><PostCard post={{ ...item, category: category || item.category }} language={language} viewsLabel={labels.viewsLabel} /></div>)}
        </div>
      </div>
      <Button unstyled type="button" aria-label={labels.next} onClick={() => move(1)} className="absolute end-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md outline-none hover:border-primary hover:text-accent-text focus:outline-none focus-visible:ring-0 md:size-10 dark:border-gray-600 dark:bg-[#2b3442]"><ChevronLeft aria-hidden="true" className="size-4 md:size-5" /></Button>
      {items.length > 40 ? <p className="mt-5 text-center text-sm font-semibold text-foreground-muted" aria-label={labels.pagination}>{current + 1} / {items.length - visibleCount + 1}</p> : <div className="mt-5 flex items-center justify-center gap-2" aria-label={labels.pagination}>{Array.from({ length: items.length <= 10 ? items.length : pages }).map((_, index) => { const postMode = items.length <= 10; const active = postMode ? current === index : Math.min(pages - 1, Math.floor(current / visibleCount)) === index; const target = postMode ? index : Math.min(index * visibleCount, items.length - visibleCount); return <button key={index} type="button" aria-label={`${labels.page} ${index + 1}`} aria-current={active ? 'true' : undefined} onClick={() => setActiveIndex(first + target)} className={`h-2 rounded-full transition-all ${active ? 'w-7 bg-primary' : 'w-2 bg-border dark:bg-gray-600'}`} /> })}</div>}
    </div>
  )
}

export default PostCarousel
