import { useEffect, useState } from 'react'

import DashboardPage from '@cms/components/pages/DashboardPage.jsx'
import HomePage from '@cms/components/pages/HomePage.jsx'
import AboutPage from '@cms/components/pages/AboutPage.jsx'
import ContactPage from '@cms/components/pages/ContactPage.jsx'
import OpportunitiesPage from '@cms/components/pages/OpportunitiesPage.jsx'
import MessagesPage from '@cms/components/pages/MessagesPage.jsx'
import ProfilePage from '@cms/components/pages/ProfilePage.jsx'
import PlaceholderPage from '@cms/components/pages/PlaceholderPage.jsx'
import DashboardSidebar from './DashboardSidebar.jsx'
import DashboardTopbar from './DashboardTopbar.jsx'
import DeleteConfirmation from '@cms/components/DeleteConfirmation.jsx'
import UnsavedChangesBar from '@cms/components/UnsavedChangesBar.jsx'
import dariContent from '@cms/locales/prs/dashboard.json'
import pashtoContent from '@cms/locales/ps/dashboard.json'
import dariMagazineContent from '@website/locales/prs/magazine.json'
import dariServicesContent from '@website/locales/prs/services.json'
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
import dariContactEditorContent from '@cms/locales/prs/contact.json'
import pashtoContactEditorContent from '@cms/locales/ps/contact.json'
import dariContactContent from '@website/locales/prs/contact.json'
import pashtoContactContent from '@website/locales/ps/contact.json'
import dariGuidesContent from '@website/locales/prs/guides.json'
import pashtoGuidesContent from '@website/locales/ps/guides.json'
import dariOpportunitiesContent from '@website/locales/prs/opportunities.json'
import pashtoOpportunitiesContent from '@website/locales/ps/opportunities.json'

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.localStorage.getItem('globalvision-cms-sidebar-collapsed') === 'true')
  const [theme, setTheme] = useState(() => window.localStorage.getItem('globalvision-theme') || 'light')
  const [language, setLanguage] = useState(() => window.localStorage.getItem('globalvision-language') || 'prs')
  const content = language === 'prs' ? dariContent : pashtoContent
  const messagesContent = language === 'prs' ? dariMessagesContent : pashtoMessagesContent
  const profileContent = language === 'prs' ? dariProfileContent : pashtoProfileContent
  const homeEditorContent = language === 'prs' ? dariHomeEditorContent : pashtoHomeEditorContent
  const homeContent = language === 'prs' ? dariHomeContent : pashtoHomeContent
  const aboutEditorContent = language === 'prs' ? dariAboutEditorContent : pashtoAboutEditorContent
  const aboutContent = language === 'prs' ? dariAboutContent : pashtoAboutContent
  const contactEditorContent = language === 'prs' ? dariContactEditorContent : pashtoContactEditorContent
  const contactContent = language === 'prs' ? dariContactContent : pashtoContactContent
  const opportunitiesContent = language === 'prs' ? dariOpportunitiesContent : pashtoOpportunitiesContent
  const guidesContent = language === 'prs' ? dariGuidesContent : pashtoGuidesContent
  const counts = { posts: dariMagazineContent.news.items.length, services: dariServicesContent.services.length, guides: dariGuidesContent.countries.length + dariGuidesContent.exams.length, messages: 0 }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.lang = language
    document.documentElement.dir = 'rtl'
    document.title = content.documentTitle
    window.localStorage.setItem('globalvision-theme', theme)
    window.localStorage.setItem('globalvision-language', language)
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

  return <DeleteConfirmation><div className="cms-root min-h-screen" data-theme={theme} dir="rtl">
    <a href="#dashboard-content" className="fixed top-3 right-3 z-[70] -translate-y-20 rounded-xl bg-admin-heading px-4 py-3 text-white transition-transform focus:translate-y-0">{content.overview}</a>
    <DashboardSidebar content={content} open={sidebarOpen} collapsed={sidebarCollapsed} onCollapseToggle={toggleSidebar} onClose={() => setSidebarOpen(false)} />
    <div className={`admin-shell min-h-screen transition-[padding] duration-250 lg:pr-(--sidebar-width) ${sidebarCollapsed ? 'lg:pr-21' : ''}`}>
      <DashboardTopbar content={content.topbar} language={language} theme={theme} onMenuOpen={() => setSidebarOpen(true)} onThemeToggle={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} onLanguageToggle={() => setLanguage((current) => current === 'prs' ? 'ps' : 'prs')} />
      <main id="dashboard-content" className="min-h-[calc(100vh-5rem)] px-4 pt-6 pb-28 sm:px-8 sm:pt-8">{window.location.pathname === '/dashboard' ? <DashboardPage content={content} counts={counts} /> : window.location.pathname.startsWith('/dashboard/home') ? <HomePage key={language} content={homeEditorContent} initialContent={homeContent} /> : window.location.pathname.startsWith('/dashboard/about') ? <AboutPage key={language} content={aboutEditorContent} initialContent={aboutContent} /> : window.location.pathname.startsWith('/dashboard/contact') ? <ContactPage key={language} content={contactEditorContent} initialContent={contactContent} /> : window.location.pathname.startsWith('/dashboard/opportunities') ? <OpportunitiesPage key={language} content={content} opportunities={opportunitiesContent} exams={guidesContent.exams} /> : window.location.pathname.startsWith('/dashboard/messages') ? <MessagesPage content={{ ...messagesContent, dashboard: content.overview }} /> : window.location.pathname.startsWith('/dashboard/profile') ? <ProfilePage content={profileContent} /> : <PlaceholderPage content={content} pageKey={window.location.pathname.split('/')[2]} />}</main><UnsavedChangesBar sidebarCollapsed={sidebarCollapsed} />
    </div>
  </div></DeleteConfirmation>
}

export default DashboardLayout
