import { ArrowLeft, ArrowRight, BookOpenCheck, ExternalLink, FileCheck2, Link as LinkIcon, PlaneTakeoff, Share2, WalletCards } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FaFacebookF, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

import Container from '@ui/Container.jsx'
import ContentSidebar from '@ui/ContentSidebar.jsx'
import Section from '@ui/Section.jsx'
import MediaShowcase from '@shared/media/MediaShowcase.jsx'
import dariPostContent from '@website/locales/prs/post.json'
import pashtoPostContent from '@website/locales/ps/post.json'

const sectionIcons = [BookOpenCheck, WalletCards, FileCheck2, PlaneTakeoff]
const linkReplacements = {
  'https://immigration-portal.ec.europa.eu/index_en': 'https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal_en',
  'https://investyourtalentapplication.esteri.it/': 'https://www.esteri.it/en/servizi-opportunita/opportunita/borse-di-studio/per-cittadini-stranieri/progetti-speciali/invest-your-talent-in-italy/',
}

function getValidHref(href) {
  return linkReplacements[href] || href
}

function BidiLabel({ label }) {
  const separatorIndex = label.indexOf('؛')
  const firstPart = separatorIndex === -1 ? '' : label.slice(0, separatorIndex).trim()
  const secondPart = separatorIndex === -1 ? '' : label.slice(separatorIndex + 1).trim()
  const normalizedLabel = /^[A-Za-z]/.test(firstPart) && secondPart ? `${secondPart} ${firstPart}؛` : label

  return <span dir="rtl" className="block text-right">{normalizedLabel}</span>
}

