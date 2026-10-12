import { ArrowRight, BriefcaseBusiness, Clock3, Gauge, GraduationCap, House, Link as LinkIcon, Maximize2, Plane, Play, RotateCcw, Settings, Share2, ShieldCheck, Subtitles, UsersRound, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FaFacebookF, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

import Container from '@ui/Container.jsx'
import PostCard from '@ui/PostCard.jsx'
import Section from '@ui/Section.jsx'

function ImageMedia({ children }) {
  return <div className="w-full min-w-0 max-w-full">{children}</div>
}

function AudioMedia({ children }) {
  return <div className="w-full min-w-0 max-w-full">{children}</div>
}

function LocalVideoMedia({ children }) {
  return <div className="w-full min-w-0 max-w-full">{children}</div>
}

function YoutubeVideoMedia({ children }) {
  return <div className="w-full min-w-0 max-w-full">{children}</div>
}

function MediaShowcase({ post, content }) {
  const playbackSpeeds = ['1.0x', '1.5x', '2.0x']
  const [playbackSpeedIndex, setPlaybackSpeedIndex] = useState(0)
  const playbackSpeed = playbackSpeeds[playbackSpeedIndex]

  return (
    <div className="mt-9 w-full min-w-0 max-w-full space-y-5 overflow-hidden" aria-label={content.media.label}>
      <ImageMedia>
      <figure className="relative w-full max-w-full overflow-hidden rounded-2xl border border-border dark:border-gray-600">
        <img src={post.image} alt={content.media.imageAlt} className="aspect-[16/8] w-full object-cover" />
        <figcaption className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">{content.media.imageLabel}</figcaption>
      </figure>
      </ImageMedia>
      <AudioMedia><div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-border bg-[#fffdf8] p-3 text-[#36454d] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:p-5 md:p-7">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(100deg,transparent_0,transparent_18px,rgba(245,155,34,0.12)_19px,transparent_20px)]" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row-reverse md:items-center md:gap-8">
          <div className="flex shrink-0 flex-col items-center gap-2 md:w-40 md:gap-3">
            <img src="/avatars/avatar.png" alt={content.media.speaker} className="size-20 rounded-full border-4 border-white object-cover shadow-md dark:border-gray-700 md:size-32" />
          </div>
          <div className="relative min-w-0 flex-1 text-center md:text-right">
            <h3 className="break-words font-heading text-base font-extrabold leading-7 md:text-2xl md:leading-9">{content.media.audioTitle}</h3>
            <p className="mt-1 text-xs text-foreground-muted md:text-sm">{content.media.speakerLabel}: <strong className="text-current">{content.media.speaker}</strong><span className="mx-2">·</span>{content.media.duration}</p>
            <div className="mt-4 flex items-center gap-2 md:mt-5 md:gap-4">
              <button type="button" aria-label={content.media.playLabel} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ecad24] text-white shadow-sm transition-colors hover:bg-primary md:size-14 focus:outline-none"><Play aria-hidden="true" size={18} fill="currentColor" className="md:size-6" /></button>
              <div className="flex h-8 min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden text-[#91a0a5] md:h-14" aria-hidden="true">
                {Array.from({ length: 54 }, (_, index) => <span key={index} className="w-0.5 shrink-0 scale-y-75 rounded-full bg-current md:scale-y-100" style={{ height: `${18 + ((index * 17) % 34)}px` }} />)}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-foreground-muted md:justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <button type="button" aria-label={content.media.rewindLabel} className="relative flex size-7 items-center justify-center transition-colors hover:text-primary focus:outline-none"><RotateCcw size={20} /><span className="absolute inset-0 flex items-center justify-center pt-0.5 text-[9px] font-bold">5</span></button>
                <button type="button" aria-label={content.media.forwardLabel} className="relative flex size-7 scale-x-[-1] items-center justify-center transition-colors hover:text-primary focus:outline-none"><RotateCcw size={20} /><span className="absolute inset-0 flex scale-x-[-1] items-center justify-center pt-0.5 text-[9px] font-bold">5</span></button>
              </div>
              <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                <button type="button" aria-label={`${content.media.speedLabel} ${playbackSpeed}`} onClick={() => setPlaybackSpeedIndex((index) => (index + 1) % playbackSpeeds.length)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-bold text-primary transition-colors hover:bg-primary/10 focus:outline-none"><Gauge aria-hidden="true" size={16} />{playbackSpeed}</button>
                <span dir="ltr" className="ms-1 whitespace-nowrap text-xs sm:ms-2 sm:text-sm">00:00 - {content.media.audioDuration}</span>
              </div>
            </div>
          </div>
        </div>
      </div></AudioMedia>
      <LocalVideoMedia><div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-border dark:border-gray-600">
        <img src={post.image} alt={content.media.videoTitle} className="aspect-video w-full object-cover brightness-75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white">
          <button type="button" aria-label={content.media.playLabel} className="flex size-14 items-center justify-center rounded-full bg-primary/95 shadow-lg transition-colors hover:bg-primary-hover focus:outline-none"><Play aria-hidden="true" size={24} fill="currentColor" /></button>
          <span className="font-bold">{content.media.videoTitle}</span>
        </div>
          <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 px-2 py-2 text-white backdrop-blur-sm sm:inset-x-4 sm:bottom-3 sm:px-3">
          <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/30"><div className="h-full w-1/4 rounded-full bg-primary" /></div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" aria-label={content.media.playLabel} className="transition-colors hover:text-primary focus:outline-none"><Play aria-hidden="true" size={16} fill="currentColor" /></button>
              <button type="button" aria-label={content.media.volumeLabel} className="transition-colors hover:text-primary focus:outline-none"><Volume2 aria-hidden="true" size={17} /></button>
              <span dir="ltr" className="hidden sm:inline">00:00 / 04:30</span>
            </div>
            <button type="button" aria-label={content.media.fullscreenLabel} className="transition-colors hover:text-primary focus:outline-none"><Maximize2 aria-hidden="true" size={17} /></button>
          </div>
        </div>
      </div></LocalVideoMedia>
      <YoutubeVideoMedia><div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-border bg-[#171717] dark:border-gray-600">
        <div className="relative">
          <img src={post.image} alt={content.media.youtubeTitle} className="aspect-video w-full object-cover opacity-70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white">
            <button type="button" aria-label={content.media.playLabel} className="flex size-16 items-center justify-center rounded-full bg-[#ff0000] shadow-xl transition-colors hover:bg-[#cc0000] focus:outline-none"><Play aria-hidden="true" size={28} fill="currentColor" /></button>
            <span className="font-bold">{content.media.youtubeTitle}</span>
          </div>
          <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/70 px-2 py-2 text-white backdrop-blur-sm sm:inset-x-4 sm:bottom-3 sm:px-3">
            <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/30"><div className="h-full w-1/5 rounded-full bg-[#ff0000]" /></div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 sm:gap-3">
                <button type="button" aria-label={content.media.playLabel} className="transition-colors hover:text-[#ff5555] focus:outline-none"><Play aria-hidden="true" size={16} fill="currentColor" /></button>
                <button type="button" aria-label={content.media.volumeLabel} className="transition-colors hover:text-[#ff5555] focus:outline-none"><Volume2 aria-hidden="true" size={17} /></button>
                <span dir="ltr">00:00 / 08:12</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button type="button" aria-label={content.media.captionsLabel} className="transition-colors hover:text-[#ff5555] focus:outline-none"><Subtitles aria-hidden="true" size={17} /></button>
                <button type="button" aria-label={content.media.settingsLabel} className="transition-colors hover:text-[#ff5555] focus:outline-none"><Settings aria-hidden="true" size={17} /></button>
                <button type="button" aria-label={content.media.fullscreenLabel} className="transition-colors hover:text-[#ff5555] focus:outline-none"><Maximize2 aria-hidden="true" size={17} /></button>
              </div>
            </div>
          </div>
        </div>
      </div></YoutubeVideoMedia>
    </div>
  )
}

function BlogPostPage({ post, content, relatedPosts = [] }) {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const shareMenuRef = useRef(null)

  useEffect(() => {
    if (!isShareMenuOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!shareMenuRef.current?.contains(event.target)) setIsShareMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [isShareMenuOpen])

  return (
    <>
      <Section padded={false} className="bg-background py-6 md:py-10 lg:py-14">
      <Container>
        <div className="mx-auto mb-5 max-w-5xl text-right text-sm text-foreground-muted">
          <a href="/magazine" className="transition-colors hover:text-primary">{content.magazineLabel}</a>
          <span className="mx-2 text-primary">/</span>
          <span>{post.title}</span>
        </div>
        <article className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-surface shadow-sm dark:border-gray-700 dark:bg-[#2b3442]">
          <div className="relative aspect-[16/8] overflow-hidden md:aspect-[16/7]">
            <img src={post.image} alt={post.imageAlt || post.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-5 bottom-5 text-right text-white md:inset-x-10 md:bottom-10">
              <h1 className="mt-4 max-w-3xl font-heading text-2xl font-extrabold leading-tight md:text-4xl lg:text-5xl">{post.title}</h1>
            </div>
          </div>
          <div className="flex items-center justify-start gap-4 px-5 pt-5 text-sm text-foreground-muted lg:hidden">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{post.category}</span>
            <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" size={17} />{content.readTime}</span>
          </div>

          <div className="grid gap-8 p-5 md:p-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:p-14">
            <div className="order-1 min-w-0 text-right lg:order-1">
              <p className="text-lg font-medium leading-9 text-foreground-muted">{post.description}</p>
              <div className="my-8 rounded-2xl border-r-4 border-primary bg-primary/10 px-5 py-4 text-base font-semibold leading-8 text-foreground">
                {content.highlight}
              </div>
              <div className="mt-7 space-y-5 text-base leading-9 text-foreground-muted">
                {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <MediaShowcase post={post} content={content} />
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-5 dark:border-gray-600 lg:justify-end">
                <span className="text-sm text-foreground-muted">{content.shareLabel}</span>
                <button type="button" className="group relative flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:border-primary hover:text-primary focus:outline-none dark:border-gray-600 dark:bg-transparent" aria-label={content.copyLabel}><LinkIcon size={16} /><span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{content.copyLabel}</span></button>
                <span ref={shareMenuRef} className="group relative">
                  <button type="button" aria-label={content.shareLabel} aria-expanded={isShareMenuOpen} onClick={() => setIsShareMenuOpen((isOpen) => !isOpen)} className="flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:border-primary hover:text-primary focus:outline-none dark:border-gray-600 dark:bg-transparent"><Share2 size={16} /></button>
                  <span className={`absolute bottom-full left-0 flex translate-y-1 gap-1 rounded-xl border border-border bg-surface p-1.5 shadow-lg transition-all group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 dark:border-gray-600 ${isShareMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none opacity-0'}`}>
                    <a href="/magazine/post/1" onClick={() => setIsShareMenuOpen(false)} aria-label="فیس‌بوک" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaFacebookF size={15} /></a>
                    <a href="/magazine/post/1" onClick={() => setIsShareMenuOpen(false)} aria-label="واتساپ" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaWhatsapp size={17} /></a>
                    <a href="/magazine/post/1" onClick={() => setIsShareMenuOpen(false)} aria-label="تلگرام" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaTelegramPlane size={17} /></a>
                    <a href="/magazine/post/1" onClick={() => setIsShareMenuOpen(false)} aria-label="اینستاگرام" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaInstagram size={16} /></a>
                    <a href="/magazine/post/1" onClick={() => setIsShareMenuOpen(false)} aria-label="لینکدین" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaLinkedinIn size={16} /></a>
                    <a href="/magazine/post/1" onClick={() => setIsShareMenuOpen(false)} aria-label="ایکس" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaXTwitter size={16} /></a>
                  </span>
                </span>
              </div>
              <div className="mt-8 flex justify-center lg:justify-start">
                <a href="/magazine" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold !text-[#fff8f3] transition-colors hover:bg-primary-hover focus-visible:bg-primary-hover">
                  <ArrowRight aria-hidden="true" size={17} />
                  {content.backLabel}
                </a>
              </div>
            </div>

            <aside className="order-2 flex h-fit flex-row flex-wrap justify-end gap-3 border-b border-border pb-5 text-right text-sm text-foreground-muted dark:border-gray-600 lg:sticky lg:top-6 lg:order-2 lg:flex-col lg:flex-nowrap lg:items-end lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
              <span className="hidden w-fit self-start rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary lg:block">{post.category}</span>
              <span className="hidden items-center gap-2 self-start lg:inline-flex"><Clock3 aria-hidden="true" size={17} />{content.readTime}</span>
              <div className="mt-5 w-full border-t border-border pt-5 text-right dark:border-gray-600">
                <h2 className="mb-4 text-center font-heading text-lg font-extrabold text-foreground lg:text-right">{content.quickAccessLabel}</h2>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-2">
                  {[[GraduationCap, content.quickLinks.study], [BriefcaseBusiness, content.quickLinks.work], [Plane, content.quickLinks.travel], [House, content.quickLinks.life], [ShieldCheck, content.quickLinks.visa], [UsersRound, content.quickLinks.migration]].map(([Icon, label]) => <a key={label} href="/magazine" className="flex flex-col items-center gap-1 rounded-xl border border-border px-2 py-3 text-center text-xs text-foreground-muted transition-colors hover:border-primary hover:text-primary dark:border-gray-600"><Icon size={20} /><span className="font-bold">{label}</span></a>)}
                </div>
              </div>
              {relatedPosts.length > 0 && <div className="mt-5 w-full border-t border-border pt-5 text-right dark:border-gray-600">
                <h2 className="mb-4 text-center font-heading text-lg font-extrabold text-foreground lg:text-right">{content.relatedLabel}</h2>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                  {relatedPosts.slice(0, 3).map((relatedPost) => <PostCard key={relatedPost.title} post={relatedPost} />)}
                </div>
              </div>}
            </aside>
          </div>
        </article>
      </Container>
      </Section>
    </>
  )
}

export default BlogPostPage
