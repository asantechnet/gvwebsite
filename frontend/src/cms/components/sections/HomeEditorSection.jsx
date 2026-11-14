import { useState } from 'react'
import { BriefcaseBusiness, Flag, GalleryVerticalEnd, Handshake, ImagePlus, LayoutTemplate, MapPinned, MessageSquareQuote, Pencil, Plus, Replace, Trash2 } from 'lucide-react'

import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import CollectionItemModal from '@cms/components/CollectionItemModal.jsx'
import SectionTabBar from '@cms/components/SectionTabBar.jsx'
import ContentLanguageSwitcher from '@cms/components/ContentLanguageSwitcher.jsx'
import MediaPickerModal from '@cms/components/MediaPickerModal.jsx'
import { EditorField, EditorFieldGroup, EditorPreviewLink, EditorSectionHeader, EditorVisibilityToggle } from '@cms/components/EditorPrimitives.jsx'
import useEditorTabs from '@cms/hooks/useEditorTabs.js'
import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import { revokeLocalUpload } from '@/shared/uploads/files.js'
import { showRecordToast } from '@cms/utils/toast.js'
import { useCmsContentLanguage } from '@cms/hooks/useCmsLanguage.js'
import englishMedia from '@cms/locales/en/media.json'
import dariMedia from '@cms/locales/prs/media.json'
import pashtoMedia from '@cms/locales/ps/media.json'

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
const defaultActionLinks = { hero: { primaryActionHref: '/contact', secondaryActionHref: '/opportunities/study' }, opportunities: { viewAllHref: '/opportunities/study' }, destinations: { viewAllHref: '/opportunities/study' }, services: { viewAllHref: '/services/consultation' }, consultation: { primaryActionHref: '/contact', secondaryActionHref: '/opportunities/study' } }
const fieldGroupMap = { heading: ['titleBefore', 'titleHighlight', 'titleAfter', 'title'], body: ['description', 'viewAll', 'viewAllHref'], actions: ['primaryAction', 'primaryActionHref', 'secondaryAction', 'secondaryActionHref'] }
function HomeEditorSection({ content, initialTranslations, interfaceLanguage }) {
  const [selectedSection, setSelectedSection] = useEditorTabs({ defaultTab: 'hero', storageKey: 'globalvision-cms-home-tab', tabs: Object.keys(sectionIcons) })
  const [contentLanguage, setContentLanguage] = useCmsContentLanguage(interfaceLanguage)
  const [drafts, setDrafts, { saveImmediate }] = useCmsDraftState('home', () => structuredClone(initialTranslations))
  const [editingItem, setEditingItem] = useState(null)
  const [addingItem, setAddingItem] = useState(false)
  const draft = drafts[contentLanguage]
  const selectedContent = draft[selectedSection]
  const heroMedia = draft.hero.media || null
  const collectionKey = collectionKeys[selectedSection]
  const collection = collectionKey ? selectedContent[collectionKey] : []

  const updateField = (field, value) => setDrafts((current) => ({ ...current, [contentLanguage]: { ...current[contentLanguage], [selectedSection]: { ...current[contentLanguage][selectedSection], [field]: value } } }))
  const updateHeroMedia = (media) => setDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, {
    ...languageDraft,
    hero: { ...languageDraft.hero, media },
  }])))
  const toggleVisibility = (key) => setDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, [key]: { ...languageDraft[key], visible: selectedContent.visible === false } }])))
  const saveCollectionTranslations = (localizedItems, index = null) => saveImmediate((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => {
    const items = languageDraft[selectedSection][collectionKey]
    const item = localizedItems[language]
    return [language, { ...languageDraft, [selectedSection]: { ...languageDraft[selectedSection], [collectionKey]: index === null ? [...items, item] : items.map((entry, itemIndex) => itemIndex === index ? { ...entry, ...item } : entry) } }]
  })))
  const deleteCollectionItem = async (index) => {
    await saveImmediate((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, [selectedSection]: { ...languageDraft[selectedSection], [collectionKey]: languageDraft[selectedSection][collectionKey].filter((_, itemIndex) => itemIndex !== index) } }])))
    showRecordToast('recordDeleted')
  }

  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} action={<EditorPreviewLink>{content.visitPage}</EditorPreviewLink>} />

    <section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <SectionTabBar sections={content.sections} icons={sectionIcons} selectedSection={selectedSection} onSelect={setSelectedSection} ariaLabel={content.sectionsTitle} />

        <EditorSectionHeader icon={sectionIcons[selectedSection]} title={content.sections[selectedSection].label} action={<div className="flex flex-nowrap items-center gap-2"><EditorVisibilityToggle label={content.visible} checked={selectedContent.visible !== false} onChange={() => toggleVisibility(selectedSection)} /><ContentLanguageSwitcher label={content.language || 'زبان محتوا'} value={contentLanguage} onChange={setContentLanguage} /></div>} />

        <div className="grid gap-6 p-5 sm:p-6">
          <div><div className="grid gap-3">{Object.entries(fieldGroupMap).map(([group, fields]) => { const visibleFields = fields.filter((field) => fieldMap[selectedSection].includes(field)); if (!visibleFields.length) return null; return <div key={group}><EditorFieldGroup title={content.fieldGroups[group]}>{visibleFields.map((field) => <EditorField key={field} label={content.fields[field]} value={selectedContent[field] ?? defaultActionLinks[selectedSection]?.[field] ?? ''} multiline={textareaFields.has(field)} type={linkFields.has(field) ? 'url' : 'text'} dir={linkFields.has(field) || contentLanguage === 'en' ? 'ltr' : 'rtl'} full={textareaFields.has(field) || field === 'title'} onChange={(value) => updateField(field, value)} />)}</EditorFieldGroup>{selectedSection === 'hero' && group === 'actions' && <MediaField content={content.media} value={heroMedia} onChange={updateHeroMedia} />}</div> })}</div></div>

          {collectionKey && <CollectionCards section={selectedSection} items={collection} content={content} language={contentLanguage} onAdd={() => setAddingItem(true)} onEdit={(index, item) => setEditingItem({ index, item })} onDelete={deleteCollectionItem} />}
        </div>
    </section>
    {editingItem && <CollectionItemModal content={content} initialLanguage={contentLanguage} initialTranslations={Object.fromEntries(Object.entries(drafts).map(([language, languageDraft]) => [language, languageDraft[selectedSection][collectionKey]?.[editingItem.index] || {}]))} isCountry={collectionKey === 'countries'} isProcess={collectionKey === 'steps'} isTestimonial={selectedSection === 'testimonials'} onClose={() => setEditingItem(null)} onSave={async (localizedItems) => { await saveCollectionTranslations(localizedItems, editingItem.index); setEditingItem(null) }} />}
    {addingItem && <CollectionItemModal mode="add" content={content} initialLanguage={contentLanguage} item={collection[0]} isCountry={collectionKey === 'countries'} isProcess={collectionKey === 'steps'} isTestimonial={selectedSection === 'testimonials'} onClose={() => setAddingItem(false)} onSave={async (localizedItems) => { await saveCollectionTranslations(localizedItems); setAddingItem(false); showRecordToast('recordAdded') }} />}
  </PageContainer>
}

