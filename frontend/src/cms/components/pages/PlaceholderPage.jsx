import { ArrowUpLeft } from 'lucide-react'

import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'

function PlaceholderPage({ content, pageKey }) {
  const page = content.groups.flatMap((group) => group.items).find((item) => item.key === pageKey)
  const label = page?.label || content.overview
  return <PageContainer><PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.overview }, { label }]} action={<a href="/" target="_blank" rel="noreferrer" className="mb-2 inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-[.7rem] border border-admin-border bg-(--primary-action-bg) px-3 py-2 text-[.6875rem] font-semibold text-(--primary-action-text) shadow-[0_8px_20px_rgba(15,23,42,.07)] transition hover:-translate-y-0.5 hover:border-admin-brand hover:text-admin-brand hover:shadow-[0_12px_26px_rgba(15,23,42,.11)] sm:w-auto">{content.topbar.website}<ArrowUpLeft size={15} /></a>} /></PageContainer>
}

export default PlaceholderPage
