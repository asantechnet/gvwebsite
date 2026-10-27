import { useEffect, useRef, useState } from 'react'
import { BriefcaseBusiness, Flag, GalleryVerticalEnd, Handshake, ImagePlus, LayoutTemplate, MapPinned, MessageSquareQuote, Pencil, Plus, Replace, Trash2, UploadCloud } from 'lucide-react'

import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import CollectionItemModal from '@cms/components/CollectionItemModal.jsx'
import AddCollectionItemModal from '@cms/components/AddCollectionItemModal.jsx'
import SectionTabBar from '@cms/components/SectionTabBar.jsx'
import { EditorField, EditorFieldGroup, EditorPreviewLink, EditorSectionHeader, EditorVisibilityToggle } from '@cms/components/EditorPrimitives.jsx'
import useEditorTabs from '@cms/hooks/useEditorTabs.js'

const sectionIcons = { hero: LayoutTemplate, opportunities: GalleryVerticalEnd, destinations: MapPinned, process: Flag, services: BriefcaseBusiness, testimonials: MessageSquareQuote, consultation: Handshake }
const fieldMap = {
  hero: ['titleBefore', 'titleHighlight', 'titleAfter', 'description', 'primaryAction', 'primaryActionHref', 'secondaryAction', 'secondaryActionHref'],
  opportunities: ['titleBefore', 'titleHighlight', 'viewAll', 'viewAllHref'],
  destinations: ['titleBefore', 'titleHighlight', 'viewAll', 'viewAllHref'],
  process: ['titleBefore', 'titleHighlight'],
  services: ['titleBefore', 'titleHighlight', 'description', 'viewAll', 'viewAllHref'],
  testimonials: ['titleBefore', 'titleHighlight'],
  consultation: ['title', 'description', 'primaryAction', 'primaryActionHref', 'secondaryAction', 'secondaryActionHref']
}
const collectionKeys = { opportunities: 'cards', destinations: 'countries', process: 'steps', services: 'cards', testimonials: 'items' }
const textareaFields = new Set(['description'])
const linkFields = new Set(['primaryActionHref', 'secondaryActionHref', 'viewAllHref'])
const defaultActionLinks = { hero: { primaryActionHref: '/contact', secondaryActionHref: '/opportunities/study' }, opportunities: { viewAllHref: '/opportunities/study' }, destinations: { viewAllHref: '/opportunities/country' }, services: { viewAllHref: '/services/consultation' }, consultation: { primaryActionHref: '/contact', secondaryActionHref: '/opportunities/study' } }
const fieldGroupMap = { heading: ['titleBefore', 'titleHighlight', 'titleAfter', 'title'], body: ['description', 'viewAll', 'viewAllHref'], actions: ['primaryAction', 'primaryActionHref', 'secondaryAction', 'secondaryActionHref'] }

