import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, ExternalLink, GraduationCap, LayoutTemplate, Pencil, Plus, RotateCcw, Search, SlidersHorizontal, Trash2, X } from 'lucide-react'

import MediaUploadField from '@cms/components/MediaUploadField.jsx'
import RichTextEditor from '@cms/components/RichTextEditor.jsx'
import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import SectionTabBar from '@cms/components/SectionTabBar.jsx'
import ContentLanguageSwitcher from '@cms/components/ContentLanguageSwitcher.jsx'
import CountryPicker from '@cms/components/CountryPicker.jsx'
import FilterModal from '@cms/components/FilterModal.jsx'
import { EditorField, EditorPreviewLink, EditorSectionHeader, EditorVisibilityToggle } from '@cms/components/EditorPrimitives.jsx'
import useEditorTabs from '@cms/hooks/useEditorTabs.js'
import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import useModalFocus from '@/shared/hooks/useModalFocus.js'
import SeoFields from '@cms/components/SeoFields.jsx'
import RecordActionButtons from '@cms/components/RecordActionButtons.jsx'
import SafeRichText from '@/shared/components/SafeRichText.jsx'
import { showRecordToast } from '@cms/utils/toast.js'
import { deleteLocalizedSnapshotItemWithUndo } from '@cms/utils/undoDelete.js'
import { closeCmsModal } from '@cms/utils/modalTransition.js'
import { useCmsContentLanguage, useCmsInterfaceLanguage } from '@cms/hooks/useCmsLanguage.js'
import { formatScholarshipDeadline } from '@website/utils/scholarshipDate.js'

const sectionIcons = { hero: LayoutTemplate, scholarships: GraduationCap }

