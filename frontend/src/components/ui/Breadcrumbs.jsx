import { ChevronLeft } from 'lucide-react'

function Breadcrumbs({ items = [], ariaLabel = 'Breadcrumb', centered = false }) {
  if (items.length === 0) return null

  return (
    <nav aria-label={ariaLabel}>
      <ol className={`flex flex-wrap items-center justify-center gap-1.5 text-sm text-foreground-muted ${centered ? '' : 'lg:justify-start'}`.trim()}>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <ChevronLeft aria-hidden="true" size={15} className="text-brand-orange" />}
            {item.href && index !== items.length - 1 ? (
              <a className="transition-colors hover:text-link" href={item.href}>
                {item.label}
              </a>
            ) : (
              <span aria-current={index === items.length - 1 ? 'page' : undefined} className={index === items.length - 1 ? 'font-medium text-foreground' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
