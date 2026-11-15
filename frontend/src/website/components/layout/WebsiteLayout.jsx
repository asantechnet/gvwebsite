import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import Footer from './Footer.jsx'
import MaintenancePage from '../MaintenancePage.jsx'
import Header from './Header.jsx'
import ScrollProgress from './ScrollProgress.jsx'
import RouteProgress from '@shared/RouteProgress.jsx'
import { searchCatalog } from '@website/utils/catalog.js'
import { getLanguageConfig, localizeHref, parseLocalizedPathname, WEBSITE_LANGUAGE_STORAGE_KEY } from '@website/utils/language.js'
import { WebsiteLanguageContext } from '@website/hooks/useWebsiteLanguage.js'
import { applySeoMetadata, buildStructuredData, getSiteOrigin, toAbsoluteUrl } from '@website/seo/metadata.js'
import { lazyWithSkeletonPreview } from '@/shared/utils/loading.js'
import { finishReloadScrollRestoration, saveScrollPosition } from '@website/utils/scrollRestoration.js'
import { STUDY_DIRECTORY_CARD_LIMIT, getVisibleCardCount } from '@website/utils/cardCounts.js'
import { applyBrandColors, BRANDING_UPDATED_EVENT, readBrandIcon, readBrandLogo, readCompanyNames, watchBrowserBrandFavicon } from '@/shared/utils/branding.js'

const delayed = (importer) => lazy(() => lazyWithSkeletonPreview(importer))
const HomePage = delayed(() => import('@pages/HomePage.jsx'))
const AboutPage = delayed(() => import('@pages/AboutPage.jsx'))
const ContactPage = delayed(() => import('@pages/ContactPage.jsx'))
const ScholarshipsPage = delayed(() => import('@pages/ScholarshipsPage.jsx'))
const ScholarshipPostPage = delayed(() => import('@pages/ScholarshipPostPage.jsx'))
const MagazinePage = delayed(() => import('@pages/MagazinePage.jsx'))
const BlogPostPage = delayed(() => import('@pages/BlogPostPage.jsx'))
const StudyOpportunityPage = delayed(() => import('@pages/StudyOpportunityPage.jsx'))
const WorkOpportunityPage = delayed(() => import('@pages/WorkOpportunityPage.jsx'))
const MigrationOpportunityPage = delayed(() => import('@pages/MigrationOpportunityPage.jsx'))
const InvestmentOpportunityPage = delayed(() => import('@pages/InvestmentOpportunityPage.jsx'))
const OpportunityCountryPostPage = delayed(() => import('@pages/OpportunityCountryPostPage.jsx'))
const GuidePostPage = delayed(() => import('@pages/GuidePostPage.jsx'))
const ServicePostPage = delayed(() => import('@pages/ServicePostPage.jsx'))
const SearchPage = delayed(() => import('@pages/SearchPage.jsx'))
const NotFoundPage = delayed(() => import('@pages/NotFoundPage.jsx'))
const TourismPage = delayed(() => import('@pages/TourismPage.jsx'))
const AfghanistanTourismPage = delayed(() => import('@pages/AfghanistanTourismPage.jsx'))
const WorldTourismPage = delayed(() => import('@pages/WorldTourismPage.jsx'))
const ServicesPage = delayed(() => import('@pages/ServicesPage.jsx'))

function formatPageTitle(pattern, values) {
  return pattern.replace(/\{(\w+)\}/g, (placeholder, key) => values[key] ?? placeholder)
}

function ScrollRestorationFinalizer() {
  useLayoutEffect(() => finishReloadScrollRestoration(), [])
  return null
}

