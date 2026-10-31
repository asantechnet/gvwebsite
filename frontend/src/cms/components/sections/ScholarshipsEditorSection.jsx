import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, ExternalLink, GraduationCap, LayoutTemplate, Pencil, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react'

import MediaUploadField from '@cms/components/MediaUploadField.jsx'
import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import SectionTabBar from '@cms/components/SectionTabBar.jsx'
import { EditorField, EditorFieldGroup, EditorPreviewLink, EditorSectionHeader } from '@cms/components/EditorPrimitives.jsx'
import useEditorTabs from '@cms/hooks/useEditorTabs.js'

const sectionIcons = { hero: LayoutTemplate, scholarships: GraduationCap }

function ScholarshipsEditorSection({ content, initialContent }) {
  const [selectedSection, setSelectedSection] = useEditorTabs({ defaultTab: 'hero', storageKey: 'globalvision-cms-scholarships-tab', tabs: Object.keys(sectionIcons) })
  const [draft, setDraft] = useState(() => structuredClone(initialContent))
  const [editing, setEditing] = useState(null)
  useEffect(() => { const handleSaved = () => setDraft((current) => ({ ...current, items: current.items.map((item) => { const next = { ...item }; delete next.savedStatus; return next }) })); window.addEventListener('cms:changes-saved', handleSaved); return () => window.removeEventListener('cms:changes-saved', handleSaved) }, [])
  const updateHero = (key, value) => setDraft((current) => ({ ...current, hero: { ...current.hero, [key]: value } }))
  const saveItem = (item) => setDraft((current) => ({ ...current, items: editing.index === null ? [...current.items, item] : current.items.map((entry, index) => index === editing.index ? item : entry) }))
  const deleteItem = async (index) => {
    const confirmed = await window.cmsConfirmDelete?.({ title: content.deleteTitle, description: content.deleteDescription })
    if (confirmed) setDraft((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }))
  }

  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} action={<EditorPreviewLink href="/scholarships">{content.visitPage}</EditorPreviewLink>} />
    <section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <SectionTabBar sections={content.sections} icons={sectionIcons} selectedSection={selectedSection} onSelect={setSelectedSection} ariaLabel={content.sectionsTitle} />
      <EditorSectionHeader icon={sectionIcons[selectedSection]} title={content.sections[selectedSection].label} action={selectedSection === 'scholarships' && <button type="button" onClick={() => setEditing({ index: null, item: null })} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-admin-brand bg-admin-brand px-3 text-[.6875rem] font-semibold text-white transition hover:bg-orange-500"><Plus size={14} />{content.add}</button>} />
      <div className="grid gap-6 p-5 sm:p-6">
        {selectedSection === 'hero' && <EditorField label={content.fields.heroEyebrow} value={draft.hero.eyebrow} onChange={(value) => updateHero('eyebrow', value)} />}
        {selectedSection === 'scholarships' && <ScholarshipList items={draft.items} options={draft.options} content={content} onEdit={(index) => setEditing({ index, item: draft.items[index] })} onDelete={deleteItem} onToggleStatus={(index) => setDraft((current) => ({ ...current, items: current.items.map((entry, itemIndex) => itemIndex === index ? { ...entry, status: entry.status === 'draft' ? 'published' : 'draft', savedStatus: entry.savedStatus ?? entry.status } : entry) }))} />}
      </div>
    </section>
    {editing && <ScholarshipModal content={content} item={editing.item} options={draft.options} onClose={() => setEditing(null)} onSave={(item) => { saveItem(item); setEditing(null) }} />}
  </PageContainer>
}