function RichPostContent({ content }) {
  if (!content.sections?.length) return <div className="mt-7 space-y-5 text-base leading-9 text-foreground-muted">{content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>

  return <div className="mt-8 space-y-8">
    {content.sections.map((section, index) => {
      const Icon = sectionIcons[index % sectionIcons.length]
      return <section key={section.title} className="border-b border-border pb-8 dark:border-gray-600">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-right">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon aria-hidden="true" size={23} /></span>
          <h2 className="font-heading text-xl font-extrabold text-foreground md:text-2xl">{section.title}</h2>
        </div>
        <p className="mt-4 text-base leading-8 text-foreground-muted">{section.body}</p>
        {section.links?.length > 0 && <div dir="rtl" className="mt-4 flex flex-wrap justify-start gap-2">{section.links.map((link) => <a key={link.href} href={getValidHref(link.href)} dir="rtl" className="inline-flex items-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-right text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary/20"><BidiLabel label={link.label} /><ArrowLeft aria-hidden="true" size={15} className="ms-1 shrink-0" /></a>)}</div>}
        {section.items?.length > 0 && <ul className="mt-4 grid gap-3 sm:grid-cols-2">{section.items.map((item) => <li key={item} className="flex items-start gap-2 rounded-xl bg-surface px-3 py-3 text-sm leading-7 text-foreground-muted dark:bg-gray-800"><span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />{item}</li>)}</ul>}
      </section>
    })}
    {content.countries?.length > 0 && <section className="mt-2" aria-labelledby="country-cards-heading">
      <h2 id="country-cards-heading" className="font-heading text-xl font-extrabold text-foreground md:text-2xl">{content.countriesTitle}</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
        {content.countries.map((country) => <a key={country.href} href={country.href} aria-label={`${country.name}؛ ${content.countriesTitle}`} className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200 hover:border-primary hover:shadow-[0_12px_28px_rgba(54,69,77,0.12)] focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(245,155,34,0.22)] dark:border-gray-600 dark:bg-gray-800">
          <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted dark:bg-gray-700">
            <img src={country.image} alt={country.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-x-3 bottom-3 rounded-lg bg-black/55 px-3 py-1.5 text-right text-xs font-bold text-white backdrop-blur-sm">{country.name}</span>
          </div>
          <div className="flex min-h-16 items-center justify-between gap-3 p-3.5">
            <span className="flex min-w-0 items-center gap-3">
              <img src={country.flag} alt="" aria-hidden="true" className="h-6 w-9 shrink-0 rounded-sm object-cover shadow-sm" />
              <span className="truncate font-heading font-extrabold text-foreground group-hover:text-primary">{country.name}</span>
            </span>
            <ArrowLeft aria-hidden="true" size={18} className="shrink-0 text-primary transition-transform duration-200 group-hover:-translate-x-1" />
          </div>
        </a>)}
      </div>
    </section>}
    {content.sources?.length > 0 && <section className="rounded-2xl border border-primary/30 bg-primary/10 p-5 md:p-6" aria-labelledby="official-sources-heading">
      <h2 id="official-sources-heading" className="font-heading text-xl font-extrabold text-foreground">{content.sourcesTitle}</h2>
      <p className="mt-2 text-sm leading-7 text-foreground-muted">{content.sourcesNote}</p>
      <ul dir="rtl" className="mt-4 grid gap-3 sm:grid-cols-2">{content.sources.map((source) => <li key={source.href}><a href={getValidHref(source.href)} target="_blank" rel="noreferrer" dir="rtl" className="flex h-full items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 text-right font-bold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:border-primary dark:border-gray-600 dark:bg-gray-800"><span dir="rtl" className="min-w-0 flex-1 text-right"><BidiLabel label={source.label} /></span><ExternalLink aria-hidden="true" size={17} className="shrink-0" /></a></li>)}</ul>
    </section>}
  </div>
}

function CountryCards({ content }) {
  const isPashto = content.countriesTitle?.includes('هېوادونه')
  const countriesTitle = content.countriesTitle.replace(' مقصد', '').replace('د مقصد ', '').replace('مشهور د ', 'مشهور ')
  const countries = content.countries.map((country) => ({
    ...country,
    name: ({
      هالنډ: 'هالند',
      هنګري: 'هنگری',
      هلند: 'هالند',
      مجارستان: 'هنگری',
    }[country.name] || country.name),
  }))
  countries.push({
    name: isPashto ? 'البانیا' : 'آلبانیا', flag: '/assets/flags/al.svg', image: '/assets/images/destinations/italy.jpg', imageAlt: isPashto ? 'په البانیا کې منظره' : 'نمایی از آلبانیا', href: '/opportunities/country/albania',
  }, {
    name: 'ایرلند', flag: '/assets/flags/ie.svg', image: '/assets/images/destinations/united-kingdom.jpg', imageAlt: isPashto ? 'په ایرلنډ کې منظره' : 'نمایی از ایرلند', href: '/opportunities/country/ireland',
  })

  return <section aria-labelledby="country-cards-heading">
    <h2 id="country-cards-heading" className="font-heading text-xl font-extrabold text-foreground md:text-2xl">{countriesTitle}</h2>
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
      {countries.map((country) => <a key={country.href} href={country.href} aria-label={`${country.name}؛ ${content.countriesTitle}`} className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200 hover:border-primary hover:shadow-[0_12px_28px_rgba(54,69,77,0.12)] focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(245,155,34,0.22)] dark:border-gray-600 dark:bg-gray-800">
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted dark:bg-gray-700">
          <img src={country.image} alt={country.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute inset-x-3 bottom-2 flex items-center justify-between gap-2 rounded-lg bg-black/55 px-3 py-1.5 text-right text-xs font-bold text-white backdrop-blur-sm">
            <span>{country.name}</span>
            <img src={country.flag} alt="" aria-hidden="true" className="h-5 w-7 rounded-sm object-cover shadow-sm" />
          </span>
        </div>
      </a>)}
    </div>
  </section>
}

function BlogPostPage({ post, content, relatedPosts = [], guideLinks = [], hideHero = false, hideBreadcrumb = false }) {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const shareMenuRef = useRef(null)
  const copySuccessLabel = content.copySuccess || (document.documentElement.lang === 'ps' ? pashtoPostContent.copySuccess : dariPostContent.copySuccess)
  const parentLabel = content.parentLabel || content.magazineLabel
  const parentHref = content.parentHref || '/magazine'
  const backHref = content.backHref || '/magazine'
  const shareUrl = typeof window === 'undefined' ? '' : window.location.href
  const encodedShareUrl = encodeURIComponent(shareUrl)
  const encodedShareTitle = encodeURIComponent(post.title)

  const copyPostLink = async () => {
    let copied = false

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        copied = true
      }
    } catch {
      copied = false
    }

    if (!copied) {
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      textArea.setAttribute('readonly', '')
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      copied = document.execCommand('copy')
      document.body.removeChild(textArea)
    }

    if (copied) {
      setIsLinkCopied(true)
      window.setTimeout(() => setIsLinkCopied(false), 1800)
    }
  }

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
        {!hideBreadcrumb && <div className="mx-auto mb-5 max-w-6xl text-right text-sm text-foreground-muted">
          <a href={parentHref} className="transition-colors hover:text-primary">{parentLabel}</a>
          <span className="mx-2 text-primary">/</span>
          <span>{post.title}</span>
        </div>}
        <article className="mx-auto max-w-6xl rounded-[2rem] border border-border bg-surface shadow-sm dark:border-gray-700 dark:bg-[#2b3442]">
          {!hideHero && <div className="relative aspect-[16/8] overflow-hidden rounded-t-[2rem] md:aspect-[16/7]">
            <img src={post.image} alt={post.imageAlt || post.title} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-5 bottom-5 text-right text-white md:inset-x-10 md:bottom-10">
              <h1 className="mt-4 max-w-3xl font-heading text-2xl font-extrabold leading-tight md:text-4xl lg:text-5xl">{post.title}</h1>
            </div>
          </div>}
          <div className="flex items-center justify-start px-5 pt-5 text-sm text-foreground-muted lg:hidden">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{post.category}</span>
          </div>

          <div className="grid gap-6 p-3 md:p-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-6 lg:p-8">
            <div className="order-1 min-w-0 text-right lg:order-1">
              {content.countries?.length > 0 ? <CountryCards content={content} /> : <>
              <p className="text-lg font-medium leading-9 text-foreground-muted">{post.description}</p>
              <div className="my-8 rounded-2xl border-r-4 border-primary bg-primary/10 px-5 py-4 text-base font-semibold leading-8 text-foreground">
                {content.highlight}
              </div>
              <RichPostContent content={content} />
              {guideLinks.length > 0 && <section className="mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-5 md:p-6" aria-labelledby="guide-links-heading"><h2 id="guide-links-heading" className="font-heading text-xl font-extrabold text-foreground">{content.guideLinksTitle}</h2><div className="mt-4 flex flex-wrap gap-3">{guideLinks.map((guide) => <a key={guide.href} href={guide.href} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold !text-[#fff8f3] transition-colors hover:bg-primary-hover"><ArrowLeft aria-hidden="true" size={17} />{guide.label}</a>)}</div></section>}
              {content.media && <MediaShowcase post={post} media={content.media} />}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-5 dark:border-gray-600 lg:justify-end">
                <span className="text-sm text-foreground-muted">{content.shareLabel}</span>
                <button type="button" onClick={copyPostLink} className="group relative flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:border-primary hover:text-primary focus:outline-none dark:border-gray-600 dark:bg-transparent" aria-label={isLinkCopied ? copySuccessLabel : content.copyLabel}><LinkIcon size={16} /><span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{isLinkCopied ? copySuccessLabel : content.copyLabel}</span></button>
                <span ref={shareMenuRef} className="group relative">
                  <button type="button" aria-label={content.shareLabel} aria-expanded={isShareMenuOpen} onClick={() => setIsShareMenuOpen((isOpen) => !isOpen)} className="flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:border-primary hover:text-primary focus:outline-none dark:border-gray-600 dark:bg-transparent"><Share2 size={16} /></button>
                  <span className={`absolute bottom-full left-0 flex translate-y-1 gap-1 rounded-xl border border-border bg-surface p-1.5 shadow-lg transition-all group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 dark:border-gray-600 ${isShareMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none opacity-0'}`}>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`} target="_blank" rel="noreferrer" onClick={() => setIsShareMenuOpen(false)} aria-label="فیس‌بوک" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaFacebookF size={15} /></a>
                    <a href={`https://wa.me/?text=${encodedShareTitle}%20${encodedShareUrl}`} target="_blank" rel="noreferrer" onClick={() => setIsShareMenuOpen(false)} aria-label="واتساپ" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaWhatsapp size={17} /></a>
                    <a href={`https://t.me/share/url?url=${encodedShareUrl}&text=${encodedShareTitle}`} target="_blank" rel="noreferrer" onClick={() => setIsShareMenuOpen(false)} aria-label="تلگرام" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaTelegramPlane size={17} /></a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`} target="_blank" rel="noreferrer" onClick={() => setIsShareMenuOpen(false)} aria-label="لینکدین" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaLinkedinIn size={16} /></a>
                    <a href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`} target="_blank" rel="noreferrer" onClick={() => setIsShareMenuOpen(false)} aria-label="ایکس" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaXTwitter size={16} /></a>
                  </span>
                </span>
              </div>
              <div className="mt-8 flex justify-center lg:justify-start">
                <a href={backHref} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold !text-[#fff8f3] transition-colors hover:bg-primary-hover focus-visible:bg-primary-hover">
                  <ArrowRight aria-hidden="true" size={17} />
                  {content.backLabel}
                </a>
              </div>
              </>}
            </div>

            <ContentSidebar content={content} category={post.category} relatedPosts={relatedPosts} className="border-b border-border pb-5 dark:border-gray-600 lg:border-b-0 lg:pb-0" />
          </div>
        </article>
      </Container>
      </Section>
    </>
  )
}

export default BlogPostPage