function WebsiteLayout({ children = null, content }) {
  const siteSettings = content.siteSettings
  const [companyNames, setCompanyNames] = useState(readCompanyNames)
  const [localMaintenanceMode, setLocalMaintenanceMode] = useState(() => window.localStorage.getItem('globalvision-maintenance-mode') === 'true')
  const maintenanceMode = siteSettings?.settings?.maintenanceMode ?? localMaintenanceMode
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'

    return window.localStorage.getItem('globalvision-theme') || 'light'
  })
  const parsedRoute = parseLocalizedPathname(window.location.pathname)
  const [maintenanceLanguage] = useState(() => {
    const hasExplicitLanguage = /^\/(dr|ps|en)(?:\/|$)/.test(window.location.pathname)
    const savedLanguage = window.sessionStorage.getItem('globalvision-maintenance-language')
    return hasExplicitLanguage ? parsedRoute.language : ['dr', 'ps', 'en'].includes(savedLanguage) ? savedLanguage : parsedRoute.language
  })
  const language = maintenanceMode ? maintenanceLanguage : parsedRoute.language
  const contentLocale = language === 'dr' ? 'prs' : language
  const companyName = content.profile?.[contentLocale] || companyNames[contentLocale]
  const page = parsedRoute.pagePath
  const activeLogo = (theme === 'dark' ? siteSettings?.branding?.darkLogo : siteSettings?.branding?.lightLogo) || readBrandLogo(theme)
  const lightFavicon = siteSettings?.branding?.lightIcon || readBrandIcon('light')
  const darkFavicon = siteSettings?.branding?.darkIcon || readBrandIcon('dark')

  useEffect(() => {
    const syncCompanyNames = () => setCompanyNames(readCompanyNames())
    const syncStoredCompanyNames = (event) => {
      if (event.key === 'globalvision-company-names') syncCompanyNames()
    }
    window.addEventListener(BRANDING_UPDATED_EVENT, syncCompanyNames)
    window.addEventListener('storage', syncStoredCompanyNames)
    return () => {
      window.removeEventListener(BRANDING_UPDATED_EVENT, syncCompanyNames)
      window.removeEventListener('storage', syncStoredCompanyNames)
    }
  }, [])

  useLayoutEffect(() => {
    if (!siteSettings) return
    if (siteSettings.branding?.primary && siteSettings.branding?.secondary) applyBrandColors(siteSettings.branding)
  }, [siteSettings])

  useLayoutEffect(() => {
    return watchBrowserBrandFavicon(lightFavicon, darkFavicon)
  }, [darkFavicon, lightFavicon])

  useLayoutEffect(() => {
    if (!maintenanceMode) return
    window.sessionStorage.setItem('globalvision-maintenance-language', maintenanceLanguage)
    if (window.location.pathname === '/' && !window.location.search && !window.location.hash) return

    window.history.replaceState(window.history.state, '', '/')
  }, [maintenanceLanguage, maintenanceMode])

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
  } = content
  const isBlogPost = page.startsWith('/magazine/post/')
  const postSlug = isBlogPost ? decodeURIComponent(page.slice('/magazine/post/'.length)) : ''
  const magazinePosts = [...magazineContent.news.items, ...magazineContent.articles.items]
  const selectedPost = magazinePosts.find((post) => post.slug === postSlug)
  const scholarshipMatch = page.match(/^\/scholarships\/([^/]+)$/)
  const selectedScholarship = scholarshipMatch ? scholarshipsContent.items.find((item) => item.slug === scholarshipMatch[1]) : null
  const opportunitySlug = page.startsWith('/opportunities/') ? page.slice('/opportunities/'.length) : ''
  const opportunity = opportunitiesContent[opportunitySlug]
  const contextualOpportunityMatch = page.match(/^\/opportunities\/(study|work|migration|investment)\/([^/]+)$/)
  const contextualOpportunity = contextualOpportunityMatch ? opportunitiesContent[contextualOpportunityMatch[1]] : null
  const opportunityCountries = (type) => opportunitiesContent[type]?.cards ?? guidesContent.countries
  const contextualOpportunityCountry = contextualOpportunityMatch ? opportunityCountries(contextualOpportunityMatch[1]).find((country) => country.slug === contextualOpportunityMatch[2]) : null
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
  const opportunitySearchItems = ['study', 'migration', 'work', 'investment'].flatMap((type) => {
    const managedCards = opportunitiesContent[type]?.cards
    if (managedCards) return managedCards.map((card) => ({ title: card.title || card.name, description: card.description, image: card.image, href: localizeHref(`/opportunities/${type}/${card.slug}`, language) }))
    const post = opportunitiesContent[type]?.post
    return post ? [{ title: post.title || post.category, description: post.description, image: post.image, href: localizeHref(`/opportunities/${type}`, language) }] : []
  })
  const searchQuery = new URLSearchParams(window.location.search).get('q')?.trim() || ''
  const searchableItems = [...opportunitySearchItems, ...Object.entries(tourismContent).map(([slug, item]) => ({ title: item.post.title, description: item.post.description, image: item.post.image, href: localizeHref(`/tourism/${slug}`, language) })), ...serviceSearchItems, ...scholarshipsContent.items.map((item) => ({ title: item.title, description: item.summary, href: localizeHref(`/scholarships/${item.slug}`, language) })), ...guidesContent.countries.map((item) => ({ title: item.name, description: item.summary, href: localizeHref(`/opportunities/study/${item.slug}`, language) })), ...guidesContent.exams.map((item) => ({ title: item.name, description: item.summary, href: localizeHref(`/opportunities/exams/${item.slug}`, language) })), ...magazinePosts.map((item) => ({ title: item.title, description: item.description, href: localizeHref(`/magazine/post/${item.slug}`, language) }))]
  const searchResults = searchCatalog(searchableItems, searchQuery, language)
  const opportunityPageTitle = contextualOpportunity?.post?.category || opportunity?.post?.category || null
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
  const currentSeoRecord = useMemo(() => tourismCard
    || service
    || selectedScholarship
    || examGuide
    || contextualOpportunityCountry
    || tourism?.post
    || opportunity?.post
    || selectedPost
    || {}, [contextualOpportunityCountry, examGuide, opportunity, selectedPost, selectedScholarship, service, tourism, tourismCard])
  const seoTitle = currentSeoRecord.seoTitle || currentTitle
  const isKnownPage = Boolean(
    navigationPageTitles[page]
    || selectedPost
    || selectedScholarship
    || service
    || tourism
    || tourismCard
    || opportunity
    || contextualOpportunityCountry
    || examGuide,
  )
  const currentDescription = currentSeoRecord.metaDescription
    || tourismCard?.description
    || service?.description
    || selectedScholarship?.summary
    || examGuide?.summary
    || contextualOpportunityCountry?.summary
    || tourism?.post.description
    || opportunity?.post?.description
    || selectedPost?.description
    || (page === '/' ? homeContent.hero.description : null)
    || (page === '/about' ? aboutContent.introduction.description : null)
    || (page === '/contact' ? contactContent.contact.form.description : null)
    || (page === '/services' ? servicesContent.ui.indexDescription : null)
    || (page === '/scholarships' ? scholarshipsContent.hero.description : null)
    || searchContent.description
  const currentImage = currentSeoRecord.socialImage
    || tourismCard?.image
    || service?.image
    || selectedScholarship?.image
    || examGuide?.image
    || tourism?.post.image
    || opportunity?.post?.image
    || selectedPost?.image
  const canonicalPage = service ? `/services/${service.slug}` : page
  const seoBreadcrumbs = useMemo(() => {
    const homeBreadcrumb = { name: headerContent.navigation.home, path: '/' }
    const currentBreadcrumb = { name: currentTitle, path: canonicalPage }
    if (page === '/') return [homeBreadcrumb]
    if (service) return [homeBreadcrumb, { name: headerContent.navigation.services, path: '/services' }, currentBreadcrumb]
    if (selectedScholarship) return [homeBreadcrumb, { name: headerContent.navigation.scholarships, path: '/scholarships' }, currentBreadcrumb]
    if (selectedPost) return [homeBreadcrumb, { name: headerContent.navigation.magazine, path: '/magazine' }, currentBreadcrumb]
    if (tourismCard && tourismDetail) return [homeBreadcrumb, { name: headerContent.navigation.tourism, path: `/tourism/${tourismDetail.id}` }, currentBreadcrumb]
    if (tourism) return [homeBreadcrumb, { name: headerContent.navigation.tourism, path: canonicalPage }, currentBreadcrumb]
    if (contextualOpportunityCountry && contextualOpportunityMatch) return [homeBreadcrumb, { name: headerContent.navigation.opportunities, path: `/opportunities/${contextualOpportunityMatch[1]}` }, currentBreadcrumb]
    if (opportunity || examGuide) return [homeBreadcrumb, { name: headerContent.navigation.opportunities, path: canonicalPage }, currentBreadcrumb]
    return [homeBreadcrumb, currentBreadcrumb]
  }, [canonicalPage, contextualOpportunityCountry, contextualOpportunityMatch, currentTitle, examGuide, headerContent.navigation, opportunity, page, selectedPost, selectedScholarship, service, tourism, tourismCard, tourismDetail])

  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto'
  }, [])

  useEffect(() => {
    window.addEventListener('pagehide', saveScrollPosition)
    return () => window.removeEventListener('pagehide', saveScrollPosition)
  }, [])

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
    const canonicalUrl = toAbsoluteUrl(currentSeoRecord.canonicalUrl || localizeHref(canonicalPage, language), getSiteOrigin())
    const structuredData = buildStructuredData({
      language,
      canonicalUrl,
      title: seoTitle,
      description: currentDescription,
      image: currentImage,
      brandName: headerContent.brandName,
      email: contactContent.contact.details.find((detail) => detail.type === 'email')?.value,
      breadcrumbs: seoBreadcrumbs,
      article: selectedPost ? { headline: selectedPost.title, datePublished: selectedPost.date } : null,
      service: service ? { name: service.title } : null,
    })
    applySeoMetadata({
      language,
      pagePath: page,
      canonicalPath: canonicalPage,
      canonicalUrl: currentSeoRecord.canonicalUrl,
      title: seoTitle,
      description: currentDescription,
      image: currentImage,
      brandName: headerContent.brandName,
      indexable: isKnownPage && page !== '/search' && !maintenanceMode,
      type: selectedPost ? 'article' : 'website',
      structuredData,
    })
  }, [language, page, canonicalPage, currentSeoRecord, seoTitle, currentDescription, currentImage, headerContent.brandName, contactContent.contact.details, isKnownPage, maintenanceMode, selectedPost, service, seoBreadcrumbs])

  useEffect(() => {
    const syncMaintenanceMode = (event) => { if (event.key === 'globalvision-maintenance-mode') setLocalMaintenanceMode(event.newValue === 'true') }
    window.addEventListener('storage', syncMaintenanceMode)
    return () => window.removeEventListener('storage', syncMaintenanceMode)
  }, [])

  if (maintenanceMode) return <MaintenancePage language={language} theme={theme} companyName={companyName} contactEmail={contactContent.contact.details.find((detail) => detail.type === 'email')?.value || ''} logo={activeLogo} onLanguageChange={(nextLanguage) => window.location.assign(localizeHref(`${page}${window.location.search}${window.location.hash}`, nextLanguage))} onThemeToggle={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))} />

  const directoryItemCount = page === '/services'
    ? servicesContent.services.length
    : page === '/tourism/afghanistan' || page === '/tourism/world'
      ? tourism?.cards.length || 0
      : page === '/opportunities/study'
        ? opportunitiesContent.study.cards?.length ?? getVisibleCardCount(guidesContent.countries.length, STUDY_DIRECTORY_CARD_LIMIT)
        : ['/opportunities/work', '/opportunities/migration', '/opportunities/investment'].includes(page)
          ? opportunityCountries(page.slice('/opportunities/'.length)).length
          : 0

  return (
    <Suspense fallback={<RouteProgress path={page} hasSearchQuery={Boolean(searchQuery)} searchResultCount={searchResults.length} directoryItemCount={directoryItemCount} scholarshipItemCount={scholarshipsContent.items.length} magazineNewsCount={magazineContent.news.items.length} magazineArticleCount={magazineContent.articles.items.length} contactSocialCount={contactContent.contact.visibility?.social === false ? 0 : contactContent.contact.socials.length} />}><WebsiteLanguageContext.Provider value={language}>
      <div className="website-root flex min-h-screen flex-col bg-background text-foreground">
        <ScrollProgress />
        <Header
          content={headerContent}
          language={language}
          theme={theme}
          onLanguageChange={(nextLanguage) => window.location.assign(localizeHref(`${page}${window.location.search}${window.location.hash}`, nextLanguage))}
          logo={activeLogo}
          onThemeToggle={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
        />
        <main key={language} className="flex-1 pt-8 md:pt-16 xl:pt-14">
          {children ?? (page === '/' ? <HomePage content={homeContent} /> : page === '/about' ? <AboutPage content={aboutContent} /> : page === '/contact' ? <ContactPage content={contactContent} language={language} /> : selectedScholarship ? <ScholarshipPostPage scholarship={selectedScholarship} content={scholarshipsContent} postShell={opportunitiesContent.migration.postDetail} /> : page === '/scholarships' ? <ScholarshipsPage key={language} content={scholarshipsContent} language={language} /> : page === '/search' ? <SearchPage content={searchContent} query={searchQuery} results={searchResults} /> : page === '/services' ? <ServicesPage content={servicesContent} sidebarContent={opportunitiesContent.migration.postDetail} /> : tourismCard ? <TourismPage content={tourismDetail} card={tourismCard} /> : tourism?.id === 'afghanistan' ? <AfghanistanTourismPage content={tourism} sidebarContent={opportunitiesContent.migration.postDetail} /> : tourism?.id === 'world' ? <WorldTourismPage content={tourism} sidebarContent={opportunitiesContent.migration.postDetail} /> : service ? <ServicePostPage service={service} content={servicesContent} postShell={opportunitiesContent.migration.postDetail} /> : contextualOpportunityCountry && contextualOpportunity?.post ? <OpportunityCountryPostPage country={contextualOpportunityCountry} opportunity={contextualOpportunity} type={contextualOpportunityMatch[1]} /> : examGuide ? <GuidePostPage guide={examGuide} content={guidesContent} type="exam" postShell={opportunitiesContent.exams.postDetail} /> : opportunitySlug === 'study' && opportunitiesContent.study.post ? <StudyOpportunityPage content={opportunitiesContent.study.postDetail} countries={opportunityCountries('study')} cmsManaged={Boolean(opportunitiesContent.study.cards)} title={language === 'en' ? 'Choose your preferred country' : language === 'ps' ? 'خپل مطلوب هېواد وټاکئ' : 'کشور مورد نظرتان را انتخاب کنید'} /> : opportunitySlug === 'work' && opportunitiesContent.work.post ? <WorkOpportunityPage content={opportunitiesContent.work.postDetail} countries={opportunityCountries('work')} title={opportunitiesContent.work.post.category} /> : opportunitySlug === 'migration' && opportunitiesContent.migration.post ? <MigrationOpportunityPage content={opportunitiesContent.migration.postDetail} countries={opportunityCountries('migration')} title={opportunitiesContent.migration.post.category} /> : opportunitySlug === 'investment' && opportunitiesContent.investment.post ? <InvestmentOpportunityPage content={opportunitiesContent.investment.postDetail} countries={opportunityCountries('investment')} title={opportunitiesContent.investment.post.category} /> : isBlogPost && selectedPost ? <BlogPostPage post={selectedPost} content={magazineContent.postDetail} relatedPosts={magazinePosts.filter((relatedPost) => relatedPost.slug !== selectedPost.slug && relatedPost.category === selectedPost.category).slice(0, 5)} /> : page === '/magazine' ? <MagazinePage content={magazineContent} language={language} /> : <NotFoundPage content={searchContent} />)}
        </main>
        <Footer content={footerContent} navigationContent={headerContent} language={language} theme={theme} logo={activeLogo} />
        <ScrollRestorationFinalizer />
      </div>
    </WebsiteLanguageContext.Provider></Suspense>
  )
}

export default WebsiteLayout
