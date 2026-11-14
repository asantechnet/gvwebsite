import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import SafeRichText from '@/shared/components/SafeRichText.jsx'
import AudioMedia from '@/shared/components/rich-text-editor/media/AudioMedia.jsx'
import ImageMedia from '@/shared/components/rich-text-editor/media/ImageMedia.jsx'
import VideoMedia from '@/shared/components/rich-text-editor/media/VideoMedia.jsx'

const publicRichTextClasses = `
  gv-public-post-content text-start text-base leading-8 text-foreground-muted
  [&>p]:mb-5 [&>p:last-child]:mb-0
  [&>h2]:mb-3 [&>h2]:mt-8 [&>h2]:font-heading [&>h2]:text-xl [&>h2]:font-extrabold [&>h2]:leading-normal [&>h2]:text-foreground
  [&>h3]:mb-2 [&>h3]:mt-6 [&>h3]:font-heading [&>h3]:text-lg [&>h3]:font-extrabold [&>h3]:leading-normal [&>h3]:text-foreground
  [&>h4]:mb-2 [&>h4]:mt-5 [&>h4]:font-heading [&>h4]:font-bold [&>h4]:text-foreground
  [&_em]:italic [&_strong]:font-bold [&_u]:underline [&_s]:line-through
  [&_a]:font-semibold [&_a]:text-accent-text [&_a]:underline [&_a]:decoration-[1.5px] [&_a]:underline-offset-[3px]
  [&>blockquote]:my-5 [&>blockquote]:border-s-4 [&>blockquote]:border-primary [&>blockquote]:bg-primary/10 [&>blockquote]:px-5 [&>blockquote]:py-4 [&>blockquote]:italic
  [&>ul]:my-3 [&>ul]:list-disc [&>ul]:ps-6 [&>ol]:my-3 [&>ol]:list-decimal [&>ol]:ps-6 [&>ul_li]:mb-1 [&>ol_li]:mb-1
  [&>[data-highlight-box]]:my-4 [&>[data-highlight-box]]:rounded-2xl [&>[data-highlight-box]]:border-e-4 [&>[data-highlight-box]]:border-primary [&>[data-highlight-box]]:bg-primary/10 [&>[data-highlight-box]]:px-5 [&>[data-highlight-box]]:py-4 [&>[data-highlight-box]]:font-semibold [&>[data-highlight-box]_p]:mb-0
  [&>:is(h2,h3)[data-icon]]:before:me-2.5 [&>:is(h2,h3)[data-icon]]:before:inline-grid [&>:is(h2,h3)[data-icon]]:before:size-10 [&>:is(h2,h3)[data-icon]]:before:place-items-center [&>:is(h2,h3)[data-icon]]:before:rounded-xl [&>:is(h2,h3)[data-icon]]:before:border [&>:is(h2,h3)[data-icon]]:before:border-primary/35 [&>:is(h2,h3)[data-icon]]:before:bg-primary/10 [&>:is(h2,h3)[data-icon]]:before:font-sans [&>:is(h2,h3)[data-icon]]:before:text-lg [&>:is(h2,h3)[data-icon]]:before:text-accent-text [&>:is(h2,h3)[data-icon]]:before:content-[attr(data-icon)]
  [&>:is(ul,ol)[data-columns]]:grid [&>:is(ul,ol)[data-columns]]:gap-x-5 [&>:is(ul,ol)[data-columns]]:gap-y-1 [&>:is(ul,ol)[data-columns="2"]]:sm:grid-cols-2 [&>:is(ul,ol)[data-columns="3"]]:sm:grid-cols-3
  [&_[data-editor-media]]:my-5 [&_[data-editor-media]]:block [&_[data-editor-media]]:w-full
  [&_[data-editor-button]]:my-5 [&_[data-editor-button]_a]:inline-flex [&_[data-editor-button]_a]:min-h-11 [&_[data-editor-button]_a]:items-center [&_[data-editor-button]_a]:justify-center [&_[data-editor-button]_a]:rounded-xl [&_[data-editor-button]_a]:border [&_[data-editor-button]_a]:border-primary [&_[data-editor-button]_a]:bg-primary [&_[data-editor-button]_a]:px-5 [&_[data-editor-button]_a]:py-2.5 [&_[data-editor-button]_a]:font-bold [&_[data-editor-button]_a]:text-[#2a170a] [&_[data-editor-button]_a]:no-underline [&_[data-editor-button]_a]:shadow-[0_7px_18px_rgba(244,126,38,0.24)] [&_[data-editor-button]_a]:transition-colors [&_[data-editor-button]_a:hover]:bg-primary-hover
  [&_[data-media-grid]]:my-5 [&_[data-media-grid]]:block [&_[data-media-grid]]:w-full [&_[data-media-grid]]:rounded-[1.4rem] [&_[data-media-grid]]:border [&_[data-media-grid]]:border-border [&_[data-media-grid]]:p-2
`.replace(/\s+/g, ' ').trim()

