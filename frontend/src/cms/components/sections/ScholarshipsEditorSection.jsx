import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, ExternalLink, GraduationCap, LayoutTemplate, Pencil, Plus, RotateCcw, Search, SlidersHorizontal, Trash2, X } from 'lucide-react'

import MediaUploadField from '@cms/components/MediaUploadField.jsx'
import RichTextEditor from '@cms/components/RichTextEditor.jsx'
import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import SectionTabBar from '@cms/components/SectionTabBar.jsx'
import ContentLanguageSwitcher from '@cms/components/ContentLanguageSwitcher.jsx'
import FilterModal from '@cms/components/FilterModal.jsx'
import { EditorField, EditorFieldGroup, EditorPreviewLink, EditorSectionHeader, EditorVisibilityToggle } from '@cms/components/EditorPrimitives.jsx'
import useEditorTabs from '@cms/hooks/useEditorTabs.js'
import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import useModalFocus from '@/shared/hooks/useModalFocus.js'
import SeoFields from '@cms/components/SeoFields.jsx'
import SafeRichText from '@/shared/components/SafeRichText.jsx'

const sectionIcons = { hero: LayoutTemplate, scholarships: GraduationCap }

function ScholarshipsEditorSection({ content, initialTranslations }) {
  const [selectedSection, setSelectedSection] = useEditorTabs({ defaultTab: 'hero', storageKey: 'globalvision-cms-scholarships-tab', tabs: Object.keys(sectionIcons) })
  const [contentLanguage, setContentLanguage] = useState(() => ['prs', 'ps', 'en'].includes(document.documentElement.lang) ? document.documentElement.lang : 'prs')
  const commitDrafts = useCallback((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, items: languageDraft.items.map((item) => { const next = { ...item }; delete next.savedStatus; return next }) }])), [])
  const [drafts, setDrafts] = useCmsDraftState('scholarships', () => structuredClone(initialTranslations), { commit: commitDrafts })
  const draft = drafts[contentLanguage]
  const setDraft = (update) => setDrafts((current) => ({ ...current, [contentLanguage]: typeof update === 'function' ? update(current[contentLanguage]) : update }))
  const [editing, setEditing] = useState(null)
  const [visibility, setVisibility] = useState(() => Object.fromEntries(Object.keys(sectionIcons).map((key) => [key, true])))
  const updateHero = (key, value) => setDraft((current) => ({ ...current, hero: { ...current.hero, [key]: value } }))
  const saveItemTranslations = (localizedItems) => setDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, items: editing.index === null ? [...languageDraft.items, localizedItems[language]] : languageDraft.items.map((entry, index) => index === editing.index ? localizedItems[language] : entry) }])))
  const deleteItem = async (index) => {
    const confirmed = await window.cmsConfirmDelete?.({ title: content.deleteTitle, description: content.deleteDescription })
    if (confirmed) setDraft((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }))
    return Boolean(confirmed)
  }

  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} action={<EditorPreviewLink href="/scholarships">{content.visitPage}</EditorPreviewLink>} />
    <section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <SectionTabBar sections={content.sections} icons={sectionIcons} selectedSection={selectedSection} onSelect={setSelectedSection} ariaLabel={content.sectionsTitle} />
      <EditorSectionHeader icon={sectionIcons[selectedSection]} title={content.sections[selectedSection].label} action={<div className="grid w-full grid-cols-2 items-center justify-items-stretch gap-2 sm:flex sm:w-auto sm:flex-nowrap sm:justify-start">{selectedSection === 'scholarships' && <button type="button" onClick={() => setEditing({ index: null, item: null })} className="order-3 col-span-2 box-border inline-flex h-[35px] min-h-[35px] max-h-[35px] w-full shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-admin-brand bg-admin-brand px-3 py-0 text-[.6875rem] leading-none font-semibold text-white transition hover:bg-orange-500 sm:order-none sm:col-span-1 sm:w-auto sm:min-w-32"><Plus size={14} />{content.add}</button>}<EditorVisibilityToggle label={content.visible || 'نمایش داده شود'} checked={visibility[selectedSection]} onChange={() => setVisibility((current) => ({ ...current, [selectedSection]: !current[selectedSection] }))} /><ContentLanguageSwitcher label={content.language || 'زبان محتوا'} value={contentLanguage} onChange={setContentLanguage} /></div>} />
      <div className="grid gap-6 p-5 sm:p-6">
        {selectedSection === 'hero' && <EditorField label={content.fields.heroEyebrow} value={draft.hero.eyebrow} onChange={(value) => updateHero('eyebrow', value)} />}
        {selectedSection === 'scholarships' && <ScholarshipList items={draft.items} options={draft.options} content={content} onEdit={(index) => setEditing({ index, item: draft.items[index] })} onDelete={deleteItem} onToggleStatus={(index) => setDraft((current) => ({ ...current, items: current.items.map((entry, itemIndex) => itemIndex === index ? { ...entry, status: entry.status === 'draft' ? 'published' : 'draft', savedStatus: entry.savedStatus ?? entry.status } : entry) }))} />}
      </div>
    </section>
    {editing && <ScholarshipModal content={content} initialLanguage={contentLanguage} initialTranslations={Object.fromEntries(Object.entries(drafts).map(([language, languageDraft]) => [language, editing.index === null ? null : languageDraft.items[editing.index] || null]))} optionsByLanguage={Object.fromEntries(Object.entries(drafts).map(([language, languageDraft]) => [language, languageDraft.options]))} onClose={() => setEditing(null)} onSave={(localizedItems) => { saveItemTranslations(localizedItems); setEditing(null) }} />}
  </PageContainer>
}

