import { Moon, Sun } from 'lucide-react'

import LanguageSwitcher from '@/shared/components/LanguageSwitcher.jsx'

const copy = {
  en: { eyebrow: 'Global Vision', title: 'Website is Under Development', description: 'We are making a few improvements and will be back shortly.', contact: 'Contact us: ' },
  ps: { eyebrow: 'ګلوبل ویژن', title: 'وېب‌سایټ د پراختیا په حال کې دی', description: 'موږ په وېب‌سایټ کې ځینې ښه‌والی راوړو او ژر به بېرته راشو.', contact: 'اړیکه: ' },
  dr: { eyebrow: 'گلوبل ویژن', title: 'وب‌سایت تحت توسعه', description: 'ما در حال بهبود وب‌سایت هستیم و به‌زودی برمی‌گردیم.', contact: 'تماس: ' },
}

function MaintenancePage({ language, theme, companyName, contactEmail, logo, onLanguageChange, onThemeToggle }) {
  const content = copy[language] || copy.dr
  return <main className="website-root grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-10 text-center text-foreground">
    <section className="relative isolate flex w-full max-w-2xl items-center justify-center overflow-visible rounded-[2rem] border border-border bg-surface px-6 pt-28 pb-8 shadow-2xl shadow-brand-orange/10 sm:px-12 sm:pt-28 sm:pb-10 lg:py-10">
      <span className="pointer-events-none absolute -end-20 -top-24 -z-10 size-64 rounded-full bg-brand-orange/15 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-28 -start-20 -z-10 size-64 rounded-full bg-brand-red/10 blur-3xl" />
      <div className="absolute left-4 top-4 z-10 flex gap-2">
        <LanguageSwitcher language={language} languageIds={{ prs: 'dr' }} optimizeEnglishTypography onChange={onLanguageChange} />
        <button type="button" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={theme === 'dark'} onClick={onThemeToggle} className="grid size-10 place-items-center rounded-xl border border-border bg-surface-muted text-foreground outline-none transition-colors hover:border-primary hover:bg-primary/20 focus:outline-none focus-visible:border-focus focus-visible:shadow-none!">{theme === 'dark' ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}</button>
      </div>
      <div className="mx-auto w-full max-w-xl">
        <img src={logo} alt={companyName || 'Global Vision'} className="mx-auto h-12 w-auto max-w-[15rem] object-contain" />
        <p className="mt-7 mb-0 text-xs font-bold tracking-[.14em] text-accent-text">{companyName || content.eyebrow}</p>
        <h1 className={`mt-3 mb-0 font-heading text-[clamp(1.45rem,4vw,2.3rem)] font-extrabold leading-tight tracking-[-.035em] ${language === 'en' ? 'normal-case' : ''}`}>{content.title}</h1>
        <p className="mx-auto mt-5 mb-0 max-w-lg text-sm leading-8 text-muted-foreground sm:text-base">{content.description}</p>
        <p className="mt-7 mb-0 text-xs font-semibold text-foreground-muted">{content.contact}<a href={`mailto:${contactEmail}`} className="text-accent-text no-underline transition-colors hover:text-accent-text">{contactEmail}</a></p>
      </div>
    </section>
  </main>
}

export default MaintenancePage
