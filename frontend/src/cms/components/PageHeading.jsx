import Breadcrumbs from './Breadcrumbs.jsx'

function PageHeading({ breadcrumbs, title, description, action }) {
  return <header className="flex flex-col items-start justify-between gap-4 border-b border-admin-border pt-1 pb-4 sm:min-h-[6.8rem] sm:flex-row sm:items-center sm:gap-8 sm:pt-3 sm:pb-5"><div><Breadcrumbs items={breadcrumbs} /><h1 className="mt-2 mb-1.5 font-heading text-[clamp(1.75rem,3vw,2.45rem)] leading-[1.1] tracking-[-.035em] text-admin-heading">{title}</h1><p className="m-0 max-w-2xl text-[.8125rem] leading-[1.65] text-admin-muted sm:text-[.875rem]">{description}</p></div>{action}</header>
}

export default PageHeading