function ScholarshipsEditorSection({ content, initialTranslations }) {
  const [selectedSection, setSelectedSection] = useEditorTabs({ defaultTab: 'hero', storageKey: 'globalvision-cms-scholarships-tab', tabs: Object.keys(sectionIcons) })
  const [contentLanguage, setContentLanguage] = useCmsContentLanguage()
  const commitDrafts = useCallback((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, items: languageDraft.items.map((item) => { const next = { ...item }; delete next.savedStatus; return next }) }])), [])
  const [drafts, setDrafts, { saveImmediate }] = useCmsDraftState('scholarships', () => structuredClone(initialTranslations), { commit: commitDrafts })
  const draft = drafts[contentLanguage]
  const setDraft = (update) => setDrafts((current) => ({ ...current, [contentLanguage]: typeof update === 'function' ? update(current[contentLanguage]) : update }))
  const [editing, setEditing] = useState(null)
  const selectedVisible = draft.visibility?.[selectedSection] !== false
  const toggleVisibility = () => setDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, visibility: { ...languageDraft.visibility, [selectedSection]: !selectedVisible } }])))
  const updateHero = (key, value) => setDraft((current) => ({ ...current, hero: { ...current.hero, [key]: value } }))
  const saveItemTranslations = (localizedItems) => saveImmediate((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, items: editing.index === null ? [...languageDraft.items, localizedItems[language]] : languageDraft.items.map((entry, index) => index === editing.index ? localizedItems[language] : entry) }])))
  const deleteItem = async (index) => {
    const confirmed = await window.cmsConfirmDelete?.({ title: content.deleteTitle, description: content.deleteDescription })
    if (confirmed) {
      await deleteLocalizedSnapshotItemWithUndo({ drafts, index, saveImmediate, getItems: (languageDraft) => languageDraft.items, setItems: (languageDraft, items) => ({ ...languageDraft, items }) })
    }
    return Boolean(confirmed)
  }

  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} action={<EditorPreviewLink href="/scholarships">{content.visitPage}</EditorPreviewLink>} />
    <section className={`min-w-0 w-full overflow-visible rounded-2xl border ${selectedSection === 'scholarships' ? 'border-transparent bg-transparent shadow-none lg:border-admin-border lg:bg-admin-card lg:shadow-[0_12px_38px_rgb(15_23_42_/.055)]' : 'border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]'}`}>
      <SectionTabBar sections={content.sections} icons={sectionIcons} selectedSection={selectedSection} onSelect={setSelectedSection} ariaLabel={content.sectionsTitle} />
      <EditorSectionHeader icon={sectionIcons[selectedSection]} title={content.sections[selectedSection].label} action={<div className="grid w-full grid-cols-2 items-center justify-items-stretch gap-2 sm:flex sm:w-auto sm:flex-nowrap sm:justify-start">{selectedSection === 'scholarships' && <button type="button" onClick={() => setEditing({ index: null, item: null })} className="order-3 col-span-2 box-border inline-flex h-[35px] min-h-[35px] max-h-[35px] w-full shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-admin-brand bg-admin-brand px-3 py-0 text-[.6875rem] leading-none font-semibold text-white transition hover:bg-orange-500 sm:order-none sm:col-span-1 sm:w-auto sm:min-w-32"><Plus size={14} />{content.add}</button>}<EditorVisibilityToggle label={content.visible || 'نمایش داده شود'} checked={selectedVisible} onChange={toggleVisibility} /><ContentLanguageSwitcher label={content.language || 'زبان محتوا'} value={contentLanguage} onChange={setContentLanguage} /></div>} />
      <div className={`grid gap-6 ${selectedSection === 'scholarships' ? 'bg-transparent p-0 lg:p-6' : 'p-5 sm:p-6'}`}>
        {selectedSection === 'hero' && <EditorField label={content.fields.heroEyebrow} value={draft.hero.eyebrow} onChange={(value) => updateHero('eyebrow', value)} />}
        {selectedSection === 'scholarships' && <ScholarshipList items={draft.items} translations={Object.fromEntries(Object.entries(drafts).map(([language, languageDraft]) => [language, languageDraft.items]))} initialLanguage={contentLanguage} options={draft.options} content={content} onEdit={(index) => setEditing({ index, item: draft.items[index] })} onDelete={deleteItem} onToggleStatus={(index) => saveImmediate((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, items: languageDraft.items.map((entry, itemIndex) => itemIndex === index ? { ...entry, status: entry.status === 'draft' ? 'published' : 'draft' } : entry) }])))} />}
      </div>
    </section>
    {editing && <ScholarshipModal content={content} initialLanguage={contentLanguage} initialTranslations={Object.fromEntries(Object.entries(drafts).map(([language, languageDraft]) => [language, editing.index === null ? null : languageDraft.items[editing.index] || null]))} optionsByLanguage={Object.fromEntries(Object.entries(drafts).map(([language, languageDraft]) => [language, languageDraft.options]))} onClose={() => closeCmsModal(() => setEditing(null))} onSave={async (localizedItems) => { const isNew = editing.index === null; await saveItemTranslations(localizedItems); closeCmsModal(() => { setEditing(null); if (isNew) showRecordToast('recordAdded') }) }} />}
  </PageContainer>
}

