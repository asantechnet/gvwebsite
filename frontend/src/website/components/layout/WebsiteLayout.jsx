import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import Footer from './Footer.jsx'
import Header from './Header.jsx'
import ScrollProgress from './ScrollProgress.jsx'
import RouteProgress from '@shared/RouteProgress.jsx'
import HomePage from '@pages/HomePage.jsx'
import AboutPage from '@pages/AboutPage.jsx'
import ContactPage from '@pages/ContactPage.jsx'
import MagazinePage from '@pages/MagazinePage.jsx'
import BlogPostPage from '@pages/BlogPostPage.jsx'
import GuidePostPage from '@pages/GuidePostPage.jsx'
import ServicePostPage from '@pages/ServicePostPage.jsx'
import DirectoryPage from '@pages/DirectoryPage.jsx'
import SearchPage from '@pages/SearchPage.jsx'
import NotFoundPage from '@pages/NotFoundPage.jsx'
import dariFooterContent from '@website/locales/prs/footer.json'
import dariHeaderContent from '@website/locales/prs/header.json'
import dariHomeContent from '@website/locales/prs/home.json'
import dariAboutContent from '@website/locales/prs/about.json'
import dariContactContent from '@website/locales/prs/contact.json'
import dariMagazineContent from '@website/locales/prs/magazine.json'
import pashtoFooterContent from '@website/locales/ps/footer.json'
import pashtoHeaderContent from '@website/locales/ps/header.json'
import pashtoHomeContent from '@website/locales/ps/home.json'
import pashtoAboutContent from '@website/locales/ps/about.json'
import pashtoContactContent from '@website/locales/ps/contact.json'
import pashtoMagazineContent from '@website/locales/ps/magazine.json'
import dariOpportunitiesContent from '@website/locales/prs/opportunities.json'
import pashtoOpportunitiesContent from '@website/locales/ps/opportunities.json'
import dariGuidesContent from '@website/locales/prs/guides.json'
import pashtoGuidesContent from '@website/locales/ps/guides.json'
import dariServicesContent from '@website/locales/prs/services.json'
import pashtoServicesContent from '@website/locales/ps/services.json'
import dariSearchContent from '@website/locales/prs/search.json'
import pashtoSearchContent from '@website/locales/ps/search.json'

// Temporary while content is static. Replace with real API loading state when the backend is connected.
const STATIC_SKELETON_MINIMUM_MS = 1000

