import SkeletonBlock from '@/shared/components/SkeletonBlock.jsx'
import { getCmsRouteKey } from '@cms/routes.js'

const list = (length) => Array.from({ length }, (_, index) => index)
const Block = ({ className = '', ...props }) => <SkeletonBlock className={`bg-admin-heading/10 ${className}`} {...props} />

function PageHeadingSkeleton({ action = true }) {
  return <header className="mb-5 flex flex-wrap items-end justify-between gap-4"><div className="space-y-2"><Block className="h-3 w-36" /><Block className="h-8 w-52" /></div>{action && <Block className="h-11 w-36 rounded-xl bg-admin-brand/15" />}</header>
}

function MetricSkeleton() {
  return <article className="rounded-2xl border border-admin-border bg-admin-card p-5"><div className="flex items-start justify-between"><Block className="size-11 rounded-xl bg-admin-brand/15" /><Block className="h-3 w-14" /></div><Block className="mt-6 h-8 w-20" /><Block className="mt-3 h-3 w-28" /></article>
}

function OverviewSkeleton() {
  return <><PageHeadingSkeleton action={false} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{list(4).map((item) => <MetricSkeleton key={item} />)}</div><div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><section className="rounded-2xl border border-admin-border bg-admin-card p-5"><div className="flex justify-between"><Block className="h-6 w-40" /><Block className="h-9 w-24" /></div><div className="mt-8 flex h-72 items-end gap-3 border-b border-admin-border px-2">{[45, 72, 58, 88, 65, 80, 54].map((height, item) => <Block key={item} className="flex-1 rounded-t-lg rounded-b-none bg-admin-brand/15" style={{ height: `${height}%` }} />)}</div></section><section className="rounded-2xl border border-admin-border bg-admin-card p-5"><Block className="h-6 w-36" /><div className="mx-auto mt-8 grid size-48 place-items-center rounded-full border-[2.4rem] border-admin-brand/15"><Block className="size-20 rounded-full" /></div><div className="mt-8 space-y-3">{list(3).map((item) => <div key={item} className="flex justify-between"><Block className="h-3 w-24" /><Block className="h-3 w-10" /></div>)}</div></section></div><section className="mt-5 rounded-2xl border border-admin-border bg-admin-card p-5"><Block className="h-6 w-44" /><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list(6).map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-admin-border p-4"><Block className="size-10 rounded-xl bg-admin-brand/15" /><div className="flex-1 space-y-2"><Block className="h-4 w-2/3" /><Block className="h-3 w-1/2" /></div></div>)}</div></section></>
}

function EditorPanel({ fields = 4, media = false }) {
  return <section className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card"><header className="flex items-center gap-3 border-b border-admin-border p-4"><Block className="size-10 rounded-xl bg-admin-brand/15" /><div className="flex-1 space-y-2"><Block className="h-5 w-36" /><Block className="h-3 w-52 max-w-full" /></div><Block className="size-8" /></header><div className="grid gap-4 p-4 sm:grid-cols-2">{list(fields).map((item) => <div key={item} className={item === fields - 1 ? 'sm:col-span-2' : ''}><Block className="mb-2 h-3 w-20" /><Block className={`${item === fields - 1 ? 'h-28' : 'h-11'} w-full rounded-xl`} /></div>)}{media && <Block className="h-44 rounded-2xl sm:col-span-2" />}</div></section>
}

function EditorSkeleton({ panels = 4, media = false }) {
  return <><PageHeadingSkeleton /><div className="mb-5 flex gap-2 overflow-hidden rounded-xl border border-admin-border bg-admin-card p-2">{list(Math.min(panels + 1, 6)).map((item) => <Block key={item} className={`h-9 shrink-0 rounded-lg ${item === 0 ? 'w-28 bg-admin-brand/15' : 'w-24'}`} />)}</div><div className="grid gap-5">{list(panels).map((item) => <EditorPanel key={item} fields={item % 2 ? 3 : 4} media={media && item === 0} />)}</div></>
}