function ScholarshipList({ items, translations, initialLanguage, options, content, onEdit, onDelete, onToggleStatus }) {
  const isEnglish = useCmsInterfaceLanguage() === 'en'
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
<div><span className="mb-1 block text-[.625rem] font-semibold text-admin-muted">{content.filters.country}</span><CountryPicker compact label={content.filters.country} language={initialLanguage} value={country} allLabel={content.filters.all} searchPlaceholder={content.countrySearch} emptyLabel={content.countryEmpty} onChange={(selectedCountry) => setCountry(selectedCountry.value === 'all' ? 'all' : selectedCountry.name)} /></div>
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
  const mobileFilterBar = <div className="grid grid-cols-2 items-end gap-2 rounded-b-2xl border-x border-b border-admin-border bg-admin-card p-5 shadow-[0_12px_34px_rgb(15_23_42_/.055)] sm:p-9 lg:hidden">
<StatusSelect value={status} onChange={setStatus} content={content} />
<button type="button" onClick={() => setFilterModalOpen(true)} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-admin-border bg-admin-control px-3 text-xs font-semibold text-admin-heading transition hover:border-admin-brand hover:text-admin-brand-text"><SlidersHorizontal size={15} />{content.filters.title || 'فیلترها'}</button>
<label className="col-span-2 flex h-9 min-w-0 items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3 text-admin-muted focus-within:border-admin-brand">
<Search size={15} />
<input className="search-field min-w-0 flex-1 bg-transparent text-xs text-admin-heading outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={content.search} />
</label>
</div>
  return <div className="grid gap-4">
{mobileFilterBar}
<FilterModal open={filterModalOpen} onClose={() => closeCmsModal(() => setFilterModalOpen(false))} title={content.filters.title || 'فیلترها'}><div className="grid gap-3 [&>*]:!col-auto [&>*]:!row-auto [&>*]:!mt-0">{scholarshipFilterControls}<button type="button" onClick={resetScholarshipFilters} aria-label={content.reset} title={content.reset} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-admin-border bg-admin-brand-soft px-3 text-xs font-semibold text-admin-muted transition hover:border-admin-brand hover:text-admin-brand-text"><RotateCcw size={14} />{content.reset}</button></div></FilterModal>
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
<strong className={`line-clamp-2 text-sm leading-5 text-admin-heading ${isEnglish ? '!font-normal' : ''}`}>{item.title}</strong>
</div>
</div>
</td>
<td className="p-4 text-xs text-admin-muted">{item.country}</td>
<td className="p-4 text-xs text-admin-muted">{item.degree}</td>
<td className="p-4" onClick={(event) => event.stopPropagation()}>
<button type="button" onClick={() => onToggleStatus(index)} className={`rounded-full px-2.5 py-1 text-[.65rem] font-semibold transition ${statusTone}`}>{statusLabel}</button>
</td>
<td className="p-4" onClick={(event) => event.stopPropagation()}>
<div className="flex gap-1">
<RecordActionButtons href={item.officialHref} previewLabel={content.preview} editLabel={content.edit} deleteLabel={content.delete} onEdit={() => onEdit(index)} onDelete={() => onDelete(index)} />
</div>
</td>
</tr> })}</tbody>
</table>
</section>
<section className="grid w-full min-w-0 max-w-full gap-3 bg-admin-page md:grid-cols-2 lg:hidden">{filteredItems.map((item) => { const index = items.indexOf(item); const statusLabel = item.status === 'draft' ? content.draft : content.published; const statusTone = item.status === 'draft' ? 'bg-admin-brand-soft text-admin-brand-text hover:bg-admin-brand/20' : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300'; return <article className="grid min-w-0 cursor-pointer grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-2xl border border-admin-border bg-admin-card p-3 shadow-[0_8px_24px_rgb(15_23_42_/.05)] transition hover:bg-admin-control-soft" key={item.slug} tabIndex="0" role="button" onClick={() => setViewing({ item, index })} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setViewing({ item, index }) } }}>
<img className="h-20 w-20 rounded-xl bg-(--editor-field) object-cover" src={item.image} alt="" />
<div className="min-w-0">
<strong className={`block truncate text-sm text-admin-heading ${isEnglish ? '!font-normal' : ''}`}>{item.title}</strong>
<span className="mt-1 block truncate text-xs text-admin-muted">{item.country} · {item.degree}</span>
<button type="button" onClick={(event) => { event.stopPropagation(); onToggleStatus(index) }} className={`mt-2 inline-block rounded-full px-2 py-1 text-[.65rem] font-semibold transition ${statusTone}`}>{statusLabel}</button>
<div className="mt-2 flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
<RecordActionButtons href={item.officialHref} previewLabel={content.preview} editLabel={content.edit} deleteLabel={content.delete} onEdit={() => onEdit(index)} onDelete={() => onDelete(index)} iconSize={15} buttonSize="size-8" />
</div>
</div>
</article> })}</section>{filteredItems.length === 0 && <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-admin-border text-sm text-admin-muted">{content.empty}</div>}{viewing && <ScholarshipPreviewModal item={viewing.item} index={viewing.index} translations={translations} initialLanguage={initialLanguage} content={content} onClose={() => closeCmsModal(() => setViewing(null))} onEdit={() => closeCmsModal(() => { setViewing(null); onEdit(viewing.index) })} onDelete={async () => { if (await onDelete(viewing.index)) closeCmsModal(() => setViewing(null)) }} />}</div>
}

