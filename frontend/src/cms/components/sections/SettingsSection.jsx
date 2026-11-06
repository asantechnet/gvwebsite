import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe2, ImagePlus, Palette, ShieldCheck } from 'lucide-react'

import { EditorVisibilityToggle } from '@cms/components/EditorPrimitives.jsx'
import MediaUploadField from '@cms/components/MediaUploadField.jsx'
import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
const cardClass = 'relative rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)]'

function SettingsSection({ content }) {
  const [draft, setDraft] = useCmsDraftState('settings', () => ({
    settings: {
      defaultLanguage: window.localStorage.getItem('globalvision-default-language') || 'prs',
      maintenanceMode: window.localStorage.getItem('globalvision-maintenance-mode') === 'true',
    },
    branding: {
      primary: window.localStorage.getItem('globalvision-brand-primary') || '#f47e26',
      secondary: window.localStorage.getItem('globalvision-brand-secondary') || '#80027f',
      lightLogo: window.localStorage.getItem('globalvision-brand-logo-light') || '',
      darkLogo: window.localStorage.getItem('globalvision-brand-logo-dark') || '',
      lightIcon: window.localStorage.getItem('globalvision-brand-icon-light') || '',
      darkIcon: window.localStorage.getItem('globalvision-brand-icon-dark') || '',
    },
  }))
  const { settings, branding } = draft
  const setSettings = (update) => setDraft((current) => ({ ...current, settings: typeof update === 'function' ? update(current.settings) : update }))
  const setBranding = (update) => setDraft((current) => ({ ...current, branding: typeof update === 'function' ? update(current.branding) : update }))
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }))
  const copy = content.branding
  useEffect(() => {
    const applyColors = (primary, secondary) => {
      document.documentElement.style.setProperty('--brand-orange', primary)
      document.documentElement.style.setProperty('--brand-red', secondary)
      document.querySelectorAll('.cms-root').forEach((root) => { root.style.setProperty('--admin-brand', primary); root.style.setProperty('--brand-orange', primary); root.style.setProperty('--brand-red', secondary) })
    }
    applyColors(window.localStorage.getItem('globalvision-brand-primary') || '#f47e26', window.localStorage.getItem('globalvision-brand-secondary') || '#80027f')
    const save = () => {
      window.localStorage.setItem('globalvision-default-language', settings.defaultLanguage)
      window.localStorage.setItem('globalvision-maintenance-mode', String(settings.maintenanceMode))
      window.localStorage.setItem('globalvision-brand-primary', branding.primary)
      window.localStorage.setItem('globalvision-brand-secondary', branding.secondary)
      if (branding.lightLogo) window.localStorage.setItem('globalvision-brand-logo-light', branding.lightLogo); else window.localStorage.removeItem('globalvision-brand-logo-light')
      if (branding.darkLogo) window.localStorage.setItem('globalvision-brand-logo-dark', branding.darkLogo); else window.localStorage.removeItem('globalvision-brand-logo-dark')
      if (branding.lightIcon) window.localStorage.setItem('globalvision-brand-icon-light', branding.lightIcon); else window.localStorage.removeItem('globalvision-brand-icon-light')
      if (branding.darkIcon) window.localStorage.setItem('globalvision-brand-icon-dark', branding.darkIcon); else window.localStorage.removeItem('globalvision-brand-icon-dark')
      applyColors(branding.primary, branding.secondary)
    }
    window.addEventListener('cms:changes-saved', save)
    return () => window.removeEventListener('cms:changes-saved', save)
  }, [branding, settings])
  const handleLogo = (key, logo) => setBranding((current) => ({ ...current, [key]: logo }))

  return <div className="grid items-stretch gap-5">
    <div className="grid gap-5 lg:grid-cols-2"><BrandingLogo copy={copy} branding={branding} onLogo={handleLogo} /><BrandingColors copy={copy} branding={branding} onChange={(key, value) => setBranding((current) => ({ ...current, [key]: value }))} /></div>
    <div className="grid items-stretch gap-5 lg:grid-cols-2">
    <SettingsCard icon={Globe2} eyebrow={content.regional.eyebrow} title={content.regional.title} description={content.regional.description}>
      <div className="mt-auto"><LanguageSelect label={content.regional.defaultLanguage} value={settings.defaultLanguage} onChange={(value) => update('defaultLanguage', value)} options={[{ value: 'prs', label: content.languages.prs }, { value: 'ps', label: content.languages.ps }, { value: 'en', label: content.languages.en }]} /></div>
    </SettingsCard>

    <SettingsCard icon={ShieldCheck} eyebrow={content.system.eyebrow} title={content.system.title} description={content.system.description}>
      <div className="mt-auto w-full [&>label]:!w-full"><EditorVisibilityToggle className="!h-11 !min-h-11 !max-h-11" label={content.system.maintenance} checked={settings.maintenanceMode} onChange={(event) => update('maintenanceMode', event.target.checked)} /></div>
    </SettingsCard></div>
  </div>
}

