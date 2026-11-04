import { ArrowUpLeft, BookOpenText, Clock3, Globe2, GraduationCap, MessageSquare } from 'lucide-react'

import OverviewCharts, { MetricMiniChart } from '@cms/components/OverviewCharts.jsx'
import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import { EditorPreviewLink } from '@cms/components/EditorPrimitives.jsx'

const metricIcons = { posts: BookOpenText, scholarships: GraduationCap, countries: Globe2, messages: MessageSquare }

function DashboardOverviewSection({ content, counts }) {
  const metrics = content.metrics.map((metric) => ({ ...metric, value: counts[metric.key], chartValue: metric.key === 'messages' ? 0 : 1 }))
  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.overview }]} action={<EditorPreviewLink>{content.topbar.website}</EditorPreviewLink>} />
    <section className="grid gap-4 min-[701px]:grid-cols-2 xl:grid-cols-4" aria-label={content.overview}>{metrics.map(({ label, value, key, chartValue }) => { const Icon = metricIcons[key]; return <article className="group relative flex min-h-[11.5rem] flex-col overflow-hidden rounded-[1.1rem] border border-admin-border bg-admin-card p-5 shadow-[0_1px_2px_rgba(15,23,42,.04),0_12px_34px_rgba(15,23,42,.055)] transition hover:-translate-y-0.5 hover:border-admin-brand/40 hover:shadow-[0_2px_4px_rgba(15,23,42,.05),0_18px_42px_rgba(15,23,42,.09)]" key={key}><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text"><Icon size={19} /></span><p className="m-0 text-xs font-medium leading-snug text-admin-muted">{label}</p></div><div className="flex flex-1 flex-col items-center justify-center gap-2 py-2"><MetricMiniChart label={label} displayValue={value} /><small className="block text-center text-[.6875rem] leading-[1.45] text-slate-400">{content.metricLastMonth.replace('{count}', chartValue)}</small></div></article> })}</section>
    <OverviewCharts counts={counts} content={content.analytics} />
    <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-[1.1rem] border border-admin-border bg-admin-card p-[1.4rem] shadow-[0_1px_2px_rgba(15,23,42,.04),0_12px_34px_rgba(15,23,42,.055)]"><div><h2 className="m-0 font-heading text-base text-admin-heading">{content.quick.title}</h2><p className="mt-1.5 text-xs text-admin-muted">{content.quick.description}</p></div><div className="mt-4 grid gap-2">{content.quick.items.map((item, index) => <a className="flex min-h-14 items-center gap-3 rounded-[.8rem] border border-admin-border bg-admin-control p-3.5 text-[.8125rem] font-medium text-admin-muted transition hover:-translate-y-px hover:border-admin-brand/45 hover:bg-admin-control-soft hover:text-admin-heading" key={item} href={['/dashboard/magazine', '/dashboard/services', '/dashboard/guides'][index]}><span className="grid size-8 place-items-center rounded-lg bg-admin-brand-soft text-[.6875rem] font-semibold text-admin-brand-text">0{index + 1}</span><span>{item}</span><ArrowUpLeft className="mr-auto text-admin-muted" size={17} /></a>)}</div></section>
      <section className="rounded-[1.1rem] border border-admin-border bg-admin-card p-[1.4rem] shadow-[0_1px_2px_rgba(15,23,42,.04),0_12px_34px_rgba(15,23,42,.055)]"><div><h2 className="m-0 font-heading text-base text-admin-heading">{content.activity.title}</h2><p className="mt-1.5 text-xs text-admin-muted">{content.activity.description}</p></div><div className="flex min-h-60 flex-col items-center justify-center text-center"><span className="grid size-13 place-items-center rounded-2xl bg-admin-brand-soft text-admin-brand-text"><Clock3 size={22} /></span><h3 className="mt-4 mb-1.5 font-heading text-sm text-admin-heading">{content.activity.emptyTitle}</h3><p className="m-0 max-w-md text-[.75rem] leading-relaxed text-admin-muted">{content.activity.emptyDescription}</p></div></section>
    </div>
  </PageContainer>
}

export default DashboardOverviewSection
