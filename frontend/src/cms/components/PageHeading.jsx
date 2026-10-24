import Breadcrumbs from './Breadcrumbs.jsx'

function PageHeading({ breadcrumbs, title, description, action, className = '' }) {
  return <header className={`flex min-w-0 flex-col items-start justify-between gap-3 border-b border-admin-border pt-1 pb-3 sm:min-h-[6rem] sm:flex-row sm:items-center sm:gap-6 sm:pt-3 sm:pb-4 ${className}`}><div className="min-w-0"><Breadcrumbs items={breadcrumbs} />{title && <h1 className="mt-1.5 mb-1 font-heading text-[clamp(1.5rem,3vw,2.45rem)] leading-[1.1] tracking-[-.035em] text-admin-heading">{title}</h1>}{description && <p className="m-0 max-w-2xl text-[.75rem] leading-[1.6] text-admin-muted sm:text-[.8125rem]">{description}</p>}</div>{action}</header>
}

export default PageHeading