function ScholarshipList({ items, options, content, onEdit, onDelete, onToggleStatus }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [country, setCountry] = useState('all')
  const [degree, setDegree] = useState('all')
  const [funding, setFunding] = useState('all')
  const [deadline, setDeadline] = useState('all')
  const filteredItems = items.filter((item) => { const filterStatus = item.savedStatus ?? item.status; return (status === 'all' || (status === 'published' ? filterStatus !== 'draft' : filterStatus === 'draft')) && (country === 'all' || item.country === country) && (degree === 'all' || item.degree === degree) && (funding === 'all' || item.funding === funding) && (deadline === 'all' || item.deadlineFilter === deadline) && `${item.title} ${item.provider} ${item.country} ${item.degree}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) })
  const resetFilters = () => { setQuery(''); setStatus('all'); setCountry('all'); setDegree('all'); setFunding('all'); setDeadline('all') }
  return <div className="grid gap-4"><section className="grid gap-2 rounded-2xl border border-admin-border bg-admin-card p-2 md:grid-cols-2 xl:grid-cols-5"><label className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-(--editor-field-border) bg-(--editor-input) px-3 text-admin-muted focus-within:border-admin-brand md:col-span-2 md:row-start-2 md:mt-[1.1rem] xl:col-span-4"><Search size={15} /><input className="min-w-0 flex-1 bg-transparent text-xs text-admin-heading outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={content.search} /></label><StatusSelect value={status} onChange={setStatus} content={content} className="md:col-span-2 md:row-start-3 xl:col-span-1 xl:row-start-2" /><button type="button" onClick={resetFilters} aria-label={content.reset} title={content.reset} className="inline-flex h-[2.25rem] min-h-0 box-border items-center justify-center gap-1.5 rounded-lg border border-admin-border leading-none bg-admin-brand-soft px-3 text-xs font-semibold text-admin-muted transition hover:border-admin-brand dark:bg-admin-control hover:bg-admin-brand-soft hover:text-admin-brand xl:col-start-5 xl:row-start-1 xl:mt-[1.25rem]"><RotateCcw size={14} />{content.reset}</button><FilterSelect value={country} onChange={setCountry} label={content.filters.country} options={options.countries} allLabel={content.filters.all} /><FilterSelect value={degree} onChange={setDegree} label={content.filters.degree} options={options.degrees} allLabel={content.filters.all} /><FilterSelect value={funding} onChange={setFunding} label={content.filters.funding} options={options.funding} allLabel={content.filters.all} /><FilterSelect value={deadline} onChange={setDeadline} label={content.filters.deadline} options={options.deadlines} allLabel={content.filters.all} /></section><section className="hidden overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)] lg:block"><table className="w-full table-fixed border-collapse text-right"><thead className="bg-(--editor-field) text-[.65rem] font-semibold text-admin-muted"><tr><th className="w-[45%] p-4">{content.fields.itemTitle}</th><th className="p-4">{content.fields.country}</th><th className="p-4">{content.fields.degree}</th><th className="p-4">{content.status}</th><th className="w-36 p-4">{content.actions}</th></tr></thead><tbody>{filteredItems.map((item) => { const index = items.indexOf(item); const statusLabel = item.status === 'draft' ? content.draft : content.published; const statusTone = item.status === 'draft' ? 'bg-admin-brand-soft text-admin-brand hover:bg-admin-brand/20' : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300'; return <tr className="border-t border-admin-border transition hover:bg-admin-control-soft" key={item.slug}><td className="p-4"><div className="flex items-center gap-3"><img className="size-14 rounded-xl bg-(--editor-field) object-cover" src={item.image} alt="" /><div className="min-w-0"><strong className="block truncate text-sm text-admin-heading">{item.title}</strong></div></div></td><td className="p-4 text-xs text-admin-muted">{item.country}</td><td className="p-4 text-xs text-admin-muted">{item.degree}</td><td className="p-4"><button type="button" onClick={(event) => { onToggleStatus(index); event.currentTarget.dispatchEvent(new Event('input', { bubbles: true })) }} className={`rounded-full px-2.5 py-1 text-[.65rem] font-semibold transition ${statusTone}`}>{statusLabel}</button></td><td className="p-4"><div className="flex gap-1"><a className="grid size-9 place-items-center rounded-xl border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand" href={item.officialHref} target="_blank" rel="noreferrer" aria-label={content.preview}><ExternalLink size={16} /></a><button type="button" onClick={() => onEdit(index)} aria-label={content.edit} className="grid size-9 place-items-center rounded-xl border border-admin-border text-admin-brand transition hover:border-admin-brand hover:bg-admin-brand-soft"><Pencil size={16} /></button><button type="button" onClick={() => onDelete(index)} aria-label={content.delete} className="grid size-9 place-items-center rounded-xl border border-red-500/25 text-red-500 transition hover:border-red-500 hover:bg-red-500/10"><Trash2 size={16} /></button></div></td></tr> })}</tbody></table></section><section className="grid gap-3 lg:hidden">{filteredItems.map((item) => { const index = items.indexOf(item); const statusLabel = item.status === 'draft' ? content.draft : content.published; const statusTone = item.status === 'draft' ? 'bg-admin-brand-soft text-admin-brand hover:bg-admin-brand/20' : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300'; return <article className="grid grid-cols-[5rem_1fr] gap-3 rounded-2xl border border-admin-border bg-admin-card p-3 shadow-[0_8px_24px_rgb(15_23_42_/.05)]" key={item.slug}><img className="h-20 w-20 rounded-xl bg-(--editor-field) object-cover" src={item.image} alt="" /><div className="min-w-0"><strong className="block truncate text-sm text-admin-heading">{item.title}</strong><span className="mt-1 block truncate text-xs text-admin-muted">{item.country} · {item.degree}</span><button type="button" onClick={(event) => { onToggleStatus(index); event.currentTarget.dispatchEvent(new Event('input', { bubbles: true })) }} className={`mt-2 inline-block rounded-full px-2 py-1 text-[.65rem] font-semibold transition ${statusTone}`}>{statusLabel}</button><div className="mt-2 flex justify-end gap-1"><a className="grid size-8 place-items-center rounded-xl border border-admin-border text-admin-muted hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand" href={item.officialHref} target="_blank" rel="noreferrer" aria-label={content.preview}><ExternalLink size={15} /></a><button type="button" onClick={() => onEdit(index)} aria-label={content.edit} className="grid size-8 place-items-center rounded-xl border border-admin-border text-admin-brand hover:border-admin-brand hover:bg-admin-brand-soft"><Pencil size={15} /></button><button type="button" onClick={() => onDelete(index)} aria-label={content.delete} className="grid size-8 place-items-center rounded-xl border border-red-500/25 text-red-500 hover:border-red-500 hover:bg-red-500/10"><Trash2 size={15} /></button></div></div></article> })}</section>{filteredItems.length === 0 && <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-admin-border text-sm text-admin-muted">{content.empty}</div>}</div>
}

function StatusSelect({ value, onChange, content, className = '' }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const options = [{ value: 'all', label: content.all }, { value: 'published', label: content.published }, { value: 'draft', label: content.draft }]
  useEffect(() => { const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }; document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close) }, [])
  const selected = options.find((option) => option.value === value) || options[0]
  return <div ref={root} className={`relative min-w-0 ${className}`}><span className="mb-1 block text-[.625rem] font-semibold text-admin-muted">{content.status}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`flex h-9 w-full items-center gap-2 rounded-lg border bg-(--editor-input) px-3 text-xs text-admin-heading outline-none transition-colors ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span className="min-w-0 flex-1 truncate text-right">{selected.label}</span><ChevronDown size={14} className={`shrink-0 text-admin-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} className={`absolute inset-x-0 top-[calc(100%+1.6rem)] z-40 grid gap-1 rounded-lg border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all duration-200 ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }} className={`flex min-h-9 items-center justify-between rounded-md px-3 text-right text-xs font-semibold transition-colors ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand'}`}><span>{option.label}</span>{option.value === value && <Check size={14} />}</button>)}</div></div>
}

