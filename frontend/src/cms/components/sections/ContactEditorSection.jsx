import { useState } from 'react'
import { AtSign, Check, ChevronDown, ContactRound, FileText, Globe2, MapPinned, MessageSquareText, Music2, Phone, Plus, Trash2, X } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTelegram, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6'

import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import SectionTabBar from '@cms/components/SectionTabBar.jsx'
import ContentLanguageSwitcher from '@cms/components/ContentLanguageSwitcher.jsx'
import { EditorField, EditorFieldGroup, EditorPreviewLink, EditorSectionHeader, EditorVisibilityToggle } from '@cms/components/EditorPrimitives.jsx'
import useEditorTabs from '@cms/hooks/useEditorTabs.js'
import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import useModalFocus from '@/shared/hooks/useModalFocus.js'

const tabIcons = { hero: FileText, details: ContactRound, form: MessageSquareText, connections: MapPinned, social: Globe2 }
const detailIcons = { phone: Phone, email: AtSign, address: MapPinned }
const defaultSocialUrls = { facebook: 'https://facebook.com/', instagram: 'https://instagram.com/', linkedin: 'https://linkedin.com/', telegram: 'https://t.me/', youtube: 'https://youtube.com/', whatsapp: 'https://wa.me/', twitter: 'https://x.com/', tiktok: 'https://tiktok.com/' }
const defaultMapUrl = 'https://www.google.com/maps?q=34.529568145213474,69.17050772740252&z=15&output=embed'
const socialOptions = [
  { type: 'facebook', label: 'Facebook', icon: FaFacebookF },
  { type: 'instagram', label: 'Instagram', icon: FaInstagram },
  { type: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn },
  { type: 'telegram', label: 'Telegram', icon: FaTelegram },
  { type: 'youtube', label: 'YouTube', icon: FaYoutube },
  { type: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp },
  { type: 'twitter', label: 'X / Twitter', icon: FaXTwitter },
  { type: 'tiktok', label: 'TikTok', icon: Music2 },
]

const prepareContactDraft = (initialContent) => ({
  ...structuredClone(initialContent),
  contact: {
    ...structuredClone(initialContent.contact),
    mapUrl: initialContent.contact.mapUrl || defaultMapUrl,
    socials: initialContent.contact.socials.map((social) => ({ ...social, href: social.href || defaultSocialUrls[social.type] }))
  }
})