function ScholarshipPreviewModal({ item, index, translations, initialLanguage, content, onClose, onEdit, onDelete }) {
  const interfaceLanguage = useCmsInterfaceLanguage()
  const interfaceDirection = interfaceLanguage === 'en' ? 'ltr' : 'rtl'
  const [contentLanguage, setContentLanguage] = useCmsContentLanguage(initialLanguage)
  const displayItem = translations?.[contentLanguage]?.[index] || item
  const dialogRef = useModalFocus({ onClose })
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousBodyOverflow; document.removeEventListener('keydown', closeOnEscape) }
  }, [onClose])
  const facts = [[content.fields.provider, displayItem.provider], [content.fields.country, displayItem.country], [content.fields.degree, displayItem.degree], [content.fields.funding, displayItem.funding], [content.fields.deadline, formatScholarshipDeadline(displayItem.deadline, contentLanguage, displayItem.slug)]]
  const detailSections = [[content.fields.eligibility, displayItem.eligibility], [content.fields.benefits, displayItem.benefits], [content.fields.documents, displayItem.documents]].filter(([, items]) => Array.isArray(items) && items.length)
  return <div className="cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center p-3 sm:p-4" onMouseDown={onClose}>
    <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="scholarship-preview-title" className="cms-overview-modal relative z-10 w-full max-w-5xl overflow-hidden rounded-xl border border-admin-border bg-admin-page shadow-2xl sm:max-w-2xl sm:rounded-2xl lg:max-w-5xl" onMouseDown={(event) => event.stopPropagation()}>
      <header dir={interfaceDirection} className="grid min-w-0 grid-cols-1 gap-2 border-b border-admin-border bg-admin-card px-2 py-2.5 sm:flex sm:flex-nowrap sm:items-center sm:gap-3 sm:px-6 sm:py-3">
        <h2 id="scholarship-preview-title" dir={interfaceDirection} className="order-2 block min-w-0 w-full truncate text-start font-heading text-base text-admin-heading sm:order-none sm:flex-1 sm:text-xl">{displayItem.title}</h2>
        <div className="order-1 grid min-w-0 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-1 sm:ms-auto sm:flex sm:w-auto sm:shrink-0 sm:gap-2">
          <ContentLanguageSwitcher className="!w-full !min-w-0 sm:!w-auto" label={content.language || 'زبان محتوا'} value={contentLanguage} onChange={setContentLanguage} />
          <div className="flex shrink-0 items-center gap-1 sm:gap-2" dir={interfaceLanguage === 'en' ? 'rtl' : 'ltr'}><button type="button" onClick={onEdit} className="grid size-9 place-items-center rounded-xl border border-admin-border text-admin-brand-text transition hover:border-admin-brand hover:bg-admin-brand-soft" aria-label={content.edit}><Pencil size={16} /></button><button type="button" onClick={onDelete} className="grid size-9 place-items-center rounded-xl border border-red-500/25 dark:border-red-500/50 text-red-500 transition hover:border-red-500 hover:bg-red-500/10" aria-label={content.delete}><Trash2 size={16} /></button></div>
          <button type="button" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-xl border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" aria-label={content.close}><X size={17} /></button>
        </div>
      </header>
      <div className="cms-overview-modal-content grid gap-3 p-2.5 sm:gap-5 sm:p-6" dir={contentLanguage === 'en' ? 'ltr' : 'rtl'}>
        <article className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-admin-border bg-admin-card sm:rounded-[2rem]">
          {displayItem.image && <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[16/8] md:aspect-[16/5]"><img src={displayItem.image} alt={displayItem.imageAlt || displayItem.title || ''} className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" aria-hidden="true" /><h3 className="absolute inset-x-4 bottom-4 text-start font-heading text-xl font-extrabold leading-tight text-white sm:inset-x-5 sm:bottom-5 sm:text-2xl md:inset-x-10 md:bottom-10 md:text-4xl">{displayItem.title}</h3></div>}
          <div className="grid gap-5 p-4 sm:p-6"><p className="text-sm leading-7 text-admin-muted">{displayItem.summary}</p><dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{facts.map(([label, value]) => <div key={label} className="rounded-xl border border-admin-border bg-(--editor-field) p-3"><dt className="text-[.65rem] font-semibold text-admin-muted">{label}</dt><dd className="mt-1 text-xs font-bold text-admin-heading">{value}</dd></div>)}</dl>{displayItem.overview && <div><h4 className="mb-2 text-sm font-bold text-admin-heading">{content.fields.overview}</h4><SafeRichText className="gv-public-post-content text-sm leading-7 text-admin-muted" html={displayItem.overview} /></div>}{detailSections.length > 0 && <div className="grid gap-4 md:grid-cols-3">{detailSections.map(([title, items]) => <section key={title} className="rounded-2xl border border-admin-border bg-(--editor-field) p-4"><h4 className="text-sm font-bold text-admin-heading">{title}</h4><ul className="mt-3 grid list-disc gap-2 ps-5 text-sm leading-7 text-admin-muted">{items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div>}{displayItem.officialHref && <a href={displayItem.officialHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-admin-brand bg-admin-brand px-4 text-xs font-semibold text-white"><ExternalLink size={15} />{content.fields.officialSource}</a>}</div>
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
  const interfaceLanguage = useCmsInterfaceLanguage()
  const dialogRef = useModalFocus({ onClose })
  const emptyDraft = { slug: '', title: '', provider: '', country: '', degree: '', funding: '', deadline: '', deadlineFilter: '', status: 'published', featured: false, image: '', imageAlt: '', summary: '', overview: '', eligibility: [], benefits: [], documents: [], officialHref: '', seoTitle: '', metaDescription: '' }
  const [contentLanguage, setContentLanguage] = useCmsContentLanguage(initialLanguage)
  const [popupDrafts, setPopupDrafts] = useState(() => Object.fromEntries(['prs', 'ps', 'en'].map((language) => { const item = initialTranslations[language]; return [language, item ? { ...item, status: item.status === 'draft' ? 'draft' : 'published' } : { ...emptyDraft }] })))
  const draft = popupDrafts[contentLanguage]
  const options = optionsByLanguage[contentLanguage] || {}
  const update = (key, value) => setPopupDrafts((current) => ({ ...current, [contentLanguage]: { ...current[contentLanguage], [key]: value } }))
  const updateShared = (key, value) => setPopupDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, [key]: value }])))
  const updateLocalizedOption = (key, value, optionKey) => {
    const selectedIndex = (optionsByLanguage[contentLanguage]?.[optionKey] || []).indexOf(value)
    setPopupDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => {
      const localizedValue = optionsByLanguage[language]?.[optionKey]?.[selectedIndex]
      return [language, { ...languageDraft, [key]: localizedValue || value }]
    })))
  }
  const updateCountry = (country) => setPopupDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, country: country.names?.[language] || country.name }])))
  const save = (event) => { event.preventDefault(); const fallbackTitle = popupDrafts.prs.title || popupDrafts.en.title || popupDrafts.ps.title; const slug = draft.slug || fallbackTitle.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, ''); onSave(Object.fromEntries(Object.entries(popupDrafts).map(([language, languageDraft]) => [language, { ...languageDraft, slug }]))) }
  const isEditing = Object.values(initialTranslations).some(Boolean)
  return <div className="cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center overflow-hidden p-3 sm:p-4" onMouseDown={onClose}>