function ScholarshipList({ items, options, content, onEdit, onDelete, onToggleStatus }) {
  const isEnglish = document.documentElement.lang === 'en' || window.sessionStorage.getItem('globalvision-language') === 'en'
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [country, setCountry] = useState('all')
  const [degree, setDegree] = useState('all')
  const [funding, setFunding] = useState('all')
  const [deadline, setDeadline] = useState('all')
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [viewing, setViewing] = useState(null)
  const filteredItems = items.filter((item) => { const filterStatus = item.savedStatus ?? item.status; return (status === 'all' || (status === 'published' ? filterStatus !== 'draft' : filterStatus === 'draft')) && (country === 'all' || item.country === country) && (degree === 'all' || item.degree === degree) && (funding === 'all' || item.funding === funding) && (deadline === 'all' || item.deadlineFilter === deadline) && `${item.title} ${item.provider} ${item.country} ${item.degree}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) })
  const resetFilters = () => { setQuery(''); setStatus('all'); setCountry('all'); setDegree('all'); setFunding('all'); setDeadline('all') }
  const resetScholarshipFilters = () => { setCountry('all'); setDegree('all'); setFunding('all'); setDeadline('all') }
  const scholarshipFilterControls = <>
<FilterSelect value={country} onChange={setCountry} label={content.filters.country} options={options.countries} allLabel={content.filters.all} />
<FilterSelect value={degree} onChange={setDegree} label={content.filters.degree} options={options.degrees} allLabel={content.filters.all} />
<FilterSelect value={funding} onChange={setFunding} label={content.filters.funding} options={options.funding} allLabel={content.filters.all} />
<FilterSelect value={deadline} onChange={setDeadline} label={content.filters.deadline} options={options.deadlines} allLabel={content.filters.all} />
</>
  const filterControls = <>
<label className="flex h-9 min-w-0 items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3 text-admin-muted focus-within:border-admin-brand md:col-span-2 md:row-start-2 md:mt-[1.1rem] xl:col-span-4">
<Search size={15} />
<input className="search-field min-w-0 flex-1 bg-transparent text-xs text-admin-heading outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={content.search} />
</label>
<StatusSelect value={status} onChange={setStatus} content={content} className="md:col-span-2 md:row-start-3 xl:col-span-1 xl:row-start-2" />
<button type="button" onClick={resetFilters} aria-label={content.reset} title={content.reset} className="inline-flex h-[2.25rem] min-h-0 box-border items-center justify-center gap-1.5 rounded-xl border border-admin-border leading-none bg-admin-brand-soft px-3 text-xs font-semibold text-admin-muted transition hover:border-admin-brand dark:bg-admin-control hover:bg-admin-brand-soft hover:text-admin-brand-text md:self-end xl:col-start-5 xl:row-start-1 xl:mt-[1.25rem]">
<RotateCcw size={14} />{content.reset}</button>
{scholarshipFilterControls}
</>
  const mobileFilterBar = <div className="grid grid-cols-2 items-end gap-2 lg:hidden">
<StatusSelect value={status} onChange={setStatus} content={content} />
<button type="button" onClick={() => setFilterModalOpen(true)} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-admin-border bg-admin-control px-3 text-xs font-semibold text-admin-heading transition hover:border-admin-brand hover:text-admin-brand-text"><SlidersHorizontal size={15} />{content.filters.title || 'فیلترها'}</button>
<label className="col-span-2 flex h-9 min-w-0 items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3 text-admin-muted focus-within:border-admin-brand">
<Search size={15} />
<input className="search-field min-w-0 flex-1 bg-transparent text-xs text-admin-heading outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={content.search} />
</label>
</div>
  return <div className="grid gap-4">
{mobileFilterBar}
<FilterModal open={filterModalOpen} onClose={() => setFilterModalOpen(false)} title={content.filters.title || 'فیلترها'}><div className="grid gap-3 [&>*]:!col-auto [&>*]:!row-auto [&>*]:!mt-0">{scholarshipFilterControls}<button type="button" onClick={resetScholarshipFilters} aria-label={content.reset} title={content.reset} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-admin-border bg-admin-brand-soft px-3 text-xs font-semibold text-admin-muted transition hover:border-admin-brand hover:text-admin-brand-text"><RotateCcw size={14} />{content.reset}</button></div></FilterModal>
<section className="hidden gap-2 rounded-2xl border border-admin-border bg-admin-card p-2 lg:grid lg:grid-cols-2 xl:grid-cols-5">
{filterControls}
</section>
<section className="hidden overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)] lg:block">
<table className="w-full table-fixed border-collapse text-right">
<thead className="bg-(--editor-field) text-[.65rem] font-semibold text-admin-muted">
<tr>
<th className="w-[45%] p-4">{content.fields.itemTitle}</th>
<th className="p-4">{content.fields.country}</th>
<th className="p-4">{content.fields.degree}</th>
<th className="p-4">{content.status}</th>
<th className="w-36 p-4">{content.actions}</th>
</tr>
</thead>
<tbody>{filteredItems.map((item) => { const index = items.indexOf(item); const statusLabel = item.status === 'draft' ? content.draft : content.published; const statusTone = item.status === 'draft' ? 'bg-admin-brand-soft text-admin-brand-text hover:bg-admin-brand/20' : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300'; return <tr className="cursor-pointer border-t border-admin-border transition hover:bg-admin-control-soft" key={item.slug} tabIndex="0" role="button" onClick={() => setViewing({ item, index })} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setViewing({ item, index }) } }}>
<td className="p-4">
<div className="flex items-center gap-3">
<img className="size-14 rounded-xl bg-(--editor-field) object-cover" src={item.image} alt="" />
<div className="min-w-0">
<strong className={`block truncate text-sm text-admin-heading ${isEnglish ? '!font-normal' : ''}`}>{item.title}</strong>
</div>
</div>
</td>
<td className="p-4 text-xs text-admin-muted">{item.country}</td>
<td className="p-4 text-xs text-admin-muted">{item.degree}</td>
<td className="p-4" onClick={(event) => event.stopPropagation()}>
<button type="button" onClick={(event) => { onToggleStatus(index); event.currentTarget.dispatchEvent(new Event('input', { bubbles: true })) }} className={`rounded-full px-2.5 py-1 text-[.65rem] font-semibold transition ${statusTone}`}>{statusLabel}</button>
</td>
<td className="p-4" onClick={(event) => event.stopPropagation()}>
<div className="flex gap-1">
<a className="grid size-9 place-items-center rounded-xl border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" href={item.officialHref} target="_blank" rel="noreferrer" aria-label={content.preview}>
<ExternalLink size={16} />
</a>
<button type="button" onClick={() => onEdit(index)} aria-label={content.edit} className="grid size-9 place-items-center rounded-xl border border-admin-border text-admin-brand-text transition hover:border-admin-brand hover:bg-admin-brand-soft">
<Pencil size={16} />
</button>
<button type="button" onClick={() => onDelete(index)} aria-label={content.delete} className="grid size-9 place-items-center rounded-xl border border-red-500/25 text-red-500 transition hover:border-red-500 hover:bg-red-500/10">
<Trash2 size={16} />
</button>
</div>
</td>
</tr> })}</tbody>
</table>
</section>
<section className="grid w-full min-w-0 max-w-full gap-3 md:grid-cols-2 lg:hidden">{filteredItems.map((item) => { const index = items.indexOf(item); const statusLabel = item.status === 'draft' ? content.draft : content.published; const statusTone = item.status === 'draft' ? 'bg-admin-brand-soft text-admin-brand-text hover:bg-admin-brand/20' : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300'; return <article className="grid min-w-0 cursor-pointer grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-2xl border border-admin-border bg-admin-card p-3 shadow-[0_8px_24px_rgb(15_23_42_/.05)] transition hover:bg-admin-control-soft" key={item.slug} tabIndex="0" role="button" onClick={() => setViewing({ item, index })} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setViewing({ item, index }) } }}>
<img className="h-20 w-20 rounded-xl bg-(--editor-field) object-cover" src={item.image} alt="" />
<div className="min-w-0">
<strong className={`block truncate text-sm text-admin-heading ${isEnglish ? '!font-normal' : ''}`}>{item.title}</strong>
<span className="mt-1 block truncate text-xs text-admin-muted">{item.country} · {item.degree}</span>
<button type="button" onClick={(event) => { event.stopPropagation(); onToggleStatus(index); event.currentTarget.dispatchEvent(new Event('input', { bubbles: true })) }} className={`mt-2 inline-block rounded-full px-2 py-1 text-[.65rem] font-semibold transition ${statusTone}`}>{statusLabel}</button>
<div className="mt-2 flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
<a className="grid size-8 place-items-center rounded-xl border border-admin-border text-admin-muted hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" href={item.officialHref} target="_blank" rel="noreferrer" aria-label={content.preview}>
<ExternalLink size={15} />
</a>
<button type="button" onClick={() => onEdit(index)} aria-label={content.edit} className="grid size-8 place-items-center rounded-xl border border-admin-border text-admin-brand-text hover:border-admin-brand hover:bg-admin-brand-soft">
<Pencil size={15} />
</button>
<button type="button" onClick={() => onDelete(index)} aria-label={content.delete} className="grid size-8 place-items-center rounded-xl border border-red-500/25 text-red-500 hover:border-red-500 hover:bg-red-500/10">
<Trash2 size={15} />
</button>
</div>
</div>
</article> })}</section>{filteredItems.length === 0 && <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-admin-border text-sm text-admin-muted">{content.empty}</div>}{viewing && <ScholarshipPreviewModal item={viewing.item} content={content} onClose={() => setViewing(null)} onEdit={() => { setViewing(null); onEdit(viewing.index) }} onDelete={async () => { if (await onDelete(viewing.index)) setViewing(null) }} />}</div>
}

function ScholarshipPreviewModal({ item, content, onClose, onEdit, onDelete }) {
  const dialogRef = useModalFocus({ onClose })
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousBodyOverflow; document.removeEventListener('keydown', closeOnEscape) }
  }, [onClose])
  const facts = [[content.fields.provider, item.provider], [content.fields.country, item.country], [content.fields.degree, item.degree], [content.fields.funding, item.funding], [content.fields.deadline, item.deadline]]
  return <div className="cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center p-4" onMouseDown={onClose}>
    <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="scholarship-preview-title" className="relative z-10 flex max-h-[calc(100svh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-page shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
      <header className="flex items-center justify-between gap-3 border-b border-admin-border bg-admin-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2" dir="ltr"><button type="button" onClick={onEdit} className="grid size-9 place-items-center rounded-lg border border-admin-border text-admin-brand-text transition hover:border-admin-brand hover:bg-admin-brand-soft" aria-label={content.edit}><Pencil size={16} /></button><button type="button" onClick={onDelete} className="grid size-9 place-items-center rounded-lg border border-red-500/25 text-red-500 transition hover:border-red-500 hover:bg-red-500/10" aria-label={content.delete}><Trash2 size={16} /></button></div>
        <h2 id="scholarship-preview-title" className="min-w-0 flex-1 truncate text-center font-heading text-lg text-admin-heading sm:text-xl">{item.title}</h2>
        <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:text-admin-brand-text" aria-label={content.close}><X size={17} /></button>
      </header>
      <div className="overflow-y-auto p-4 sm:p-6">
        <article className="mx-auto overflow-hidden rounded-2xl border border-admin-border bg-admin-card">
          {item.image && <div className="relative aspect-[16/7] overflow-hidden"><img src={item.image} alt="" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" /><h3 className="absolute inset-x-5 bottom-5 text-start font-heading text-xl font-extrabold text-white sm:text-2xl">{item.title}</h3></div>}
          <div className="grid gap-5 p-4 sm:p-6"><p className="text-sm leading-7 text-admin-muted">{item.summary}</p><dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{facts.map(([label, value]) => <div key={label} className="rounded-xl border border-admin-border bg-(--editor-field) p-3"><dt className="text-[.65rem] font-semibold text-admin-muted">{label}</dt><dd className="mt-1 text-xs font-bold text-admin-heading">{value}</dd></div>)}</dl>{item.overview && <div><h4 className="mb-2 text-sm font-bold text-admin-heading">{content.fields.overview}</h4><SafeRichText className="gv-public-post-content text-sm leading-7 text-admin-muted" html={item.overview} /></div>}</div>
        </article>
      </div>
    </section>
  </div>
}

function StatusSelect({ value, onChange, content, className = '' }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const options = [{ value: 'all', label: content.all }, { value: 'published', label: content.published }, { value: 'draft', label: content.draft }]
  useEffect(() => { const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }; document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close) }, [])
  const selected = options.find((option) => option.value === value) || options[0]
  return <div ref={root} className={`relative min-w-0 ${className}`}><span className="mb-1 block text-[.625rem] font-semibold text-admin-muted">{content.status}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`flex h-9 w-full items-center gap-2 rounded-xl border bg-(--editor-input) px-3 text-xs text-admin-heading outline-none transition-colors ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span className="min-w-0 flex-1 truncate text-right">{selected.label}</span><ChevronDown size={14} className={`shrink-0 text-admin-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} className={`absolute inset-x-0 top-[calc(100%+1.6rem)] z-40 grid gap-1 rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all duration-200 ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }} className={`flex min-h-9 items-center justify-between rounded-lg px-3 text-right text-xs font-semibold transition-colors ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand-text'}`}><span>{option.label}</span>{option.value === value && <Check size={14} />}</button>)}</div></div>
}