function ContactEditorSection({ content, initialTranslations }) {
  const [selectedTab, setSelectedTab] = useEditorTabs({ defaultTab: 'hero', storageKey: 'globalvision-cms-contact-tab', tabs: Object.keys(tabIcons) })
  const [contentLanguage, setContentLanguage] = useState(() => ['prs', 'ps', 'en'].includes(document.documentElement.lang) ? document.documentElement.lang : 'prs')
  const [drafts, setDrafts] = useCmsDraftState('contact', () => Object.fromEntries(Object.entries(initialTranslations).map(([language, initialContent]) => [language, prepareContactDraft(initialContent)])))
  const draft = drafts[contentLanguage]
  const setDraft = (update) => setDrafts((current) => ({ ...current, [contentLanguage]: typeof update === 'function' ? update(current[contentLanguage]) : update }))
  const [addingSocial, setAddingSocial] = useState(false)
  const [visibility, setVisibility] = useState(() => Object.fromEntries(Object.keys(tabIcons).map((key) => [key, true])))

  const updateHero = (key, value) => setDraft((current) => ({ ...current, hero: { ...current.hero, [key]: value } }))
  const updateContact = (key, value) => setDraft((current) => ({ ...current, contact: { ...current.contact, [key]: value } }))
  const updateForm = (key, value) => setDraft((current) => ({ ...current, contact: { ...current.contact, form: { ...current.contact.form, [key]: value } } }))
  const updateDetail = (index, key, value) => setDraft((current) => ({ ...current, contact: { ...current.contact, details: current.contact.details.map((detail, detailIndex) => detailIndex === index ? { ...detail, [key]: value } : detail) } }))
  const updateSocial = (index, key, value) => setDraft((current) => ({ ...current, contact: { ...current.contact, socials: current.contact.socials.map((social, socialIndex) => socialIndex === index ? { ...social, [key]: value } : social) } }))
  const addSocial = (social) => setDraft((current) => ({ ...current, contact: { ...current.contact, socials: [...current.contact.socials, social] } }))
  const deleteSocial = (index) => setDraft((current) => ({ ...current, contact: { ...current.contact, socials: current.contact.socials.filter((_, socialIndex) => socialIndex !== index) } }))
  const CurrentIcon = tabIcons[selectedTab]


  return <PageContainer>
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.breadcrumb }, { label: content.title }]} action={<EditorPreviewLink href="/contact">{content.visitPage}</EditorPreviewLink>} />

    <section className="min-w-0 w-full overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_38px_rgb(15_23_42_/.055)]">
      <SectionTabBar sections={content.sections} icons={tabIcons} selectedSection={selectedTab} onSelect={setSelectedTab} ariaLabel={content.sectionsTitle} />

      <EditorSectionHeader icon={CurrentIcon} title={content.sections[selectedTab]} action={<div className="flex flex-nowrap items-center gap-2"><EditorVisibilityToggle label={content.visible || 'نمایش داده شود'} checked={visibility[selectedTab]} onChange={() => setVisibility((current) => ({ ...current, [selectedTab]: !current[selectedTab] }))} /><ContentLanguageSwitcher label={content.language || 'زبان محتوا'} value={contentLanguage} onChange={setContentLanguage} /></div>} />

      <div className="p-5 sm:p-6">
        {selectedTab === 'hero' && <EditorFieldGroup columns={false} className="sm:p-5"><EditorField label={content.fields.heroTitle} value={draft.hero.title} onChange={(value) => updateHero('title', value)} /></EditorFieldGroup>}

        {selectedTab === 'details' && <div className="grid gap-5"><EditorField label={content.fields.sectionTitle} value={draft.contact.title} onChange={(value) => updateContact('title', value)} /><div className="grid gap-3 lg:grid-cols-3">{draft.contact.details.map((detail, index) => { const Icon = detailIcons[detail.type]; return <article key={detail.type} className="rounded-2xl border border-admin-border bg-(--editor-field) p-4"><span className="mb-4 grid size-10 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text"><Icon size={18} /></span><EditorField label={detail.label} value={detail.value} dir={detail.type === 'phone' || detail.type === 'email' ? 'ltr' : undefined} onChange={(value) => updateDetail(index, 'value', value)} /></article> })}</div></div>}

        {selectedTab === 'form' && <div className="grid gap-5"><EditorFieldGroup title={content.formFields} className="sm:p-5">{['nameLabel', 'namePlaceholder', 'emailLabel', 'emailPlaceholder', 'subjectLabel', 'subjectPlaceholder', 'messageLabel', 'messagePlaceholder'].map((field) => <EditorField key={field} label={content.fields[field]} value={draft.contact.form[field] || ''} onChange={(value) => updateForm(field, value)} />)}</EditorFieldGroup><EditorFieldGroup title={content.formFeedback} columns={false} className="sm:p-5"><EditorField label={content.fields.successMessage} value={draft.contact.form.successMessage} multiline onChange={(value) => updateForm('successMessage', value)} /><EditorField label={content.fields.requiredMessage} value={draft.contact.form.requiredMessage} multiline onChange={(value) => updateForm('requiredMessage', value)} /></EditorFieldGroup></div>}

        {selectedTab === 'connections' && <div className="grid gap-6"><EditorFieldGroup title={content.mapSettings} columns={false} className="sm:p-5"><EditorField label={content.fields.mapTitle} value={draft.contact.mapTitle} onChange={(value) => updateContact('mapTitle', value)} /><EditorField label={content.fields.mapUrl} value={draft.contact.mapUrl} type="url" onChange={(value) => updateContact('mapUrl', value)} /></EditorFieldGroup></div>}
        {selectedTab === 'social' && <div className="grid gap-6"><EditorFieldGroup title={content.socialSettings} columns={false} className="sm:p-5"><div className="flex justify-end"><button type="button" onClick={() => setAddingSocial(true)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-admin-brand bg-admin-brand-soft px-4 text-xs font-semibold text-admin-brand-text transition hover:bg-admin-brand hover:text-white"><Plus size={15} />{content.addSocial}</button></div><div className="grid gap-3 sm:grid-cols-2">{draft.contact.socials.map((social, index) => <article key={`${social.type}-${index}`} className="grid grid-cols-[1fr_auto] items-start gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><div className="grid gap-1"><SocialPlatformSelect value={social.type} onChange={(option) => { updateSocial(index, 'type', option.type); updateSocial(index, 'label', option.label) }} /><EditorField label={content.fields.socialUrl} hideLabel value={social.href} type="url" onChange={(value) => updateSocial(index, 'href', value)} /></div><button type="button" onClick={() => deleteSocial(index)} aria-label={content.deleteSocial} className="grid size-8 place-items-center rounded-lg border border-red-500/25 text-red-500 transition hover:border-red-500 hover:bg-red-500/10"><Trash2 size={15} /></button></article>)}</div></EditorFieldGroup></div>}
      </div>
    </section>

    {addingSocial && <SocialLinkModal content={content} onClose={() => setAddingSocial(false)} onSave={(social) => { addSocial(social); setAddingSocial(false) }} />}

  </PageContainer>
}

