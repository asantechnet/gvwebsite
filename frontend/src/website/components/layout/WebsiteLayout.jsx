import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import Footer from './Footer.jsx'
import Header from './Header.jsx'
import ScrollProgress from './ScrollProgress.jsx'
import RouteProgress from '@shared/RouteProgress.jsx'
import HomePage from '@pages/HomePage.jsx'
import AboutPage from '@pages/AboutPage.jsx'
import ContactPage from '@pages/ContactPage.jsx'
import ScholarshipsPage from '@pages/ScholarshipsPage.jsx'
import ScholarshipPostPage from '@pages/ScholarshipPostPage.jsx'
import MagazinePage from '@pages/MagazinePage.jsx'
import BlogPostPage from '@pages/BlogPostPage.jsx'
import StudyOpportunityPage from '@pages/StudyOpportunityPage.jsx'
import WorkOpportunityPage from '@pages/WorkOpportunityPage.jsx'
import MigrationOpportunityPage from '@pages/MigrationOpportunityPage.jsx'
import InvestmentOpportunityPage from '@pages/InvestmentOpportunityPage.jsx'
import OpportunityCountryPostPage from '@pages/OpportunityCountryPostPage.jsx'
import GuidePostPage from '@pages/GuidePostPage.jsx'
import ServicePostPage from '@pages/ServicePostPage.jsx'
import SearchPage from '@pages/SearchPage.jsx'
import NotFoundPage from '@pages/NotFoundPage.jsx'
import TourismPage from '@pages/TourismPage.jsx'
import AfghanistanTourismPage from '@pages/AfghanistanTourismPage.jsx'
import WorldTourismPage from '@pages/WorldTourismPage.jsx'
import ServicesPage from '@pages/ServicesPage.jsx'
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
import dariScholarshipsContent from '@website/locales/prs/scholarships.json'
import pashtoScholarshipsContent from '@website/locales/ps/scholarships.json'
import dariOpportunitiesContent from '@website/locales/prs/opportunities.json'
import pashtoOpportunitiesContent from '@website/locales/ps/opportunities.json'
import dariGuidesContent from '@website/locales/prs/guides.json'
import pashtoGuidesContent from '@website/locales/ps/guides.json'
import dariServicesContent from '@website/locales/prs/services.json'
import pashtoServicesContent from '@website/locales/ps/services.json'
import dariSearchContent from '@website/locales/prs/search.json'
import pashtoSearchContent from '@website/locales/ps/search.json'
import dariTourismContent from '@website/locales/prs/tourism.json'
import pashtoTourismContent from '@website/locales/ps/tourism.json'
import englishFooterContent from '@website/locales/en/footer.json'
import englishHeaderContent from '@website/locales/en/header.json'
import englishHomeContent from '@website/locales/en/home.json'
import englishAboutContent from '@website/locales/en/about.json'
import englishContactContent from '@website/locales/en/contact.json'
import englishMagazineContent from '@website/locales/en/magazine.json'
import englishScholarshipsContent from '@website/locales/en/scholarships.json'
import englishOpportunitiesContent from '@website/locales/en/opportunities.json'
import englishGuidesContent from '@website/locales/en/guides.json'
import englishServicesContent from '@website/locales/en/services.json'
import englishSearchContent from '@website/locales/en/search.json'
import englishTourismContent from '@website/locales/en/tourism.json'
import { searchCatalog } from '@website/utils/catalog.js'
import { getLanguageConfig, localizeContentHrefs, localizeHref, parseLocalizedPathname, WEBSITE_LANGUAGE_STORAGE_KEY } from '@website/utils/language.js'
import { WebsiteLanguageContext } from '@website/hooks/useWebsiteLanguage.js'