function FilterSelect({ value, onChange, label, options, allLabel }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const choices = [{ value: 'all', label: allLabel }, ...options.map((option) => ({ value: option, label: option }))]
  useEffect(() => { const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }; document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close) }, [])
  const selected = choices.find((option) => option.value === value) || choices[0]
  return <div ref={root} className="relative min-w-0"><span className="mb-1 block text-[.625rem] font-semibold text-admin-muted">{label}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`flex h-9 w-full items-center gap-2 rounded-lg border bg-(--editor-input) px-3 text-xs text-admin-heading outline-none transition-colors ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span className="min-w-0 flex-1 truncate text-right">{selected.label}</span><ChevronDown size={14} className={`shrink-0 text-admin-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} className={`absolute inset-x-0 top-[calc(100%+1.6rem)] z-40 grid max-h-56 gap-1 overflow-y-auto rounded-lg border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all duration-200 ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{choices.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }} className={`flex min-h-9 items-center justify-between rounded-md px-3 text-right text-xs font-semibold transition-colors ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand'}`}><span>{option.label}</span>{option.value === value && <Check size={14} />}</button>)}</div></div>
}

function ScholarshipModal({ content, item, options = {}, onClose, onSave }) {
  const [draft, setDraft] = useState(() => item ? { ...item, status: item.status === 'draft' ? 'draft' : 'published' } : { slug: '', title: '', provider: '', country: '', degree: '', funding: '', deadline: '', deadlineFilter: '', status: 'published', featured: false, image: '', summary: '', overview: '', eligibility: [], benefits: [], documents: [], officialHref: '' })
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  const save = (event) => { event.preventDefault(); const slug = draft.slug || draft.title.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, ''); onSave({ ...draft, slug }) }
  return <div className="cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center overflow-hidden p-4" onMouseDown={onClose}>
