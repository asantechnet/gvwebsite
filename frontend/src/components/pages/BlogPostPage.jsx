import { ArrowRight, BriefcaseBusiness, Clock3, Eye, GraduationCap, House, Link as LinkIcon, Plane, Share2, ShieldCheck, UsersRound } from 'lucide-react'
import { FaFacebookF, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

import Container from '@ui/Container.jsx'
import PostCard from '@ui/PostCard.jsx'
import Section from '@ui/Section.jsx'
import { getStablePostViews } from '@/utils/postViews.js'

function BlogPostPage({ post, content, relatedPosts = [] }) {
  const views = post.views || getStablePostViews(post.title)

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

          <div className="grid gap-8 p-5 md:p-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:p-14">
            <div className="order-2 text-right lg:order-1">
              <p className="text-lg font-medium leading-9 text-foreground-muted">{post.description}</p>
              <div className="my-8 rounded-2xl border-r-4 border-primary bg-primary/10 px-5 py-4 text-base font-semibold leading-8 text-foreground">
                {content.highlight}
              </div>
              <div className="mt-7 space-y-5 text-base leading-9 text-foreground-muted">
                {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-border pt-5 dark:border-gray-600">
                <span className="text-sm text-foreground-muted">{content.shareLabel}</span>
                <button type="button" className="group relative flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:border-primary hover:text-primary focus:outline-none dark:border-gray-600 dark:bg-transparent" aria-label={content.copyLabel}><LinkIcon size={16} /><span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{content.copyLabel}</span></button>
                <span className="group relative">
                  <button type="button" className="flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground-muted transition-colors hover:border-primary hover:text-primary focus:outline-none dark:border-gray-600 dark:bg-transparent" aria-label={content.shareLabel}><Share2 size={16} /></button>
                  <span className="pointer-events-none absolute bottom-full left-0 flex translate-y-1 gap-1 rounded-xl border border-border bg-surface p-1.5 opacity-0 shadow-lg transition-all group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 dark:border-gray-600">
                    <a href="/magazine/post/1" aria-label="فیس‌بوک" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaFacebookF size={15} /></a>
                    <a href="/magazine/post/1" aria-label="واتساپ" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaWhatsapp size={17} /></a>
                    <a href="/magazine/post/1" aria-label="تلگرام" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaTelegramPlane size={17} /></a>
                    <a href="/magazine/post/1" aria-label="اینستاگرام" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaInstagram size={16} /></a>
                    <a href="/magazine/post/1" aria-label="لینکدین" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaLinkedinIn size={16} /></a>
                    <a href="/magazine/post/1" aria-label="ایکس" className="flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"><FaXTwitter size={16} /></a>
                  </span>
                </span>
              </div>
              {relatedPosts.length > 0 && <div className="mt-10 border-t border-border pt-8 dark:border-gray-600">
                <h2 className="mb-7 text-center font-heading text-xl font-extrabold text-foreground md:text-2xl">{content.relatedLabel}</h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 2xl:grid-cols-5">
                  {relatedPosts.map((relatedPost, index) => <div key={relatedPost.title} className={`${index >= 2 ? 'hidden md:block' : ''} ${index >= 3 ? 'md:hidden lg:block' : ''} ${index >= 4 ? 'lg:hidden 2xl:block' : ''}`}><PostCard post={relatedPost} language={content.language} /></div>)}
                </div>
              </div>}
              <div className="mt-8 flex justify-center">
                <a href="/magazine" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold !text-[#fff8f3] transition-colors hover:bg-primary-hover focus-visible:bg-primary-hover">
                  <ArrowRight aria-hidden="true" size={17} />
                  {content.backLabel}
                </a>
              </div>
            </div>

            <aside className="order-1 flex h-fit flex-row flex-wrap justify-end gap-3 border-b border-border pb-5 text-right text-sm text-foreground-muted dark:border-gray-600 lg:order-2 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
              <span className="w-fit self-start rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{post.category}</span>
              <span className="inline-flex items-center gap-2"><Eye aria-hidden="true" size={17} />{views}</span>
              <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" size={17} />{content.readTime}</span>
              <div className="mt-5 w-full border-t border-border pt-5 text-right dark:border-gray-600">
                <h2 className="mb-4 font-heading text-lg font-extrabold text-foreground">{content.quickAccessLabel}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {[[GraduationCap, content.quickLinks.study], [BriefcaseBusiness, content.quickLinks.work], [Plane, content.quickLinks.travel], [House, content.quickLinks.life], [ShieldCheck, content.quickLinks.visa], [UsersRound, content.quickLinks.migration]].map(([Icon, label]) => <a key={label} href="/magazine" className="flex flex-col items-center gap-1 rounded-xl border border-border px-2 py-3 text-center text-xs text-foreground-muted transition-colors hover:border-primary hover:text-primary dark:border-gray-600"><Icon size={20} /><span className="font-bold">{label}</span></a>)}
                </div>
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
