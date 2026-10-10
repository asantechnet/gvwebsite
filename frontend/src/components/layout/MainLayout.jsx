import { useEffect, useState } from 'react'

import Footer from './Footer.jsx'
import Header from './Header.jsx'
import ScrollProgress from './ScrollProgress.jsx'
import HomePage from '@pages/HomePage.jsx'
import AboutPage from '@pages/AboutPage.jsx'
import ContactPage from '@pages/ContactPage.jsx'
import dariFooterContent from '@/locales/prs/footer.json'
import dariHeaderContent from '@/locales/prs/header.json'
import dariHomeContent from '@/locales/prs/home.json'
import dariAboutContent from '@/locales/prs/about.json'
import dariContactContent from '@/locales/prs/contact.json'
import pashtoFooterContent from '@/locales/ps/footer.json'
import pashtoHeaderContent from '@/locales/ps/header.json'
import pashtoHomeContent from '@/locales/ps/home.json'
import pashtoAboutContent from '@/locales/ps/about.json'
import pashtoContactContent from '@/locales/ps/contact.json'

function MainLayout({ children = null }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'

    return window.localStorage.getItem('globalvision-theme') || 'light'
  })
  const [language, setLanguage] = useState('prs')
  const headerContent = language === 'prs' ? dariHeaderContent : pashtoHeaderContent
  const footerContent = language === 'prs' ? dariFooterContent : pashtoFooterContent
  const homeContent = language === 'prs' ? dariHomeContent : pashtoHomeContent
  const aboutContent = language === 'prs' ? dariAboutContent : pashtoAboutContent
  const contactContent = language === 'prs' ? dariContactContent : pashtoContactContent
  const page = window.location.pathname.replace(/\/$/, '') || '/'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1f2937' : '#fffaf5')
    window.localStorage.setItem('globalvision-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = 'rtl'
  }, [language])

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
        {children ?? (page === '/about' ? <AboutPage content={aboutContent} /> : page === '/contact' ? <ContactPage content={contactContent} /> : <HomePage content={homeContent} />)}
      </main>
      <Footer content={footerContent} navigationContent={headerContent} />
    </div>
  )
}

export default MainLayout