function HomeEditorSection({ content, initialContent }) {
  const [selectedSection, setSelectedSection] = useEditorTabs({ defaultTab: 'hero', storageKey: 'globalvision-cms-home-tab', tabs: Object.keys(sectionIcons) })
  const [draft, setDraft] = useState(() => structuredClone(initialContent))
  const [heroMedia, setHeroMedia] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [addingItem, setAddingItem] = useState(false)
  const [visibility, setVisibility] = useState(() => Object.fromEntries(Object.keys(sectionIcons).map((key) => [key, true])))
  const selectedContent = draft[selectedSection]
  const collectionKey = collectionKeys[selectedSection]
  const collection = collectionKey ? selectedContent[collectionKey] : []

  const updateField = (field, value) => setDraft((current) => ({ ...current, [selectedSection]: { ...current[selectedSection], [field]: value } }))
  const toggleVisibility = (key) => setVisibility((current) => ({ ...current, [key]: !current[key] }))
  const updateCollectionItem = (index, changes) => setDraft((current) => ({ ...current, [selectedSection]: { ...current[selectedSection], [collectionKey]: changes.__delete ? current[selectedSection][collectionKey].filter((_, itemIndex) => itemIndex !== index) : current[selectedSection][collectionKey].map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item) } }))
  const addCollectionItem = (item) => setDraft((current) => ({ ...current, [selectedSection]: { ...current[selectedSection], [collectionKey]: [...current[selectedSection][collectionKey], item] } }))

  useEffect(() => () => { if (heroMedia?.url?.startsWith('blob:')) URL.revokeObjectURL(heroMedia.url) }, [heroMedia])

  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} action={<EditorPreviewLink>{content.preview}</EditorPreviewLink>} />

    <section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <SectionTabBar sections={content.sections} icons={sectionIcons} selectedSection={selectedSection} onSelect={setSelectedSection} ariaLabel={content.sectionsTitle} />

        <EditorSectionHeader icon={sectionIcons[selectedSection]} title={content.sections[selectedSection].label} action={<EditorVisibilityToggle label={content.visible} checked={visibility[selectedSection]} onChange={() => toggleVisibility(selectedSection)} />} />

        <div className="grid gap-6 p-5 sm:p-6">
          <div><div className="grid gap-3">{Object.entries(fieldGroupMap).map(([group, fields]) => { const visibleFields = fields.filter((field) => fieldMap[selectedSection].includes(field)); if (!visibleFields.length) return null; return <div key={group}><EditorFieldGroup title={content.fieldGroups[group]}>{visibleFields.map((field) => <EditorField key={field} label={content.fields[field]} value={selectedContent[field] ?? defaultActionLinks[selectedSection]?.[field] ?? ''} multiline={textareaFields.has(field)} type={linkFields.has(field) ? 'url' : 'text'} full={textareaFields.has(field) || field === 'title'} onChange={(value) => updateField(field, value)} />)}</EditorFieldGroup>{selectedSection === 'hero' && group === 'actions' && <MediaField content={content.media} value={heroMedia} onChange={setHeroMedia} />}</div> })}</div></div>

          {collectionKey && selectedSection !== 'testimonials' && <div className="border-t border-admin-border pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="m-0 font-heading text-sm text-admin-heading">{content.items}</h3>{selectedSection !== 'process' && selectedSection !== 'services' && <button type="button" onClick={() => setAddingItem(true)} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-control px-3 text-[.6875rem] font-semibold text-admin-muted transition hover:border-admin-brand hover:text-admin-brand"><Plus size={14} />{content.manageItems}</button>}</div><div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{collection.map((item, index) => <article key={item.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[color-mix(in_srgb,var(--admin-brand)_28%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-brand)_15%,var(--admin-card))] text-[.6875rem] font-bold text-admin-brand shadow-[0_1px_3px_rgb(15_23_42_/.06)]">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1"><strong className="block truncate text-[.75rem] text-admin-heading">{item.title || item.name}</strong></span><span className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={() => setEditingItem({ index, item })} className="grid size-8 place-items-center rounded-lg border border-admin-border bg-admin-control text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand" aria-label={content.editItem}><Pencil size={14} /></button>{selectedSection !== 'process' && selectedSection !== 'services' && <button type="button" onClick={async () => { const confirmed = await window.cmsConfirmDelete?.({ title: content.deleteItemTitle, description: content.deleteItemDescription }); if (confirmed) updateCollectionItem(index, { __delete: true }) }} className="grid size-8 place-items-center rounded-lg border border-red-500/25 bg-admin-control text-red-500 transition hover:border-red-500 hover:bg-red-500/10" aria-label={content.deleteItem}><Trash2 size={14} /></button>}</span></article>)}</div></div>}
        </div>
    </section>
    {editingItem && <CollectionItemModal content={content} item={editingItem.item} isCountry={collectionKey === 'countries'} isProcess={collectionKey === 'steps'} countryOptions={collection} onClose={() => setEditingItem(null)} onSave={(changes) => { updateCollectionItem(editingItem.index, changes); setEditingItem(null) }} />}
    {addingItem && <AddCollectionItemModal content={content} item={collection[0]} isCountry={collectionKey === 'countries'} isProcess={collectionKey === 'steps'} countryOptions={collection} onClose={() => setAddingItem(false)} onSave={(item) => { addCollectionItem(item); setAddingItem(false) }} />}
  </PageContainer>
}

function MediaField({ content, value, onChange }) {
  const inputRef = useRef(null)
  const chooseFile = (file) => {
    if (!file || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))) return
    if (value?.url?.startsWith('blob:')) URL.revokeObjectURL(value.url)
    onChange({ name: file.name, type: file.type.startsWith('video/') ? 'video' : 'image', url: URL.createObjectURL(file) })
  }
  return <div className="mt-6"><div className="flex items-center justify-between gap-3"><div><h3 className="m-0 font-heading text-sm text-admin-heading">{content.title}</h3><p className="mt-1 mb-0 text-[.6875rem] text-admin-muted">{content.description}</p></div></div>{value ? <div className="relative mt-3 aspect-[16/7] overflow-hidden rounded-xl border border-(--editor-field-border) bg-(--editor-input)">{value.type === 'video' ? <video src={value.url} controls className="size-full object-contain" /> : <img src={value.url} alt={value.name} className="size-full object-cover" />}<div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/75 via-black/45 to-transparent px-3 pb-3 pt-10"><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-3 text-[.65rem] font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/25"><Replace size={13} />{content.replace}</button><button type="button" onClick={() => onChange(null)} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-red-300/50 bg-red-600/75 px-3 text-[.65rem] font-semibold text-white backdrop-blur-sm transition hover:bg-red-600"><Trash2 size={13} />{content.remove}</button></div></div> : <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files?.[0]) }} className="mt-2 grid min-h-28 w-full place-items-center content-center gap-1.5 rounded-xl border-2 border-dashed border-(--editor-field-border) bg-(--editor-input) p-4 text-center text-admin-brand hover:border-admin-brand hover:bg-admin-brand-soft"><ImagePlus size={24} /><strong className="text-xs text-admin-heading">{content.choose}</strong><span className="inline-flex items-center gap-1.5 text-[.65rem] text-admin-muted"><UploadCloud size={13} />{content.drop}</span></button>}<input ref={inputRef} type="file" accept="image/*,video/*" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0])} /></div>
}

export default HomeEditorSection
