import { useEffect, useState } from 'react'

import DashboardPage from '@cms/components/pages/DashboardPage.jsx'
import HomePage from '@cms/components/pages/HomePage.jsx'
import AboutPage from '@cms/components/pages/AboutPage.jsx'
import MagazinePage from '@cms/components/pages/MagazinePage.jsx'
import ScholarshipsPage from '@cms/components/pages/ScholarshipsPage.jsx'
import ContactPage from '@cms/components/pages/ContactPage.jsx'
import OpportunitiesPage from '@cms/components/pages/OpportunitiesPage.jsx'
import MessagesPage from '@cms/components/pages/MessagesPage.jsx'
import ProfilePage from '@cms/components/pages/ProfilePage.jsx'
import MediaLibraryPage from '@cms/components/pages/MediaLibraryPage.jsx'
import SettingsPage from '@cms/components/pages/SettingsPage.jsx'
import PlaceholderPage from '@cms/components/pages/PlaceholderPage.jsx'
import DashboardSidebar from './DashboardSidebar.jsx'
import DashboardTopbar from './DashboardTopbar.jsx'
import DeleteConfirmation from '@cms/components/DeleteConfirmation.jsx'
import UnsavedChangesBar from '@cms/components/UnsavedChangesBar.jsx'
import dariContent from '@cms/locales/prs/dashboard.json'
import pashtoContent from '@cms/locales/ps/dashboard.json'
import dariMagazineContent from '@website/locales/prs/magazine.json'
import dariServicesContent from '@website/locales/prs/services.json'
import pashtoServicesContent from '@website/locales/ps/services.json'
import dariMessagesContent from '@cms/locales/prs/messages.json'
import pashtoMessagesContent from '@cms/locales/ps/messages.json'
import dariProfileContent from '@cms/locales/prs/profile.json'
import pashtoProfileContent from '@cms/locales/ps/profile.json'
import dariHomeEditorContent from '@cms/locales/prs/home.json'
import pashtoHomeEditorContent from '@cms/locales/ps/home.json'
import dariHomeContent from '@website/locales/prs/home.json'
import pashtoHomeContent from '@website/locales/ps/home.json'
import dariAboutEditorContent from '@cms/locales/prs/about.json'
import pashtoAboutEditorContent from '@cms/locales/ps/about.json'
import dariAboutContent from '@website/locales/prs/about.json'
import pashtoAboutContent from '@website/locales/ps/about.json'
import dariMagazineEditorContent from '@cms/locales/prs/magazine.json'
import pashtoMagazineEditorContent from '@cms/locales/ps/magazine.json'
import pashtoMagazineContent from '@website/locales/ps/magazine.json'
import dariScholarshipsEditorContent from '@cms/locales/prs/scholarships.json'
import pashtoScholarshipsEditorContent from '@cms/locales/ps/scholarships.json'
import dariScholarshipsContent from '@website/locales/prs/scholarships.json'
import pashtoScholarshipsContent from '@website/locales/ps/scholarships.json'
import dariContactEditorContent from '@cms/locales/prs/contact.json'
import pashtoContactEditorContent from '@cms/locales/ps/contact.json'
import dariContactContent from '@website/locales/prs/contact.json'
import pashtoContactContent from '@website/locales/ps/contact.json'
import dariGuidesContent from '@website/locales/prs/guides.json'
import pashtoGuidesContent from '@website/locales/ps/guides.json'
import dariOpportunitiesContent from '@website/locales/prs/opportunities.json'
import pashtoOpportunitiesContent from '@website/locales/ps/opportunities.json'
import englishContent from '@cms/locales/en/dashboard.json'
import englishMessagesContent from '@cms/locales/en/messages.json'
import englishProfileContent from '@cms/locales/en/profile.json'
import dariDeviceContent from '@cms/locales/prs/device.json'
import pashtoDeviceContent from '@cms/locales/ps/device.json'
import englishDeviceContent from '@cms/locales/en/device.json'
import englishHomeEditorContent from '@cms/locales/en/home.json'
import englishAboutEditorContent from '@cms/locales/en/about.json'
import englishMagazineEditorContent from '@cms/locales/en/magazine.json'
import englishScholarshipsEditorContent from '@cms/locales/en/scholarships.json'
import englishContactEditorContent from '@cms/locales/en/contact.json'
import englishHomeContent from '@website/locales/en/home.json'
import englishAboutContent from '@website/locales/en/about.json'
import englishMagazineContent from '@website/locales/en/magazine.json'
import englishScholarshipsContent from '@website/locales/en/scholarships.json'
import englishContactContent from '@website/locales/en/contact.json'
import englishOpportunitiesContent from '@website/locales/en/opportunities.json'
import englishGuidesContent from '@website/locales/en/guides.json'
import englishServicesContent from '@website/locales/en/services.json'
import dariMediaContent from '@cms/locales/prs/media.json'
import pashtoMediaContent from '@cms/locales/ps/media.json'
import englishMediaContent from '@cms/locales/en/media.json'
import dariSettingsContent from '@cms/locales/prs/settings.json'
import pashtoSettingsContent from '@cms/locales/ps/settings.json'
import englishSettingsContent from '@cms/locales/en/settings.json'

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.localStorage.getItem('globalvision-cms-sidebar-collapsed') === 'true')
  const [theme, setTheme] = useState(() => window.localStorage.getItem('globalvision-theme') || 'light')
  const [language, setLanguage] = useState(() => {
    const savedLanguage = window.sessionStorage.getItem('globalvision-language')
    return ['prs', 'ps', 'en'].includes(savedLanguage) ? savedLanguage : 'prs'
  })
  const select = (dari, pashto, english) => language === 'en' ? english : language === 'ps' ? pashto : dari
  const content = select(dariContent, pashtoContent, englishContent)
  const messagesContent = select(dariMessagesContent, pashtoMessagesContent, englishMessagesContent)
  const deviceContent = select(dariDeviceContent, pashtoDeviceContent, englishDeviceContent)
  const profileContent = { ...select(dariProfileContent, pashtoProfileContent, englishProfileContent), ...deviceContent }
  const homeEditorContent = select(dariHomeEditorContent, pashtoHomeEditorContent, englishHomeEditorContent)
  const aboutEditorContent = select(dariAboutEditorContent, pashtoAboutEditorContent, englishAboutEditorContent)
  const magazineEditorContent = select(dariMagazineEditorContent, pashtoMagazineEditorContent, englishMagazineEditorContent)
  const scholarshipsEditorContent = select(dariScholarshipsEditorContent, pashtoScholarshipsEditorContent, englishScholarshipsEditorContent)
  const contactEditorContent = select(dariContactEditorContent, pashtoContactEditorContent, englishContactEditorContent)
  const opportunitiesContent = select(dariOpportunitiesContent, pashtoOpportunitiesContent, englishOpportunitiesContent)
  const guidesContent = select(dariGuidesContent, pashtoGuidesContent, englishGuidesContent)
  const servicesContent = select(dariServicesContent, pashtoServicesContent, englishServicesContent)
  const mediaContent = select(dariMediaContent, pashtoMediaContent, englishMediaContent)
  const settingsContent = select(dariSettingsContent, pashtoSettingsContent, englishSettingsContent)
  const serviceSources = { prs: dariServicesContent.services, ps: pashtoServicesContent.services, en: englishServicesContent.services }
  const localizedServices = servicesContent.services.map((service) => ({
    ...service,
    translations: Object.fromEntries(Object.entries(serviceSources).map(([locale, records]) => {
      const localized = records.find((record) => record.slug === service.slug) || {}
      return [locale, { title: localized.title || '', excerpt: localized.description || '', content: localized.content || '', tags: localized.tags || [], seoTitle: localized.seoTitle || localized.title || '', metaDescription: localized.metaDescription || localized.description || '', imageAlt: localized.imageAlt || '' }]
    })),
  }))
  const counts = { posts: dariMagazineContent.news.items.length, services: dariServicesContent.services.length, guides: dariGuidesContent.countries.length + dariGuidesContent.exams.length, messages: 0 }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.lang = language
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl'
    document.title = content.documentTitle
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
    robots.content = 'noindex, nofollow, noarchive'
    window.localStorage.setItem('globalvision-theme', theme)
    window.sessionStorage.setItem('globalvision-language', language)
  }, [content.documentTitle, language, theme])

  useEffect(() => {
    if (!sidebarOpen) return undefined

    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
    }
  }, [sidebarOpen])

  const toggleSidebar = () => setSidebarCollapsed((current) => { window.localStorage.setItem('globalvision-cms-sidebar-collapsed', String(!current)); return !current })

  return <DeleteConfirmation><div className="cms-root min-h-screen" data-theme={theme} dir={language === 'en' ? 'ltr' : 'rtl'}>
    <a href="#dashboard-content" className="fixed start-3 top-3 z-[70] -translate-y-20 rounded-xl bg-admin-heading px-4 py-3 text-white transition-transform focus:translate-y-0">{content.overview}</a>
    <DashboardSidebar content={content} theme={theme} open={sidebarOpen} collapsed={sidebarCollapsed} onCollapseToggle={toggleSidebar} onClose={() => setSidebarOpen(false)} />
    <div className={`admin-shell min-h-screen transition-[padding] duration-250 rtl:lg:pr-(--sidebar-width) ltr:lg:pl-(--sidebar-width) ${sidebarCollapsed ? 'rtl:lg:pr-21 ltr:lg:pl-21' : ''}`}>
      <DashboardTopbar content={content.topbar} searchItems={content.groups.flatMap((group) => group.items)} language={language} theme={theme} onMenuOpen={() => setSidebarOpen(true)} onThemeToggle={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} onLanguageChange={setLanguage} />
      <main id="dashboard-content" className="min-h-[calc(100vh-5rem)] px-4 pt-6 pb-28 sm:px-8 sm:pt-8">{window.location.pathname === '/dashboard' ? <DashboardPage content={content} counts={counts} /> : window.location.pathname.startsWith('/dashboard/home') ? <HomePage content={homeEditorContent} initialTranslations={{ prs: dariHomeContent, ps: pashtoHomeContent, en: englishHomeContent }} /> : window.location.pathname.startsWith('/dashboard/about') ? <AboutPage key={language} content={aboutEditorContent} initialTranslations={{ prs: dariAboutContent, ps: pashtoAboutContent, en: englishAboutContent }} /> : window.location.pathname.startsWith('/dashboard/contact') ? <ContactPage key={language} content={contactEditorContent} initialTranslations={{ prs: dariContactContent, ps: pashtoContactContent, en: englishContactContent }} /> : window.location.pathname.startsWith('/dashboard/magazine') ? <MagazinePage key={language} content={magazineEditorContent} initialTranslations={{ prs: dariMagazineContent, ps: pashtoMagazineContent, en: englishMagazineContent }} /> : window.location.pathname.startsWith('/dashboard/scholarships') ? <ScholarshipsPage key={language} content={scholarshipsEditorContent} initialTranslations={{ prs: dariScholarshipsContent, ps: pashtoScholarshipsContent, en: englishScholarshipsContent }} /> : window.location.pathname.startsWith('/dashboard/opportunities') ? <OpportunitiesPage key={language} content={content} opportunities={opportunitiesContent} exams={guidesContent.exams} /> : window.location.pathname.startsWith('/dashboard/services') ? <OpportunitiesPage key={language} content={content} services={localizedServices} /> : window.location.pathname.startsWith('/dashboard/messages') ? <MessagesPage content={{ ...messagesContent, dashboard: content.overview }} /> : window.location.pathname.startsWith('/dashboard/media') ? <MediaLibraryPage key={language} content={mediaContent} /> : window.location.pathname.startsWith('/dashboard/settings') ? <SettingsPage key={language} content={settingsContent} /> : window.location.pathname.startsWith('/dashboard/profile') ? <ProfilePage content={profileContent} theme={theme} /> : <PlaceholderPage content={content} pageKey={window.location.pathname.split('/')[2]} />}</main><UnsavedChangesBar sidebarCollapsed={sidebarCollapsed} />
    </div>
  </div></DeleteConfirmation>
}

export default DashboardLayout