function CollectionSkeleton({ kind = 'cards' }) {
  return <><PageHeadingSkeleton /><section className="rounded-2xl border border-admin-border bg-admin-card p-4"><div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem]"><Block className="h-11" /><Block className="h-11" /><Block className="h-11" /></div></section>{kind === 'table' ? <TableSkeleton /> : <div className="mt-5 grid gap-4 lg:grid-cols-2">{list(6).map((item) => <article key={item} className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card"><div className="flex gap-4 p-4"><Block className="h-24 w-32 shrink-0 rounded-xl" /><div className="flex-1 space-y-3"><Block className="h-5 w-3/4" /><Block className="h-3 w-full" /><Block className="h-3 w-2/3" /><div className="flex gap-2"><Block className="h-7 w-20 rounded-full" /><Block className="h-7 w-16 rounded-full" /></div></div></div><footer className="flex justify-end gap-2 border-t border-admin-border p-3"><Block className="size-9" /><Block className="size-9" /><Block className="size-9" /></footer></article>)}</div>}</>
}

function TableSkeleton({ rows = 7 }) {
  return <section className="mt-5 overflow-hidden rounded-2xl border border-admin-border bg-admin-card"><div className="grid grid-cols-[2fr_1.2fr_1fr_7rem] gap-4 border-b border-admin-border bg-admin-control-soft p-4">{list(4).map((item) => <Block key={item} className="h-3 w-2/3" />)}</div>{list(rows).map((row) => <div key={row} className="grid min-h-16 grid-cols-[2fr_1.2fr_1fr_7rem] items-center gap-4 border-b border-admin-border px-4 last:border-0"><div className="space-y-2"><Block className="h-4 w-3/4" /><Block className="h-3 w-1/2" /></div><Block className="h-4 w-3/4" /><Block className="h-7 w-20 rounded-full" /><div className="flex gap-2"><Block className="size-8" /><Block className="size-8" /></div></div>)}</section>
}

function MediaSkeleton() {
  return <><PageHeadingSkeleton /><div className="flex flex-wrap gap-3 rounded-2xl border border-admin-border bg-admin-card p-4"><Block className="h-11 min-w-56 flex-1" /><Block className="h-11 w-36" /><Block className="h-11 w-32 bg-admin-brand/15" /></div><div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{list(8).map((item) => <article key={item} className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card"><Block className="aspect-[4/3] w-full rounded-none" /><div className="space-y-2 p-3"><Block className="h-4 w-3/4" /><Block className="h-3 w-1/3" /></div></article>)}</div></>
}

function SettingsSkeleton() {
  return <><PageHeadingSkeleton action={false} /><div className="grid gap-5 lg:grid-cols-2">{list(4).map((item) => <EditorPanel key={item} fields={2} media={item === 0} />)}</div><section className="mt-5 rounded-2xl border border-admin-border bg-admin-card"><header className="flex gap-3 border-b border-admin-border p-4"><Block className="size-10 bg-admin-brand/15" /><div className="flex-1 space-y-2"><Block className="h-5 w-36" /><Block className="h-3 w-56" /></div></header><div className="space-y-3 p-4">{list(6).map((item) => <div key={item} className="flex justify-between rounded-xl border border-admin-border p-4"><div className="space-y-2"><Block className="h-4 w-40" /><Block className="h-3 w-24" /></div><Block className="h-4 w-32" /></div>)}</div></section></>
}

function ProfileSkeleton() {
  return <><PageHeadingSkeleton action={false} /><div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]"><aside className="rounded-2xl border border-admin-border bg-admin-card p-6 text-center"><Block className="mx-auto size-24 rounded-full bg-admin-brand/15" /><Block className="mx-auto mt-4 h-6 w-40" /><Block className="mx-auto mt-3 h-4 w-52" /><div className="mt-6 space-y-3">{list(4).map((item) => <div key={item} className="flex justify-between border-t border-admin-border pt-3"><Block className="h-3 w-20" /><Block className="h-3 w-28" /></div>)}</div></aside><div className="space-y-5">{list(3).map((section) => <section key={section} className="rounded-2xl border border-admin-border bg-admin-card p-5"><Block className="h-6 w-40" /><div className="mt-5 space-y-3">{list(section === 0 ? 3 : 2).map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-admin-border p-4"><Block className="size-9 bg-admin-brand/15" /><div className="flex-1 space-y-2"><Block className="h-4 w-36" /><Block className="h-3 w-48 max-w-full" /></div><Block className="h-9 w-24" /></div>)}</div></section>)}</div></div></>
}

