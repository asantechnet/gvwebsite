import { useEffect, useMemo, useRef, useState } from 'react'
import { BriefcaseBusiness, ChartNoAxesCombined, Check, ChevronDown, ExternalLink, Globe2, GraduationCap, MapPinned, Pencil, PlaneTakeoff, Plus, Search, Trash2, X } from 'lucide-react'

import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import RichTextEditor from '@cms/components/RichTextEditor.jsx'
import MediaUploadField from '@cms/components/MediaUploadField.jsx'
import SectionTabBar from '@cms/components/SectionTabBar.jsx'
import { EditorPreviewLink } from '@cms/components/EditorPrimitives.jsx'
import useEditorTabs from '@cms/hooks/useEditorTabs.js'
import useManagedCollection from '@cms/hooks/useManagedCollection.js'
import useModalFocus from '@/shared/hooks/useModalFocus.js'
import SafeRichText from '@/shared/components/SafeRichText.jsx'
import SeoFields from '@cms/components/SeoFields.jsx'

const contentLanguages = [{ id: 'prs', short: 'دری', label: 'زبان دری' }, { id: 'ps', short: 'پښتو', label: 'پښتو ژبه' }, { id: 'en', short: 'English', label: 'English language' }]
const currentCmsLanguage = () => {
  const language = document.documentElement.lang
  return ['prs', 'ps', 'en'].includes(language) ? language : 'prs'
}

const emptyPostTranslation = () => ({ title: '', excerpt: '', content: '', tags: [], seoTitle: '', metaDescription: '', imageAlt: '', socialImage: '', canonicalUrl: '', allowIndexing: true })
const opportunityTypes = ['study', 'work', 'migration', 'investment']
const opportunityTabIcons = { study: GraduationCap, work: BriefcaseBusiness, migration: PlaneTakeoff, investment: ChartNoAxesCombined }
const tourismTypes = ['afghanistan', 'world']
const tourismTabIcons = { afghanistan: MapPinned, world: Globe2 }
function ContentLanguageTabs({ value, onChange, mobile = false }) {
  const activeIndex = contentLanguages.findIndex((language) => language.id === value)
  if (mobile) return <div dir="ltr" className="sticky top-0 z-30 grid grid-cols-3 gap-1 border-b border-admin-border bg-admin-card p-1.5 md:hidden" role="tablist" aria-label="Content language">
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-1.5 left-1.5 w-[calc((100%-1rem)/3)] translate-x-[calc(var(--language-index)*(100%+.25rem))] rounded-lg bg-admin-brand shadow-[0_1px_3px_rgb(15_23_42_/.12)] transition-transform duration-300 ease-out motion-reduce:transition-none" style={{ '--language-index': activeIndex }} />
    {contentLanguages.map((language) => <button key={language.id} type="button" role="tab" aria-selected={value === language.id} onClick={() => onChange(language.id)} className={`relative z-10 min-h-9 rounded-lg px-2 text-[.65rem] font-semibold transition-colors duration-300 motion-reduce:transition-none ${value === language.id ? 'text-white' : 'text-admin-muted hover:bg-admin-control-soft hover:text-admin-heading'}`}>{language.short}</button>)}
  </div>
  return <div role="tablist" aria-label="Content language" className="absolute right-0 top-1/2 z-40 hidden -translate-y-1/2 gap-1.5 overflow-hidden rounded-l-xl border-y border-l border-admin-border bg-admin-card p-1 shadow-[-8px_8px_24px_rgb(15_23_42_/.16)] md:grid">
    <span aria-hidden="true" className="pointer-events-none absolute top-1 left-1 h-16 w-10 translate-y-[calc(var(--language-index)*4.375rem)] rounded-lg bg-admin-brand shadow-[0_1px_3px_rgb(15_23_42_/.12)] transition-transform duration-300 ease-out motion-reduce:transition-none" style={{ '--language-index': activeIndex }} />
    {contentLanguages.map((language) => <button key={language.id} type="button" role="tab" aria-selected={value === language.id} aria-label={language.label} onClick={() => onChange(language.id)} className={`relative z-10 grid h-16 w-10 place-items-center rounded-lg text-[.65rem] font-semibold transition-colors duration-300 ease-out motion-reduce:transition-none ${value === language.id ? 'text-white' : 'text-admin-muted hover:bg-admin-control-soft hover:text-admin-heading'}`}><span className="block origin-center whitespace-nowrap leading-none rotate-90">{language.short}</span></button>)}
  </div>
}

