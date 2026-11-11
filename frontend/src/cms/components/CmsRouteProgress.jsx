import SkeletonBlock from '@/shared/components/SkeletonBlock.jsx'
import { getCmsRouteKey } from '@cms/routes.js'
import { useCmsInterfaceLanguage } from '@cms/hooks/useCmsLanguage.js'

const list = (length) => Array.from({ length }, (_, index) => index)
const Block = ({ className = '', ...props }) => <SkeletonBlock className={`bg-admin-heading/10 ${className}`} {...props} />

function PageHeadingSkeleton({ action = true }) {
  const language = useCmsInterfaceLanguage()
  return <header dir={language === 'en' ? 'ltr' : 'rtl'} className="mb-2 flex min-w-0 flex-col items-start justify-between gap-3 border-b border-(--admin-tab-bar-border) lg:mb-5 sm:flex-row sm:items-center sm:gap-6"><div className="min-w-0 self-start pb-2 sm:mt-5"><Block className="h-3 w-28 max-w-full" /></div>{action && <Block className="mb-2 h-9 w-full rounded-xl bg-admin-brand/15 sm:w-28" />}</header>
}

function EditorTabsSkeleton({ tabs, activeTab, widths = {}, className = '' }) {
  return <nav className={`sticky top-15 z-20 min-w-0 max-w-full overflow-hidden rounded-t-[1.1rem] border border-(--admin-tab-bar-border) border-b-2 bg-admin-page shadow-[inset_0_1px_0_rgb(255_255_255_/.45),0_8px_20px_rgb(15_23_42_/.08)] min-[701px]:top-16 ${className}`}><div className="cms-tab-scroller"><div className="cms-tabs-scroll relative flex w-full max-w-full min-w-0 flex-nowrap gap-1 overflow-x-auto overscroll-x-contain p-1.5 sm:gap-1.5 sm:px-2">{tabs.map((tab) => <Block key={tab} className={`h-10 shrink-0 rounded-lg ${widths[tab] || 'w-28'} ${tab === activeTab ? 'bg-admin-brand/15' : ''}`} />)}</div></div></nav>
}

function EditorHeaderSkeleton({ addAction = false }) {
  return <header className="flex flex-wrap items-center gap-4 border-b border-admin-border bg-[linear-gradient(110deg,var(--editor-field),var(--admin-card))] px-5 py-4 sm:px-6"><Block className="size-11 shrink-0 rounded-xl bg-admin-brand/15" /><div className="min-w-0 flex-1"><Block className="h-5 w-36 max-w-full" /></div><div className="w-full sm:ms-auto sm:w-auto"><div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">{addAction && <Block className="order-3 col-span-2 h-[35px] w-full rounded-xl bg-admin-brand/15 sm:order-none sm:col-span-1 sm:w-32" />}<Block className="h-9 w-full rounded-xl sm:w-28" /><Block className="h-9 w-full rounded-xl sm:w-28" /></div></div></header>
}

function OverviewSkeleton() {
  const card = 'overflow-hidden rounded-[1.1rem] border border-admin-border bg-admin-card p-[1.4rem]'
  return <div className="mx-auto grid w-full min-w-0 max-w-[82rem] gap-5 sm:gap-[1.65rem]">
    <PageHeadingSkeleton />
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{list(4).map((item) => <article key={item} className="flex min-h-[9rem] flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-card p-3 sm:min-h-[8rem] sm:rounded-[1.1rem] sm:p-2 xl:min-h-[11.5rem] xl:p-5"><div className="flex items-center gap-1 sm:gap-1.5 xl:gap-3"><Block className="size-8 shrink-0 rounded-lg bg-admin-brand/15 sm:size-7 xl:size-10 xl:rounded-xl" /><Block className={`h-3 ${item % 2 ? 'w-20' : 'w-28'} sm:w-16 xl:w-28`} /></div><div className="flex flex-1 flex-col items-center justify-center gap-1 py-1 sm:gap-1 sm:py-0.5 xl:gap-2 xl:py-2"><div className="grid size-[5rem] place-items-center rounded-full border-[.55rem] border-admin-heading/10 sm:size-[5.25rem] xl:size-[5.75rem] xl:border-[.7rem]"><Block className="h-5 w-7 bg-admin-heading/15 sm:h-6 sm:w-8" /></div><Block className="h-3 w-24" /></div></article>)}</section>
    <section className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
      <article className={card}><div className="flex items-start justify-between gap-4"><div className="space-y-2"><Block className="h-2.5 w-24 bg-admin-brand/15" /><Block className="h-5 w-36" /><Block className="h-3 w-64 max-w-full" /></div><Block className="h-8 w-20 rounded-full" /></div><div className="mt-4 flex h-[15rem] items-end gap-[12%] border-b border-admin-border px-[12%] pt-8">{[72, 48, 86].map((height, item) => <Block key={item} className="flex-1 rounded-t-lg rounded-b-none bg-admin-brand/15" style={{ height: `${height}%` }} />)}</div></article>
      <article className={card}><div className="flex items-start justify-between gap-4"><div className="space-y-2"><Block className="h-2.5 w-20 bg-admin-brand/15" /><Block className="h-5 w-28" /><Block className="h-3 w-44 max-w-full" /></div><Block className="h-8 w-16 rounded-full" /></div><div className="mx-auto mt-3 grid h-[10rem] place-items-center"><div className="grid justify-items-center gap-3"><Block className="size-12 rounded-2xl bg-admin-brand/15" /><Block className="h-3 w-32" /></div></div><div className="grid grid-cols-2 gap-2">{list(2).map((item) => <div key={item} className="rounded-xl border border-admin-border bg-admin-control-soft px-3 py-2.5"><Block className="h-3 w-16" /><Block className="mt-2 h-4 w-6" /></div>)}</div></article>
    </section>
    <div className="grid gap-4 min-[701px]:grid-cols-2">
      <section className={card}><Block className="h-5 w-28" /><div className="mt-4 grid gap-2">{list(3).map((item) => <div key={item} className="flex min-h-14 items-center gap-3 rounded-[.8rem] border border-admin-border bg-admin-control p-3.5"><Block className="size-8 rounded-lg bg-admin-brand/15" /><Block className="h-3 w-40 max-w-[55%]" /><Block className="ms-auto size-4 rounded-md" /></div>)}</div></section>
      <section className={card}><Block className="h-5 w-32" /><div className="flex min-h-60 flex-col items-center justify-center text-center"><Block className="size-13 rounded-2xl bg-admin-brand/15" /><Block className="mt-4 h-4 w-32" /></div></section>
    </div>
  </div>
}

