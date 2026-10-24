import { useEffect, useRef, useState } from 'react'
import { ArrowUpLeft, BriefcaseBusiness, Flag, GalleryVerticalEnd, Handshake, ImagePlus, LayoutTemplate, MapPinned, MessageSquareQuote, Pencil, Plus, Replace, Trash2, UploadCloud } from 'lucide-react'

import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import CollectionItemModal from '@cms/components/CollectionItemModal.jsx'
import AddCollectionItemModal from '@cms/components/AddCollectionItemModal.jsx'

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
const defaultActionLinks = { hero: { primaryActionHref: '/contact', secondaryActionHref: '/opportunities' }, opportunities: { viewAllHref: '/opportunities' }, destinations: { viewAllHref: '/opportunities/country' }, services: { viewAllHref: '/services' }, consultation: { primaryActionHref: '/contact', secondaryActionHref: '/opportunities' } }
const fieldGroupMap = { heading: ['titleBefore', 'titleHighlight', 'titleAfter', 'title'], body: ['description', 'viewAll', 'viewAllHref'], actions: ['primaryAction', 'primaryActionHref', 'secondaryAction', 'secondaryActionHref'] }

function HomeEditorSection({ content, initialContent }) {
  const [selectedSection, setSelectedSection] = useState(() => {
    const navigation = window.performance.getEntriesByType('navigation')[0]
    return navigation?.type === 'reload' ? window.localStorage.getItem('globalvision-cms-home-tab') || 'hero' : 'hero'
  })
  const previousSection = useRef(selectedSection)
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
  useEffect(() => { window.localStorage.setItem('globalvision-cms-home-tab', selectedSection) }, [selectedSection])
  useEffect(() => { if (previousSection.current !== selectedSection) { window.scrollTo(0, 0); previousSection.current = selectedSection } }, [selectedSection])

  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} action={<a href="/" target="_blank" rel="noreferrer" className="mb-2 inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-[.7rem] border border-admin-border bg-(--primary-action-bg) px-3 py-2 text-[.6875rem] font-semibold text-(--primary-action-text) shadow-[0_8px_20px_rgba(15,23,42,.07)] transition hover:-translate-y-0.5 hover:border-admin-brand hover:text-admin-brand hover:shadow-[0_12px_26px_rgba(15,23,42,.11)] sm:w-auto"><ArrowUpLeft size={15} />{content.preview}</a>} />

    <section className="grid gap-3 rounded-2xl border border-admin-border bg-admin-card p-3 shadow-[0_10px_32px_rgb(15_23_42_/.045)] sm:grid-cols-3 sm:p-4" aria-label={content.status}>
      <StatusItem label={content.status}><span className="inline-flex items-center gap-2 font-semibold text-[#168a52]"><i className="size-2 rounded-full bg-[#22a06b] shadow-[0_0_0_4px_rgb(34_160_107_/.12)]" />{content.published}</span></StatusItem>
      <StatusItem label={content.lastUpdate} value={content.today} />
      <StatusItem label={content.language} value={content.currentLanguage} />
    </section>

    <section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <nav className="sticky top-15 z-20 min-w-0 max-w-full overflow-hidden rounded-t-[1.1rem] border border-(--admin-tab-bar-border) border-b-2 bg-admin-page shadow-[inset_0_1px_0_rgb(255_255_255_/.45),0_8px_20px_rgb(15_23_42_/.08)] min-[701px]:top-16" aria-label={content.sectionsTitle} role="tablist">
        <TabScroller sections={content.sections} selectedSection={selectedSection} onSelect={setSelectedSection} />
      </nav>

        <header className="flex flex-wrap items-center gap-4 border-b border-admin-border bg-[linear-gradient(110deg,var(--editor-field),var(--admin-card))] px-5 py-4 sm:px-6"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand">{(() => { const Icon = sectionIcons[selectedSection]; return <Icon size={20} /> })()}</span><div className="min-w-0 flex-1"><h2 className="m-0 font-heading text-base text-admin-heading">{content.sections[selectedSection].label}</h2></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-admin-border bg-admin-control px-3 py-2 text-[.6875rem] font-semibold text-admin-muted">{content.visible}<input type="checkbox" className="peer sr-only" checked={visibility[selectedSection]} onChange={() => toggleVisibility(selectedSection)} /><span aria-hidden="true" className="relative h-5 w-9 shrink-0 rounded-full border border-admin-border bg-[var(--admin-toggle-off)] transition-colors duration-200 peer-checked:border-admin-brand peer-checked:bg-admin-brand after:absolute after:top-1/2 after:right-1 after:size-3 after:-translate-y-1/2 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 peer-checked:after:-translate-x-4" /></label></header>

        <div className="grid gap-6 p-5 sm:p-6">
          <div><h3 className="m-0 font-heading text-sm text-admin-heading">{content.content}</h3><div className="mt-4 grid gap-3">{Object.entries(fieldGroupMap).map(([group, fields]) => { const visibleFields = fields.filter((field) => fieldMap[selectedSection].includes(field)); if (!visibleFields.length) return null; return <div key={group}><fieldset className="grid gap-4 rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4 sm:grid-cols-2"><legend className="-mb-1 rounded-md bg-admin-card px-2 py-1 text-[.6875rem] font-semibold text-admin-brand shadow-[0_1px_2px_rgb(15_23_42_/.06)]">{content.fieldGroups[group]}</legend>{visibleFields.map((field) => <EditorField key={field} label={content.fields[field]} value={selectedContent[field] ?? defaultActionLinks[selectedSection]?.[field] ?? ''} multiline={textareaFields.has(field)} type={linkFields.has(field) ? 'url' : 'text'} full={textareaFields.has(field) || field === 'title'} onChange={(value) => updateField(field, value)} />)}</fieldset>{selectedSection === 'hero' && group === 'actions' && <MediaField content={content.media} value={heroMedia} onChange={setHeroMedia} />}</div> })}</div></div>

          {collectionKey && selectedSection !== 'testimonials' && <div className="border-t border-admin-border pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="m-0 font-heading text-sm text-admin-heading">{content.items}</h3><p className="mt-1.5 mb-0 text-[.6875rem] text-admin-muted">{content.itemsDescription}</p></div>{selectedSection !== 'process' && selectedSection !== 'services' && <button type="button" onClick={() => setAddingItem(true)} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-control px-3 text-[.6875rem] font-semibold text-admin-muted transition hover:border-admin-brand hover:text-admin-brand"><Plus size={14} />{content.manageItems}</button>}</div><div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{collection.map((item, index) => <article key={item.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[color-mix(in_srgb,var(--admin-brand)_28%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-brand)_15%,var(--admin-card))] text-[.6875rem] font-bold text-admin-brand shadow-[0_1px_3px_rgb(15_23_42_/.06)]">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1"><strong className="block truncate text-[.75rem] text-admin-heading">{item.title || item.name}</strong><small className="mt-0.5 block text-[.625rem] text-admin-muted">{content.itemUnits[collectionKey]}</small></span><span className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={() => setEditingItem({ index, item })} className="grid size-8 place-items-center rounded-lg border border-admin-border bg-admin-control text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand" aria-label={content.editItem}><Pencil size={14} /></button>{selectedSection !== 'process' && selectedSection !== 'services' && <button type="button" onClick={async () => { const confirmed = await window.cmsConfirmDelete?.({ title: content.deleteItemTitle, description: content.deleteItemDescription }); if (confirmed) updateCollectionItem(index, { __delete: true }) }} className="grid size-8 place-items-center rounded-lg border border-red-500/25 bg-admin-control text-red-500 transition hover:border-red-500 hover:bg-red-500/10" aria-label={content.deleteItem}><Trash2 size={14} /></button>}</span></article>)}</div></div>}
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
  return <div className="mt-6"><div className="flex items-center justify-between gap-3"><div><h3 className="m-0 font-heading text-sm text-admin-heading">{content.title}</h3><p className="mt-1 mb-0 text-[.6875rem] text-admin-muted">{content.description}</p></div></div>{value ? <div className="relative mt-3 overflow-hidden rounded-2xl border border-admin-border bg-admin-control"><div className="aspect-[16/7] bg-admin-control-soft">{value.type === 'video' ? <video src={value.url} controls className="size-full object-contain" /> : <img src={value.url} alt={value.name} className="size-full object-cover" />}</div><div className="flex justify-center gap-2 border-t border-admin-border bg-admin-card p-3"><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-admin-border bg-admin-control px-3 text-[.6875rem] font-semibold text-admin-muted hover:border-admin-brand hover:text-admin-brand"><Replace size={14} />{content.replace}</button><button type="button" onClick={() => onChange(null)} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-red-600 px-3 text-[.6875rem] font-semibold text-white hover:bg-red-700"><Trash2 size={14} />{content.remove}</button></div></div> : <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files?.[0]) }} className="mt-3 grid min-h-40 w-full place-items-center content-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-control p-5 text-center text-admin-brand transition hover:border-admin-brand hover:bg-admin-brand-soft"><ImagePlus size={28} /><strong className="text-sm text-admin-heading">{content.choose}</strong><span className="text-[.6875rem] text-admin-muted"><UploadCloud size={14} className="mr-1 inline" />{content.drop}</span></button>}<input ref={inputRef} type="file" accept="image/*,video/*" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0])} /></div>
}