function BrandingLogo({ copy, branding, onLogo }) { const uploadContent = { countryImage: '', choose: copy.choose, drop: '', replace: copy.replace, remove: copy.remove }; return <section className={`${cardClass} p-4 sm:p-5`}><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text"><ImagePlus size={19} /></span><h2 className="font-heading text-base text-admin-heading">{copy.logo}</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="grid content-start gap-4"><div><span className="text-xs font-semibold text-admin-heading">{copy.lightLogo}</span><MediaUploadField iconOnly imageFit="contain" value={branding.lightLogo || '/assets/branding/new%20logo.webp'} onChange={(logo) => onLogo('lightLogo', logo)} content={uploadContent} /></div><div><span className="text-xs font-semibold text-admin-heading">{copy.lightIcon}</span><MediaUploadField iconOnly previewShape="icon" imageFit="contain" value={branding.lightIcon || '/assets/branding/icon.webp'} onChange={(icon) => onLogo('lightIcon', icon)} content={uploadContent} /></div></div><div className="grid content-start gap-4"><div><span className="text-xs font-semibold text-admin-heading">{copy.darkLogo}</span><MediaUploadField iconOnly imageFit="contain" value={branding.darkLogo || '/assets/branding/new%20logo%20white.webp'} onChange={(logo) => onLogo('darkLogo', logo)} content={uploadContent} /></div><div><span className="text-xs font-semibold text-admin-heading">{copy.darkIcon}</span><MediaUploadField iconOnly previewShape="icon" imageFit="contain" value={branding.darkIcon || '/assets/branding/icon%20white.webp'} onChange={(icon) => onLogo('darkIcon', icon)} content={uploadContent} /></div></div></div></section> }
function BrandingColors({ copy, branding, onChange }) { return <section className={`${cardClass} p-4 sm:p-5`}><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text"><Palette size={19} /></span><h2 className="font-heading text-base text-admin-heading">{copy.colors}</h2></div><div className="mt-5 grid gap-3">{[['primary', copy.primary], ['secondary', copy.secondary]].map(([key, label]) => <label key={key} className="flex min-h-11 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) px-3 text-xs font-semibold text-admin-heading"><span className="size-7 shrink-0 rounded-lg border border-white/20 shadow-inner" style={{ backgroundColor: branding[key] }} /><span className="flex-1">{label}</span><input dir="ltr" type="text" inputMode="text" spellCheck="false" aria-label={label} value={branding[key].toUpperCase()} onChange={(event) => { const value = event.target.value.trim(); onChange(key, value) }} className="h-8 w-24 rounded-lg border border-(--editor-field-border) bg-(--editor-input) px-2 text-left text-[.6875rem] font-normal uppercase text-admin-heading outline-none focus:border-admin-brand" /></label>)}</div></section> }

function SettingsCard({ icon: Icon, title, children }) {
  return <section className={`${cardClass} flex h-full flex-col`}>
    <header className="flex items-center gap-3 rounded-t-2xl border-b border-admin-border bg-[linear-gradient(100deg,var(--editor-field),var(--admin-card))] px-4 py-4 sm:px-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text"><Icon size={19} /></span>
      <div className="min-w-0 flex-1"><h2 className="font-heading text-base text-admin-heading">{title}</h2></div>
    </header>
    <div className="flex flex-1 flex-col p-4 sm:p-5">{children}</div>
  </section>
}

function LanguageSelect({ label, value, onChange, options }) {
  const root = useRef(null)
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value) || options[0]

  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  const fontClass = (language) => language === 'prs' ? '[font-family:var(--font-dari)]' : language === 'ps' ? '[font-family:var(--font-pashto)]' : '[font-family:var(--font-english)]'
  return <div ref={root} className="relative text-xs font-semibold text-admin-heading"><span>{label}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`mt-2 flex h-11 min-h-11 max-h-11 w-full items-center gap-2 rounded-xl border bg-(--editor-input) px-3.5 text-sm font-normal text-admin-heading transition ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span dir={selected.value === 'en' ? 'ltr' : 'rtl'} className={`min-w-0 flex-1 truncate text-start text-sm font-semibold leading-6 ${fontClass(selected.value)}`}>{selected.label}</span><ChevronDown size={16} className={`shrink-0 text-admin-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} className={`absolute inset-x-0 top-full z-50 mt-2 grid gap-1 rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all duration-200 motion-reduce:transition-none ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={(event) => { onChange(option.value); setOpen(false); event.currentTarget.dispatchEvent(new Event('input', { bubbles: true })) }} className={`flex min-h-11 items-center justify-between rounded-lg px-3.5 text-start text-sm font-semibold leading-6 transition-colors ${fontClass(option.value)} ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand-text'}`}><span dir={option.value === 'en' ? 'ltr' : 'rtl'}>{option.label}</span>{option.value === value && <Check size={15} />}</button>)}</div></div>
}

export default SettingsSection