function EditorPanel({ fields = 4, media = false }) {
  return <section className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card"><header className="flex items-center gap-3 border-b border-admin-border p-4"><Block className="size-10 rounded-xl bg-admin-brand/15" /><div className="flex-1 space-y-2"><Block className="h-5 w-36" /><Block className="h-3 w-52 max-w-full" /></div><Block className="size-8" /></header><div className="grid gap-4 p-4 sm:grid-cols-2">{list(fields).map((item) => <div key={item} className={item === fields - 1 ? 'sm:col-span-2' : ''}><Block className="mb-2 h-3 w-20" /><Block className={`${item === fields - 1 ? 'h-28' : 'h-11'} w-full rounded-xl`} /></div>)}{media && <Block className="h-44 rounded-2xl sm:col-span-2" />}</div></section>
}

function EditorSkeleton({ panels = 4, media = false }) {
  return <><PageHeadingSkeleton /><section className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card"><div className="flex gap-2 overflow-hidden border-b-2 border-(--admin-tab-bar-border) bg-admin-page p-1.5 sm:px-2">{list(Math.min(panels + 1, 6)).map((item) => <Block key={item} className={`h-10 shrink-0 rounded-lg ${item === 0 ? 'w-28 bg-admin-brand/15' : 'w-24'}`} />)}</div><header className="flex flex-wrap items-center gap-4 border-b border-admin-border bg-(--editor-field) px-5 py-4 sm:px-6"><Block className="size-11 rounded-xl bg-admin-brand/15" /><Block className="h-5 w-36 flex-1 max-w-48" /><div className="ms-auto flex gap-2"><Block className="h-9 w-24 rounded-xl" /><Block className="h-9 w-40 rounded-xl" /></div></header><div className="grid gap-5 p-5 sm:p-6">{list(Math.min(panels, 3)).map((item) => <EditorPanel key={item} fields={item % 2 ? 3 : 4} media={media && item === 0} />)}</div></section></>
}