function FilterSelect({ value, onChange, label, options, allLabel }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const choices = [{ value: 'all', label: allLabel }, ...options.map((option) => ({ value: option, label: option }))]
  useEffect(() => { const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }; document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close) }, [])
  const selected = choices.find((option) => option.value === value) || choices[0]
  return <div ref={root} className="relative min-w-0"><span className="mb-1 block text-[.625rem] font-semibold text-admin-muted">{label}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`flex h-9 w-full items-center gap-2 rounded-xl border bg-(--editor-input) px-3 text-xs text-admin-heading outline-none transition-colors ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span className="min-w-0 flex-1 truncate text-right">{selected.label}</span><ChevronDown size={14} className={`shrink-0 text-admin-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} className={`absolute inset-x-0 top-[calc(100%+1.6rem)] z-40 grid max-h-56 gap-1 overflow-y-auto rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all duration-200 ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{choices.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }} className={`flex min-h-9 items-center justify-between rounded-lg px-3 text-right text-xs font-semibold transition-colors ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand-text'}`}><span>{option.label}</span>{option.value === value && <Check size={14} />}</button>)}</div></div>
}

function ScholarshipModal({ content, initialLanguage, initialTranslations, optionsByLanguage, onClose, onSave }) {
  const dialogRef = useModalFocus({ onClose })
  const emptyDraft = { slug: '', title: '', provider: '', country: '', degree: '', funding: '', deadline: '', deadlineFilter: '', status: 'published', featured: false, image: '', summary: '', overview: '', eligibility: [], benefits: [], documents: [], officialHref: '', seoTitle: '', metaDescription: '', socialImage: '', canonicalUrl: '', allowIndexing: true }
  const [contentLanguage, setContentLanguage] = useState(initialLanguage)
  const [popupDrafts, setPopupDrafts] = useState(() => Object.fromEntries(['prs', 'ps', 'en'].map((language) => { const item = initialTranslations[language]; return [language, item ? { ...item, status: item.status === 'draft' ? 'draft' : 'published' } : { ...emptyDraft }] })))
  const draft = popupDrafts[contentLanguage]
  const options = optionsByLanguage[contentLanguage] || {}
  const update = (key, value) => setPopupDrafts((current) => ({ ...current, [contentLanguage]: { ...current[contentLanguage], [key]: value } }))
  const updateShared = (key, value) => setPopupDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, [key]: value }])))
  const save = (event) => { event.preventDefault(); const fallbackTitle = popupDrafts.prs.title || popupDrafts.en.title || popupDrafts.ps.title; const slug = draft.slug || fallbackTitle.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, ''); onSave(Object.fromEntries(Object.entries(popupDrafts).map(([language, languageDraft]) => [language, { ...languageDraft, slug }]))) }
  const isEditing = Object.values(initialTranslations).some(Boolean)
  return <div className="cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center overflow-hidden p-4" onMouseDown={onClose}>