function WebsiteLayout({ children = null }) {
  const [isRouteLoading, setIsRouteLoading] = useState(true)
  const scrollStorageKey = `globalvision-scroll:${window.location.pathname}${window.location.search}`
  const savedScrollPosition = useRef(Number(window.sessionStorage.getItem(scrollStorageKey)))
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'

    return window.localStorage.getItem('globalvision-theme') || 'light'
  })
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'prs'

    return window.localStorage.getItem('globalvision-language') || 'prs'
  })
  const headerContent = language === 'prs' ? dariHeaderContent : pashtoHeaderContent
  const footerContent = language === 'prs' ? dariFooterContent : pashtoFooterContent
  const homeContent = language === 'prs' ? dariHomeContent : pashtoHomeContent
  const aboutContent = language === 'prs' ? dariAboutContent : pashtoAboutContent
  const contactContent = language === 'prs' ? dariContactContent : pashtoContactContent
  const magazineContent = language === 'prs' ? dariMagazineContent : pashtoMagazineContent
  const opportunitiesContent = language === 'prs' ? dariOpportunitiesContent : pashtoOpportunitiesContent
  const guidesContent = language === 'prs' ? dariGuidesContent : pashtoGuidesContent
  const servicesContent = language === 'prs' ? dariServicesContent : pashtoServicesContent
  const searchContent = language === 'prs' ? dariSearchContent : pashtoSearchContent
  const page = window.location.pathname.replace(/\/$/, '') || '/'
  const isBlogPost = page.startsWith('/magazine/post/')
  const postSlug = isBlogPost ? decodeURIComponent(page.slice('/magazine/post/'.length)) : ''
  const selectedPost = magazineContent.news.items.find((post) => post.slug === postSlug)
  const opportunitySlug = page.startsWith('/opportunities/') ? page.slice('/opportunities/'.length) : ''
  const opportunity = opportunitiesContent[opportunitySlug]
  const countryMatch = page.match(/^\/opportunities\/country\/([^/]+)(\/scholarships)?$/)
  const countryGuide = countryMatch ? guidesContent.countries.find((country) => country.slug === countryMatch[1]) : null
  const examMatch = page.match(/^\/opportunities\/exams\/(ielts|toefl)$/)
  const examGuide = examMatch ? guidesContent.exams.find((exam) => exam.slug === examMatch[1]) : null
  const examGuideLinks = guidesContent.exams.map((exam) => ({ label: exam.name, href: `/opportunities/exams/${exam.slug}` }))
  const serviceSlug = page.startsWith('/services/') ? page.slice('/services/'.length) : ''
  const service = servicesContent.services.find((item) => item.slug === serviceSlug || item.aliases?.includes(serviceSlug))
  const serviceDirectoryItems = servicesContent.services.map((item) => ({ title: item.title, description: item.description, image: item.image, href: `/services/${item.slug}` }))
  const opportunityDirectoryItems = [...['study', 'migration', 'work', 'exams', 'country'].map((slug) => ({ title: opportunitiesContent[slug].post.title, description: opportunitiesContent[slug].post.description, image: opportunitiesContent[slug].post.image, href: `/opportunities/${slug}` })), (() => { const ielts = guidesContent.exams.find((exam) => exam.slug === 'ielts'); return { title: ielts.name, description: ielts.summary, image: '/assets/images/destinations/france.jpg', href: '/opportunities/exams/ielts' } })()]
  const searchQuery = new URLSearchParams(window.location.search).get('q')?.trim() || ''
  const searchableItems = [...opportunityDirectoryItems, ...serviceDirectoryItems, ...guidesContent.countries.map((item) => ({ title: item.name, description: item.summary, href: `/opportunities/country/${item.slug}` })), ...guidesContent.exams.map((item) => ({ title: item.name, description: item.summary, href: `/opportunities/exams/${item.slug}` })), ...magazineContent.news.items.map((item) => ({ title: item.title, description: item.description, href: `/magazine/post/${item.slug}` }))]
  const normalizedQuery = searchQuery.toLocaleLowerCase(language)
  const searchResults = normalizedQuery ? searchableItems.filter((item) => `${item.title} ${item.description}`.toLocaleLowerCase(language).includes(normalizedQuery)) : []
  const currentTitle = service?.title || countryGuide?.name || examGuide?.name || opportunity?.post.title || selectedPost?.title || (page === '/services' ? servicesContent.ui.indexTitle : page === '/opportunities' ? servicesContent.ui.opportunitiesTitle : page === '/search' ? searchContent.title : page === '/about' ? aboutContent.hero.title : page === '/contact' ? contactContent.hero.title : page === '/magazine' ? magazineContent.hero.title : page === '/' ? headerContent.navigation.home : searchContent.notFoundTitle)

  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto'
  }, [])

  useEffect(() => {
    const saveScrollPosition = () => window.sessionStorage.setItem(scrollStorageKey, String(window.scrollY))
    window.addEventListener('pagehide', saveScrollPosition)
    return () => window.removeEventListener('pagehide', saveScrollPosition)
  }, [scrollStorageKey])

  useEffect(() => {
    const minimumTimer = window.setTimeout(() => setIsRouteLoading(false), STATIC_SKELETON_MINIMUM_MS)
    return () => window.clearTimeout(minimumTimer)
  }, [])

  useLayoutEffect(() => {
    if (isRouteLoading) return undefined

    const navigationType = window.performance.getEntriesByType('navigation')[0]?.type
    if (navigationType === 'reload' && Number.isFinite(savedScrollPosition.current)) {
      window.scrollTo({ top: savedScrollPosition.current, behavior: 'auto' })
    }

    const frame = window.requestAnimationFrame(() => document.documentElement.style.removeProperty('scroll-behavior'))
    return () => window.cancelAnimationFrame(frame)
  }, [isRouteLoading])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1f2937' : '#fffaf5')
    window.localStorage.setItem('globalvision-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = 'rtl'
    window.localStorage.setItem('globalvision-language', language)
  }, [language])

  useEffect(() => {
    document.title = `${currentTitle} | Global Vision`
    let descriptionMeta = document.querySelector('meta[name="description"]')
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta')
      descriptionMeta.name = 'description'
      document.head.append(descriptionMeta)
    }
    descriptionMeta.content = service?.description || countryGuide?.summary || examGuide?.summary || opportunity?.post.description || selectedPost?.description || searchContent.description
  }, [currentTitle, service, countryGuide, examGuide, opportunity, selectedPost, searchContent.description])

  if (isRouteLoading) return <RouteProgress path={page} />

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollProgress />
      <Header
        content={headerContent}
        language={language}
        theme={theme}
        onLanguageToggle={() => setLanguage((currentLanguage) => (currentLanguage === 'prs' ? 'ps' : 'prs'))}
        onThemeToggle={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
      />
      <main className="flex-1 pt-16 xl:pt-20">
        {children ?? (page === '/' ? <HomePage content={homeContent} /> : page === '/about' ? <AboutPage content={aboutContent} /> : page === '/contact' ? <ContactPage content={contactContent} /> : page === '/search' ? <SearchPage content={searchContent} query={searchQuery} results={searchResults} /> : page === '/services' ? <DirectoryPage title={servicesContent.ui.indexTitle} description={servicesContent.ui.indexDescription} breadcrumbTitle={servicesContent.ui.services} homeLabel={headerContent.navigation.home} items={serviceDirectoryItems} actionLabel={servicesContent.ui.viewService} /> : page === '/opportunities' ? <DirectoryPage title={servicesContent.ui.opportunitiesTitle} description={servicesContent.ui.opportunitiesDescription} breadcrumbTitle={servicesContent.ui.opportunitiesTitle} homeLabel={headerContent.navigation.home} items={opportunityDirectoryItems} actionLabel={servicesContent.ui.viewOpportunity} /> : service ? <ServicePostPage service={service} content={servicesContent} postShell={opportunitiesContent.country.postDetail} /> : countryGuide ? <GuidePostPage guide={countryGuide} content={guidesContent} type={countryMatch[2] ? 'scholarship' : 'country'} postShell={opportunitiesContent.country.postDetail} /> : examGuide ? <GuidePostPage guide={examGuide} content={guidesContent} type="exam" /> : opportunity ? <BlogPostPage post={opportunity.post} content={{ ...opportunity.postDetail, guideLinksTitle: guidesContent.ui.examGuides }} guideLinks={opportunitySlug === 'exams' ? examGuideLinks : []} /> : isBlogPost && selectedPost ? <BlogPostPage post={selectedPost} content={magazineContent.postDetail} relatedPosts={magazineContent.news.items.filter((relatedPost) => relatedPost.slug !== selectedPost.slug && relatedPost.category === selectedPost.category).slice(0, 5)} /> : page === '/magazine' ? <MagazinePage content={magazineContent} language={language} /> : <NotFoundPage content={searchContent} />)}
      </main>
      <Footer content={footerContent} navigationContent={headerContent} />
    </div>
  )
}

export default WebsiteLayout
