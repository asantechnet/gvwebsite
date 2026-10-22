import { useState } from 'react'
import { ArrowUpLeft, BriefcaseBusiness, Flag, GalleryVerticalEnd, Handshake, LayoutTemplate, MapPinned, MessageSquareQuote, MousePointerClick, Plus } from 'lucide-react'

import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'

const sectionIcons = { hero: LayoutTemplate, opportunities: GalleryVerticalEnd, destinations: MapPinned, process: Flag, services: BriefcaseBusiness, testimonials: MessageSquareQuote, consultation: Handshake }
const fieldMap = {
  hero: ['titleBefore', 'titleHighlight', 'titleAfter', 'description', 'primaryAction', 'secondaryAction'],
  opportunities: ['titleBefore', 'titleHighlight', 'viewAll'],
  destinations: ['titleBefore', 'titleHighlight', 'viewAll'],
  process: ['titleBefore', 'titleHighlight'],
  services: ['titleBefore', 'titleHighlight', 'description', 'viewAll'],
  testimonials: ['titleBefore', 'titleHighlight'],
  consultation: ['title', 'description', 'primaryAction', 'secondaryAction']
}
const collectionKeys = { opportunities: 'cards', destinations: 'countries', process: 'steps', services: 'cards', testimonials: 'items' }
const textareaFields = new Set(['description'])

function HomeEditorSection({ content, initialContent }) {
  const [selectedSection, setSelectedSection] = useState('hero')
  const [draft, setDraft] = useState(() => structuredClone(initialContent))
  const [visibility, setVisibility] = useState(() => Object.fromEntries(Object.keys(sectionIcons).map((key) => [key, true])))
  const selectedContent = draft[selectedSection]
  const collectionKey = collectionKeys[selectedSection]
  const collection = collectionKey ? selectedContent[collectionKey] : []

  const updateField = (field, value) => setDraft((current) => ({ ...current, [selectedSection]: { ...current[selectedSection], [field]: value } }))
  const toggleVisibility = (key) => setVisibility((current) => ({ ...current, [key]: !current[key] }))

  return <PageContainer>
    <PageHeading breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} title={content.title} description={content.description} action={<a href="/" target="_blank" rel="noreferrer" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-admin-border bg-admin-control px-4 text-xs font-semibold text-admin-heading transition hover:border-admin-brand hover:text-admin-brand sm:w-auto"><ArrowUpLeft size={16} />{content.preview}</a>} />

    <section className="grid gap-3 rounded-2xl border border-admin-border bg-admin-card p-3 shadow-[0_10px_32px_rgb(15_23_42_/.045)] sm:grid-cols-3 sm:p-4" aria-label={content.status}>
      <StatusItem label={content.status}><span className="inline-flex items-center gap-2 font-semibold text-[#168a52]"><i className="size-2 rounded-full bg-[#22a06b] shadow-[0_0_0_4px_rgb(34_160_107_/.12)]" />{content.published}</span></StatusItem>
      <StatusItem label={content.lastUpdate} value={content.today} />
      <StatusItem label={content.language} value={content.currentLanguage} />
    </section>

    <section className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <nav className="overflow-x-auto rounded-t-[1.1rem] border border-(--admin-tab-bar-border) border-b-2 bg-admin-page shadow-[inset_0_1px_0_rgb(255_255_255_/.45)]" aria-label={content.sectionsTitle} role="tablist">
        <div className="flex min-w-max gap-1 px-3 py-2">{Object.entries(content.sections).map(([key, section]) => { const Icon = sectionIcons[key]; const active = selectedSection === key; return <button type="button" role="tab" aria-selected={active} key={key} onClick={() => setSelectedSection(key)} className={`inline-flex min-h-10 items-center gap-2 rounded-t-lg px-3 text-[.75rem] font-semibold transition ${active ? '-mb-px bg-(--admin-tab-active-bg) text-admin-brand' : 'text-admin-muted hover:bg-admin-control-soft hover:text-admin-heading'}`}><Icon size={15} />{section.label}</button> })}</div>
      </nav>

        <header className="flex flex-wrap items-center gap-4 border-b border-admin-border bg-[linear-gradient(110deg,var(--editor-field),var(--admin-card))] px-5 py-4 sm:px-6"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand">{(() => { const Icon = sectionIcons[selectedSection]; return <Icon size={20} /> })()}</span><div className="min-w-0 flex-1"><span className="text-[.625rem] font-semibold tracking-[.12em] text-admin-brand">{content.editSection}</span><h2 className="mt-1 mb-0 font-heading text-base text-admin-heading">{content.sections[selectedSection].label}</h2><p className="mt-1 mb-0 text-[.6875rem] text-admin-muted">{content.sectionDescription}</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-admin-border bg-admin-control px-3 py-2 text-[.6875rem] font-semibold text-admin-muted"><input type="checkbox" className="accent-(--admin-brand)" checked={visibility[selectedSection]} onChange={() => toggleVisibility(selectedSection)} />{content.visible}</label></header>

        <div className="grid gap-6 p-5 sm:p-6">
          <div><h3 className="m-0 font-heading text-sm text-admin-heading">{content.content}</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{fieldMap[selectedSection].map((field) => <EditorField key={field} label={content.fields[field]} value={selectedContent[field] ?? ''} multiline={textareaFields.has(field)} full={textareaFields.has(field) || field === 'title'} onChange={(value) => updateField(field, value)} />)}</div></div>

          {collectionKey && <div className="border-t border-admin-border pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="m-0 font-heading text-sm text-admin-heading">{content.items}</h3><p className="mt-1.5 mb-0 text-[.6875rem] text-admin-muted">{content.itemsDescription}</p></div><button type="button" className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-control px-3 text-[.6875rem] font-semibold text-admin-muted transition hover:border-admin-brand hover:text-admin-brand"><Plus size={14} />{content.manageItems}</button></div><div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{collection.map((item, index) => <article key={item.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-admin-brand-soft text-[.6875rem] font-bold text-admin-brand">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1"><strong className="block truncate text-[.75rem] text-admin-heading">{item.title || item.name}</strong><small className="mt-0.5 block text-[.625rem] text-admin-muted">{content.itemUnits[collectionKey]}</small></span><MousePointerClick className="shrink-0 text-admin-muted/60" size={15} /></article>)}</div></div>}
        </div>
    </section>
  </PageContainer>
}

function StatusItem({ label, value, children }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl border border-admin-border bg-(--editor-field) px-4 py-3 sm:block sm:border-0 sm:bg-transparent sm:px-3 sm:py-1"><span className="text-[.625rem] font-medium text-admin-muted">{label}</span><span className="text-[.75rem] font-semibold text-admin-heading sm:mt-1.5 sm:block">{children || value}</span></div>
}

function EditorField({ label, value, multiline, full, onChange }) {
  const shared = 'mt-2 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 text-[.8125rem] font-normal text-admin-heading transition placeholder:text-admin-muted focus:border-admin-brand'
  return <label className={`text-[.75rem] font-semibold text-admin-heading ${full ? 'sm:col-span-2' : ''}`}><span>{label}</span>{multiline ? <textarea rows={4} className={`${shared} resize-y py-3 leading-6`} value={value} onChange={(event) => onChange(event.target.value)} /> : <input className={`${shared} min-h-11 py-2.5`} value={value} onChange={(event) => onChange(event.target.value)} />}</label>
}

export default HomeEditorSection
