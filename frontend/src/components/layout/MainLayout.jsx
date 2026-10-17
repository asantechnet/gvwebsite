import { useEffect, useState } from 'react'

import Footer from './Footer.jsx'
import Header from './Header.jsx'
import ScrollProgress from './ScrollProgress.jsx'
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
import dariFooterContent from '@/locales/prs/footer.json'
import dariHeaderContent from '@/locales/prs/header.json'
import dariHomeContent from '@/locales/prs/home.json'
import dariAboutContent from '@/locales/prs/about.json'
import dariContactContent from '@/locales/prs/contact.json'
import dariMagazineContent from '@/locales/prs/magazine.json'
import pashtoFooterContent from '@/locales/ps/footer.json'
import pashtoHeaderContent from '@/locales/ps/header.json'
import pashtoHomeContent from '@/locales/ps/home.json'
import pashtoAboutContent from '@/locales/ps/about.json'
import pashtoContactContent from '@/locales/ps/contact.json'
import pashtoMagazineContent from '@/locales/ps/magazine.json'
import dariOpportunitiesContent from '@/locales/prs/opportunities.json'
import pashtoOpportunitiesContent from '@/locales/ps/opportunities.json'
import dariGuidesContent from '@/locales/prs/guides.json'
import pashtoGuidesContent from '@/locales/ps/guides.json'
import dariServicesContent from '@/locales/prs/services.json'
import pashtoServicesContent from '@/locales/ps/services.json'
import dariSearchContent from '@/locales/prs/search.json'
import pashtoSearchContent from '@/locales/ps/search.json'
import { getCurrentRoute, toStaticHostHref } from '@/utils/routing.js'

function MainLayout({ children = null }) {
  const [route, setRoute] = useState(getCurrentRoute)
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
  const page = route.pathname
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
  const opportunityDirectoryItems = ['study', 'migration', 'work', 'exams', 'country'].map((slug) => ({ title: opportunitiesContent[slug].post.title, description: opportunitiesContent[slug].post.description, image: opportunitiesContent[slug].post.image, href: `/opportunities/${slug}` }))
  const searchQuery = route.searchParams.get('q')?.trim() || ''
  const searchableItems = [...opportunityDirectoryItems, ...serviceDirectoryItems, ...guidesContent.countries.map((item) => ({ title: item.name, description: item.summary, href: `/opportunities/country/${item.slug}` })), ...guidesContent.exams.map((item) => ({ title: item.name, description: item.summary, href: `/opportunities/exams/${item.slug}` })), ...magazineContent.news.items.map((item) => ({ title: item.title, description: item.description, href: `/magazine/post/${item.slug}` }))]
  const normalizedQuery = searchQuery.toLocaleLowerCase(language)
  const searchResults = normalizedQuery ? searchableItems.filter((item) => `${item.title} ${item.description}`.toLocaleLowerCase(language).includes(normalizedQuery)) : []
  const currentTitle = service?.title || countryGuide?.name || examGuide?.name || opportunity?.post.title || selectedPost?.title || (page === '/services' ? servicesContent.ui.indexTitle : page === '/opportunities' ? servicesContent.ui.opportunitiesTitle : page === '/search' ? searchContent.title : page === '/about' ? aboutContent.hero.title : page === '/contact' ? contactContent.hero.title : page === '/magazine' ? magazineContent.hero.title : page === '/' ? headerContent.navigation.home : searchContent.notFoundTitle)

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getCurrentRoute())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  useEffect(() => {
    const rewriteInternalLinks = (root = document) => {
      const links = [
        ...(root.matches?.('a[href^="/"]') ? [root] : []),
        ...(root.querySelectorAll?.('a[href^="/"]') ?? []),
      ]
      links.forEach((link) => {
        const href = link.getAttribute('href')
        const staticHostHref = toStaticHostHref(href)
        if (staticHostHref !== href) link.setAttribute('href', staticHostHref)
      })
    }
    const handleInternalClick = (event) => {
      const link = event.target.closest?.('a[href^="/"]')
      const href = link?.getAttribute('href')
      if (!href || href.startsWith('/#') || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      event.preventDefault()
      window.location.hash = href
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) rewriteInternalLinks(node)
      }))
    })

    rewriteInternalLinks()
    observer.observe(document.body, { childList: true, subtree: true })
    document.addEventListener('click', handleInternalClick)
    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleInternalClick)
    }
  })

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

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollProgress />
      <Header
        content={headerContent}
        language={language}
        theme={theme}
        onLanguageToggle={() => setLanguage((currentLanguage) => (currentLanguage === 'prs' ? 'ps' : 'prs'))}
        onThemeToggle={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
        currentPath={page}
      />
      <main className="flex-1 pt-16 xl:pt-20">
        {children ?? (page === '/' ? <HomePage content={homeContent} /> : page === '/about' ? <AboutPage content={aboutContent} /> : page === '/contact' ? <ContactPage content={contactContent} /> : page === '/search' ? <SearchPage content={searchContent} query={searchQuery} results={searchResults} /> : page === '/services' ? <DirectoryPage title={servicesContent.ui.indexTitle} description={servicesContent.ui.indexDescription} homeLabel={headerContent.navigation.home} items={serviceDirectoryItems} actionLabel={servicesContent.ui.viewService} /> : page === '/opportunities' ? <DirectoryPage title={servicesContent.ui.opportunitiesTitle} description={servicesContent.ui.opportunitiesDescription} homeLabel={headerContent.navigation.home} items={opportunityDirectoryItems} actionLabel={servicesContent.ui.viewOpportunity} /> : service ? <ServicePostPage service={service} content={servicesContent} postShell={opportunitiesContent.country.postDetail} /> : countryGuide ? <GuidePostPage guide={countryGuide} content={guidesContent} type={countryMatch[2] ? 'scholarship' : 'country'} postShell={opportunitiesContent.country.postDetail} /> : examGuide ? <GuidePostPage guide={examGuide} content={guidesContent} type="exam" /> : opportunity ? <BlogPostPage post={opportunity.post} content={{ ...opportunity.postDetail, guideLinksTitle: guidesContent.ui.examGuides }} guideLinks={opportunitySlug === 'exams' ? examGuideLinks : []} /> : isBlogPost && selectedPost ? <BlogPostPage post={selectedPost} content={magazineContent.postDetail} relatedPosts={magazineContent.news.items.filter((relatedPost) => relatedPost.slug !== selectedPost.slug && relatedPost.category === selectedPost.category).slice(0, 5)} /> : page === '/magazine' ? <MagazinePage content={magazineContent} language={language} /> : <NotFoundPage content={searchContent} />)}
      </main>
      <Footer content={footerContent} navigationContent={headerContent} currentPath={page} />
    </div>
  )
}

export default MainLayout