export default ContactEditorSection

function SocialLinkModal({ content, onClose, onSave }) {
  const [closing, setClosing] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(socialOptions[0])
  const [href, setHref] = useState('')
  const SelectedIcon = selected.icon
  const close = () => { if (closing) return; setClosing(true); window.setTimeout(onClose, 200) }
  const dialogRef = useModalFocus({ onClose: close })
  const save = (event) => { event.preventDefault(); if (!href.trim() || closing) return; setClosing(true); window.setTimeout(() => onSave({ type: selected.type, label: selected.label, href: href.trim() }), 200) }
  return <div className={`cms-modal-backdrop fixed inset-0 z-[80] isolate grid place-items-center p-4 ${closing ? 'animate-cms-modal-backdrop-out' : 'animate-cms-modal-backdrop-in'}`} onMouseDown={close}>
    <form ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="social-dialog-title" aria-describedby="social-dialog-description" onSubmit={save} onMouseDown={(event) => event.stopPropagation()} className={`relative z-10 grid w-full max-w-lg gap-5 rounded-2xl border border-admin-border bg-admin-card p-5 shadow-2xl sm:p-6 ${closing ? 'animate-cms-modal-panel-out' : 'animate-cms-modal-panel-in'}`}>
      <header className="flex items-start justify-between gap-4"><div><h2 id="social-dialog-title" className="font-heading text-lg text-admin-heading">{content.addSocial}</h2><p id="social-dialog-description" className="mt-1 text-xs text-admin-muted">{content.socialModalDescription}</p></div><button type="button" onClick={close} aria-label={content.close} className="grid size-9 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:text-admin-brand-text"><X size={17} /></button></header>
      <div className="grid gap-4"><div className="relative"><span className="text-[.75rem] font-semibold text-admin-heading">{content.socialPlatform}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="mt-2 flex min-h-11 w-full items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 text-sm text-admin-heading transition hover:border-admin-brand"><SelectedIcon size={17} className="text-admin-brand-text" /><span className="min-w-0 flex-1 text-right">{selected.label}</span><ChevronDown size={16} className={`text-admin-muted transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <div role="listbox" className="absolute inset-x-0 top-full z-10 mt-2 grid max-h-56 gap-1 overflow-y-auto rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)]">{socialOptions.map((option) => { const Icon = option.icon; return <button key={option.type} type="button" role="option" aria-selected={selected.type === option.type} onClick={() => { setSelected(option); setOpen(false) }} className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-right text-xs font-semibold transition ${selected.type === option.type ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand-text'}`}><Icon size={16} /><span className="flex-1">{option.label}</span>{selected.type === option.type && <Check size={14} />}</button> })}</div>}</div><label className="block text-[.75rem] font-semibold text-admin-heading"><span>{content.socialUrl}</span><input required type="url" dir="ltr" value={href} onChange={(event) => setHref(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 py-2.5 text-left text-sm font-normal text-admin-heading outline-none transition focus:border-admin-brand" placeholder="https://" /></label></div>
      <footer className="flex justify-end gap-2"><button type="button" onClick={close} className="min-h-10 rounded-xl border border-admin-border px-4 text-xs font-semibold text-admin-muted hover:border-admin-brand hover:text-admin-brand-text">{content.cancel}</button><button type="submit" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-admin-brand px-5 text-xs font-semibold text-white hover:bg-orange-500"><Plus size={15} />{content.add}</button></footer>
    </form>
  </div>
}

function SocialPlatformSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const selected = socialOptions.find((option) => option.type === value) || socialOptions[0]
  const SelectedIcon = selected.icon

  return <div className="relative"><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 text-sm text-admin-heading transition hover:border-admin-brand"><SelectedIcon size={17} className="text-admin-brand-text" /><span className="min-w-0 flex-1 text-right">{selected.label}</span><ChevronDown size={16} className={`text-admin-muted transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <div role="listbox" className="absolute inset-x-0 top-full z-10 mt-2 grid max-h-56 gap-1 overflow-y-auto rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)]">{socialOptions.map((option) => { const Icon = option.icon; return <button key={option.type} type="button" role="option" aria-selected={selected.type === option.type} onClick={() => { onChange(option); setOpen(false) }} className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-right text-xs font-semibold transition ${selected.type === option.type ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand-text'}`}><Icon size={16} /><span className="flex-1">{option.label}</span>{selected.type === option.type && <Check size={14} />}</button> })}</div>}</div>
}
