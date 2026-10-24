import { useEffect, useState } from 'react'

import DashboardPage from '@cms/components/pages/DashboardPage.jsx'
import HomePage from '@cms/components/pages/HomePage.jsx'
import MessagesPage from '@cms/components/pages/MessagesPage.jsx'
import ProfilePage from '@cms/components/pages/ProfilePage.jsx'
import DashboardSidebar from './DashboardSidebar.jsx'
import DashboardTopbar from './DashboardTopbar.jsx'
import DeleteConfirmation from '@cms/components/DeleteConfirmation.jsx'
import UnsavedChangesBar from '@cms/components/UnsavedChangesBar.jsx'
import dariContent from '@cms/locales/prs/dashboard.json'
import pashtoContent from '@cms/locales/ps/dashboard.json'
import dariMagazineContent from '@website/locales/prs/magazine.json'
import dariServicesContent from '@website/locales/prs/services.json'
import dariGuidesContent from '@website/locales/prs/guides.json'
import dariMessagesContent from '@cms/locales/prs/messages.json'
import pashtoMessagesContent from '@cms/locales/ps/messages.json'
import dariProfileContent from '@cms/locales/prs/profile.json'
import pashtoProfileContent from '@cms/locales/ps/profile.json'
import dariHomeEditorContent from '@cms/locales/prs/home.json'
import pashtoHomeEditorContent from '@cms/locales/ps/home.json'
import dariHomeContent from '@website/locales/prs/home.json'
import pashtoHomeContent from '@website/locales/ps/home.json'

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
      <main id="dashboard-content" className="min-h-[calc(100vh-5rem)] px-4 pt-6 pb-28 sm:px-8 sm:pt-8">{window.location.pathname.startsWith('/dashboard/home') ? <HomePage key={language} content={homeEditorContent} initialContent={homeContent} /> : window.location.pathname.startsWith('/dashboard/messages') ? <MessagesPage content={{ ...messagesContent, dashboard: content.overview }} /> : window.location.pathname.startsWith('/dashboard/profile') ? <ProfilePage content={profileContent} /> : <DashboardPage content={content} counts={counts} />}</main><UnsavedChangesBar sidebarCollapsed={sidebarCollapsed} />
    </div>
  </div></DeleteConfirmation>
}

export default DashboardLayout
