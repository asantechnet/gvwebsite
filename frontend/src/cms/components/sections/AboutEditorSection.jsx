import { useEffect, useState } from 'react'
import { CheckCircle2, CircleHelp, Eye, Flag, History, LayoutTemplate, Pencil, Plus, Sparkles, Trash2, Users, X } from 'lucide-react'

import MediaUploadField from '@cms/components/MediaUploadField.jsx'
import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import SectionTabBar from '@cms/components/SectionTabBar.jsx'
import ContentLanguageSwitcher from '@cms/components/ContentLanguageSwitcher.jsx'
import { EditorField, EditorFieldGroup, EditorPreviewLink, EditorSectionHeader, EditorVisibilityToggle } from '@cms/components/EditorPrimitives.jsx'
import useEditorTabs from '@cms/hooks/useEditorTabs.js'
import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import useModalFocus from '@/shared/hooks/useModalFocus.js'
import { showRecordToast } from '@cms/utils/toast.js'
import { closeCmsModal } from '@cms/utils/modalTransition.js'
import { useCmsContentLanguage } from '@cms/hooks/useCmsLanguage.js'

const sectionIcons = { hero: LayoutTemplate, introduction: Sparkles, missionVision: Eye, story: History, faq: CircleHelp, team: Users, cta: Flag }
const collectionKeys = { introduction: 'values', story: 'milestones', faq: 'items', team: 'members' }