function mediaItemFromElement(element) {
  return {
    mediaType: element.dataset.mediaType || 'image',
    src: element.dataset.src || '',
    name: element.dataset.name || '',
    title: element.dataset.title || '',
    caption: element.dataset.caption || '',
    alt: element.dataset.alt || '',
    author: element.dataset.author || '',
    avatar: element.dataset.avatar || '',
    poster: element.dataset.poster || '',
    mimeType: element.dataset.mimeType || '',
  }
}

function MediaTemplate({ item, fill = false, compact = false }) {
  const displayTitle = item.title || item.name
  if (item.mediaType === 'video') return <VideoMedia fill={fill} post={{ image: '' }} media={{ video: { src: item.src, title: displayTitle, playLabel: displayTitle, poster: item.poster } }} />
  if (item.mediaType === 'audio') return <AudioMedia compact={compact} media={{ audio: { src: item.src, type: item.mimeType, title: displayTitle, speaker: item.author, speakerLabel: '', avatar: item.avatar || '/assets/images/team/erfan.webp' } }} />
  return <ImageMedia fill={fill} post={{ image: item.src }} media={{ imageAlt: item.alt || displayTitle, imageLabel: item.caption || displayTitle }} />
}

function MediaGridTemplate({ layout, items }) {
  const layoutClass = layout === 'two' ? 'sm:grid-cols-2 sm:auto-rows-[15rem]' : layout === 'three' ? 'sm:grid-cols-3 sm:auto-rows-[13rem]' : layout === 'four' ? 'sm:grid-cols-2 sm:auto-rows-[12rem]' : 'sm:grid-cols-3 sm:auto-rows-[10rem]'
  const featured = layout === 'featured-right' || layout === 'featured-left'
  return <div className={`grid w-full min-w-0 gap-3 ${layoutClass}`}>{items.map((item, index) => {
    if (!item?.src) return null
    const isFeatured = featured && index === 0
    const featuredPosition = !featured ? 'sm:h-full' : isFeatured ? (layout === 'featured-left' ? 'sm:col-start-1 sm:col-span-2 sm:row-start-1 sm:row-span-2' : 'sm:col-start-2 sm:col-span-2 sm:row-start-1 sm:row-span-2') : `${layout === 'featured-left' ? 'sm:col-start-3' : 'sm:col-start-1'} ${index === 1 ? 'sm:row-start-1' : 'sm:row-start-2'} sm:h-full`
    return <div key={index} className={`min-h-40 min-w-0 max-w-full overflow-hidden rounded-2xl bg-background/70 ${featuredPosition}`}><div className="size-full min-h-0 min-w-0 overflow-hidden"><MediaTemplate item={item} fill compact={item.mediaType === 'audio'} /></div></div>
  })}</div>
}

function PublicRichText({ className = '', html = '', ...props }) {
  const rootRef = useRef(null)
  const [mediaTargets, setMediaTargets] = useState([])

  useLayoutEffect(() => {
    if (!rootRef.current) return
    const targets = []
    rootRef.current.querySelectorAll('[data-editor-media]').forEach((element) => {
      const item = mediaItemFromElement(element)
      element.replaceChildren()
      targets.push({ element, item, type: 'single' })
    })
    rootRef.current.querySelectorAll('[data-media-grid]').forEach((element) => {
      let items
      try { items = JSON.parse(element.dataset.items || '[]') } catch { items = [] }
      element.replaceChildren()
      targets.push({ element, items: Array.isArray(items) ? items : [], layout: element.dataset.layout || 'two', type: 'grid' })
    })
    setMediaTargets(targets)
  }, [html])

  return <>
    <SafeRichText {...props} ref={rootRef} html={html} className={`${publicRichTextClasses} [--admin-border:var(--color-border)] [--admin-brand:var(--color-primary)] [--admin-muted:var(--color-foreground-muted)] ${className}`} />
    {mediaTargets.map((target, index) => createPortal(target.type === 'grid' ? <MediaGridTemplate layout={target.layout} items={target.items} /> : <MediaTemplate item={target.item} />, target.element, index))}
  </>
}

export default PublicRichText