function TabScroller({ sections, selectedSection, onSelect }) {
  const scrollRef = useRef(null)
  const buttonRefs = useRef(new Map())
  const [scrollState, setScrollState] = useState({ hasOverflow: false, position: 0, thumbSize: 100 })
  const [activeIndicator, setActiveIndicator] = useState({ right: 0, width: 0, visible: false })

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return undefined

    const updateScrollState = () => {
      const maxScroll = element.scrollWidth - element.clientWidth
      const hasOverflow = maxScroll > 1
      const thumbSize = hasOverflow ? Math.max(18, (element.clientWidth / element.scrollWidth) * 100) : 100
      const position = hasOverflow ? Math.min(100 - thumbSize, (Math.abs(element.scrollLeft) / maxScroll) * (100 - thumbSize)) : 0
      setScrollState({ hasOverflow, position, thumbSize })
      const activeButton = buttonRefs.current.get(selectedSection)
      if (activeButton) {
        const containerRect = element.getBoundingClientRect()
        const buttonRect = activeButton.getBoundingClientRect()
        const contentRight = buttonRect.left - containerRect.left + element.scrollLeft + buttonRect.width
        setActiveIndicator({ right: element.scrollWidth - contentRight, width: buttonRect.width, visible: true })
      }
    }

    updateScrollState()
    let frame = 0
    const handleScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updateScrollState) }
    element.addEventListener('scroll', handleScroll, { passive: true })
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(element)
    return () => { cancelAnimationFrame(frame); element.removeEventListener('scroll', handleScroll); observer.disconnect() }
  }, [sections, selectedSection])

  return <div className="cms-tab-scroller">
    <div ref={scrollRef} className="cms-tabs-scroll relative flex w-full max-w-full min-w-0 flex-nowrap gap-1 overflow-x-auto overscroll-x-contain p-1.5 sm:gap-1.5 sm:px-2"><span aria-hidden="true" className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-lg bg-(--admin-tab-active-bg) shadow-[0_1px_3px_rgb(15_23_42_/.08)] transition-[right,width,opacity] duration-300 ease-out" style={{ right: activeIndicator.right, width: activeIndicator.width, opacity: activeIndicator.visible ? 1 : 0 }} />{Object.entries(sections).map(([key, section]) => { const Icon = sectionIcons[key]; const active = selectedSection === key; return <button ref={(node) => { if (node) buttonRefs.current.set(key, node); else buttonRefs.current.delete(key) }} type="button" role="tab" aria-selected={active} key={key} onClick={() => onSelect(key)} className={`relative z-10 inline-flex min-h-10 w-max shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 text-center text-[.625rem] font-semibold leading-none outline-none transition-colors focus-visible:border-admin-brand focus-visible:shadow-[0_0_0_2px_rgb(245_155_34_/.24)] sm:min-h-10 sm:px-3 sm:text-[.6875rem] ${active ? 'text-admin-brand' : 'text-admin-muted hover:bg-admin-control-soft hover:text-admin-heading'}`}><Icon className="shrink-0" size={14} /><span className="whitespace-nowrap">{section.label}</span></button> })}</div>
    {scrollState.hasOverflow && <div className="cms-tabs-indicator" aria-hidden="true"><span style={{ width: `${scrollState.thumbSize}%`, right: `${scrollState.position}%` }} /></div>}
  </div>
}

function StatusItem({ label, value, children }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl border border-admin-border bg-(--editor-field) px-4 py-3 sm:block sm:border-0 sm:bg-transparent sm:px-3 sm:py-1"><span className="text-[.625rem] font-medium text-admin-muted">{label}</span><span className="text-[.75rem] font-semibold text-admin-heading sm:mt-1.5 sm:block">{children || value}</span></div>
}

function EditorField({ label, value, multiline, type = 'text', full, onChange }) {
  const shared = 'mt-2 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 text-[.8125rem] font-normal text-admin-heading outline-none transition placeholder:text-admin-muted focus:border focus:border-admin-brand'
  const isLink = type === 'url'
  return <label className={`text-[.75rem] font-semibold text-admin-heading ${full ? 'sm:col-span-2' : ''}`}><span>{label}</span>{multiline ? <textarea rows={4} className={`${shared} resize-y py-3 leading-6`} value={value} onChange={(event) => onChange(event.target.value)} /> : <input dir={isLink ? 'ltr' : undefined} type={type} className={`${shared} min-h-11 py-2.5 ${isLink ? 'text-left' : ''}`} value={value} onChange={(event) => onChange(event.target.value)} />}</label>
}

export default HomeEditorSection
