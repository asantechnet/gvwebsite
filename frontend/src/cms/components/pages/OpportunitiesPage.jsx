import { useState } from 'react'
import { ArrowUpLeft, Pencil } from 'lucide-react'

import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'

const opportunityKeys = ['study', 'migration', 'work', 'exams', 'country']

function OpportunitiesPage({ content, opportunities, exams }) {
  const label = content.groups?.flatMap((group) => group.items || []).find((item) => item.key === 'opportunities')?.label || 'فرصت‌ها'
  const [pageTitle, setPageTitle] = useState(label)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const cards = opportunityKeys.flatMap((key) => opportunities?.[key]?.post ? [{ ...opportunities[key].post, href: `/opportunities/${key}` }] : [])
  const ielts = exams?.find((exam) => exam.slug === 'ielts')
  if (ielts) cards.push({ title: ielts.name, description: ielts.summary, category: ielts.category || 'امتحانات', image: ielts.image || '/assets/images/destinations/france.jpg', href: '/opportunities/exams/ielts' })
  const categories = ['all', ...new Set(cards.map((card) => card.category).filter(Boolean))]
  const visibleCards = selectedCategory === 'all' ? cards : cards.filter((card) => card.category === selectedCategory)
  const labels = content.opportunities || {}
  return <PageContainer><PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.overview }, { label }]} action={<a href="/" target="_blank" rel="noreferrer" className="mb-2 inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-[.7rem] border border-admin-border bg-(--primary-action-bg) px-3 py-2 text-[.6875rem] font-semibold text-(--primary-action-text) shadow-[0_8px_20px_rgba(15,23,42,.07)] transition hover:-translate-y-0.5 hover:border-admin-brand hover:text-admin-brand hover:shadow-[0_12px_26px_rgba(15,23,42,.11)] sm:w-auto">{content.topbar.website}<ArrowUpLeft size={15} /></a>} />
    <section className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)]" aria-label={labels.settings || label}>
      <div className="border-b border-admin-border bg-[linear-gradient(135deg,var(--admin-card),var(--admin-control))] px-5 py-6 sm:px-7"><span className="text-xs font-semibold text-admin-brand">{label}</span><h1 className="mt-2 mb-0 font-heading text-2xl text-admin-heading sm:text-3xl">{pageTitle || label}</h1></div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7"><label className="block text-sm font-semibold text-admin-heading"><span className="mb-2 block">{labels.pageTitle || 'عنوان صفحه'}</span><input value={pageTitle} onChange={(event) => setPageTitle(event.target.value)} className="admin-input w-full" /></label><label className="block text-sm font-semibold text-admin-heading"><span className="mb-2 block">{labels.postCategory || 'دسته‌بندی نوشته‌ها'}</span><select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="admin-input w-full"><option value="all">{labels.allCategories || 'همه دسته‌بندی‌ها'}</option>{categories.slice(1).map((category) => <option key={category} value={category}>{category}</option>)}</select></label></div>
    </section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={label}>{visibleCards.map((card, index) => <article key={card.href} className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-[0_1px_2px_rgb(15_23_42_/.04),0_12px_34px_rgb(15_23_42_/.055)]"><div className="relative h-40 overflow-hidden"><img src={card.image} alt="" className="size-full object-cover" /><span className="absolute top-3 right-3 grid size-9 place-items-center rounded-xl bg-black/35 text-xs font-bold text-white backdrop-blur-sm">{String(index + 1).padStart(2, '0')}</span></div><div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="m-0 truncate font-heading text-sm text-admin-heading">{card.title}</h2><p className="mt-2 line-clamp-3 text-xs leading-6 text-admin-muted">{card.description}</p></div><button type="button" className="grid size-8 shrink-0 place-items-center rounded-lg border border-admin-border bg-admin-control text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand" aria-label={content.editItem || 'ویرایش'}><Pencil size={14} /></button></div><span className="mt-3 block truncate text-[.6875rem] text-admin-brand">{card.href}</span></div></article>)}</section>
  </PageContainer>
}

export default OpportunitiesPage
