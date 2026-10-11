import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import Button from '@ui/Button.jsx'
import PostCard from '@ui/PostCard.jsx'

const getVisibleCount = () => typeof window === 'undefined' ? 1 : window.innerWidth >= 1536 ? 5 : window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1

function PostCarousel({ items, category, labels, language }) {
  const viewportRef = useRef(null)
  const pointerStartRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(getVisibleCount)
  const [activeIndex, setActiveIndex] = useState(getVisibleCount())
  const [paused, setPaused] = useState(false)
  const [resetting, setResetting] = useState(false)
  const first = visibleCount
  const last = visibleCount + items.length - 1
  const loopItems = [...items.slice(-visibleCount), ...items, ...items.slice(0, visibleCount)]
  const current = (activeIndex - first + items.length) % items.length
  const pages = Math.ceil(items.length / visibleCount)
  const gap = 12

  useEffect(() => {
    const resize = () => { const count = getVisibleCount(); setVisibleCount(count); setActiveIndex(count) }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [items.length])

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
  const cardWidth = `calc((100% - ${(visibleCount - 1) * gap}px) / ${visibleCount})`
  const postItems = items.map((item) => ({ ...item, category: category || item.category }))

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
      <Button unstyled type="button" aria-label={labels.previous} onClick={() => move(-1)} className="absolute start-0 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md outline-none hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-0 dark:border-gray-600 dark:bg-[#2b3442]"><ChevronRight aria-hidden="true" size={20} /></Button>
      <div
        ref={viewportRef}
        className="mx-12 touch-pan-y cursor-grab overflow-hidden px-2 active:cursor-grabbing"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture?.(event.pointerId)
          pointerStartRef.current = event.clientX
          setPaused(true)
        }}
        onPointerUp={(event) => {
          const distance = event.clientX - pointerStartRef.current
          if (pointerStartRef.current !== null && Math.abs(distance) > 40) move(distance > 0 ? 1 : -1)
          pointerStartRef.current = null
          setPaused(false)
          event.currentTarget.releasePointerCapture?.(event.pointerId)
        }}
        onPointerCancel={(event) => {
          pointerStartRef.current = null
          setPaused(false)
          event.currentTarget.releasePointerCapture?.(event.pointerId)
        }}
      >
        <div className="flex gap-3 ease-out [direction:rtl]" style={{ transform: `translateX(${activeIndex * (viewportRef.current ? (viewportRef.current.clientWidth - 16 + gap) / visibleCount : 0)}px)`, transition: resetting ? 'none' : 'transform 700ms ease-out' }}>
          {loopItems.map((item, index) => <div key={`${item.title}-${index}`} className="shrink-0" style={{ width: cardWidth }}><PostCard post={postItems[index % items.length]} language={language} viewsLabel={labels.viewsLabel} /></div>)}
        </div>
      </div>
      <Button unstyled type="button" aria-label={labels.next} onClick={() => move(1)} className="absolute end-0 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md outline-none hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-0 dark:border-gray-600 dark:bg-[#2b3442]"><ChevronLeft aria-hidden="true" size={20} /></Button>
      {items.length > 40 ? <p className="mt-5 text-center text-sm font-semibold text-foreground-muted" aria-label={labels.pagination}>{current + 1} / {items.length - visibleCount + 1}</p> : <div className="mt-5 flex items-center justify-center gap-2" aria-label={labels.pagination}>{Array.from({ length: items.length <= 10 ? items.length : pages }).map((_, index) => { const postMode = items.length <= 10; const active = postMode ? current === index : Math.min(pages - 1, Math.floor(current / visibleCount)) === index; const target = postMode ? index : Math.min(index * visibleCount, items.length - visibleCount); return <button key={index} type="button" aria-label={`${labels.page} ${index + 1}`} aria-current={active ? 'true' : undefined} onClick={() => setActiveIndex(first + target)} className={`h-2 rounded-full transition-all ${active ? 'w-7 bg-primary' : 'w-2 bg-border dark:bg-gray-600'}`} /> })}</div>}
    </div>
  )
}

export default PostCarousel