function OpportunitiesPage({ content, opportunities, exams, services, tourism }) {
  return <ManagedCollectionPage content={content} opportunities={opportunities} exams={exams} services={services} tourism={tourism} />
}

function ManagedCollectionPage({ content, opportunities, exams, services, tourism }) {
  const isServices = Array.isArray(services)
  const isTourism = Boolean(tourism)
  const pageKey = isServices ? 'services' : isTourism ? 'tourism' : 'opportunities'
  const label = content.groups.flatMap((group) => group.items || []).find((item) => item.key === pageKey)?.label
  const sectionTypes = isTourism ? tourismTypes : opportunityTypes
  const [activeType, setActiveType] = useEditorTabs({ defaultTab: sectionTypes[0], storageKey: `globalvision-cms-${pageKey}-tab`, tabs: sectionTypes })
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const { cards, removePost, savePost, toggleStatus } = useManagedCollection({ pageKey, label, services, tourism, opportunities, exams })
  const labels = { ...content.opportunities, ...content.opportunities.collection }
  const typeLabels = isTourism
    ? { afghanistan: labels.tourismAfghanistan, world: labels.tourismWorld, typeLabel: label }
    : labels.manager || {}
  const typeSections = Object.fromEntries(sectionTypes.map((type) => [type, typeLabels[type] || type]))
  const categoryOptions = [...new Set(cards.map((card) => card.category).filter(Boolean))]
  const visibleCards = isServices ? cards : isTourism ? cards.filter((card) => card.type === activeType) : cards.filter((card) => card.id === activeType)
  const filteredCards = useMemo(() => visibleCards.filter((card) => { const filterStatus = card.savedStatus ?? card.status; return (status === 'all' || filterStatus === status) && `${card.title} ${card.description} ${card.category || ''}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) }), [visibleCards, query, status])
  const modalContent = { ...content, editItem: labels.editPost || 'ویرایش نوشته', editItemTitle: labels.editPostTitle || 'ویرایش نوشته فرصت', close: labels.close || 'بستن', itemTitle: labels.postTitle || 'عنوان نوشته', itemDescription: labels.postDescription || 'خلاصه نوشته', itemAction: labels.postAction || 'متن دکمه', itemLink: labels.postLink || 'پیوند نوشته', cancel: labels.cancel || 'انصراف', save: labels.save || 'ذخیره', categoryOptions }
  const requestRemove = async (card) => {
    const confirmed = await window.cmsConfirmDelete?.({ title: labels.deletePost || 'حذف نوشته', description: labels.deletePostDescription || 'آیا از حذف این نوشته مطمئن هستید؟' })
    if (confirmed) removePost(card)
  }
  return <PageContainer><PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.groups?.[0]?.label || content.overview }, { label }]} action={<EditorPreviewLink>{content.topbar.visitPage}</EditorPreviewLink>} />
    <section className={isServices ? 'overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)]' : 'overflow-visible bg-transparent'}><div className={`grid gap-1 border-b border-admin-border bg-admin-control-soft p-1 md:grid-cols-[minmax(12rem,1fr)_minmax(12rem,.7fr)_minmax(14rem,.8fr)] ${isServices ? 'rounded-t-2xl' : 'mb-3 rounded-2xl border border-admin-border shadow-[0_12px_34px_rgb(15_23_42_/.055)]'}`}>
<button type="button" onClick={() => setEditing({ id: `new-${Date.now()}`, title: '', description: '', action: '', href: '', image: '' })} className="box-border flex h-9 min-h-0 w-full items-center justify-center gap-1.5 rounded-xl border border-admin-brand bg-admin-brand px-3 text-xs font-semibold text-white transition hover:bg-orange-500 md:w-fit md:justify-self-start md:px-4">
<Plus size={14} />{isServices ? content.createService : isTourism ? labels.createDestination : labels.createOpportunity}</button>
<StatusSelect value={status} onChange={setStatus} labels={labels} compact />
<label className="flex h-9 min-w-0 items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3 text-admin-muted focus-within:border-admin-brand">
<Search size={15} />
<input className="search-field min-w-0 flex-1 bg-transparent text-xs text-admin-heading outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.search || 'جستجوی نوشته‌ها...'} />
</label>
</div>
    {!isServices && <SectionTabBar sections={typeSections} icons={isTourism ? tourismTabIcons : opportunityTabIcons} selectedSection={activeType} onSelect={setActiveType} ariaLabel={typeLabels.typeLabel || label} />}
    <section className={`hidden lg:block ${isServices ? '' : 'overflow-hidden rounded-b-2xl border border-t-0 border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)]'}`}>
<table className="w-full table-fixed border-collapse text-right">
<thead className="border-b border-admin-border bg-admin-control-soft text-[.65rem] font-semibold text-admin-muted">
<tr>
<th className={`${isServices ? '' : 'w-[48%]'} px-4 py-2`}>{labels.postTitle || 'نوشته'}</th>
{!isServices && <th className="px-4 py-2">{labels.postCategory || 'دسته‌بندی'}</th>}
<th className="w-32 pe-5 py-2 ps-4 text-right"><span className="inline-block translate-x-6">{labels.pageStatus || 'وضعیت'}</span></th>
<th className="w-36 ps-5 py-2 pe-4 text-right">{labels.actions || 'عملیات'}</th>
</tr>
</thead>
<tbody>{filteredCards.map((card) => <tr className="cursor-pointer border-t border-admin-border transition hover:bg-admin-control-soft" key={card.id} tabIndex="0" role="button" onClick={() => setViewing(card)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setViewing(card) } }}>
<td className="pe-5 p-4 text-right">
<div className="flex items-center gap-3">
<img className="size-14 rounded-xl bg-(--editor-field) object-cover" src={card.image} alt="" />
<div className="min-w-0">
<strong className="block truncate text-sm text-admin-heading">{card.title}</strong>
</div>
</div>
</td>
{!isServices && <td className="p-4 text-xs text-admin-muted">{card.category || label}</td>}
<td className="w-32 pe-5 p-4 text-right" onClick={(event) => event.stopPropagation()}>
<span className="inline-block translate-x-6"><ServiceStatusBadge card={card} labels={labels} onToggle={() => toggleStatus(card)} /></span>
</td>
<td className="ps-5 p-4 text-right" onClick={(event) => event.stopPropagation()}>
<div className="flex justify-end gap-1">
<a className="grid size-9 place-items-center rounded-xl border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" href={card.href} target="_blank" rel="noreferrer" aria-label={labels.preview || 'پیش‌نمایش'}>
<ExternalLink size={16} />
</a>
<button type="button" className="grid size-9 place-items-center rounded-xl border border-admin-border text-admin-brand-text transition hover:border-admin-brand hover:bg-admin-brand-soft" onClick={() => setEditing(card)} aria-label={labels.editPost || 'ویرایش'}>
<Pencil size={16} />
</button>
<button type="button" className="grid size-9 place-items-center rounded-xl border border-red-500/25 text-red-500 transition hover:border-red-500 hover:bg-red-500/10" onClick={() => requestRemove(card)} aria-label={labels.deletePost || 'حذف'}>
<Trash2 size={16} />
</button>
</div>
</td>
</tr>)}</tbody>
</table>
</section></section>
<section className="-mt-5 grid w-full min-w-0 max-w-full gap-3 lg:hidden md:grid-cols-2 min-[701px]:-mt-[1.65rem]">{filteredCards.map((card) => <article className="relative grid min-h-32 min-w-0 cursor-pointer grid-cols-[5rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-admin-border bg-admin-card p-3 shadow-[0_8px_24px_rgb(15_23_42_/.05)] transition hover:bg-admin-control-soft" key={card.id} tabIndex="0" role="button" onClick={() => setViewing(card)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setViewing(card) } }}>
<img className="h-20 w-20 justify-self-center rounded-xl bg-(--editor-field) object-cover" src={card.image} alt="" />
    <div className="min-w-0 pe-12 text-start">
<strong className="block truncate text-sm text-admin-heading">{card.title}</strong>
<ServiceStatusBadge card={card} labels={labels} onToggle={() => toggleStatus(card)} />
    <div className="absolute end-3 top-1/2 flex -translate-y-1/2 flex-col gap-1" onClick={(event) => event.stopPropagation()}>
<a className="grid size-8 place-items-center rounded-xl border border-admin-border text-admin-muted hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" href={card.href} target="_blank" rel="noreferrer" aria-label={labels.preview || 'پیش‌نمایش'}>
<ExternalLink size={15} />
</a>
<button type="button" className="grid size-8 place-items-center rounded-xl border border-admin-border text-admin-brand-text hover:border-admin-brand hover:bg-admin-brand-soft" onClick={() => setEditing(card)} aria-label={labels.editPost || 'ویرایش'}>
<Pencil size={15} />
</button>
<button type="button" className="grid size-8 place-items-center rounded-xl border border-red-500/25 text-red-500 hover:border-red-500 hover:bg-red-500/10" onClick={() => requestRemove(card)} aria-label={labels.deletePost || 'حذف'}>
<Trash2 size={15} />
</button>
</div>
</div>
</article>)}</section>
    {!filteredCards.length && <div className="grid min-h-44 place-items-center rounded-2xl border border-admin-border bg-admin-card text-sm text-admin-muted">{labels.empty || 'نوشته‌ای پیدا نشد.'}</div>}
    {viewing && <OpportunityPostPreviewModal post={viewing} content={modalContent} onClose={() => setViewing(null)} onDelete={() => { removePost(viewing); setViewing(null) }} onEdit={() => { setViewing(null); setEditing(viewing) }} />}
    {editing && <OpportunityPostModal post={editing} content={modalContent} isServices={isServices} onClose={() => setEditing(null)} onSave={(savedPost) => { savePost(savedPost, activeType); setEditing(null) }} />}
  </PageContainer>
}

function StatusSelect({ value, onChange, labels, compact = false }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const options = [{ value: 'all', label: labels.allPosts || 'همه نوشته‌ها' }, { value: 'published', label: labels.published || 'منتشرشده' }, { value: 'draft', label: labels.draft || 'پیش‌نویس' }]
  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])
  const selected = options.find((option) => option.value === value) || options[0]
  return <div ref={root} className="relative min-w-0"><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`flex w-full items-center gap-2 rounded-xl border bg-(--editor-input) px-3 text-sm text-admin-heading outline-none transition-colors ${compact ? 'h-9' : 'h-11'} ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span className="min-w-0 flex-1 truncate text-right">{selected.label}</span><ChevronDown size={16} className={`shrink-0 text-admin-muted transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} inert={!open} className={`absolute inset-x-0 top-[calc(100%+.45rem)] z-40 grid gap-1 rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all duration-200 ease-out motion-reduce:transition-none ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }} className={`flex min-h-10 items-center justify-between rounded-lg px-3 text-right text-xs font-semibold transition-colors ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand-text'}`}><span>{option.label}</span>{option.value === value && <Check size={15} />}</button>)}</div></div>
}

