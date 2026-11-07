import { ChevronLeft } from 'lucide-react'
import dariDashboard from '@cms/locales/prs/dashboard.json'
import pashtoDashboard from '@cms/locales/ps/dashboard.json'
import englishDashboard from '@cms/locales/en/dashboard.json'
import { useCmsInterfaceLanguage } from '@cms/hooks/useCmsLanguage.js'

function Breadcrumbs({ items }) {
  const language = useCmsInterfaceLanguage()
  const overview = (language === 'en' ? englishDashboard : language === 'ps' ? pashtoDashboard : dariDashboard).overview
  const trail = [{ label: overview }, ...(items.length > 1 ? items.slice(1) : [])]
  return <nav aria-label={language === 'en' ? 'Breadcrumb' : 'مسیر صفحه'}><ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">{trail.map(({ label, href }, index) => { const current = index === trail.length - 1; const parentHref = href || (!current ? '/dashboard' : undefined); return <li className="inline-flex items-center gap-1.5 text-[.75rem] leading-snug font-medium text-admin-muted" key={`${label}-${href ?? index}`}>{index > 0 && <ChevronLeft className="text-admin-muted/55" size={13} aria-hidden="true" />}{current ? <span className="font-semibold text-admin-heading" aria-current="page">{label}</span> : <a className="transition hover:text-admin-brand-text" href={parentHref}>{label}</a>}</li> })}</ol></nav>
}

export default Breadcrumbs