function AboutEditorSection({ content, initialTranslations }) {
  const [selectedSection, setSelectedSection] = useEditorTabs({ defaultTab: 'hero', storageKey: 'globalvision-cms-about-tab', tabs: Object.keys(sectionIcons) })
  const [contentLanguage, setContentLanguage] = useCmsContentLanguage()
  const [drafts, setDrafts] = useCmsDraftState('about', () => structuredClone(initialTranslations))
  const draft = drafts[contentLanguage]
  const setDraft = (update) => setDrafts((current) => ({ ...current, [contentLanguage]: typeof update === 'function' ? update(current[contentLanguage]) : update }))
  const [visibility, setVisibility] = useState(() => Object.fromEntries(Object.keys(sectionIcons).map((key) => [key, true])))
  const [editingItem, setEditingItem] = useState(null)
  const [addingItem, setAddingItem] = useState(false)
  const collectionKey = collectionKeys[selectedSection]
  const collection = collectionKey ? draft[selectedSection][collectionKey] : []

  const updateSection = (field, value) => setDraft((current) => ({ ...current, [selectedSection]: { ...current[selectedSection], [field]: value } }))
  const updateNested = (group, field, value) => setDraft((current) => ({ ...current, [selectedSection]: { ...current[selectedSection], [group]: { ...current[selectedSection][group], [field]: value } } }))
  const saveCollectionTranslations = (localizedItems) => setDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => {
    const items = languageDraft[selectedSection][collectionKey]
    const item = localizedItems[language]
    return [language, { ...languageDraft, [selectedSection]: { ...languageDraft[selectedSection], [collectionKey]: editingItem === null ? [...items, item] : items.map((entry, index) => index === editingItem ? item : entry) } }]
  })))
  const deleteCollectionItem = async (index) => {
    const confirmed = await window.cmsConfirmDelete?.({ title: content.deleteItemTitle, description: content.deleteItemDescription })
    if (confirmed) {
      setDraft((current) => ({ ...current, [selectedSection]: { ...current[selectedSection], [collectionKey]: current[selectedSection][collectionKey].filter((_, itemIndex) => itemIndex !== index) } }))
      showRecordToast('recordDeleted')
    }
  }

  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} action={<EditorPreviewLink href="/about">{content.visitPage}</EditorPreviewLink>} />

    <section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <SectionTabBar sections={content.sections} icons={sectionIcons} selectedSection={selectedSection} onSelect={setSelectedSection} ariaLabel={content.sectionsTitle} />
      <EditorSectionHeader icon={sectionIcons[selectedSection]} title={content.sections[selectedSection].label} action={<div className="flex flex-nowrap items-center gap-2"><EditorVisibilityToggle label={content.visible} checked={visibility[selectedSection]} onChange={() => setVisibility((current) => ({ ...current, [selectedSection]: !current[selectedSection] }))} /><ContentLanguageSwitcher label={content.language || 'زبان محتوا'} value={contentLanguage} onChange={setContentLanguage} /></div>} />

      <div className="grid gap-6 p-5 sm:p-6">
        <div>
          <div className="grid gap-3">
            {selectedSection === 'hero' && <EditorField label={content.fields.title} value={draft.hero.title} onChange={(value) => updateSection('title', value)} />}
            {selectedSection === 'introduction' && <EditorFieldGroup title={content.fieldGroups.body}><EditorField label={content.fields.title} value={draft.introduction.title} full onChange={(value) => updateSection('title', value)} /><EditorField label={content.fields.description} value={draft.introduction.description} multiline full onChange={(value) => updateSection('description', value)} /></EditorFieldGroup>}
            {selectedSection === 'missionVision' && <div className="grid gap-3 lg:grid-cols-2"><EditorFieldGroup title={content.mission}><EditorField label={content.fields.title} value={draft.missionVision.mission.title} onChange={(value) => updateNested('mission', 'title', value)} /><EditorField label={content.fields.description} value={draft.missionVision.mission.description} multiline full onChange={(value) => updateNested('mission', 'description', value)} /></EditorFieldGroup><EditorFieldGroup title={content.vision}><EditorField label={content.fields.title} value={draft.missionVision.vision.title} onChange={(value) => updateNested('vision', 'title', value)} /><EditorField label={content.fields.description} value={draft.missionVision.vision.description} multiline full onChange={(value) => updateNested('vision', 'description', value)} /></EditorFieldGroup></div>}
            {selectedSection === 'story' && <EditorFieldGroup title={content.fieldGroups.heading} columns={false}><EditorField label={content.fields.title} value={draft.story.title} onChange={(value) => updateSection('title', value)} /></EditorFieldGroup>}
            {selectedSection === 'faq' && <EditorFieldGroup title={content.fieldGroups.heading} columns={false}><EditorField label={content.fields.title} value={draft.faq.title} onChange={(value) => updateSection('title', value)} /></EditorFieldGroup>}
            {selectedSection === 'team' && <EditorFieldGroup title={content.fieldGroups.heading} columns={false}><EditorField label={content.fields.title} value={draft.team.title} onChange={(value) => updateSection('title', value)} /></EditorFieldGroup>}
            {selectedSection === 'cta' && <><EditorFieldGroup title={content.fieldGroups.body}><EditorField label={content.fields.title} value={draft.cta.title} full onChange={(value) => updateSection('title', value)} /><EditorField label={content.fields.description} value={draft.cta.description} multiline full onChange={(value) => updateSection('description', value)} /></EditorFieldGroup><EditorFieldGroup title={content.fieldGroups.actions}><EditorField label={content.fields.primaryAction} value={draft.cta.primaryAction.label} onChange={(value) => updateNested('primaryAction', 'label', value)} /><EditorField label={content.fields.primaryActionHref} type="url" value={draft.cta.primaryAction.href} onChange={(value) => updateNested('primaryAction', 'href', value)} /><EditorField label={content.fields.secondaryAction} value={draft.cta.secondaryAction.label} onChange={(value) => updateNested('secondaryAction', 'label', value)} /><EditorField label={content.fields.secondaryActionHref} type="url" value={draft.cta.secondaryAction.href} onChange={(value) => updateNested('secondaryAction', 'href', value)} /></EditorFieldGroup></>}
          </div>
        </div>

        {collectionKey && <div className="border-t border-admin-border pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="m-0 font-heading text-sm text-admin-heading">{content.items[selectedSection]}</h3>{(selectedSection === 'team' || selectedSection === 'faq') && <button type="button" onClick={() => { setEditingItem(null); setAddingItem(true) }} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border border-admin-brand bg-admin-brand px-3 text-[.6875rem] font-semibold text-white transition hover:bg-orange-500"><Plus size={14} />{content.addItem}</button>}</div><div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">{collection.map((item, index) => <article key={`${item.title || item.question || item.name}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[color-mix(in_srgb,var(--admin-brand)_28%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-brand)_15%,var(--admin-card))] text-admin-brand-text"><CheckCircle2 size={16} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-[.75rem] text-admin-heading">{item.title || item.question || item.name}</strong></span><span className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={() => { setEditingItem(index); setAddingItem(true) }} className="grid size-8 place-items-center rounded-lg border border-admin-border bg-admin-control text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" aria-label={content.editItem}><Pencil size={14} /></button><button type="button" onClick={() => deleteCollectionItem(index)} className="grid size-8 place-items-center rounded-lg border border-red-500/25 dark:border-red-500/50 bg-admin-control text-red-500 transition hover:border-red-500 hover:bg-red-500/10" aria-label={content.deleteItem}><Trash2 size={14} /></button></span></article>)}</div></div>}
      </div>
    </section>

    {addingItem && <AboutItemModal content={content} type={selectedSection} initialLanguage={contentLanguage} initialTranslations={Object.fromEntries(Object.entries(drafts).map(([language, languageDraft]) => [language, editingItem === null ? null : languageDraft[selectedSection][collectionKey]?.[editingItem] || null]))} onClose={() => closeCmsModal(() => setAddingItem(false))} onSave={(localizedItems) => closeCmsModal(() => { saveCollectionTranslations(localizedItems); setAddingItem(false); if (editingItem === null) showRecordToast('recordAdded') })} />}
  </PageContainer>
}

