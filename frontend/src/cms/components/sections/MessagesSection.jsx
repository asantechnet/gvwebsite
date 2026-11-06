import { Mail, MailOpen, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import PageHeading from '@cms/components/PageHeading.jsx'
import { EditorPreviewLink } from '@cms/components/EditorPrimitives.jsx'
import SkeletonBlock from '@/shared/components/SkeletonBlock.jsx'

const dateLocales = { prs: 'fa-AF-u-nu-latn', ps: 'ps-AF-u-nu-latn', en: 'en-GB' }
const messageActionClass = 'grid size-8 flex-none place-items-center rounded-lg border border-transparent bg-transparent text-admin-muted transition-colors hover:border-admin-border hover:bg-admin-control-soft hover:text-admin-heading disabled:cursor-wait disabled:opacity-45'

function formatMessageDate(value, language) {
  return new Intl.DateTimeFormat(dateLocales[language] || dateLocales.prs, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function MessagesSection({ content, language = 'prs', messageState }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const normalizedQuery = query.trim().toLocaleLowerCase(dateLocales[language])
  const { records: messages, status, error, unreadCount, isPending, refresh, setUnread, remove } = messageState
  const selected = messages.find((message) => message.id === selectedId) || null
  const visible = useMemo(() => messages.filter((message) => {
    const matchesFilter = filter === 'all' || (filter === 'unread' ? message.unread : !message.unread)
    const searchableText = `${message.title} ${message.email} ${message.service} ${message.body}`.toLocaleLowerCase(dateLocales[language])
    return matchesFilter && searchableText.includes(normalizedQuery)
  }), [filter, language, messages, normalizedQuery])
  const filters = [
    ['all', content.categories.all, messages.length],
    ['seen', content.categories.seen, messages.length - unreadCount],
    ['unread', content.categories.unread, unreadCount],
  ]

  const toggleUnread = async (message) => {
    await setUnread(message.id, !message.unread)
  }

  const deleteMessage = async (message) => {
    const confirmed = await window.cmsConfirmDelete?.({
      title: content.deleteTitle,
      description: content.deleteDescription,
    })
    if (!confirmed) return
    const removed = await remove(message.id)
    if (removed) setSelectedId(null)
  }

  return <div className="mx-auto grid w-full max-w-[78rem] gap-[1.2rem] sm:gap-[1.65rem]">
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.dashboard }, { label: content.title }]} action={<EditorPreviewLink>{content.website}</EditorPreviewLink>} />
    {error && status !== 'error' && <p role="alert" className="m-0 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-center text-xs text-red-600">{content.actionError}</p>}
    <section className="inbox-panel grid min-h-[38rem] grid-cols-[minmax(18rem,.8fr)_minmax(25rem,1.2fr)] overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-[0_1px_2px_rgb(15_23_42_/.04),0_12px_34px_rgb(15_23_42_/.055)] max-[1023px]:grid-cols-[minmax(16rem,.8fr)_minmax(20rem,1.2fr)] max-[700px]:grid-cols-1" aria-label={content.title}>
      <aside className="message-list border-e border-admin-border bg-(--editor-field) max-[700px]:border-e-0 max-[700px]:border-b">
        <div className="flex gap-2 border-b border-admin-border p-[.8rem]">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-[.62rem] border border-(--editor-field-border) bg-(--editor-input) px-[.7rem] text-admin-muted focus-within:border-admin-brand">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">{content.search}</span>
            <input type="search" className="search-field w-full border-0 bg-transparent py-[.72rem] text-[.8125rem] text-admin-heading outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={content.search} />
          </label>
        </div>
        <div className="px-3 pt-3"><div className="flex min-w-0 items-center gap-[.2rem] overflow-x-auto rounded-[.7rem] border border-(--editor-field-border) bg-(--editor-input) p-[.22rem]">{filters.map(([key, label, count]) => <button type="button" key={key} aria-pressed={filter === key} onClick={() => { setFilter(key); setSelectedId(null) }} className={`min-h-9 flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${filter === key ? 'bg-admin-brand-soft text-admin-heading shadow-sm' : 'text-admin-muted hover:bg-admin-brand-soft'}`}>{label}<span className="ms-2 inline-block text-[.625rem] opacity-75">{count}</span></button>)}</div></div>
        <div className="flex items-center justify-between px-4 pt-[.9rem] pb-[.6rem]"><strong className="text-[.8125rem] text-admin-heading">{content.inbox}</strong><span className="text-[.6875rem] text-admin-muted">{unreadCount} {content.unread}</span></div>
        {status === 'loading' && <MessageListSkeleton />}
        {status === 'error' && <div role="alert" className="grid justify-items-center gap-3 px-4 py-8 text-center"><p className="m-0 text-xs leading-relaxed text-red-600">{content.loadError}</p><button type="button" onClick={refresh} className="min-h-9 rounded-lg border border-admin-brand bg-admin-brand-soft px-4 text-xs font-semibold text-admin-brand-text transition hover:bg-admin-brand hover:text-white">{content.retry}</button></div>}
        {status === 'ready' && visible.map((message) => <div key={message.id} className="flex items-center border-t border-admin-border">
          <button type="button" onClick={() => setSelectedId(message.id)} aria-current={selectedId === message.id ? 'true' : undefined} className={`grid min-w-0 flex-1 grid-cols-[.45rem_1fr] gap-2 border-0 px-4 py-[.9rem] text-start ${selectedId === message.id ? 'bg-admin-card shadow-[inset_3px_0_var(--admin-brand)] rtl:shadow-[inset_-3px_0_var(--admin-brand)]' : 'bg-transparent hover:bg-admin-control'}`}><span className={`mt-[.38rem] size-[.42rem] rounded-full ${message.unread ? 'bg-admin-brand shadow-[0_0_0_3px_var(--admin-brand-soft)]' : ''}`} /><span className="min-w-0"><span className="flex items-center justify-between gap-2"><strong className="truncate text-[.75rem] text-admin-heading">{message.title}</strong><time dateTime={message.createdAt} className="shrink-0 text-[.625rem] text-admin-muted">{formatMessageDate(message.createdAt, language)}</time></span><small className="mt-[.2rem] block truncate text-[.6875rem] text-admin-brand-text">{message.service}</small><span className="mt-[.45rem] block overflow-hidden text-[.6875rem] leading-[1.45] text-ellipsis whitespace-nowrap text-admin-muted">{message.body}</span></span></button>
          <button type="button" disabled={isPending(message.id)} onClick={() => toggleUnread(message)} className={`${messageActionClass} me-2`} aria-label={message.unread ? content.markRead : content.markUnread}>{message.unread ? <MailOpen size={17} /> : <Mail size={17} />}</button>
        </div>)}
        {status === 'ready' && visible.length === 0 && <p className="px-4 py-8 text-center text-xs leading-relaxed text-admin-muted">{normalizedQuery ? content.noMatches : filter === 'all' ? content.empty : content.filterEmpty}</p>}
      </aside>
      {selected ? <article className="message-detail min-w-0 px-[1.4rem] py-5">
        <div className="flex items-center justify-between border-b border-admin-border pb-4"><span className="inline-flex items-center gap-[.3rem] rounded-[99px] bg-[#e8f8ef] px-[.55rem] py-[.35rem] text-[.625rem] font-semibold text-[#15834d]"><Mail size={12} />{content.messageCategory}</span><div className="flex gap-[.2rem]"><button type="button" disabled={isPending(selected.id)} onClick={() => toggleUnread(selected)} className={messageActionClass} aria-label={selected.unread ? content.markRead : content.markUnread}>{selected.unread ? <MailOpen size={17} /> : <Mail size={17} />}</button><button type="button" disabled={isPending(selected.id)} onClick={() => deleteMessage(selected)} className={`${messageActionClass} hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-600`} aria-label={content.delete}><Trash2 size={17} /></button></div></div>
        <header className="flex flex-wrap items-center gap-[.8rem] py-[1.4rem]"><span className="grid size-[2.2rem] place-items-center rounded-[.7rem] bg-admin-brand-soft text-[.75rem] font-semibold text-admin-brand-text">{selected.title.slice(0, 1)}</span><div className="min-w-0 flex-1"><h2 className="m-0 truncate font-heading text-[1.08rem] text-admin-heading">{selected.title}</h2><a className="break-all text-[.8125rem] text-admin-muted hover:text-admin-brand-text" href={`mailto:${selected.email}`}>{selected.email}</a></div><time dateTime={selected.createdAt} className="text-[.6875rem] text-admin-muted">{formatMessageDate(selected.createdAt, language)}</time></header>
        <div className="grid grid-cols-1 gap-[.6rem] sm:grid-cols-2"><span className="grid gap-[.3rem] rounded-[.7rem] border border-admin-border bg-(--editor-field) p-3 text-[.625rem] text-admin-muted">{content.service}<strong className="text-[.6875rem] text-admin-heading">{selected.service || content.notSpecified}</strong></span><span className="grid gap-[.3rem] rounded-[.7rem] border border-admin-border bg-(--editor-field) p-3 text-[.625rem] text-admin-muted">{content.timeline}<strong className="text-[.6875rem] text-admin-heading">{selected.timeline || content.notSpecified}</strong></span></div>
        <p className="my-[1.2rem] whitespace-pre-wrap text-[.8125rem] leading-[1.75] text-admin-heading">{selected.body}</p>
        <a href={`mailto:${selected.email}?subject=${encodeURIComponent(selected.service || content.messageCategory)}`} className="inline-flex min-h-9 items-center justify-center gap-[.35rem] rounded-[.55rem] border border-admin-brand bg-admin-brand px-[.7rem] py-[.42rem] text-[.6875rem] font-semibold text-white transition hover:bg-brand-orange/90"><Mail size={15} />{content.reply}</a>
      </article> : <div className="message-detail flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center sm:min-h-96" role="status"><span className="mb-5 grid size-16 place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--admin-brand)_18%,var(--admin-border))] bg-admin-brand-soft text-admin-brand-text shadow-[0_8px_24px_color-mix(in_srgb,var(--admin-brand)_8%,transparent)]"><Mail className="text-admin-heading" size={28} strokeWidth={1.75} aria-hidden="true" /></span><h3 className="m-0 font-heading text-base tracking-tight text-admin-heading">{messages.length ? content.select : content.noMessages}</h3><p className="mt-2 mb-0 max-w-64 text-[.8125rem] leading-relaxed text-admin-muted">{messages.length ? content.selectDescription : content.noMessagesDescription}</p></div>}
    </section>
  </div>
}

function MessageListSkeleton() {
  return <div role="status" aria-label="Loading messages" className="border-t border-admin-border"><span className="sr-only">Loading messages</span>{Array.from({ length: 7 }, (_, index) => <div key={index} className="flex min-h-[5.1rem] items-start gap-3 border-b border-admin-border px-4 py-3"><SkeletonBlock className="mt-1 size-2 shrink-0 rounded-full bg-admin-brand/20" /><div className="min-w-0 flex-1 space-y-2"><div className="flex justify-between gap-3"><SkeletonBlock className="h-4 w-2/5 bg-admin-heading/10" /><SkeletonBlock className="h-3 w-16 bg-admin-heading/10" /></div><SkeletonBlock className="h-3 w-1/3 bg-admin-brand/15" /><SkeletonBlock className="h-3 w-full bg-admin-heading/10" /></div></div>)}</div>
}

export default MessagesSection