function CollectionCards({ section, items, content, language, onAdd, onEdit, onDelete }) {
  const canAddOrDelete = !['process', 'services', 'testimonials'].includes(section)
  const remove = async (index) => {
    const confirmed = await window.cmsConfirmDelete?.({ title: content.deleteItemTitle, description: content.deleteItemDescription })
    if (confirmed) onDelete(index)
  }
  return <div className="border-t border-admin-border pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="m-0 font-heading text-sm text-admin-heading">{content.items}</h3>{canAddOrDelete && <button type="button" onClick={onAdd} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border border-admin-brand bg-admin-brand px-3 text-[.6875rem] font-semibold text-white transition hover:bg-orange-500"><Plus size={14} />{content.manageItems}</button>}</div><div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{items.map((item, index) => section === 'testimonials' ? <article key={item.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-4"><span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-admin-border bg-admin-brand-soft text-admin-brand-text">{item.avatar ? <img src={item.avatar} alt="" className="size-full object-cover" /> : <MessageSquareQuote size={17} />}</span><strong dir={language === 'en' ? 'ltr' : 'rtl'} className="min-w-0 flex-1 truncate text-[.75rem] text-admin-heading">{item.name}</strong><button type="button" onClick={() => onEdit(index, item)} className="grid size-8 shrink-0 place-items-center rounded-lg border border-admin-border bg-admin-control text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" aria-label={content.editItem}><Pencil size={14} /></button></article> : <article key={item.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[color-mix(in_srgb,var(--admin-brand)_28%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-brand)_15%,var(--admin-card))] text-[.6875rem] font-bold text-admin-brand-text shadow-[0_1px_3px_rgb(15_23_42_/.06)]">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1"><strong dir={language === 'en' ? 'ltr' : 'rtl'} className="block truncate text-[.75rem] text-admin-heading">{item.title || item.name}</strong></span><span className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={() => onEdit(index, item)} className="grid size-8 shrink-0 place-items-center rounded-lg border border-admin-border bg-admin-control text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" aria-label={content.editItem}><Pencil size={14} /></button>{canAddOrDelete && <button type="button" onClick={() => remove(index)} className="grid size-8 place-items-center rounded-lg border border-red-500/25 dark:border-red-500/50 bg-admin-control text-red-500 transition hover:border-red-500 hover:bg-red-500/10" aria-label={content.deleteItem}><Trash2 size={14} /></button>}</span></article>)}</div></div>
}