function ServiceStatusBadge({ card, labels, onToggle }) {
  const isDraft = card.status === 'draft'
  return <button type="button" onClick={(event) => { event.stopPropagation(); onToggle(); event.currentTarget.dispatchEvent(new Event('input', { bubbles: true })) }} className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[.65rem] font-semibold transition lg:mt-0 ${isDraft ? 'bg-admin-brand-soft text-admin-brand-text hover:bg-admin-brand/20' : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300'}`}>{isDraft ? (labels.draft || 'پیش‌نویس') : (labels.published || 'منتشرشده')}</button>
}

function FeaturedToggle({ label, checked, onChange, full = true }) {
  return <div className={`flex items-center justify-between gap-3 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-4 text-xs font-semibold text-admin-heading ${full ? 'min-h-12 sm:col-span-2' : 'h-11 min-h-11 self-end'}`}><span>{label}</span><button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200 ease-out ${checked ? 'border-admin-brand bg-admin-brand' : 'border-admin-border bg-[var(--admin-toggle-off)]'}`}><span aria-hidden="true" className={`absolute top-1/2 start-1 size-3 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none ${checked ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`} /></button></div>
}

function OpportunityPostPreviewModal({ post, content, onClose, onDelete, onEdit }) {
  const interfaceLanguage = currentCmsLanguage()
  const [closing, setClosing] = useState(false)
  const [contentLanguage, setContentLanguage] = useState(interfaceLanguage)
  const close = () => { if (closing) return; setClosing(true); window.setTimeout(onClose, 200) }
  const dialogRef = useModalFocus({ onClose: close })
  const translation = post.translations?.[contentLanguage] || {
    title: post.title || '',
    excerpt: post.description || post.excerpt || '',
    content: post.content || '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    seoTitle: post.seoTitle || post.title || '',
    metaDescription: post.metaDescription || post.description || '',
    imageAlt: post.imageAlt || '',
  }
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.classList.add('cms-modal-open')
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
      document.documentElement.classList.remove('cms-modal-open')
    }
  }, [])
  const requestDelete = async () => {
    const confirmed = await window.cmsConfirmDelete?.({ title: content.deletePost || 'حذف نوشته', description: content.deletePostDescription || 'آیا از حذف این نوشته مطمئن هستید؟' })
    if (confirmed) onDelete()
  }
  return <div className={`cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center p-4 ${closing ? 'animate-cms-modal-backdrop-out' : 'animate-cms-modal-backdrop-in'}`} onMouseDown={close}>
    <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="post-preview-title" className={`relative z-10 flex max-h-[calc(100svh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-page shadow-2xl ${closing ? 'animate-cms-modal-panel-out' : 'animate-cms-modal-panel-in'}`} onMouseDown={(event) => event.stopPropagation()}>
      <ContentLanguageTabs value={contentLanguage} onChange={setContentLanguage} />
      <header className="flex items-center justify-between gap-3 border-b border-admin-border bg-admin-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2" dir="ltr">
          <button type="button" onClick={onEdit} className="grid size-9 place-items-center rounded-lg border border-admin-border text-admin-brand-text transition hover:border-admin-brand hover:bg-admin-brand-soft" aria-label={content.editPost || 'ویرایش'}><Pencil size={16} /></button>
          <button type="button" onClick={requestDelete} className="grid size-9 place-items-center rounded-lg border border-red-500/25 text-red-500 transition hover:border-red-500 hover:bg-red-500/10" aria-label={content.deletePost || 'حذف'}><Trash2 size={16} /></button>
        </div>
        <div className="min-w-0 text-right" dir={contentLanguage === 'en' ? 'ltr' : 'rtl'}><h2 id="post-preview-title" className="truncate font-heading text-lg text-admin-heading sm:text-xl">{translation.title || content.postTitle || 'نوشته'}</h2></div>
        <button type="button" onClick={close} className="grid size-9 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" aria-label={content.close || 'بستن'}><X size={17} /></button>
      </header>
      <ContentLanguageTabs mobile value={contentLanguage} onChange={setContentLanguage} />
      <div className="grid gap-5 overflow-y-auto p-4 sm:p-6 md:pr-16" dir={contentLanguage === 'en' ? 'ltr' : 'rtl'}>
        <article className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-surface text-foreground shadow-sm dark:border-gray-700 dark:bg-[#2b3442]">
          {post.image && <div className="relative aspect-[16/8] overflow-hidden md:aspect-[16/5]"><img src={post.image} alt={translation.imageAlt || translation.title} className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" aria-hidden="true" /><div className="absolute inset-x-5 bottom-5 text-start text-white md:inset-x-10 md:bottom-10"><h1 className="mt-4 w-full font-heading text-2xl font-extrabold leading-tight md:text-4xl">{translation.title}</h1></div></div>}
          <div className="grid gap-6 p-4 sm:p-6 lg:p-8"><main className="min-w-0 text-start"><p className="text-lg font-medium leading-9 text-foreground-muted">{translation.excerpt}</p><SafeRichText className="gv-public-post-content mt-8 text-base leading-8 text-foreground-muted [&_a]:font-semibold [&_a]:text-accent-text [&_a]:underline [&_figure]:my-6 [&_figure]:overflow-hidden [&_figure]:rounded-2xl [&_figure]:border [&_figure]:border-border [&_figure]:bg-surface [&_figure]:p-2 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_img]:max-h-[32rem] [&_img]:w-full [&_img]:rounded-xl [&_img]:object-contain [&_li]:mb-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6" html={translation.content || `<p>${translation.excerpt || ''}</p>`} /></main></div>
        </article>
      </div>
    </section>
  </div>
}

function OpportunityPostModal({ post, content, isServices = false, onClose, onSave }) {
  const isNew = String(post.id ?? '').startsWith('new-')
  const interfaceLanguage = currentCmsLanguage()
  const [closing, setClosing] = useState(false)
  const [contentLanguage, setContentLanguage] = useState(interfaceLanguage)
  const close = () => { if (closing) return; setClosing(true); window.setTimeout(onClose, 200) }
  const dialogRef = useModalFocus({ onClose: close })
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.classList.add('cms-modal-open')
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
      document.documentElement.classList.remove('cms-modal-open')
    }
  }, [])
  const [form, setForm] = useState(() => {
    const fallbackTranslation = { title: post.title || '', excerpt: post.description || post.excerpt || '', content: post.content || '', tags: Array.isArray(post.tags) ? post.tags : [], seoTitle: post.seoTitle || post.title || '', metaDescription: post.metaDescription || post.description || '', imageAlt: post.imageAlt || '' }
    const translations = Object.fromEntries(contentLanguages.map(({ id }) => {
      const stored = post.translations?.[id]
      const source = stored || (id === interfaceLanguage ? fallbackTranslation : emptyPostTranslation())
      return [id, { ...emptyPostTranslation(), ...source, tags: Array.isArray(source.tags) ? source.tags : [] }]
    }))
    return { slug: post.slug || '', category: post.category || '', href: post.href || '', image: post.image || '', status: post.status || 'draft', featured: post.featured || false, publishDate: post.publishDate || new Date().toISOString().slice(0, 10), author: 'گلوبل ویژن', translations }
  })
  const translation = form.translations[contentLanguage]
  const [tagDraft, setTagDraft] = useState('')
  const selectContentLanguage = (language) => { setTagDraft(''); setContentLanguage(language) }
  const addTag = () => { const tag = tagDraft.trim(); if (!tag || translation.tags.includes(tag)) { setTagDraft(''); return }; updateTranslation('tags', [...translation.tags, tag]); setTagDraft('') }
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const updateTranslation = (key, value) => setForm((current) => ({ ...current, translations: { ...current.translations, [contentLanguage]: { ...current.translations[contentLanguage], [key]: value } } }))
  const submit = (event) => { event.preventDefault(); const displayTranslation = form.translations[interfaceLanguage]; const slugTitle = form.translations.prs.title || form.translations.en.title || form.translations.ps.title; const slug = form.slug || slugTitle.toLocaleLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, ''); const savedPost = { ...post, ...form, ...displayTranslation, slug, description: displayTranslation.excerpt, author: 'گلوبل ویژن' }; setClosing(true); window.setTimeout(() => onSave(savedPost), 200) }
  return <div className={`cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center p-4 ${closing ? 'animate-cms-modal-backdrop-out' : 'animate-cms-modal-backdrop-in'}`} onMouseDown={close}><form ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="opportunity-editor-title" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()} className={`relative z-10 flex max-h-[calc(100svh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-page shadow-2xl ${closing ? 'animate-cms-modal-panel-out' : 'animate-cms-modal-panel-in'}`}>
    <ContentLanguageTabs value={contentLanguage} onChange={selectContentLanguage} />
    <header className="flex items-center justify-between gap-4 border-b border-admin-border bg-admin-card px-5 py-2 sm:px-6"><h2 id="opportunity-editor-title" className="font-heading text-xl leading-tight text-admin-heading">{isNew ? (content.createPost || 'ایجاد فرصت جدید') : translation.title}</h2><button type="button" className="grid size-8 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" onClick={close} aria-label={content.close || 'بستن'}><X size={16} /></button></header>
    <ContentLanguageTabs mobile value={contentLanguage} onChange={selectContentLanguage} />
    <div className="grid gap-5 overflow-y-auto p-4 sm:p-6 md:pr-16" dir={contentLanguage === 'en' ? 'ltr' : 'rtl'}>
<section className="grid gap-5 rounded-2xl border border-admin-border bg-admin-card p-4 sm:grid-cols-2 sm:p-5">
<Field label={content.postTitle || 'عنوان نوشته'} value={translation.title} onChange={(value) => updateTranslation('title', value)} full={isServices} />
{!isServices && <ModalSelect label={content.postCategory || 'دسته‌بندی'} value={form.category} onChange={(value) => update('category', value)} options={[{ value: '', label: content.noCategory || 'بدون دسته‌بندی' }]} />}
<ModalSelect label={content.postStatus || 'وضعیت'} value={form.status} onChange={(value) => update('status', value)} options={[{ value: 'draft', label: content.draft || 'پیش‌نویس' }, { value: 'published', label: content.published || 'منتشرشده' }]} />
<FeaturedToggle label={content.featuredPost || 'نوشته ویژه'} checked={form.featured} onChange={(value) => update('featured', value)} full={false} />
<Field label={content.postDescription || 'خلاصه نوشته'} value={translation.excerpt} onChange={(value) => updateTranslation('excerpt', value)} full />
</section>
<section className="grid gap-4 rounded-2xl border border-admin-border bg-admin-card p-4 sm:p-5">
<h3 className="text-sm text-admin-heading">{content.tags || 'برچسب‌ها'}</h3>
<div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3 py-2 focus-within:border-admin-brand">{translation.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-admin-brand-soft px-2.5 py-1 text-xs font-medium text-admin-brand-text">
<span>{tag}</span>
<button type="button" className="grid size-4 place-items-center rounded-full text-current hover:bg-admin-brand hover:text-white" aria-label={`حذف ${tag}`} onClick={() => updateTranslation('tags', translation.tags.filter((currentTag) => currentTag !== tag))}>
<X size={12} />
</button>
</span>)}<input className="min-w-32 flex-1 border-0 bg-transparent px-1 py-1 text-sm font-normal text-admin-heading outline-none" value={tagDraft} placeholder={content.tagsPlaceholder || 'برچسب را بنویسید و Enter بزنید'} onChange={(event) => setTagDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ',' || event.key === '،') { event.preventDefault(); addTag() } else if (event.key === 'Backspace' && !tagDraft && translation.tags.length) updateTranslation('tags', translation.tags.slice(0, -1)) }} />
</div>
</section>
<section className="grid gap-4 rounded-2xl border border-admin-border bg-admin-card p-4 sm:p-5">
<h3 className="text-sm text-admin-heading">{content.postContent || 'محتوای نوشته'}</h3>
<RichTextEditor key={contentLanguage} language={contentLanguage} value={translation.content} onChange={(value) => updateTranslation('content', value)} />
</section>
<div className="grid gap-5 lg:grid-cols-2">
<section className="grid gap-5 rounded-2xl border border-admin-border bg-admin-card p-4 sm:p-5">
<MediaUploadField fill content={{ countryImage: content.postImage || 'تصویر اصلی', choose: content.chooseImage || 'انتخاب تصویر', drop: content.dropImage || 'تصویر را بکشید و رها کنید', replace: content.replaceImage || 'جایگزین کردن', remove: content.removeImage || 'حذف' }} value={form.image} onChange={(value) => update('image', value)} />
</section>
<section className="grid gap-5 rounded-2xl border border-admin-border bg-admin-card p-4 sm:grid-cols-2 sm:p-5">
<h3 className="text-sm text-admin-heading sm:col-span-2">{content.seo || 'تنظیمات موتور جستجو'}</h3>
<Field label={content.imageAlt || 'متن جایگزین تصویر'} value={translation.imageAlt} onChange={(value) => updateTranslation('imageAlt', value)} />
<SeoFields language={contentLanguage} value={translation} slug={form.slug} onSlugChange={(value) => update('slug', value)} onChange={updateTranslation} />
</section>
</div>
</div>
    <footer className="flex justify-end gap-2 border-t border-admin-border bg-admin-card px-4 py-2 sm:px-6"><button type="button" onClick={close} className="min-h-8 rounded-xl border border-admin-border px-4 text-xs font-semibold text-admin-muted hover:border-admin-brand hover:text-admin-brand-text">{content.cancel || 'انصراف'}</button><button type="submit" className="min-h-8 rounded-xl bg-admin-brand px-5 text-xs font-semibold text-white hover:bg-orange-500">{content.save || 'ذخیره تغییرات'}</button></footer>
  </form></div>
}

function Field({ label, value, onChange, full = false, dir, type = 'text' }) {
  return <label className={`text-xs font-semibold text-admin-heading ${full ? 'sm:col-span-2' : ''}`}><span>{label}</span><input dir={dir} type={type} className="mt-2 min-h-11 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 py-2.5 text-sm font-normal text-admin-heading outline-none focus:border-admin-brand" value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

function ModalSelect({ label, value, onChange, options }) {
  const resolvedOptions = label.includes('دسته') && options.length === 1 ? [...options, { value: 'تحصیل', label: 'تحصیل' }, { value: 'مهاجرت', label: 'مهاجرت' }, { value: 'کار', label: 'کار' }, { value: 'امتحانات', label: 'امتحانات' }, { value: 'کشورها', label: 'کشورها' }] : options
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  useEffect(() => { const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }; document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close) }, [])
  const selected = resolvedOptions.find((option) => option.value === value) || resolvedOptions[0]
  return <label ref={root} className="relative block text-xs font-semibold text-admin-heading"><span>{label}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`mt-2 flex min-h-11 w-full items-center gap-2 rounded-xl border bg-(--editor-input) px-3.5 text-sm font-normal text-admin-heading outline-none transition ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span className="min-w-0 flex-1 truncate text-right">{selected?.label}</span><ChevronDown size={16} className={`text-admin-muted transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} /></button><span role="listbox" aria-hidden={!open} inert={!open} className={`absolute inset-x-0 top-full z-50 mt-2 grid gap-1 rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all duration-200 ease-out motion-reduce:transition-none ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{resolvedOptions.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }} className={`flex min-h-10 items-center justify-between rounded-lg px-3 text-right text-xs font-semibold transition ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand-text'}`}><span>{option.label}</span>{option.value === value && <Check size={15} />}</button>)}</span></label>
}

export default OpportunitiesPage
