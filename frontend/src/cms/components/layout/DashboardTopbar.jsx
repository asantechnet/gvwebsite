import { useState } from 'react'
import { ExternalLink, Menu, MessagesSquare, Moon, Search, Sun } from 'lucide-react'

import LanguageSwitcher from '@/shared/components/LanguageSwitcher.jsx'
import { getCmsHref } from '@cms/routes.js'
import { navigateCms } from '@cms/navigation.js'

function DashboardTopbar({ content, searchItems = [], language, theme, unreadCount = 0, canAccessMessages = false, onMenuOpen, onThemeToggle, onLanguageChange }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase(language)
  const searchResults = normalizedQuery
    ? searchItems.filter((item) => item.label.toLocaleLowerCase(language).includes(normalizedQuery) || item.key.toLocaleLowerCase().includes(normalizedQuery)).slice(0, 6)
    : []
  const submitSearch = (event) => {
    event.preventDefault()
    if (!normalizedQuery) return
    const [match] = searchResults
    if (match) navigateCms(getCmsHref(match.key))
  }
  const iconButton = 'grid size-10 shrink-0 place-items-center rounded-xl border border-(--header-control-border) bg-(--header-control) text-admin-muted outline-none transition hover:-translate-y-px hover:border-admin-brand hover:bg-(--header-control-hover) hover:text-admin-heading focus:outline-none focus-visible:border-admin-brand focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--admin-brand)_28%,transparent)] active:scale-[.97]'
  return <header className="admin-topbar [&_a]:outline-none [&_button]:outline-none sticky top-0 z-[70] flex min-h-15 items-center gap-[.45rem] border-b border-admin-border bg-(--admin-topbar) px-4 backdrop-blur-lg min-[701px]:min-h-16 min-[701px]:gap-2 max-[700px]:gap-2 max-[700px]:px-2 max-[420px]:gap-1 max-[420px]:px-1.5 sm:px-4 md:px-5 lg:px-8">
    <button type="button" className={`${iconButton} lg:hidden`} aria-label={content.menu} onClick={onMenuOpen}><Menu className="max-[420px]:size-[1.15rem]" size={20} /></button>
    <form role="search" onSubmit={submitSearch} className="relative hidden w-full max-w-64 sm:block"><label htmlFor="dashboard-search" className="sr-only">{content.search}</label><Search className="pointer-events-none absolute start-3 top-5 -translate-y-1/2 text-admin-muted" size={17} /><input id="dashboard-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={content.search} autoComplete="off" aria-controls="dashboard-search-results" aria-expanded={Boolean(normalizedQuery)} className="search-field h-10 w-full rounded-xl border border-(--header-control-border) bg-(--header-control) pe-3 ps-10 text-xs text-admin-heading outline-none transition placeholder:text-admin-muted focus:border-admin-brand" />{normalizedQuery && <div id="dashboard-search-results" className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-xl border border-admin-border bg-admin-card p-1.5 shadow-xl">{searchResults.length ? searchResults.map((item) => <a key={item.key} href={getCmsHref(item.key)} className="block rounded-lg px-3 py-2 text-xs font-semibold text-admin-heading transition hover:bg-admin-soft hover:text-admin-brand-text">{item.label}</a>) : <p className="px-3 py-2 text-xs text-admin-muted">{content.searchEmpty}</p>}</div>}</form>
    <a className="inline-flex size-10 items-center justify-center gap-2 rounded-xl border border-(--header-control-border) bg-(--header-control) p-0 text-xs font-semibold text-admin-muted transition hover:border-admin-brand hover:bg-(--header-control-hover) hover:text-admin-brand-text min-[1280px]:h-10 min-[1280px]:w-auto min-[1280px]:px-3.5" href="/" target="_blank" rel="noreferrer"><span className="hidden min-[1280px]:inline">{content.website}</span><ExternalLink size={16} /></a>
    <div className="ms-auto flex items-center gap-2.5 min-[701px]:gap-2 max-[420px]:gap-1"><LanguageSwitcher language={language} onChange={onLanguageChange} /><button type="button" className={iconButton} aria-label={content.theme} onClick={onThemeToggle}>{theme === 'dark' ? <Sun className="max-[420px]:size-[1.15rem]" size={18} /> : <Moon className="max-[420px]:size-[1.15rem]" size={18} />}</button>{canAccessMessages && <a href={getCmsHref('messages')} className={`${iconButton} relative overflow-visible border-[color-mix(in_srgb,var(--admin-brand)_28%,var(--header-control-border))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--admin-brand)_11%,var(--header-control)),var(--header-control))] text-[var(--admin-brand)] shadow-[inset_0_1px_0_rgb(255_255_255/.14),0_7px_18px_color-mix(in_srgb,var(--admin-brand)_10%,transparent)]`} aria-label={`${content.notifications}${unreadCount ? ` (${unreadCount})` : ''}`}><MessagesSquare className="max-[420px]:size-[1.15rem]" size={19} strokeWidth={2.15} />{unreadCount > 0 && <span className="absolute -end-1.5 -top-1.5 grid min-h-4 min-w-4 place-items-center rounded-full border-2 border-(--admin-topbar) bg-red-500 px-1 text-[.5625rem] font-bold leading-none text-white">{Math.min(unreadCount, 99)}</span>}</a>}<a href={getCmsHref('profile')} className={`${iconButton} group overflow-hidden p-0`} aria-label={content.profile}><img className="size-6 scale-[1.35] rounded-md border-0 object-contain p-0 shadow-none transition group-hover:-translate-y-px" src={theme === "dark" ? "/assets/branding/icon%20white.webp" : "/assets/branding/icon.webp"} alt="Global Vision" /></a></div>
  </header>
}

export default DashboardTopbar