<form ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="scholarship-editor-title" onSubmit={save} onMouseDown={(event) => event.stopPropagation()} className="relative z-10 my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-page shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl sm:rounded-2xl lg:max-w-5xl">
<header dir={interfaceLanguage === 'en' ? 'ltr' : 'rtl'} className="grid min-w-0 grid-cols-1 gap-2 border-b border-admin-border bg-admin-card px-3 py-2.5 sm:flex sm:flex-nowrap sm:items-center sm:gap-4 sm:px-6">
<h2 id="scholarship-editor-title" className="order-2 block min-w-0 w-full truncate text-start font-heading text-base leading-tight text-admin-heading sm:order-none sm:flex-1 sm:text-xl">{isEditing ? content.editTitle : content.addTitle}</h2>
<div className="order-1 grid min-w-0 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:ms-auto sm:flex sm:w-auto sm:shrink-0">
<ContentLanguageSwitcher className="!w-full !min-w-0 sm:!w-auto" label={content.language || 'زبان محتوا'} value={contentLanguage} onChange={setContentLanguage} />
<button type="button" onClick={onClose} aria-label={content.close} className="grid size-9 shrink-0 place-items-center rounded-xl border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text"><X size={17} /></button>
</div>
</header>
<div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6" dir={contentLanguage === 'en' ? 'ltr' : 'rtl'}>
<div className="grid gap-3 sm:gap-5">
<section className="grid gap-4 rounded-2xl border border-admin-border bg-admin-card p-4 sm:grid-cols-2 sm:p-5">
<EditorField label={content.fields.itemTitle} value={draft.title} dir={contentLanguage === 'en' ? 'ltr' : 'rtl'} full onChange={(value) => update('title', value)} />
<label className="block min-w-0 text-xs font-semibold text-admin-heading"><span className="mb-2 block">{content.fields.country}</span><CountryPicker label={content.fields.country} language={contentLanguage} value={draft.country} searchPlaceholder={content.countrySearch} emptyLabel={content.countryEmpty} onChange={updateCountry} /></label>
<ScholarshipSelect label={content.fields.degree} value={draft.degree} onChange={(value) => updateLocalizedOption('degree', value, 'degrees')} options={options.degrees} />
<ScholarshipSelect label={content.fields.funding} value={draft.funding} onChange={(value) => updateLocalizedOption('funding', value, 'funding')} options={options.funding} />
<EditorField label={content.fields.deadline} value={draft.deadline} type="date" onChange={(value) => updateShared('deadline', value)} />
<label className="block min-w-0 text-xs font-semibold text-admin-heading">
<span className="mb-2 block">{content.fields.status}</span>
<ScholarshipSelect label="" value={draft.status} onChange={(value) => updateShared('status', value)} options={[{ value: 'published', label: content.published }, { value: 'draft', label: content.draft }]} />
</label>
<div className="flex h-11 min-h-11 self-end items-center justify-between gap-3 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-4 text-xs font-semibold text-admin-heading">
<span>{content.featured}</span>
<button type="button" role="switch" aria-checked={draft.featured} aria-label={content.featured} onClick={() => updateShared('featured', !draft.featured)} className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200 ease-out ${draft.featured ? 'border-admin-brand bg-admin-brand' : 'border-admin-border bg-[var(--admin-toggle-off)]'}`}><span aria-hidden="true" className="absolute top-1 size-3 rounded-full bg-white shadow-sm transition-transform duration-200" style={{ left: interfaceLanguage === 'en' ? '4px' : undefined, right: interfaceLanguage === 'en' ? undefined : '4px', transform: draft.featured ? `translate(${interfaceLanguage === 'en' ? '16px' : '-16px'}, 0)` : 'translate(0, 0)' }} /></button>
</div>
</section>
<section className="grid gap-4 rounded-2xl border border-admin-border bg-admin-card p-4 sm:p-5">
<div className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-admin-heading">{content.fields.overview || 'معلومات کامل بورسیه'}</span><RichTextEditor key={contentLanguage} language={contentLanguage} value={draft.overview || ''} onChange={(value) => update('overview', value)} /></div>
</section>
<div className="grid gap-5 sm:grid-cols-2">
<section className="grid min-w-0 gap-4 rounded-2xl border border-admin-border bg-admin-card p-4 sm:p-5"><MediaUploadField fullWidth={false} value={draft.image} onChange={(image) => updateShared('image', image)} content={{ countryImage: content.fields.image, choose: content.chooseImage, drop: content.dropImage, replace: content.replaceImage, remove: content.removeImage }} /></section>
<section className="grid min-w-0 gap-4 rounded-2xl border border-admin-border bg-admin-card p-4 sm:p-5 sm:grid-cols-2"><h3 className="text-sm text-admin-heading sm:col-span-2">SEO</h3><SeoFields language={contentLanguage} value={draft} onChange={update} /></section>
</div>
</div>
</div>
<footer className="flex justify-end gap-2 border-t border-admin-border bg-admin-card px-4 py-2 sm:px-6">
<button type="button" onClick={onClose} className="min-h-8 rounded-xl border border-admin-border px-4 text-xs font-semibold text-admin-muted hover:border-admin-brand hover:text-admin-brand-text">{content.cancel}</button>
<button type="submit" className="min-h-8 rounded-xl bg-admin-brand px-5 text-xs font-semibold text-white hover:bg-orange-500">{content.save}</button>
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
