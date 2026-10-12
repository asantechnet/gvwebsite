import { ArrowRight, AudioLines, BookOpenCheck, BriefcaseBusiness, Clock3, ExternalLink, FileCheck2, GraduationCap, House, Link as LinkIcon, Pause, Plane, PlaneTakeoff, Play, Share2, ShieldCheck, Square, UsersRound, WalletCards } from 'lucide-react'
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

function YoutubeVideoMedia({ children }) {
  return <div className="w-full min-w-0 max-w-full">{children}</div>
}

function MediaShowcase({ post, content }) {
  const playbackSpeeds = ['1.0x', '1.5x', '2.0x']
  const [playbackSpeedIndex, setPlaybackSpeedIndex] = useState(0)
  const [speechState, setSpeechState] = useState('idle')
  const playbackSpeed = playbackSpeeds[playbackSpeedIndex]
  const media = content.media

  const stopSpeech = () => {
    window.speechSynthesis?.cancel()
    setSpeechState('idle')
  }

  const toggleSpeech = () => {
    if (!media.audioScript || !window.speechSynthesis) return
    if (speechState === 'playing') {
      window.speechSynthesis.pause()
      setSpeechState('paused')
      return
    }
    if (speechState === 'paused') {
      window.speechSynthesis.resume()
      setSpeechState('playing')
      return
    }

    const utterance = new SpeechSynthesisUtterance(media.audioScript)
    utterance.lang = document.documentElement.lang === 'ps' ? 'ps-AF' : 'fa-AF'
    utterance.rate = Number.parseFloat(playbackSpeed)
    utterance.onend = () => setSpeechState('idle')
    utterance.onerror = () => setSpeechState('idle')
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeechState('playing')
  }

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  return (
    <div className="mt-9 w-full min-w-0 max-w-full space-y-5 overflow-hidden" aria-label={media.label}>
      {media.gallery?.length > 0 && <ImageMedia>
        <div className="grid gap-3 sm:grid-cols-3">
          {media.gallery.map((image, index) => <figure key={image.src} className={`relative overflow-hidden rounded-2xl border border-border dark:border-gray-600 ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}>
            <img src={image.src} alt={image.alt} className={`w-full object-cover ${index === 0 ? 'aspect-[16/9] h-full' : 'aspect-[4/3]'}`} />
            <figcaption className="absolute inset-x-2 bottom-2 rounded-lg bg-black/65 px-2 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">{image.label}</figcaption>
          </figure>)}
        </div>
      </ImageMedia>}
      {!media.gallery?.length && <ImageMedia><figure className="relative w-full max-w-full overflow-hidden rounded-2xl border border-border dark:border-gray-600">
        <img src={post.image} alt={media.imageAlt} className="aspect-[16/8] w-full object-cover" />
        <figcaption className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">{media.imageLabel}</figcaption>
      </figure></ImageMedia>}
      {media.audioScript && <AudioMedia><div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-border bg-[#fffdf8] p-4 text-[#36454d] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(100deg,transparent_0,transparent_18px,rgba(245,155,34,0.12)_19px,transparent_20px)]" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row-reverse md:items-center md:gap-8">
          <div className="flex shrink-0 flex-col items-center gap-2 md:w-40 md:gap-3">
            <span className="flex size-20 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10 text-primary shadow-md md:size-32" aria-hidden="true"><AudioLines className="size-9 md:size-14" /></span>
          </div>
          <div className="relative min-w-0 flex-1 text-center md:text-right">
            <h3 className="break-words font-heading text-base font-extrabold leading-7 md:text-2xl md:leading-9">{media.audioTitle}</h3>
            <p className="mt-1 text-xs text-foreground-muted md:text-sm">{media.audioDescription}</p>
            <div className="mt-4 flex items-center gap-2 md:mt-5 md:gap-4">
              <button type="button" aria-label={speechState === 'playing' ? media.pauseLabel : media.playLabel} onClick={toggleSpeech} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:bg-primary-hover md:size-14">{speechState === 'playing' ? <Pause aria-hidden="true" size={20} fill="currentColor" /> : <Play aria-hidden="true" size={20} fill="currentColor" />}</button>
              <div className="flex h-8 min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden text-[#91a0a5] md:h-14" aria-hidden="true">
                {Array.from({ length: 54 }, (_, index) => <span key={index} className="w-0.5 shrink-0 scale-y-75 rounded-full bg-current md:scale-y-100" style={{ height: `${18 + ((index * 17) % 34)}px` }} />)}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-foreground-muted md:justify-between">
              <button type="button" aria-label={media.stopLabel} onClick={stopSpeech} className="inline-flex items-center gap-2 rounded-lg px-2 py-1 font-bold transition-colors hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10"><Square aria-hidden="true" size={15} fill="currentColor" />{media.stopLabel}</button>
              <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                <button type="button" aria-label={`${media.speedLabel} ${playbackSpeed}`} onClick={() => setPlaybackSpeedIndex((index) => (index + 1) % playbackSpeeds.length)} className="rounded-md px-2 py-1 font-bold text-primary transition-colors hover:bg-primary/10 focus-visible:bg-primary/10">{playbackSpeed}</button>
              </div>
            </div>
          </div>
        </div>
      </div></AudioMedia>}
      {media.youtubeId && <YoutubeVideoMedia><figure className="overflow-hidden rounded-2xl border border-border bg-black dark:border-gray-600">
        <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${media.youtubeId}`} title={media.youtubeTitle} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        <figcaption className="flex flex-wrap items-center justify-between gap-2 bg-surface px-4 py-3 text-sm text-foreground-muted dark:bg-gray-800">
          <span>{media.videoCredit}</span>
          <a href={media.videoSource} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-primary hover:text-primary-hover"><ExternalLink aria-hidden="true" size={15} />{media.sourceLabel}</a>
        </figcaption>
      </figure></YoutubeVideoMedia>}
    </div>
  )
}

const sectionIcons = [BookOpenCheck, WalletCards, FileCheck2, PlaneTakeoff]

function RichPostContent({ content }) {
  if (!content.sections?.length) return <div className="mt-7 space-y-5 text-base leading-9 text-foreground-muted">{content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>

  return <div className="mt-8 space-y-8">
    {content.sections.map((section, index) => {
      const Icon = sectionIcons[index % sectionIcons.length]
      return <section key={section.title} className="rounded-2xl border border-border bg-background/50 p-5 dark:border-gray-600 md:p-6">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-right">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon aria-hidden="true" size={23} /></span>
          <h2 className="font-heading text-xl font-extrabold text-foreground md:text-2xl">{section.title}</h2>
        </div>
        <p className="mt-4 text-base leading-8 text-foreground-muted">{section.body}</p>
        {section.items?.length > 0 && <ul className="mt-4 grid gap-3 sm:grid-cols-2">{section.items.map((item) => <li key={item} className="flex items-start gap-2 rounded-xl bg-surface px-3 py-3 text-sm leading-7 text-foreground-muted dark:bg-gray-800"><span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />{item}</li>)}</ul>}
      </section>
    })}
    <section className="rounded-2xl border border-primary/30 bg-primary/10 p-5 md:p-6" aria-labelledby="official-sources-heading">
      <h2 id="official-sources-heading" className="font-heading text-xl font-extrabold text-foreground">{content.sourcesTitle}</h2>
      <p className="mt-2 text-sm leading-7 text-foreground-muted">{content.sourcesNote}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">{content.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="flex h-full items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 font-bold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:border-primary dark:border-gray-600 dark:bg-gray-800"><span>{source.label}</span><ExternalLink aria-hidden="true" size={17} className="shrink-0" /></a></li>)}</ul>
    </section>
  </div>
}

function BlogPostPage({ post, content, relatedPosts = [] }) {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const shareMenuRef = useRef(null)
  const parentLabel = content.parentLabel || content.magazineLabel
  const parentHref = content.parentHref || '/magazine'
  const backHref = content.backHref || '/magazine'

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
          <a href={parentHref} className="transition-colors hover:text-primary">{parentLabel}</a>
          <span className="mx-2 text-primary">/</span>
          <span>{post.title}</span>
        </div>
        <article className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-surface shadow-sm dark:border-gray-700 dark:bg-[#2b3442]">
          <div className="relative aspect-[16/8] overflow-hidden rounded-t-[2rem] md:aspect-[16/7]">
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
              <RichPostContent content={content} />
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
                <a href={backHref} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold !text-[#fff8f3] transition-colors hover:bg-primary-hover focus-visible:bg-primary-hover">
                  <ArrowRight aria-hidden="true" size={17} />
                  {content.backLabel}
                </a>
              </div>
            </div>

            <aside className="order-2 h-fit self-start border-b border-border pb-5 text-right text-sm text-foreground-muted dark:border-gray-600 lg:sticky lg:top-20 lg:order-2 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
              <div className="w-full lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overscroll-contain lg:pe-2 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
                <div className="w-full">
                  <div className="hidden flex-col items-start gap-3 lg:flex">
                    <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{post.category}</span>
                    <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" size={17} />{content.readTime}</span>
                  </div>
                  <div className="mt-5 w-full border-t border-border pt-5 text-right dark:border-gray-600">
                    <h2 className="mb-4 text-center font-heading text-lg font-extrabold text-foreground lg:text-right">{content.quickAccessLabel}</h2>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-2">
                      {[[GraduationCap, content.quickLinks.study], [BriefcaseBusiness, content.quickLinks.work], [Plane, content.quickLinks.travel], [House, content.quickLinks.life], [ShieldCheck, content.quickLinks.visa], [UsersRound, content.quickLinks.migration]].map(([Icon, label]) => <a key={label} href="/magazine" className="flex flex-col items-center gap-1 rounded-xl border border-border px-2 py-3 text-center text-xs text-foreground-muted transition-colors hover:border-primary hover:text-primary dark:border-gray-600"><Icon size={20} /><span className="font-bold">{label}</span></a>)}
                    </div>
                  </div>
                </div>
                {relatedPosts.length > 0 && <div className="mt-5 w-full border-t border-border pt-5 text-right dark:border-gray-600">
                  <h2 className="mb-4 text-center font-heading text-lg font-extrabold text-foreground lg:text-right">{content.relatedLabel}</h2>
                  <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                    {relatedPosts.slice(0, 3).map((relatedPost) => <PostCard key={relatedPost.title} post={relatedPost} />)}
                  </div>
                </div>}
              </div>
            </aside>
          </div>
        </article>
      </Container>
      </Section>
    </>
  )
}

export default BlogPostPage