<form ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="scholarship-editor-title" onSubmit={save} onMouseDown={(event) => event.stopPropagation()} className="relative z-10 my-auto flex max-h-[calc(100svh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-page shadow-2xl">
<header className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border bg-admin-card px-5 py-4 sm:px-6">
<h2 id="scholarship-editor-title" className="min-w-0 flex-1 font-heading text-base text-admin-heading sm:text-lg">{isEditing ? content.editTitle : content.addTitle}</h2>
<ContentLanguageSwitcher label={content.language || 'زبان محتوا'} value={contentLanguage} onChange={setContentLanguage} />
<button type="button" onClick={onClose} aria-label={content.close} className="grid size-9 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:text-admin-brand-text">
<X size={17} />
</button>
</header>
<div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6" dir={contentLanguage === 'en' ? 'ltr' : 'rtl'}>
<EditorFieldGroup>
<EditorField label={content.fields.itemTitle} value={draft.title} dir={contentLanguage === 'en' ? 'ltr' : 'rtl'} full onChange={(value) => update('title', value)} />
<ScholarshipSelect label={content.fields.country} value={draft.country} onChange={(value) => update('country', value)} options={options.countries} />
<ScholarshipSelect label={content.fields.degree} value={draft.degree} onChange={(value) => update('degree', value)} options={content.programOptions} />
<ScholarshipSelect label={content.fields.funding} value={draft.funding} onChange={(value) => update('funding', value)} options={options.funding} />
<EditorField label={content.fields.deadline} value={draft.deadline} type="date" onChange={(value) => updateShared('deadline', value)} />
<label className="block min-w-0 text-xs font-semibold text-admin-heading">
<span>{content.fields.status}</span>
<ScholarshipSelect label="" value={draft.status} onChange={(value) => updateShared('status', value)} options={[{ value: 'published', label: content.published }, { value: 'draft', label: content.draft }]} />
</label>
<div className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-admin-heading">{content.fields.overview || 'معلومات کامل بورسیه'}</span><RichTextEditor key={contentLanguage} language={contentLanguage} value={draft.overview || ''} onChange={(value) => update('overview', value)} /></div>
<div className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-4 text-xs font-semibold text-admin-heading sm:col-span-2">
<span>{content.featured}</span>
<button type="button" role="switch" aria-checked={draft.featured} aria-label={content.featured} onClick={() => updateShared('featured', !draft.featured)} className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200 ease-out ${draft.featured ? 'border-admin-brand bg-admin-brand' : 'border-admin-border bg-[var(--admin-toggle-off)]'}`}><span aria-hidden="true" className={`absolute top-1/2 start-1 size-3 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none ${draft.featured ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`} /></button>
</div>
<MediaUploadField value={draft.image} onChange={(image) => updateShared('image', image)} content={{ countryImage: content.fields.image, choose: content.chooseImage, drop: content.dropImage, replace: content.replaceImage, remove: content.removeImage }} />
<section className="grid gap-4 rounded-2xl border border-admin-border bg-admin-control-soft p-4 sm:col-span-2 sm:grid-cols-2"><h3 className="text-sm text-admin-heading sm:col-span-2">SEO</h3><SeoFields language={contentLanguage} value={{ ...draft, excerpt: draft.summary }} slug={draft.slug} onSlugChange={(value) => updateShared('slug', value)} onChange={update} /></section>
</EditorFieldGroup>
</div>
<footer className="flex justify-end gap-2 border-t border-admin-border bg-admin-card p-4 sm:px-6">
<button type="button" onClick={onClose} className="min-h-10 rounded-xl border border-admin-border px-4 text-xs font-semibold text-admin-muted hover:border-admin-brand hover:text-admin-brand-text">{content.cancel}</button>
<button type="submit" className="min-h-10 rounded-xl bg-admin-brand px-5 text-xs font-semibold text-white hover:bg-orange-500">{content.save}</button>
</footer>
</form>
</div>
}

function ScholarshipSelect({ label, value, onChange, options = [] }) {
  const choices = options.map((option) => typeof option === 'string' ? { value: option, label: option } : option)
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  useEffect(() => { const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }; document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close) }, [])
  const selected = choices.find((option) => option.value === value)
  return <div ref={root} className="relative min-w-0">{label && <span className="mb-2 block text-xs font-semibold text-admin-heading">{label}</span>}<button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`flex min-h-11 w-full items-center gap-2 rounded-xl border bg-(--editor-input) px-3.5 text-sm text-admin-heading outline-none transition-colors ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span className="min-w-0 flex-1 truncate text-right">{selected?.label || '—'}</span><ChevronDown size={16} className={`shrink-0 text-admin-muted transition-transform ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} inert={!open} className={`absolute inset-x-0 top-full z-50 mt-2 grid max-h-56 gap-1 overflow-y-auto rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{choices.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }} className={`flex min-h-10 items-center justify-between rounded-lg px-3 text-right text-xs font-semibold transition-colors ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand-text'}`}><span>{option.label}</span>{option.value === value && <Check size={15} />}</button>)}</div></div>
}

export default ScholarshipsEditorSection