function MediaField({ content, value, onChange }) {
  const [pickingMedia, setPickingMedia] = useState(false)
  const language = document.documentElement.lang
  const mediaContent = language === 'en' ? englishMedia : language === 'ps' ? pashtoMedia : dariMedia
  const selectMedia = (media) => { revokeLocalUpload(value?.url); onChange({ name: media.name, type: media.type, url: media.url }); setPickingMedia(false) }
  return <div className="mt-6"><div className="flex items-center justify-between gap-3"><h3 className="m-0 font-heading text-sm text-admin-heading">{content.title}</h3></div>{value ? <div className="relative mt-3 aspect-[16/7] overflow-hidden rounded-xl border border-(--editor-field-border) bg-(--editor-input)">{value.type === 'video' ? <video src={value.url} controls className="size-full object-contain" /> : <img src={value.url} alt={value.name} className="size-full object-cover" />}<div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/75 via-black/45 to-transparent px-3 pb-3 pt-10"><button type="button" onClick={() => setPickingMedia(true)} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-3 text-[.65rem] font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/25"><Replace size={13} />{content.replace}</button><button type="button" onClick={() => onChange(null)} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-red-300/50 bg-red-600/75 px-3 text-[.65rem] font-semibold text-white backdrop-blur-sm transition hover:bg-red-600"><Trash2 size={13} />{content.remove}</button></div></div> : <button type="button" onClick={() => setPickingMedia(true)} className="mt-2 grid min-h-28 w-full place-items-center content-center gap-1.5 rounded-xl border-2 border-dashed border-(--editor-field-border) bg-(--editor-input) p-4 text-center text-admin-brand-text hover:border-admin-brand hover:bg-admin-brand-soft"><ImagePlus size={24} /><strong className="text-xs text-admin-heading">{mediaContent.picker.fieldChoose}</strong></button>}{pickingMedia && <MediaPickerModal content={mediaContent} acceptedKinds={['image', 'video']} onClose={() => setPickingMedia(false)} onSelect={selectMedia} />}</div>
}

export default HomeEditorSection