// Temporary while content is static. Replace with real API loading state when the backend is connected.
const STATIC_SKELETON_MINIMUM_MS = 1000
const rawLocalizedContent = {
  dr: {
    footer: dariFooterContent,
    header: dariHeaderContent,
    home: dariHomeContent,
    about: dariAboutContent,
    contact: dariContactContent,
    magazine: dariMagazineContent,
    scholarships: dariScholarshipsContent,
    opportunities: dariOpportunitiesContent,
    guides: dariGuidesContent,
    services: dariServicesContent,
    search: dariSearchContent,
    tourism: dariTourismContent,
  },
  ps: {
    footer: pashtoFooterContent,
    header: pashtoHeaderContent,
    home: pashtoHomeContent,
    about: pashtoAboutContent,
    contact: pashtoContactContent,
    magazine: pashtoMagazineContent,
    scholarships: pashtoScholarshipsContent,
    opportunities: pashtoOpportunitiesContent,
    guides: pashtoGuidesContent,
    services: pashtoServicesContent,
    search: pashtoSearchContent,
    tourism: pashtoTourismContent,
  },
  en: {
    footer: englishFooterContent,
    header: englishHeaderContent,
    home: englishHomeContent,
    about: englishAboutContent,
    contact: englishContactContent,
    magazine: englishMagazineContent,
    scholarships: englishScholarshipsContent,
    opportunities: englishOpportunitiesContent,
    guides: englishGuidesContent,
    services: englishServicesContent,
    search: englishSearchContent,
    tourism: englishTourismContent,
  },
}
const localizedContent = Object.fromEntries(
  Object.entries(rawLocalizedContent).map(([language, content]) => [
    language,
    localizeContentHrefs(content, language),
  ]),
)

function formatPageTitle(pattern, values) {
  return pattern.replace(/\{(\w+)\}/g, (placeholder, key) => values[key] ?? placeholder)
}