function AuthSkeleton() {
  return <main className="grid min-h-dvh place-items-center bg-admin-page p-4"><section className="grid min-h-140 w-full max-w-4xl overflow-hidden rounded-3xl border border-admin-border bg-admin-card md:grid-cols-[.9fr_1.1fr]"><div className="hidden bg-admin-brand/20 p-8 md:flex md:flex-col md:justify-between"><div><Block className="h-9 w-36 bg-white/30" /><Block className="mt-8 h-10 w-4/5 bg-white/30" /><Block className="mt-3 h-10 w-3/5 bg-white/30" /></div><div className="space-y-4">{list(3).map((item) => <Block key={item} className="h-4 w-4/5 bg-white/30" />)}</div></div><div className="flex flex-col justify-center p-8"><Block className="mx-auto size-16 rounded-full bg-admin-brand/15" /><Block className="mx-auto mt-5 h-6 w-32" /><Block className="mx-auto mt-3 h-4 w-52" /><div className="mt-8 space-y-5">{list(2).map((item) => <div key={item}><Block className="mb-2 h-3 w-20" /><Block className="h-12" /></div>)}<Block className="h-11 bg-admin-brand/15" /></div></div></section></main>
}

function SuperUserSkeleton() {
  return <main className="min-h-dvh bg-admin-page px-4 py-6"><div className="mx-auto max-w-6xl"><div className="mb-5 flex justify-between"><Block className="h-11 w-44" /><Block className="h-10 w-28" /></div><section className="rounded-3xl border border-admin-border bg-admin-card p-8"><Block className="h-3 w-28 bg-admin-brand/15" /><Block className="mt-3 h-9 w-72" /><Block className="mt-3 h-4 w-full max-w-xl" /><div className="mt-5 flex gap-2"><Block className="h-11 w-28" /><Block className="h-11 w-36 bg-admin-brand/15" /></div></section><div className="my-4 grid max-w-md grid-cols-2 gap-3"><MetricSkeleton /><MetricSkeleton /></div><div className="grid gap-4 lg:grid-cols-2">{list(4).map((item) => <EditorPanel key={item} fields={2} />)}</div></div></main>
}

function DashboardSidebarSkeleton({ collapsed }) {
  return <aside className={`fixed inset-y-0 z-50 hidden w-(--sidebar-width) flex-col border-(--sidebar-border) bg-(--admin-sidebar) text-(--sidebar-text) lg:flex rtl:right-0 rtl:border-l ltr:left-0 ltr:border-r ${collapsed ? 'lg:w-21' : ''}`}><div className={`flex min-h-16 shrink-0 items-center gap-3 border-b border-(--sidebar-border) px-[1.15rem] ${collapsed ? 'justify-center px-2.5' : ''}`}><Block className={`size-[2.55rem] shrink-0 rounded-[.9rem] bg-admin-brand/15 ${collapsed ? 'hidden' : ''}`} />{!collapsed && <><div className="min-w-0 flex-1 space-y-2"><Block className="h-4 w-28" /><Block className="h-3 w-20" /></div><Block className="size-9 rounded-[.65rem]" /></>}</div><nav className={`min-h-0 flex-1 overflow-hidden px-3 pt-[1.1rem] ${collapsed ? 'px-2.5' : ''}`}>{list(10).map((item) => <div key={item} className={`my-[.36rem] flex min-h-10 items-center gap-3 rounded-xl px-3 ${collapsed ? 'justify-center px-2.5' : ''}`}><Block className="size-[1.125rem] shrink-0 rounded-md bg-admin-brand/15" />{!collapsed && <Block className={`h-3 ${item % 3 === 0 ? 'w-24' : item % 2 === 0 ? 'w-32' : 'w-28'}`} />}</div>)}</nav><div className={`shrink-0 border-t border-(--sidebar-border) px-3 py-[.7rem] ${collapsed ? 'px-2.5' : ''}`}><div className={`flex min-h-10 items-center gap-3 rounded-xl px-3 ${collapsed ? 'justify-center px-2.5' : ''}`}><Block className="size-[1.125rem] rounded-md" />{!collapsed && <Block className="h-3 w-20" />}</div></div></aside>
}