function AboutSkeleton() {
  const tabs = ['hero', 'introduction', 'missionVision', 'story', 'faq', 'team', 'cta']
  const activeSection = tabs.includes(window.localStorage.getItem('globalvision-cms-about-tab')) ? window.localStorage.getItem('globalvision-cms-about-tab') : 'hero'
  const collections = ['introduction', 'story', 'faq', 'team']
  const hasCollection = collections.includes(activeSection)
  return <><PageHeadingSkeleton /><section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]"><EditorTabsSkeleton tabs={tabs} activeTab={activeSection} /><EditorHeaderSkeleton /><div className="grid gap-6 p-5 sm:p-6"><AboutFieldsSkeleton section={activeSection} />{hasCollection && <div className="border-t border-admin-border pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><Block className="h-4 w-28" />{['faq', 'team'].includes(activeSection) && <Block className="h-9 w-28 rounded-xl bg-admin-brand/15" />}</div><div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{list(activeSection === 'introduction' ? 3 : activeSection === 'story' ? 4 : activeSection === 'team' ? 3 : 5).map((item) => <div key={item} className="flex min-h-16 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><Block className="size-9 shrink-0 rounded-lg bg-admin-brand/15" /><Block className="h-3 min-w-0 flex-1" /><Block className="size-8 shrink-0 rounded-lg" /><Block className="size-8 shrink-0 rounded-lg" /></div>)}</div></div>}</div></section></>
}

function AboutFieldsSkeleton({ section }) {
  if (section === 'missionVision') return <div className="grid gap-3 lg:grid-cols-2">{list(2).map((item) => <div key={item} className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4"><Block className="mb-3 h-4 w-24" /><Block className="h-11 w-full rounded-xl" /><Block className="mt-3 h-3 w-20" /><Block className="mt-2 h-24 w-full rounded-xl" /></div>)}</div>
  if (section === 'cta') return <div className="grid gap-4">{list(2).map((item) => <div key={item} className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4"><Block className="mb-3 h-4 w-24" /><div className="grid gap-3 sm:grid-cols-2">{list(item ? 4 : 2).map((field) => <div key={field}><Block className="mb-2 h-3 w-20" /><Block className="h-11 w-full rounded-xl" /></div>)}</div></div>)}</div>
  if (section === 'introduction') return <div className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4"><Block className="mb-3 h-4 w-24" /><Block className="h-11 w-full rounded-xl" /><Block className="mt-3 h-3 w-24" /><Block className="mt-2 h-24 w-full rounded-xl" /></div>
  return <div className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4"><Block className="mb-3 h-4 w-24" /><Block className="h-11 w-full rounded-xl" /></div>
}

function ContactSkeleton() {
  const tabs = ['hero', 'details', 'form', 'connections', 'social']
  const activeTab = tabs.includes(window.localStorage.getItem('globalvision-cms-contact-tab')) ? window.localStorage.getItem('globalvision-cms-contact-tab') : 'hero'
  return <><PageHeadingSkeleton /><section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]"><EditorTabsSkeleton tabs={tabs} activeTab={activeTab} /><EditorHeaderSkeleton /><div className="grid gap-6 p-5 sm:p-6"><ContactFieldsSkeleton tab={activeTab} /></div></section></>
}

function ContactFieldsSkeleton({ tab }) {
  if (tab === 'hero') return <div className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4"><Block className="mb-2 h-3 w-28" /><Block className="h-11 w-full rounded-xl" /></div>
  if (tab === 'details') return <div className="grid gap-5"><Block className="h-11 w-full rounded-xl" /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{list(4).map((item) => <div key={item} className="rounded-2xl border border-admin-border bg-(--editor-field) p-4"><Block className="mb-4 size-10 rounded-xl bg-admin-brand/15" /><Block className="h-3 w-20" /><Block className="mt-2 h-11 w-full rounded-xl" /></div>)}</div></div>
  if (tab === 'form') return <div className="grid gap-5"><div className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4 sm:p-5"><Block className="mb-4 h-4 w-28" /><div className="grid gap-3 sm:grid-cols-2">{list(8).map((item) => <div key={item}><Block className="mb-2 h-3 w-20" /><Block className="h-11 w-full rounded-xl" /></div>)}</div></div><div className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4 sm:p-5"><Block className="mb-4 h-4 w-28" /><Block className="h-24 w-full rounded-xl" /><Block className="mt-3 h-24 w-full rounded-xl" /></div></div>
  if (tab === 'connections') return <div className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4 sm:p-5"><Block className="mb-4 h-4 w-28" /><Block className="h-11 w-full rounded-xl" /><Block className="mt-3 h-11 w-full rounded-xl" /></div>
  return <div className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4 sm:p-5"><div className="flex justify-end"><Block className="h-10 w-28 rounded-xl bg-admin-brand/15" /></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{list(4).map((item) => <div key={item} className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><div className="grid gap-2"><Block className="h-11 w-full rounded-xl" /><Block className="h-11 w-full rounded-xl" /></div><Block className="size-8 rounded-lg" /></div>)}</div></div>
}

const homeSections = ['hero', 'opportunities', 'destinations', 'process', 'services', 'testimonials', 'consultation']
const homeSkeletonGroups = {
  hero: [3, 1, 4],
  opportunities: [2, 2],
  destinations: [2, 2],
  process: [2],
  services: [2, 3],
  testimonials: [2],
  consultation: [1, 1, 4],
}
const homeTabWidths = { hero: 'w-42', opportunities: 'w-36', destinations: 'w-44', process: 'w-36', services: 'w-32', testimonials: 'w-40', consultation: 'w-40' }

function HomeFieldGroupSkeleton({ fields, multiline = false }) {
  return <fieldset className="grid gap-4 rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4 sm:grid-cols-2">{list(fields).map((item) => <div key={item} className={fields === 1 || (multiline && item === 0) ? 'sm:col-span-2' : ''}><Block className="mb-2 h-3 w-20" /><Block className={`${multiline && item === 0 ? 'h-24' : 'h-11'} w-full rounded-xl`} /></div>)}</fieldset>
}

function HomeSkeleton() {
  const storedSection = window.localStorage.getItem('globalvision-cms-home-tab')
  const activeSection = homeSections.includes(storedSection) ? storedSection : 'hero'
  const hasCollection = ['opportunities', 'destinations', 'process', 'services', 'testimonials'].includes(activeSection)
  const hasMedia = activeSection === 'hero'
  return <div className="mx-auto grid w-full min-w-0 max-w-[82rem] grid-cols-[minmax(0,1fr)] gap-5 sm:gap-[1.65rem]">
    <PageHeadingSkeleton />
    <section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <EditorTabsSkeleton tabs={homeSections} activeTab={activeSection} widths={homeTabWidths} />
      <EditorHeaderSkeleton />
      <div className="grid gap-6 p-5 sm:p-6">
        <div className="grid gap-3">{homeSkeletonGroups[activeSection].map((fields, index) => <HomeFieldGroupSkeleton key={index} fields={fields} multiline={['hero', 'services', 'consultation'].includes(activeSection) && index === 1} />)}{hasMedia && <div className="mt-3"><Block className="h-4 w-32" /><Block className="mt-3 aspect-[16/7] w-full rounded-xl" /></div>}</div>
        {hasCollection && <div className="border-t border-admin-border pt-5"><div className="flex items-center justify-between gap-3"><Block className="h-4 w-28" />{['opportunities', 'destinations'].includes(activeSection) && <Block className="h-9 w-28 rounded-lg bg-admin-brand/15" />}</div><div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{list(3).map((item) => <article key={item} className="flex min-h-16 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><Block className={`shrink-0 bg-admin-brand/15 ${activeSection === 'testimonials' ? 'size-10 rounded-full' : 'size-9 rounded-lg'}`} /><Block className="h-3 flex-1" /><Block className="size-8 rounded-lg" />{!['process', 'services', 'testimonials'].includes(activeSection) && <Block className="size-8 rounded-lg" />}</article>)}</div></div>}
      </div>
    </section>
  </div>
}

function OpportunitiesSkeleton() {
  return <><PageHeadingSkeleton /><section className="overflow-visible bg-transparent"><div className="relative z-30 mb-3 grid gap-1 rounded-2xl border border-admin-border bg-admin-control-soft p-1 shadow-[0_12px_34px_rgb(15_23_42_/.055)] md:grid-cols-[minmax(12rem,1fr)_minmax(12rem,.7fr)_minmax(14rem,.8fr)]"><Block className="h-9 w-full rounded-xl bg-admin-brand/15 md:w-36" /><Block className="h-9 w-full rounded-xl" /><Block className="h-9 w-full rounded-xl" /></div><nav className="relative z-20 min-w-0 max-w-full overflow-hidden rounded-t-[1.1rem] border border-(--admin-tab-bar-border) border-b-2 bg-admin-page shadow-[inset_0_1px_0_rgb(255_255_255_/.45),0_8px_20px_rgb(15_23_42_/.08)]"><div className="flex w-full max-w-full min-w-0 flex-nowrap gap-1 overflow-hidden p-1.5 sm:gap-1.5 sm:px-2">{list(4).map((item) => <Block key={item} className={`h-10 shrink-0 rounded-lg ${item === 0 ? 'w-28 bg-admin-brand/15' : 'w-24'}`} />)}</div></nav><section className="hidden overflow-hidden rounded-b-2xl border border-t-0 border-admin-border bg-admin-card lg:block"><div className="grid grid-cols-[minmax(0,1.5fr)_8rem_9rem] gap-4 border-b border-admin-border bg-admin-control-soft px-4 py-2"><Block className="h-3 w-24" /><Block className="h-3 w-20" /><Block className="h-3 w-16" /></div>{list(6).map((item) => <div key={item} className="grid min-h-[5.25rem] grid-cols-[minmax(0,1.5fr)_8rem_9rem] items-center gap-4 border-b border-admin-border p-4 last:border-0"><div className="flex items-center gap-3"><Block className="size-14 shrink-0 rounded-xl" /><Block className="h-4 w-2/3" /></div><Block className="h-7 w-20 rounded-full" /><div className="flex justify-end gap-1"><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /></div></div>)}</section></section><section className="mt-3 grid gap-3 md:grid-cols-2 lg:hidden">{list(6).map((item) => <article key={item} className="relative grid min-h-32 grid-cols-[5rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-admin-border bg-admin-card p-3"><Block className="size-20 justify-self-center rounded-xl" /><div className="min-w-0 space-y-3"><Block className="h-4 w-3/4" /><Block className="h-7 w-24 rounded-full" /><div className="absolute bottom-3 left-3 flex flex-col gap-1"><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /></div></div></article>)}</section></>
}

function TourismSkeleton() {
  return <><PageHeadingSkeleton /><section className="overflow-visible bg-transparent">
    <div className="relative z-30 grid gap-1 border-b border-admin-border bg-admin-control-soft p-1 md:grid-cols-[minmax(12rem,1fr)_minmax(12rem,.7fr)_minmax(14rem,.8fr)]"><Block className="h-9 w-full rounded-xl bg-admin-brand/15 md:w-36" /><Block className="h-9 w-full rounded-xl" /><Block className="h-9 w-full rounded-xl" /></div>
    <EditorTabsSkeleton tabs={['afghanistan', 'world']} activeTab="afghanistan" className="max-lg:rounded-[1.1rem]" />
    <section className="hidden overflow-hidden rounded-b-2xl border border-t-0 border-admin-border bg-admin-card lg:block"><div className="grid grid-cols-[minmax(0,1.5fr)_minmax(8rem,.7fr)_8rem_9rem] gap-4 border-b border-admin-border bg-admin-control-soft px-4 py-2"><Block className="h-3 w-24" /><Block className="h-3 w-20" /><Block className="h-3 w-16" /><Block className="h-3 w-16" /></div>{list(6).map((item) => <div key={item} className="grid min-h-[5.25rem] grid-cols-[minmax(0,1.5fr)_minmax(8rem,.7fr)_8rem_9rem] items-center gap-4 border-b border-admin-border p-4 last:border-0"><div className="flex items-center gap-3"><Block className="size-14 shrink-0 rounded-xl" /><Block className="h-4 w-2/3" /></div><Block className="h-3 w-20" /><Block className="h-7 w-20 rounded-full" /><div className="flex justify-end gap-1"><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /></div></div>)}</section>
  </section><section className="mt-3 grid w-full min-w-0 gap-3 md:grid-cols-2 lg:hidden">{list(6).map((item) => <article key={item} className="relative grid min-h-32 min-w-0 grid-cols-[5rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-admin-border bg-admin-card p-3"><Block className="size-20 justify-self-center rounded-xl" /><div className="min-w-0 space-y-3"><Block className="h-4 w-3/4" /><Block className="h-7 w-24 rounded-full" /><div className="absolute bottom-3 left-3 flex flex-col gap-1"><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /></div></div></article>)}</section></>
}

function ServicesSkeleton() {
  return <><PageHeadingSkeleton /><section className="overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)]"><div className="relative z-30 grid gap-1 rounded-2xl border-b border-admin-border bg-admin-control-soft p-1 md:grid-cols-[minmax(12rem,1fr)_minmax(12rem,.7fr)_minmax(14rem,.8fr)] lg:rounded-b-none"><Block className="h-9 w-full rounded-xl bg-admin-brand/15 md:w-36" /><Block className="h-9 w-full rounded-xl" /><Block className="h-9 w-full rounded-xl" /></div><section className="hidden overflow-hidden rounded-b-2xl bg-admin-card lg:block"><div className="grid grid-cols-[minmax(0,1.5fr)_8rem_9rem] gap-4 border-b border-admin-border bg-admin-control-soft p-4"><Block className="h-3 w-24" /><Block className="h-3 w-16" /><Block className="h-3 w-16" /></div>{list(6).map((item) => <div key={item} className="grid min-h-[5.25rem] grid-cols-[minmax(0,1.5fr)_8rem_9rem] items-center gap-4 border-b border-admin-border p-4 last:border-0"><div className="flex items-center gap-3"><Block className="size-14 shrink-0 rounded-xl" /><Block className="h-4 w-2/3" /></div><Block className="h-7 w-20 rounded-full" /><div className="flex justify-end gap-1"><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /></div></div>)}</section></section><section className="mt-3 grid gap-3 md:grid-cols-2 lg:hidden">{list(6).map((item) => <article key={item} className="relative grid min-h-32 grid-cols-[5rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-admin-border bg-admin-card p-3"><Block className="size-20 justify-self-center rounded-xl" /><div className="min-w-0 space-y-3"><Block className="h-4 w-3/4" /><Block className="h-7 w-24 rounded-full" /><div className="absolute bottom-3 left-3 flex flex-col gap-1"><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /></div></div></article>)}</section></>
}

function ScholarshipsSkeleton() {
  const activeSection = ['hero', 'scholarships'].includes(window.localStorage.getItem('globalvision-cms-scholarships-tab')) ? window.localStorage.getItem('globalvision-cms-scholarships-tab') : 'hero'
  return <><PageHeadingSkeleton /><section className={`min-w-0 w-full overflow-visible rounded-2xl border ${activeSection === 'scholarships' ? 'border-transparent bg-transparent shadow-none lg:border-admin-border lg:bg-admin-card lg:shadow-[0_12px_38px_rgb(15_23_42_/.055)]' : 'border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]'}`}><nav className="sticky top-15 z-20 min-w-0 max-w-full overflow-hidden rounded-t-[1.1rem] border border-(--admin-tab-bar-border) border-b-2 bg-admin-page shadow-[inset_0_1px_0_rgb(255_255_255_/.45),0_8px_20px_rgb(15_23_42_/.08)] min-[701px]:top-16"><div className="flex w-full max-w-full min-w-0 flex-nowrap gap-1 overflow-hidden p-1.5 sm:gap-1.5 sm:px-2"><Block className={`h-10 w-28 shrink-0 rounded-lg ${activeSection === 'hero' ? 'bg-admin-brand/15' : ''}`} /><Block className={`h-10 w-28 shrink-0 rounded-lg ${activeSection === 'scholarships' ? 'bg-admin-brand/15' : ''}`} /></div></nav><header className="flex flex-wrap items-center gap-4 border-b border-admin-border bg-[linear-gradient(110deg,var(--editor-field),var(--admin-card))] px-5 py-4 sm:px-6"><Block className="size-11 shrink-0 rounded-xl bg-admin-brand/15" /><Block className="h-5 w-36 flex-1 max-w-48" /><div className="ms-auto grid w-full grid-cols-2 items-center gap-2 sm:flex sm:w-auto sm:flex-nowrap">{activeSection === 'scholarships' && <Block className="order-3 col-span-2 h-[35px] w-full rounded-xl bg-admin-brand/15 sm:order-none sm:col-span-1 sm:w-32" />}<Block className="h-9 w-full rounded-xl sm:w-28" /><Block className="h-9 w-full rounded-xl sm:w-28" /></div></header>{activeSection === 'hero' ? <div className="grid gap-6 p-5 sm:p-6"><div><Block className="mb-2 h-3 w-28" /><Block className="h-11 w-full rounded-xl" /></div></div> : <div className="grid gap-6 bg-transparent p-0 lg:p-6"><ScholarshipsRecordsSkeleton /></div>}</section></>
}

function ScholarshipFilterSkeleton({ className = '' }) {
  return <div className={className}><Block className="mb-1 h-2.5 w-16" /><Block className="h-9 w-full rounded-xl" /></div>
}

function ScholarshipsRecordsSkeleton() {
  return <div className="grid gap-4"><section className="hidden gap-2 rounded-2xl border border-admin-border bg-admin-card p-2 lg:grid lg:grid-cols-2 xl:grid-cols-5"><Block className="h-9 xl:col-span-4 xl:row-start-2" /><ScholarshipFilterSkeleton className="xl:col-start-5 xl:row-start-1" /><ScholarshipFilterSkeleton className="xl:col-start-1 xl:row-start-1" /><ScholarshipFilterSkeleton className="xl:col-start-2 xl:row-start-1" /><ScholarshipFilterSkeleton className="xl:col-start-3 xl:row-start-1" /><ScholarshipFilterSkeleton className="xl:col-start-4 xl:row-start-1" /><ScholarshipFilterSkeleton className="xl:col-start-5 xl:row-start-2" /></section><section className="grid gap-2 rounded-b-2xl border-x border-b border-admin-border bg-admin-card p-5 shadow-[0_12px_34px_rgb(15_23_42_/.055)] sm:p-9 lg:hidden"><div className="grid grid-cols-2 gap-2"><Block className="h-9" /><Block className="h-9" /></div><Block className="h-9" /></section><section className="hidden overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)] lg:block"><div className="grid grid-cols-[minmax(0,1.5fr)_minmax(7rem,.8fr)_minmax(7rem,.8fr)_7rem_9rem] gap-3 bg-(--editor-field) p-4">{list(5).map((item) => <Block key={item} className="h-3 w-20" />)}</div>{list(6).map((item) => <div key={item} className="grid min-h-[5.25rem] grid-cols-[minmax(0,1.5fr)_minmax(7rem,.8fr)_minmax(7rem,.8fr)_7rem_9rem] items-center gap-3 border-t border-admin-border p-4"><div className="flex items-center gap-3"><Block className="size-14 shrink-0 rounded-xl" /><Block className="h-4 w-2/3" /></div><Block className="h-3 w-20" /><Block className="h-3 w-20" /><Block className="h-7 w-20 rounded-full" /><div className="flex justify-end gap-1"><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /></div></div>)}</section><section className="grid w-full gap-3 bg-admin-page md:grid-cols-2 lg:hidden">{list(6).map((item) => <article key={item} className="grid min-h-32 grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-2xl border border-admin-border bg-admin-card p-3"><Block className="size-20 rounded-xl" /><div className="min-w-0 space-y-3"><Block className="h-4 w-3/4" /><Block className="h-3 w-2/3" /><Block className="h-7 w-24 rounded-full" /><div className="flex justify-end gap-1"><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /></div></div></article>)}</section></div>
}

function MagazineSkeleton() {
  const tabs = ['hero', 'news', 'articles', 'categories']
  const activeSection = tabs.includes(window.localStorage.getItem('globalvision-cms-magazine-tab')) ? window.localStorage.getItem('globalvision-cms-magazine-tab') : 'hero'
  return <><PageHeadingSkeleton /><section className="min-w-0 w-full overflow-visible bg-transparent lg:rounded-2xl lg:border lg:border-admin-border lg:bg-admin-card lg:shadow-[0_12px_38px_rgb(15_23_42_/.055)]"><nav className="sticky top-15 z-20 min-w-0 max-w-full overflow-hidden rounded-t-[1.1rem] border border-(--admin-tab-bar-border) border-b-2 bg-admin-page shadow-[inset_0_1px_0_rgb(255_255_255_/.45),0_8px_20px_rgb(15_23_42_/.08)] min-[701px]:top-16"><div className="flex w-full max-w-full min-w-0 flex-nowrap gap-1 overflow-hidden p-1.5 sm:gap-1.5 sm:px-2">{tabs.map((tab, index) => <Block key={tab} className={`h-10 shrink-0 rounded-lg ${activeSection === tab ? 'w-28 bg-admin-brand/15' : index === 0 ? 'w-24' : 'w-28'}`} />)}</div></nav>{activeSection === 'hero' ? <section className="rounded-b-2xl border border-t-0 border-admin-border bg-admin-card p-5 shadow-[0_12px_38px_rgb(15_23_42_/.055)] sm:p-6"><div className="mb-5 grid gap-2 sm:flex sm:justify-end"><Block className="h-9 w-full rounded-xl sm:w-28" /><Block className="h-9 w-full rounded-xl sm:w-52" /></div><div className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4"><Block className="mb-2 h-3 w-28" /><Block className="h-11 w-full rounded-xl" /></div></section> : activeSection === 'categories' ? <MagazineCategoriesSkeleton /> : <MagazineRecordsSkeleton section={activeSection} />}</section></>
}

function MagazineCategoriesSkeleton() {
  return <><header className="flex flex-wrap items-center gap-4 rounded-b-2xl border-b border-admin-border bg-(--editor-field) px-5 py-4 sm:px-6"><Block className="size-11 rounded-xl bg-admin-brand/15" /><Block className="h-5 w-36 flex-1 max-w-48" /><div className="grid w-full grid-cols-1 gap-2 sm:ms-auto sm:flex sm:w-auto"><Block className="h-9 w-full rounded-xl sm:w-32" /><Block className="h-9 w-full rounded-xl bg-admin-brand/15 sm:w-36" /></div></header><section className="border-t border-admin-border py-5 sm:py-6"><div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{list(6).map((item) => <div key={item} className="flex min-h-16 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><Block className="size-9 rounded-lg bg-admin-brand/15" /><Block className="h-3 flex-1 max-w-48" /><Block className="size-8 rounded-lg" /><Block className="size-8 rounded-lg" /></div>)}</div></section></>
}

function MagazineRecordsSkeleton({ section }) {
  const isArticles = section === 'articles'
  return <><section className="border-x border-b border-admin-border bg-admin-card p-5 sm:p-6 lg:border-x-0"><div className="mb-3 grid gap-2 sm:flex sm:justify-end"><Block className="h-9 w-full rounded-xl sm:w-28" /><Block className="h-9 w-full rounded-xl sm:w-52" /></div><div className="rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4"><Block className="mb-2 h-3 w-28" /><Block className="h-11 w-full rounded-xl" /></div></section><section className="overflow-visible"><div className={`grid gap-1 rounded-b-2xl border-x border-b border-admin-border bg-admin-control-soft p-1 lg:rounded-b-none lg:border-x-0 ${isArticles ? 'md:grid-cols-[repeat(4,minmax(0,1fr))]' : 'md:grid-cols-[minmax(12rem,1fr)_minmax(12rem,.7fr)_minmax(14rem,.8fr)]'}`}><Block className="h-9 w-full rounded-xl bg-admin-brand/15 md:w-36" />{isArticles ? <><div className="grid grid-cols-2 gap-1"><Block className="h-9 w-full rounded-xl" /><Block className="h-9 w-full rounded-xl" /></div><Block className="h-9 w-full rounded-xl" /></> : <Block className="h-9 w-full rounded-xl" />}<Block className="h-9 w-full rounded-xl" /></div><section className="hidden bg-admin-card lg:block"><div className="grid grid-cols-[minmax(0,1.5fr)_8rem_9rem] gap-4 border-b border-admin-border bg-admin-control-soft px-4 py-2"><Block className="h-3 w-24" /><Block className="h-3 w-16" /><Block className="h-3 w-16" /></div>{list(6).map((item) => <div key={item} className="grid min-h-[5.25rem] grid-cols-[minmax(0,1.5fr)_8rem_9rem] items-center gap-4 border-b border-admin-border p-4"><div className="flex items-center gap-3"><Block className="size-14 shrink-0 rounded-xl" /><Block className="h-4 w-2/3" /></div><Block className="h-7 w-20 rounded-full" /><div className="flex justify-end gap-1"><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /><Block className="size-9 rounded-xl" /></div></div>)}</section></section><section className="grid w-full min-w-0 max-w-full gap-3 pt-3 md:grid-cols-2 min-[701px]:pt-4 lg:hidden">{list(6).map((item) => <article key={item} className="relative grid min-h-32 min-w-0 grid-cols-[5rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-admin-border bg-admin-card p-3"><Block className="size-20 justify-self-center rounded-xl" /><div className="min-w-0 space-y-3"><Block className="h-4 w-3/4" /><Block className="h-7 w-24 rounded-full" /><div className="absolute bottom-3 left-3 flex flex-col gap-1"><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /><Block className="size-8 rounded-xl" /></div></div></article>)}</section></>
}

function MessagesSkeleton() {
  return <div className="mx-auto grid w-full max-w-[78rem] gap-[1.2rem] sm:gap-[1.65rem]">
    <PageHeadingSkeleton />
    <section className="grid min-h-[38rem] grid-cols-[minmax(18rem,.8fr)_minmax(25rem,1.2fr)] overflow-hidden rounded-2xl border border-admin-border bg-admin-card max-[1023px]:grid-cols-[minmax(16rem,.8fr)_minmax(20rem,1.2fr)] max-[700px]:grid-cols-1">
      <aside className="border-e border-admin-border bg-(--editor-field) max-[700px]:border-e-0 max-[700px]:border-b">
        <div className="border-b border-admin-border p-3"><Block className="h-10 w-full rounded-xl" /></div>
        <div className="px-3 pt-3"><div className="grid grid-cols-3 gap-1 rounded-xl border border-admin-border bg-(--editor-input) p-1">{list(3).map((item) => <Block key={item} className={`h-9 rounded-lg ${item === 0 ? 'bg-admin-brand/15' : ''}`} />)}</div></div>
        <div className="flex items-center justify-between px-4 pt-4 pb-2"><Block className="h-4 w-20" /><Block className="h-3 w-16" /></div>
        <div className="border-t border-admin-border">{list(7).map((item) => <div key={item} className="flex min-h-[5.1rem] items-start gap-3 border-b border-admin-border px-4 py-3"><Block className="mt-1 size-2 shrink-0 rounded-full bg-admin-brand/20" /><div className="min-w-0 flex-1 space-y-2"><div className="flex justify-between gap-3"><Block className="h-4 w-2/5" /><Block className="h-3 w-16" /></div><Block className="h-3 w-1/3 bg-admin-brand/15" /><Block className="h-3 w-full" /></div><Block className="size-8 shrink-0 rounded-lg" /></div>)}</div>
      </aside>
      <div className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center sm:min-h-96"><Block className="size-16 rounded-2xl bg-admin-brand/15" /><Block className="mt-5 h-5 w-36" /><Block className="mt-3 h-3 w-64 max-w-full" /><Block className="mt-2 h-3 w-48 max-w-full" /></div>
    </section>
  </div>
}

function MediaSkeleton() {
  return <><PageHeadingSkeleton /><section className="grid gap-2 rounded-2xl border border-admin-border bg-admin-card p-2 shadow-[0_12px_34px_rgb(15_23_42_/.055)] md:grid-cols-[minmax(15rem,.7fr)_minmax(18rem,1fr)]"><Block className="order-2 h-9 rounded-xl md:order-1" /><div className="order-1 grid grid-cols-4 gap-1 rounded-xl border border-(--editor-field-border) bg-(--editor-input) p-1 md:order-2">{list(4).map((item) => <Block key={item} className={`h-7 rounded-lg ${item === 0 ? 'bg-admin-brand/15' : ''}`} />)}</div></section><section className="mt-3 flex min-h-12 flex-nowrap items-center gap-2 rounded-2xl border border-admin-border bg-admin-card px-3 py-2 sm:gap-3"><Block className="h-4 min-w-0 w-28" /><Block className="me-auto h-3 w-20 shrink-0" /><Block className="size-9 shrink-0 rounded-xl sm:w-32" /></section><div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">{list(8).map((item) => <article key={item} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-admin-border bg-admin-card"><Block className="absolute inset-0 h-full w-full rounded-none" /><Block className="absolute start-2.5 top-2.5 size-5 rounded-md" /><div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 rounded-lg bg-slate-950/20 px-2 py-1.5"><Block className="h-3 min-w-0 flex-1 bg-white/30" /><Block className="size-7 shrink-0 rounded-md bg-white/30" /></div></article>)}</div></>
}

function SettingsSkeleton() {
  return <><SettingsHeadingSkeleton /><div className="mt-5 grid items-stretch gap-5 sm:mt-[1.65rem]">
    <div className="grid gap-5 lg:grid-cols-2">
      <SettingsBrandingLogoSkeleton />
      <SettingsColorsSkeleton />
    </div>
    <div className="grid items-stretch gap-5 md:grid-cols-2">
      <SettingsCardSkeleton fields={1} />
      <SettingsCardSkeleton fields={1} />
    </div>
  </div></>
}

function SettingsHeadingSkeleton() {
  return <PageHeadingSkeleton action={false} />
}

function SettingsCardSkeleton({ fields = 1 }) {
  return <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-card">
    <header className="flex items-center gap-3 border-b border-admin-border bg-[linear-gradient(100deg,var(--editor-field),var(--admin-card))] px-4 py-4 sm:px-5"><Block className="size-10 shrink-0 rounded-xl bg-admin-brand/15" /><Block className="h-4 w-32" /></header>
    <div className="flex flex-1 flex-col p-4 sm:p-5">{list(fields).map((field) => <div key={field} className="mt-auto"><Block className="mb-2 h-3 w-28" /><Block className="h-11 w-full rounded-xl" /></div>)}</div>
  </section>
}

function SettingsBrandingLogoSkeleton() {
  return <section className="relative rounded-2xl border border-admin-border bg-admin-card p-4 shadow-[0_12px_34px_rgb(15_23_42_/.055)] sm:p-5">
    <div className="flex items-center gap-3"><Block className="size-10 rounded-xl bg-admin-brand/15" /><Block className="h-4 w-28" /></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">{list(4).map((item) => <div key={item}><Block className="mb-2 h-3 w-20" /><div className="relative aspect-[2.25] overflow-hidden rounded-2xl border border-admin-border bg-(--editor-input)"><Block className="absolute inset-0 h-full w-full rounded-none" /><div className="absolute inset-x-0 bottom-3 flex justify-center gap-2"><Block className="size-10 rounded-xl bg-red-500/15" /><Block className="size-10 rounded-xl" /></div></div></div>)}</div>
  </section>
}

function SettingsColorsSkeleton() {
  return <section className="relative rounded-2xl border border-admin-border bg-admin-card p-4 shadow-[0_12px_34px_rgb(15_23_42_/.055)] sm:p-5">
    <div className="flex items-center gap-3"><Block className="size-10 rounded-xl bg-admin-brand/15" /><Block className="h-4 w-28" /></div>
    <div className="mt-5 grid gap-3">{list(2).map((item) => <div key={item} className="flex min-h-11 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) px-3"><Block className="size-7 shrink-0 rounded-lg bg-admin-brand/15" /><Block className="h-3 flex-1" /><Block className="h-8 w-24 shrink-0 rounded-lg" /></div>)}</div>
  </section>
}

function ProfileSkeleton() {
  const card = 'overflow-hidden rounded-2xl border border-admin-border bg-admin-card'
  return <>
    <PageHeadingSkeleton action={false} />
    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(17rem,.65fr)] items-start gap-4 max-[700px]:grid-cols-1">
      <div className="grid gap-4">
        <section className={card}>
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border bg-admin-control-soft px-5 py-4">
            <Block className="h-5 w-32" />
            <div className="flex items-center gap-3"><Block className="h-10 w-64 max-w-[55vw] rounded-xl" /><Block className="size-10 rounded-xl bg-admin-brand/15" /></div>
          </header>
          <div className="grid grid-cols-2 gap-5 p-5 max-[700px]:grid-cols-1">
            <div className="col-span-full max-[700px]:col-auto"><Block className="h-3 w-24" /><Block className="mt-2 h-10 w-full rounded-xl" /></div>
            {list(2).map((item) => <div key={item}><Block className="h-3 w-20" /><Block className="mt-2 h-10 w-full rounded-xl" /></div>)}
          </div>
        </section>
        <section className={card}>
          <header className="flex items-center justify-between border-b border-admin-border bg-admin-control-soft px-5 py-4"><Block className="h-5 w-36" /><Block className="size-10 rounded-xl bg-admin-brand/15" /></header>
          <div className="grid gap-3 p-5">{list(2).map((item) => <div key={item} className="flex min-h-12 items-center gap-3 rounded-xl border border-admin-border bg-admin-control-soft px-4"><Block className="size-8 rounded-xl bg-admin-brand/15" /><Block className="h-3 w-32 flex-1 max-w-44" /><Block className="h-8 w-16 rounded-lg" /></div>)}</div>
        </section>
      </div>
      <aside className="grid gap-4">
        <section className={`${card} p-5 text-center`}><Block className="mx-auto size-14 rounded-2xl bg-admin-brand/15" /><Block className="mx-auto mt-3 h-5 w-28" /><div className="mt-4">{list(3).map((item) => <div key={item} className="flex items-center justify-between border-t border-admin-border py-3"><Block className="h-3 w-16" /><Block className="h-3 w-20" /></div>)}</div></section>
        <section className={card}><div className="flex items-center justify-between px-4 py-4"><Block className="h-5 w-28" /><Block className="size-6 rounded-lg bg-admin-brand/15" /></div><div className="flex items-center gap-3 border-t border-admin-border px-4 py-3"><Block className="size-9 rounded-xl bg-admin-brand/15" /><div className="flex-1 space-y-2"><Block className="h-3 w-28" /><Block className="h-3 w-36 max-w-full" /></div><Block className="size-2 rounded-full bg-admin-brand/20" /></div></section>
        <section className={`${card} flex items-center gap-3 px-4 py-4`}><Block className="size-9 rounded-xl bg-admin-brand/15" /><Block className="h-4 w-32" /></section>
      </aside>
    </div>
  </>
}

function AuthSkeleton({ forceLogin = false }) {
  const path = window.location.pathname
  const login = forceLogin || path.endsWith('/login')
  const reset = path.endsWith('/reset-password')
  if (!login) return <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden bg-slate-200 bg-cover bg-center bg-no-repeat px-5 py-12 dark:bg-background"><span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-transparent dark:bg-slate-950/80" /><section className="relative z-10 w-full max-w-md rounded-3xl border border-admin-border bg-admin-card p-7 text-center shadow-[0_28px_80px_rgba(15,23,42,.14)] sm:p-9"><RecoverySkeleton reset={reset} /></section></main>
  return <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-slate-200 bg-cover bg-center bg-no-repeat p-3 dark:bg-background sm:p-6"><span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-transparent dark:bg-slate-950/80" /><section className="relative z-10 flex w-full max-w-md overflow-hidden rounded-[1.75rem] border border-admin-border bg-admin-card/95 shadow-[0_26px_80px_rgba(36,32,27,.15)]"><div className="relative flex w-full flex-col justify-center p-4"><LoginSkeleton /></div></section></main>
}

function LoginSkeleton() {
  return <><header className="flex items-center justify-between gap-3"><Block className="h-8 w-28 rounded-xl" /><div className="flex gap-2"><Block className="h-10 w-28 rounded-xl" /><Block className="size-10 rounded-xl" /></div></header><div className="mt-4 rounded-3xl bg-admin-card/70 px-2 py-4 sm:px-8"><Block className="mx-auto size-20 rounded-full bg-admin-brand/15" /><Block className="mx-auto mt-2 h-5 w-32" /><div className="mt-7 grid gap-2"><div><Block className="me-auto mb-2 h-3 w-20" /><Block className="h-10 w-full rounded-xl" /></div><div><Block className="me-auto mb-2 h-3 w-16" /><Block className="h-10 w-full rounded-xl" /></div><Block className="ms-auto h-3 w-28" /><Block className="mt-2 h-11 w-full rounded-xl bg-admin-brand/15" /></div></div></>
}

function RecoverySkeleton({ reset = false }) {
  return <><Block className="mx-auto size-12 rounded-2xl bg-admin-brand/15" /><Block className="mx-auto mt-2 h-9 w-56" />{reset ? <div className="mt-7 grid gap-5"><div><Block className="mb-2 h-3 w-24" /><Block className="h-10 w-full rounded-xl" /></div><div><Block className="mb-2 h-3 w-28" /><Block className="h-10 w-full rounded-xl" /></div></div> : <div className="mt-7"><Block className="mb-2 h-3 w-20" /><Block className="h-10 w-full rounded-xl" /></div>}<Block className="mt-7 h-11 w-full rounded-xl bg-admin-brand/15" /><Block className="mx-auto mt-6 h-4 w-32" /></>
}

function SuperUserSkeleton() {
  return <main className="min-h-dvh bg-admin-page px-4 py-6 sm:px-6"><div className="mx-auto max-w-6xl"><header className="mb-5 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Block className="size-11 rounded-xl bg-admin-brand/15" /><Block className="h-5 w-28" /></div><Block className="h-10 w-28 rounded-xl" /></header><section className="relative overflow-hidden rounded-3xl border border-admin-border bg-admin-card px-5 py-6 sm:px-8"><Block className="h-3 w-28 bg-admin-brand/15" /><Block className="mt-2 h-9 w-72 max-w-full" /><Block className="mt-2 h-4 w-full max-w-2xl" /><Block className="mt-2 h-4 w-4/5 max-w-xl" /><div className="mt-5 flex flex-wrap gap-2"><Block className="h-11 w-28 rounded-xl" /><Block className="h-11 w-36 rounded-xl bg-admin-brand/15" /></div></section><div className="my-4 grid max-w-md grid-cols-2 gap-3">{list(2).map((item) => <div key={item} className="rounded-xl border border-admin-border bg-admin-card p-4"><Block className="h-3 w-20" /><Block className="mt-2 h-6 w-8" /></div>)}</div><section className="grid gap-4 lg:grid-cols-2">{list(4).map((item) => <article key={item} className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card"><div className="flex items-start gap-4 p-5"><Block className="size-12 shrink-0 rounded-xl bg-admin-brand/15" /><div className="min-w-0 flex-1"><Block className="h-5 w-2/5" /><Block className="mt-3 h-3 w-3/5" /><Block className="mt-3 h-7 w-24 rounded-full" /></div></div><footer className="flex justify-end gap-2 border-t border-admin-border bg-admin-control-soft p-3">{list(item ? 4 : 3).map((action) => <Block key={action} className="size-10 rounded-xl" />)}</footer></article>)}</section></div></main>
}

function RouteSkeleton({ routeKey }) {
  if (routeKey === 'overview') return <OverviewSkeleton />
  if (routeKey === 'home') return <HomeSkeleton />
  if (routeKey === 'about') return <AboutSkeleton />
  if (routeKey === 'contact') return <ContactSkeleton />
  if (routeKey === 'settings') return <SettingsSkeleton />
  if (routeKey === 'profile') return <ProfileSkeleton />
  if (routeKey === 'media') return <MediaSkeleton />
  if (routeKey === 'messages') return <MessagesSkeleton />
  if (routeKey === 'magazine') return <MagazineSkeleton />
  if (routeKey === 'scholarships') return <ScholarshipsSkeleton />
  if (routeKey === 'opportunities') return <OpportunitiesSkeleton />
  if (routeKey === 'services') return <ServicesSkeleton />
  if (routeKey === 'tourism') return <TourismSkeleton />
  return <EditorSkeleton panels={2} />
}

export function CmsPageProgress({ routeKey = getCmsRouteKey(window.location.pathname) }) {
  return <div role="status" aria-live="polite" aria-busy="true" aria-label="Loading page" className="w-full"><span className="sr-only">Loading page</span><RouteSkeleton routeKey={routeKey} /></div>
}

export default function CmsRouteProgress({ authenticationPending = false, standalone = false }) {
  const path = window.location.pathname
  const authPath = ['/dashboard/login', '/dashboard/forgot-password', '/dashboard/reset-password'].includes(path)
  if (authPath) return <div className="cms-root"><AuthSkeleton /></div>
  if (authenticationPending || standalone) return <div className="cms-root"><AuthSkeleton forceLogin /></div>
  if (path === '/dashboard/super') return <div className="cms-root"><SuperUserSkeleton /></div>
  return <CmsPageProgress />
}

export { SuperUserSkeleton }
