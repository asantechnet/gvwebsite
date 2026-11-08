import { ArrowUpLeft, BookOpenText, Clock3, Globe2, GraduationCap, MessageSquare } from 'lucide-react'

import OverviewCharts, { MetricMiniChart } from '@cms/components/OverviewCharts.jsx'
import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import { EditorPreviewLink } from '@cms/components/EditorPrimitives.jsx'
import { CMS_QUICK_ROUTE_KEYS, getCmsHref } from '@cms/routes.js'

const metricIcons = { posts: BookOpenText, scholarships: GraduationCap, countries: Globe2, messages: MessageSquare }

function DashboardOverviewSection({ content, counts }) {
  const metrics = content.metrics.map((metric) => ({ ...metric, value: counts[metric.key], chartValue: metric.key === 'messages' ? 0 : 1 }))
  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.overview }]} action={<EditorPreviewLink>{content.topbar.website}</EditorPreviewLink>} />
    <section className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4" aria-label={content.overview}>{metrics.map(({ label, value, key, chartValue }) => { const Icon = metricIcons[key]; return <article className="group relative flex min-h-[9rem] flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-card p-3 shadow-[0_1px_2px_rgba(15,23,42,.04),0_12px_34px_rgba(15,23,42,.055)] transition hover:-translate-y-0.5 hover:border-admin-brand/40 hover:shadow-[0_2px_4px_rgba(15,23,42,.05),0_18px_42px_rgba(15,23,42,.09)] sm:min-h-[8rem] sm:rounded-[1.1rem] sm:p-2 xl:min-h-[11.5rem] xl:p-5" key={key}><div className="flex items-center gap-1 sm:gap-1.5 xl:gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-admin-brand-soft text-admin-brand-text sm:size-7 sm:rounded-lg xl:size-10 xl:rounded-xl"><Icon size={16} className="sm:size-[14px] xl:size-[19px]" /></span><p className="m-0 text-[.6875rem] font-medium leading-snug text-admin-muted sm:text-[.625rem] xl:text-xs">{label}</p></div><div className="flex flex-1 flex-col items-center justify-center gap-1 py-1 sm:gap-1 sm:py-0.5 xl:gap-2 xl:py-2"><MetricMiniChart label={label} displayValue={value} className="sm:size-[5.25rem] xl:size-[5.75rem]" valueClassName="sm:text-[1.7rem] xl:text-[1.45rem]" /><small className="block text-center text-[.625rem] leading-[1.35] text-slate-400 sm:text-[.5625rem] xl:text-[.6875rem] xl:leading-[1.45]">{content.metricLastMonth.replace('{count}', chartValue)}</small></div></article> })}</section>
    <OverviewCharts counts={counts} content={content.analytics} />
    <div className="grid gap-4 min-[701px]:grid-cols-2">
      <section className="rounded-[1.1rem] border border-admin-border bg-admin-card p-[1.4rem] shadow-[0_1px_2px_rgba(15,23,42,.04),0_12px_34px_rgba(15,23,42,.055)]"><h2 className="m-0 font-heading text-base text-admin-heading">{content.quick.title}</h2><div className="mt-4 grid gap-2">{content.quick.items.map((item, index) => <a className="flex min-h-14 items-center gap-3 rounded-[.8rem] border border-admin-border bg-admin-control p-3.5 text-[.8125rem] font-medium text-admin-muted transition hover:-translate-y-px hover:border-admin-brand/45 hover:bg-admin-control-soft hover:text-admin-heading" key={item} href={getCmsHref(CMS_QUICK_ROUTE_KEYS[index])}><span className="grid size-8 place-items-center rounded-lg bg-admin-brand-soft text-[.6875rem] font-semibold text-admin-brand-text">0{index + 1}</span><span>{item}</span><ArrowUpLeft className="mr-auto text-admin-muted" size={17} /></a>)}</div></section>
      <section className="rounded-[1.1rem] border border-admin-border bg-admin-card p-[1.4rem] shadow-[0_1px_2px_rgba(15,23,42,.04),0_12px_34px_rgba(15,23,42,.055)]"><h2 className="m-0 font-heading text-base text-admin-heading">{content.activity.title}</h2><div className="flex min-h-60 flex-col items-center justify-center text-center"><span className="grid size-13 place-items-center rounded-2xl bg-admin-brand-soft text-admin-brand-text"><Clock3 size={22} /></span><h3 className="mt-4 mb-1.5 font-heading text-sm text-admin-heading">{content.activity.emptyTitle}</h3></div></section>
    </div>
  </PageContainer>
}

export default DashboardOverviewSection