function AboutItemModal({ content, type, initialLanguage, initialTranslations, onClose, onSave }) {
  const emptyItem = type === 'faq' ? { question: '', answer: '' } : type === 'team' ? { name: '', role: '', avatar: '', avatarAlt: '' } : { title: '', description: '' }
  const [contentLanguage, setContentLanguage] = useCmsContentLanguage(initialLanguage)
  const [popupDrafts, setPopupDrafts] = useState(() => Object.fromEntries(['prs', 'ps', 'en'].map((language) => [language, { ...emptyItem, ...initialTranslations[language] }])))
  const draft = popupDrafts[contentLanguage]
  const setDraft = (update) => setPopupDrafts((current) => ({ ...current, [contentLanguage]: typeof update === 'function' ? update(current[contentLanguage]) : update }))
  const fields = type === 'faq' ? [['question', content.fields.question], ['answer', content.fields.answer]] : type === 'team' ? [['name', content.fields.name], ['role', content.fields.role]] : [['title', content.fields.title], ['description', content.fields.description]]
  const save = (event) => { event.preventDefault(); onSave(Object.fromEntries(Object.entries(popupDrafts).map(([language, languageDraft]) => [language, type === 'team' ? { ...languageDraft, avatarAlt: languageDraft.name } : languageDraft]))) }
  const dialogRef = useModalFocus({ onClose })

  const isEditing = Object.values(initialTranslations).some(Boolean)
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.classList.add('cms-modal-open')
    return () => { document.body.style.overflow = previousBodyOverflow; document.documentElement.style.overflow = previousDocumentOverflow; document.documentElement.classList.remove('cms-modal-open') }
  }, [])

  return <div className="cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center p-4 animate-cms-modal-backdrop-in" onMouseDown={onClose}><form ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="about-item-dialog-title" onSubmit={save} onMouseDown={(event) => event.stopPropagation()} className="cms-collection-modal relative z-10 my-auto flex max-h-[calc(100svh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-2xl animate-cms-modal-panel-in"><header className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:flex sm:justify-between lg:gap-4"><div className="min-w-0 flex-1"><h2 id="about-item-dialog-title" className="m-0 truncate font-heading text-base text-admin-heading sm:text-lg">{isEditing ? content.editItemTitle : content.addItemTitle}</h2></div><ContentLanguageSwitcher className="!w-11 sm:!w-28 lg:!w-auto" iconOnlyMobile label={content.language || 'زبان محتوا'} value={contentLanguage} onChange={setContentLanguage} /><button type="button" onClick={onClose} aria-label={content.close} className="grid size-9 shrink-0 place-items-center rounded-xl border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text dark:bg-admin-control"><X size={17} /></button></header><div className="grid gap-4" dir={contentLanguage === 'en' ? 'ltr' : 'rtl'}>{fields.map(([field, label]) => <EditorField key={field} label={label} value={draft[field]} multiline={field === 'description' || field === 'answer'} dir={contentLanguage === 'en' ? 'ltr' : 'rtl'} onChange={(value) => setDraft((current) => ({ ...current, [field]: value }))} />)}{type === 'team' && <MediaUploadField value={draft.avatar} onChange={(avatar) => setPopupDrafts((current) => Object.fromEntries(Object.entries(current).map(([language, languageDraft]) => [language, { ...languageDraft, avatar }]))) } content={{ countryImage: content.fields.avatar, choose: content.chooseImage, drop: content.dropImage, replace: content.replaceImage, remove: content.removeImage }} />}</div><footer className="flex justify-end gap-2"><button type="button" onClick={onClose} className="min-h-7 rounded-lg border border-admin-border bg-admin-control px-4 text-xs font-semibold text-admin-muted hover:border-admin-brand hover:text-admin-brand-text">{content.cancel}</button><button type="submit" className="inline-flex min-h-7 items-center justify-center gap-2 rounded-lg bg-admin-brand px-4 text-xs font-semibold text-white hover:bg-orange-500"><Plus size={15} />{content.save}</button></footer></form></div>
}

export default AboutEditorSection