function DashboardTopbarSkeleton() {
  return <header className="sticky top-0 z-30 flex min-h-15 items-center gap-[.45rem] border-b border-admin-border bg-(--admin-topbar) px-4 backdrop-blur-lg min-[701px]:min-h-16 min-[701px]:gap-4 sm:px-4 md:px-5 lg:px-8"><Block className="size-10 rounded-xl lg:hidden" /><Block className="hidden h-10 w-full max-w-64 rounded-xl sm:block" /><Block className="h-10 w-11 rounded-xl min-[1280px]:w-28" /><div className="ms-auto flex items-center gap-2.5"><Block className="h-10 w-16 rounded-xl" /><Block className="size-10 rounded-xl" /><Block className="size-10 rounded-xl" /><Block className="size-10 rounded-xl" /></div></header>
}

function DashboardShellSkeleton() {
  const collapsed = window.localStorage.getItem('globalvision-cms-sidebar-collapsed') === 'true'
  return <div className="cms-root min-h-screen w-full max-w-full overflow-x-clip bg-admin-page"><DashboardSidebarSkeleton collapsed={collapsed} /><div className={`admin-shell min-h-screen min-w-0 max-w-full rtl:lg:pr-(--sidebar-width) ltr:lg:pl-(--sidebar-width) ${collapsed ? 'rtl:lg:pr-21 ltr:lg:pl-21' : ''}`}><DashboardTopbarSkeleton /><main className="min-h-[calc(100vh-5rem)] px-4 pt-6 pb-28 sm:px-8 sm:pt-8"><CmsPageProgress /></main></div></div>
}

function RouteSkeleton({ routeKey }) {
  if (routeKey === 'overview') return <OverviewSkeleton />
  if (['home', 'about', 'contact'].includes(routeKey)) return <EditorSkeleton panels={routeKey === 'home' ? 6 : routeKey === 'about' ? 5 : 3} media />
  if (routeKey === 'settings') return <SettingsSkeleton />
  if (routeKey === 'profile') return <ProfileSkeleton />
  if (routeKey === 'media') return <MediaSkeleton />
  if (routeKey === 'messages') return <><PageHeadingSkeleton action={false} /><TableSkeleton rows={8} /></>
  if (['magazine', 'scholarships'].includes(routeKey)) return <CollectionSkeleton kind="table" />
  if (['opportunities', 'tourism', 'services'].includes(routeKey)) return <CollectionSkeleton />
  return <EditorSkeleton panels={2} />
}

export function CmsPageProgress({ routeKey = getCmsRouteKey(window.location.pathname) }) {
  return <div role="status" aria-live="polite" aria-busy="true" aria-label="Loading page" className="w-full"><span className="sr-only">Loading page</span><RouteSkeleton routeKey={routeKey} /></div>
}

export default function CmsRouteProgress({ standalone = false }) {
  const path = window.location.pathname
  const authPath = ['/dashboard/login', '/dashboard/forgot-password', '/dashboard/reset-password'].includes(path)
  if (authPath) return <div className="cms-root"><AuthSkeleton /></div>
  if (path === '/dashboard/super') return <div className="cms-root"><SuperUserSkeleton /></div>
  if (standalone) return <DashboardShellSkeleton />
  return <CmsPageProgress />
}

export { SuperUserSkeleton }