function WebsiteLayout({ children = null }) {
  const [isRouteLoading, setIsRouteLoading] = useState(true)
  const scrollStorageKey = `globalvision-scroll:${window.location.pathname}${window.location.search}`
  const savedScrollPosition = useRef(Number(window.sessionStorage.getItem(scrollStorageKey)))
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'

    return window.localStorage.getItem('globalvision-theme') || 'light'
  })
  const { language, pagePath: page } = parseLocalizedPathname(window.location.pathname)
  const {
    header: headerContent,
    footer: footerContent,
    home: homeContent,
    about: aboutContent,
    contact: contactContent,
    magazine: magazineContent,
    scholarships: scholarshipsContent,
    opportunities: opportunitiesContent,
    guides: guidesContent,
    services: servicesContent,
    search: searchContent,
    tourism: tourismContent,
  } = localizedContent[language]
  const isBlogPost = page.startsWith('/magazine/post/')
  const postSlug = isBlogPost ? decodeURIComponent(page.slice('/magazine/post/'.length)) : ''
  const selectedPost = magazineContent.news.items.find((post) => post.slug === postSlug)
  const scholarshipMatch = page.match(/^\/scholarships\/([^/]+)$/)
  const selectedScholarship = scholarshipMatch ? scholarshipsContent.items.find((item) => item.slug === scholarshipMatch[1]) : null
  const opportunitySlug = page.startsWith('/opportunities/') ? page.slice('/opportunities/'.length) : ''
  const opportunity = opportunitiesContent[opportunitySlug]
  const contextualOpportunityMatch = page.match(/^\/opportunities\/(study|work|migration|investment)\/([^/]+)$/)
  const contextualOpportunityCountry = contextualOpportunityMatch ? guidesContent.countries.find((country) => country.slug === contextualOpportunityMatch[2]) : null
  const contextualOpportunity = contextualOpportunityMatch ? opportunitiesContent[contextualOpportunityMatch[1]] : null
  const examMatch = page.match(/^\/opportunities\/exams\/([^/]+)$/)
  const examGuide = examMatch ? guidesContent.exams.find((exam) => exam.slug === examMatch[1]) : null
  const tourismDirectoryMatch = page.match(/^\/tourism\/(afghanistan|world)$/)
  const tourismDetailMatch = page.match(/^\/tourism\/(afghanistan|world)\/([^/]+)$/)
  const tourism = tourismDirectoryMatch ? tourismContent[tourismDirectoryMatch[1]] : null
  const tourismDetail = tourismDetailMatch ? tourismContent[tourismDetailMatch[1]] : null
  const tourismCard = tourismDetail?.cards.find((card) => card.slug === tourismDetailMatch[2])
  const serviceSlug = page.startsWith('/services/') ? page.slice('/services/'.length) : ''
  const service = servicesContent.services.find((item) => item.slug === serviceSlug || item.aliases?.includes(serviceSlug))
  const serviceSearchItems = servicesContent.services.map((item) => ({ title: `${servicesContent.ui.services} ${item.title}`, description: item.description, image: item.image, href: localizeHref(`/services/${item.slug}`, language) }))
  const opportunitySearchItems = ['study', 'migration', 'work', 'investment'].map((slug) => ({ title: opportunitiesContent[slug].post.category, description: opportunitiesContent[slug].post.description, image: opportunitiesContent[slug].post.image, href: localizeHref(`/opportunities/${slug}`, language) }))
  const searchQuery = new URLSearchParams(window.location.search).get('q')?.trim() || ''
  const searchableItems = [...opportunitySearchItems, ...Object.entries(tourismContent).map(([slug, item]) => ({ title: item.post.title, description: item.post.description, image: item.post.image, href: localizeHref(`/tourism/${slug}`, language) })), ...serviceSearchItems, ...scholarshipsContent.items.map((item) => ({ title: item.title, description: item.summary, href: localizeHref(`/scholarships/${item.slug}`, language) })), ...guidesContent.countries.map((item) => ({ title: item.name, description: item.summary, href: localizeHref(`/opportunities/study/${item.slug}`, language) })), ...guidesContent.exams.map((item) => ({ title: item.name, description: item.summary, href: localizeHref(`/opportunities/exams/${item.slug}`, language) })), ...magazineContent.news.items.map((item) => ({ title: item.title, description: item.description, href: localizeHref(`/magazine/post/${item.slug}`, language) }))]
  const searchResults = searchCatalog(searchableItems, searchQuery, language)
  const opportunityPageTitle = contextualOpportunity?.post.category || opportunity?.post.category || null
  const countryOpportunityTitle = contextualOpportunityCountry && opportunityPageTitle
    ? formatPageTitle(headerContent.pageTitles.opportunityInCountry, {
        opportunity: opportunityPageTitle,
        country: contextualOpportunityCountry.name,
      })
    : null
  const tourismDirectoryTitle = tourism?.post.title || null
  const tourismDestinationTitle = tourismCard
    ? formatPageTitle(headerContent.pageTitles.tourismInDestination, { destination: tourismCard.name })
    : null
  const navigationPageTitles = {
    '/': headerContent.navigation.home,
    '/services': headerContent.navigation.services,
    '/scholarships': headerContent.navigation.scholarships,
    '/magazine': headerContent.navigation.magazine,
    '/about': headerContent.navigation.about,
    '/contact': headerContent.navigation.contact,
    '/search': searchContent.title,
  }
  const currentTitle = tourismDestinationTitle
    || service?.title
    || selectedScholarship?.title
    || examGuide?.name
    || countryOpportunityTitle
    || tourismDirectoryTitle
    || opportunityPageTitle
    || selectedPost?.title
    || navigationPageTitles[page]
    || searchContent.notFoundTitle

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

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1f2937' : '#fffaf5')
    window.localStorage.setItem('globalvision-theme', theme)
  }, [theme])

  useLayoutEffect(() => {
    const config = getLanguageConfig(language)
    document.documentElement.dataset.language = config.id
    document.documentElement.lang = config.htmlLang
    document.documentElement.dir = config.direction
    window.localStorage.setItem(WEBSITE_LANGUAGE_STORAGE_KEY, config.id)
  }, [language])

  useLayoutEffect(() => {
    document.title = `${currentTitle} | ${headerContent.brandName}`
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
    robots.content = 'index, follow'
    let descriptionMeta = document.querySelector('meta[name="description"]')
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta')
      descriptionMeta.name = 'description'
      document.head.append(descriptionMeta)
    }
    descriptionMeta.content = tourismCard?.description || service?.description || selectedScholarship?.summary || examGuide?.summary || tourism?.post.description || opportunity?.post.description || selectedPost?.description || (page === '/services' ? servicesContent.ui.indexDescription : page === '/scholarships' ? scholarshipsContent.hero.description : searchContent.description)
  }, [currentTitle, headerContent.brandName, tourismCard, service, selectedScholarship, examGuide, tourism, opportunity, selectedPost, page, servicesContent.ui.indexDescription, scholarshipsContent.hero.description, searchContent.description])

  useEffect(() => {
    const upsertLanguageLink = (rel, href, hreflang) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`
      let link = document.head.querySelector(selector)
      if (!link) {
        link = document.createElement('link')
        link.rel = rel
        if (hreflang) link.hreflang = hreflang
        document.head.append(link)
      }
      link.href = new URL(href, window.location.origin).href
    }

    upsertLanguageLink('canonical', `${localizeHref(page, language)}${window.location.search}`)
    upsertLanguageLink('alternate', localizeHref(page, 'dr'), 'fa-AF')
    upsertLanguageLink('alternate', localizeHref(page, 'ps'), 'ps-AF')
    upsertLanguageLink('alternate', localizeHref(page, 'en'), 'en')
    upsertLanguageLink('alternate', localizeHref(page, 'dr'), 'x-default')
  }, [language, page])

  if (isRouteLoading) {
    const directoryItemCount = page === '/services'
      ? servicesContent.services.length
      : page === '/tourism/afghanistan' || page === '/tourism/world'
        ? tourism?.cards.length || 0
        : ['/opportunities/study', '/opportunities/work', '/opportunities/migration', '/opportunities/investment'].includes(page)
            ? guidesContent.countries.length
            : 0
    return <RouteProgress path={page} hasSearchQuery={Boolean(searchQuery)} searchResultCount={searchResults.length} directoryItemCount={directoryItemCount} />
  }

  return (
    <WebsiteLanguageContext.Provider value={language}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <ScrollProgress />
        <Header
          content={headerContent}
          language={language}
          theme={theme}
          onLanguageChange={(nextLanguage) => window.location.assign(localizeHref(`${page}${window.location.search}${window.location.hash}`, nextLanguage))}
          onThemeToggle={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
        />
        <main key={language} className="flex-1 pt-8 md:pt-16 xl:pt-14">
          {children ?? (page === '/' ? <HomePage content={homeContent} /> : page === '/about' ? <AboutPage content={aboutContent} /> : page === '/contact' ? <ContactPage content={contactContent} language={language} /> : selectedScholarship ? <ScholarshipPostPage scholarship={selectedScholarship} content={scholarshipsContent} postShell={opportunitiesContent.migration.postDetail} /> : page === '/scholarships' ? <ScholarshipsPage key={language} content={scholarshipsContent} language={language} /> : page === '/search' ? <SearchPage content={searchContent} query={searchQuery} results={searchResults} /> : page === '/services' ? <ServicesPage content={servicesContent} sidebarContent={opportunitiesContent.migration.postDetail} /> : tourismCard ? <TourismPage content={tourismDetail} card={tourismCard} /> : tourism?.id === 'afghanistan' ? <AfghanistanTourismPage content={tourism} sidebarContent={opportunitiesContent.migration.postDetail} /> : tourism?.id === 'world' ? <WorldTourismPage content={tourism} sidebarContent={opportunitiesContent.migration.postDetail} /> : service ? <ServicePostPage service={service} content={servicesContent} postShell={opportunitiesContent.migration.postDetail} /> : contextualOpportunityCountry && contextualOpportunity ? <OpportunityCountryPostPage country={contextualOpportunityCountry} opportunity={contextualOpportunity} type={contextualOpportunityMatch[1]} /> : examGuide ? <GuidePostPage guide={examGuide} content={guidesContent} type="exam" postShell={opportunitiesContent.exams.postDetail} /> : opportunitySlug === 'study' ? <StudyOpportunityPage content={opportunitiesContent.study.postDetail} countries={guidesContent.countries} title={language === 'en' ? 'Choose your preferred country' : language === 'ps' ? 'خپل مطلوب هېواد وټاکئ' : 'کشور مورد نظرتان را انتخاب کنید'} /> : opportunitySlug === 'work' ? <WorkOpportunityPage content={opportunitiesContent.work.postDetail} countries={guidesContent.countries} title={opportunitiesContent.work.post.category} /> : opportunitySlug === 'migration' ? <MigrationOpportunityPage content={opportunitiesContent.migration.postDetail} countries={guidesContent.countries} title={opportunitiesContent.migration.post.category} /> : opportunitySlug === 'investment' ? <InvestmentOpportunityPage content={opportunitiesContent.investment.postDetail} countries={guidesContent.countries} title={opportunitiesContent.investment.post.category} /> : isBlogPost && selectedPost ? <BlogPostPage post={selectedPost} content={magazineContent.postDetail} relatedPosts={magazineContent.news.items.filter((relatedPost) => relatedPost.slug !== selectedPost.slug && relatedPost.category === selectedPost.category).slice(0, 5)} /> : page === '/magazine' ? <MagazinePage content={magazineContent} language={language} /> : <NotFoundPage content={searchContent} />)}
        </main>
        <Footer content={footerContent} navigationContent={headerContent} language={language} theme={theme} />
      </div>
    </WebsiteLanguageContext.Provider>
  )
}

export default WebsiteLayout
