import { useState } from 'react'
import { LayoutTemplate, Pencil, X } from 'lucide-react'

import MediaUploadField from '@cms/components/MediaUploadField.jsx'
import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import SectionTabBar from '@cms/components/SectionTabBar.jsx'
import { EditorField, EditorFieldGroup, EditorPreviewLink, EditorSectionHeader } from '@cms/components/EditorPrimitives.jsx'
import useEditorTabs from '@cms/hooks/useEditorTabs.js'

const sectionIcons = { hero: LayoutTemplate }

function MagazineEditorSection({ content, initialContent }) {
  const [selectedSection, setSelectedSection] = useEditorTabs({ defaultTab: 'hero', storageKey: 'globalvision-cms-magazine-tab', tabs: Object.keys(sectionIcons) })
  const [draft, setDraft] = useState(() => structuredClone(initialContent))
  const [editing, setEditing] = useState(null)
  const collection = selectedSection === 'news' ? draft.news.items : selectedSection === 'articles' ? draft.articles.items : []
  const updateSection = (key, value) => setDraft((current) => ({ ...current, [selectedSection]: { ...current[selectedSection], [key]: value } }))
  const updateItem = (item) => setDraft((current) => ({ ...current, [editing.section]: { ...current[editing.section], items: current[editing.section].items.map((entry, index) => index === editing.index ? item : entry) } }))

  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} action={<EditorPreviewLink href="/magazine">{content.preview}</EditorPreviewLink>} />
    <section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <SectionTabBar sections={{ hero: content.sections.hero }} icons={sectionIcons} selectedSection={selectedSection} onSelect={setSelectedSection} ariaLabel={content.sectionsTitle} />
      <EditorSectionHeader icon={sectionIcons[selectedSection]} title={content.sections[selectedSection].label} />
      <div className="grid gap-6 p-5 sm:p-6">
        {selectedSection === 'hero' && <EditorFieldGroup columns={false}><EditorField label={content.fields.heroTitle} value={draft.hero.title} onChange={(value) => updateSection('title', value)} /></EditorFieldGroup>}
        {selectedSection === 'news' && <CardSection title={draft.news.title} items={collection} content={content} onTitleChange={(value) => updateSection('title', value)} onEdit={(index) => setEditing({ section: 'news', index, item: collection[index] })} />}
        {selectedSection === 'articles' && <CardSection title={draft.articles.title} items={collection} content={content} onTitleChange={(value) => updateSection('title', value)} onEdit={(index) => setEditing({ section: 'articles', index, item: collection[index] })} />}
      </div>
    </section>
    {editing && <MagazineItemModal content={content} item={editing.item} onClose={() => setEditing(null)} onSave={(item) => { updateItem(item); setEditing(null) }} />}
  </PageContainer>
}

function CardSection({ title, items, content, onTitleChange, onEdit }) {
  return <div className="grid gap-5"><EditorFieldGroup columns={false}><EditorField label={content.fields.sectionTitle} value={title} onChange={onTitleChange} /></EditorFieldGroup><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map((item, index) => <article key={`${item.slug || item.title}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><img src={item.image} alt="" className="size-14 shrink-0 rounded-lg object-cover" /><div className="min-w-0 flex-1"><strong className="block truncate text-[.75rem] text-admin-heading">{item.title}</strong><span className="mt-1 block truncate text-[.625rem] text-admin-muted">{item.category}</span></div><button type="button" onClick={() => onEdit(index)} aria-label={content.editItem} className="grid size-8 shrink-0 place-items-center rounded-lg border border-admin-border bg-admin-control text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand"><Pencil size={14} /></button></article>)}</div></div>
}

function MagazineItemModal({ content, item, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...item }))
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  return <div className="cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center overflow-y-auto p-4" onMouseDown={onClose}><form onSubmit={(event) => { event.preventDefault(); onSave(draft) }} onMouseDown={(event) => event.stopPropagation()} className="relative z-10 my-auto grid w-full max-w-2xl gap-5 rounded-2xl border border-admin-border bg-admin-card p-5 shadow-2xl sm:p-6"><header className="flex items-start justify-between gap-4"><div><h2 className="font-heading text-lg text-admin-heading">{content.editItem}</h2><p className="mt-1 text-xs text-admin-muted">{content.itemModalDescription}</p></div><button type="button" onClick={onClose} aria-label={content.close} className="grid size-9 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:text-admin-brand"><X size={17} /></button></header><EditorFieldGroup><EditorField label={content.fields.itemTitle} value={draft.title} full onChange={(value) => update('title', value)} /><EditorField label={content.fields.category} value={draft.category || ''} onChange={(value) => update('category', value)} /><EditorField label={content.fields.description} value={draft.description} multiline full onChange={(value) => update('description', value)} /><MediaUploadField value={draft.image} onChange={(image) => update('image', image)} content={{ countryImage: content.fields.image, choose: content.chooseImage, drop: content.dropImage, replace: content.replaceImage, remove: content.removeImage }} /></EditorFieldGroup><footer className="flex justify-end gap-2"><button type="button" onClick={onClose} className="min-h-10 rounded-xl border border-admin-border px-4 text-xs font-semibold text-admin-muted hover:border-admin-brand hover:text-admin-brand">{content.cancel}</button><button type="submit" className="min-h-10 rounded-xl bg-admin-brand px-5 text-xs font-semibold text-white hover:bg-orange-500">{content.save}</button></footer></form></div>
}

export default MagazineEditorSection