<form onSubmit={save} onMouseDown={(event) => event.stopPropagation()} className="relative z-10 my-auto flex max-h-[calc(100svh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-page shadow-2xl">
<header className="flex items-start justify-between gap-4 border-b border-admin-border bg-admin-card px-5 py-4 sm:px-6">
<div>
<h2 className="font-heading text-lg text-admin-heading">{item ? content.editTitle : content.addTitle}</h2>
<p className="mt-1 text-xs text-admin-muted">{content.modalDescription}</p>
</div>
<button type="button" onClick={onClose} aria-label={content.close} className="grid size-9 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:text-admin-brand">
<X size={17} />
</button>
</header>
<div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
<EditorFieldGroup>
<EditorField label={content.fields.itemTitle} value={draft.title} full onChange={(value) => update('title', value)} />
<ScholarshipSelect label={content.fields.country} value={draft.country} onChange={(value) => update('country', value)} options={options.countries} />
<ScholarshipSelect label={content.fields.degree} value={draft.degree} onChange={(value) => update('degree', value)} options={content.programOptions} />
<ScholarshipSelect label={content.fields.funding} value={draft.funding} onChange={(value) => update('funding', value)} options={options.funding} />
<EditorField label={content.fields.deadline} value={draft.deadline} type="date" onChange={(value) => update('deadline', value)} />
<label className="block min-w-0 text-xs font-semibold text-admin-heading">
<span>{content.fields.status}</span>
<ScholarshipSelect label="" value={draft.status} onChange={(value) => update('status', value)} options={[{ value: 'published', label: content.published }, { value: 'draft', label: content.draft }]} />
</label>
<EditorField label={content.fields.summary} value={draft.summary} multiline full onChange={(value) => update('summary', value)} />
<div className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-4 text-xs font-semibold text-admin-heading sm:col-span-2">
<span>{content.featured}</span>
<button type="button" role="switch" aria-checked={draft.featured} aria-label={content.featured} onClick={() => update('featured', !draft.featured)} className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200 ease-out ${draft.featured ? 'border-admin-brand bg-admin-brand' : 'border-admin-border bg-[var(--admin-toggle-off)]'}`}><span aria-hidden="true" className={`absolute top-1/2 start-1 size-3 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none ${draft.featured ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`} /></button>
</div>
<MediaUploadField value={draft.image} onChange={(image) => update('image', image)} content={{ countryImage: content.fields.image, choose: content.chooseImage, drop: content.dropImage, replace: content.replaceImage, remove: content.removeImage }} />
</EditorFieldGroup>
</div>
<footer className="flex justify-end gap-2 border-t border-admin-border bg-admin-card p-4 sm:px-6">
<button type="button" onClick={onClose} className="min-h-10 rounded-xl border border-admin-border px-4 text-xs font-semibold text-admin-muted hover:border-admin-brand hover:text-admin-brand">{content.cancel}</button>
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
  return <div ref={root} className="relative min-w-0">{label && <span className="mb-2 block text-xs font-semibold text-admin-heading">{label}</span>}<button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`flex min-h-11 w-full items-center gap-2 rounded-xl border bg-(--editor-input) px-3.5 text-sm text-admin-heading outline-none transition-colors ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span className="min-w-0 flex-1 truncate text-right">{selected?.label || '—'}</span><ChevronDown size={16} className={`shrink-0 text-admin-muted transition-transform ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} inert={!open} className={`absolute inset-x-0 top-full z-50 mt-2 grid max-h-56 gap-1 overflow-y-auto rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{choices.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }} className={`flex min-h-10 items-center justify-between rounded-lg px-3 text-right text-xs font-semibold transition-colors ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand'}`}><span>{option.label}</span>{option.value === value && <Check size={15} />}</button>)}</div></div>
}

export default ScholarshipsEditorSection
