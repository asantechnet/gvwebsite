import { ChevronLeft } from 'lucide-react'

function Breadcrumbs({ items }) {
  return <nav aria-label="مسیر صفحه"><ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">{items.map(({ label, href }, index) => { const current = index === items.length - 1; return <li className="inline-flex items-center gap-1.5 text-[.75rem] leading-snug font-medium text-admin-muted" key={`${label}-${href ?? index}`}>{index > 0 && <ChevronLeft className="text-admin-muted/55" size={13} aria-hidden="true" />}{current || !href ? <span className={current ? 'font-semibold text-admin-heading' : ''} aria-current={current ? 'page' : undefined}>{label}</span> : <a className="transition hover:text-admin-brand" href={href}>{label}</a>}</li> })}</ol></nav>
}

export default Breadcrumbs
