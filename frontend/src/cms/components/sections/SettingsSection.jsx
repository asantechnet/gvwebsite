import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Clock3, Globe2, ImagePlus, Palette, RefreshCw, ShieldCheck } from 'lucide-react'

import { EditorVisibilityToggle } from '@cms/components/EditorPrimitives.jsx'
import MediaUploadField from '@cms/components/MediaUploadField.jsx'
import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import { dataSource } from '@/shared/services/data/index.js'
import SkeletonBlock from '@/shared/components/SkeletonBlock.jsx'
import { withSkeletonPreview } from '@/shared/utils/loading.js'
const cardClass = 'relative rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)]'

function SettingsSection({ content }) {
  const [audit, setAudit] = useState({ entries: [], status: 'loading' })
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
      applyColors(branding.primary, branding.secondary)
    }
    window.addEventListener('cms:changes-saved', save)
    return () => window.removeEventListener('cms:changes-saved', save)
  }, [branding, settings])
  const handleLogo = (key, logo) => setBranding((current) => ({ ...current, [key]: logo }))

  const loadAudit = () => {
    setAudit((current) => ({ ...current, status: 'loading' }))
    withSkeletonPreview(dataSource.auditLogs.list())
      .then((entries) => setAudit({ entries, status: 'ready' }))
      .catch(() => setAudit((current) => ({ ...current, status: 'error' })))
  }

  useEffect(() => {
    let active = true
    withSkeletonPreview(dataSource.auditLogs.list())
      .then((entries) => { if (active) setAudit({ entries, status: 'ready' }) })
      .catch(() => { if (active) setAudit((current) => ({ ...current, status: 'error' })) })
    return () => { active = false }
  }, [])

  return <div className="grid items-stretch gap-5">
    <div className="grid gap-5 lg:grid-cols-2"><BrandingLogo copy={copy} lightLogo={branding.lightLogo} darkLogo={branding.darkLogo} onLogo={handleLogo} /><BrandingColors copy={copy} branding={branding} onChange={(key, value) => setBranding((current) => ({ ...current, [key]: value }))} /></div>
    <div className="grid items-stretch gap-5 lg:grid-cols-2">
    <SettingsCard icon={Globe2} eyebrow={content.regional.eyebrow} title={content.regional.title} description={content.regional.description}>
      <div className="mt-auto"><LanguageSelect label={content.regional.defaultLanguage} value={settings.defaultLanguage} onChange={(value) => update('defaultLanguage', value)} options={[{ value: 'prs', label: content.languages.prs }, { value: 'ps', label: content.languages.ps }, { value: 'en', label: content.languages.en }]} /></div>
    </SettingsCard>

    <SettingsCard icon={ShieldCheck} eyebrow={content.system.eyebrow} title={content.system.title} description={content.system.description}>
      <div className="mt-auto w-full [&>label]:!w-full"><EditorVisibilityToggle className="!h-11 !min-h-11 !max-h-11" label={content.system.maintenance} checked={settings.maintenanceMode} onChange={(event) => update('maintenanceMode', event.target.checked)} /></div>
    </SettingsCard></div>
    <AuditHistory copy={content.audit} audit={audit} onRetry={loadAudit} />
  </div>
}

function AuditHistory({ copy, audit, onRetry }) {
  const actionLabel = (action) => copy.actions[action] || String(action || '').replaceAll('.', ' ')
  return <section className={`${cardClass} overflow-hidden`}>
    <header className="flex items-center gap-3 border-b border-admin-border bg-[linear-gradient(100deg,var(--editor-field),var(--admin-card))] px-4 py-4 sm:px-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text"><Clock3 size={19} /></span>
      <div className="min-w-0 flex-1"><h2 className="font-heading text-base text-admin-heading">{copy.title}</h2><p className="mt-1 text-xs text-admin-muted">{copy.description}</p></div>
      <button type="button" onClick={onRetry} aria-label={copy.refresh} className="grid size-10 shrink-0 place-items-center rounded-xl border border-admin-border text-admin-muted transition hover:border-admin-brand hover:text-admin-brand-text focus:border-admin-brand focus:shadow-[0_0_0_2px_var(--admin-brand-soft)]"><RefreshCw size={17} className={audit.status === 'loading' ? 'animate-spin motion-reduce:animate-none' : ''} /></button>
    </header>
    <div className="p-4 sm:p-5">
      {audit.status === 'loading' && <AuditSkeleton />}
      {audit.status === 'error' && <p className="text-sm text-red-600" role="alert">{copy.error}</p>}
      {audit.status === 'ready' && audit.entries.length === 0 && <p className="text-sm text-admin-muted">{copy.empty}</p>}
      {audit.entries.length > 0 && <ol className="grid gap-3">{audit.entries.slice(0, 12).map((entry) => <li key={entry.id} className="flex flex-col gap-1 rounded-xl border border-admin-border bg-(--editor-field) px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0"><p className="text-sm font-semibold text-admin-heading">{actionLabel(entry.action)}</p><p className="mt-0.5 truncate text-xs text-admin-muted">{entry.actor?.name || copy.systemActor}</p></div>
        <time dateTime={entry.createdAt} className="shrink-0 text-xs text-admin-muted">{entry.createdAt ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.createdAt)) : ''}</time>
      </li>)}</ol>}
    </div>
  </section>
}

function AuditSkeleton() {
  return <div className="grid gap-3" role="status" aria-label="Loading audit history"><span className="sr-only">Loading audit history</span>{Array.from({ length: 6 }, (_, index) => <div key={index} className="flex flex-col gap-3 rounded-xl border border-admin-border bg-(--editor-field) px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="space-y-2"><SkeletonBlock className="h-4 w-44 bg-admin-heading/10" /><SkeletonBlock className="h-3 w-28 bg-admin-heading/10" /></div><SkeletonBlock className="h-3 w-32 bg-admin-heading/10" /></div>)}</div>
}

function BrandingLogo({ copy, lightLogo, darkLogo, onLogo }) { return <section className={`${cardClass} p-4 sm:p-5`}><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text"><ImagePlus size={19} /></span><h2 className="font-heading text-base text-admin-heading">{copy.logo}</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><span className="text-xs font-semibold text-admin-heading">{copy.lightLogo}</span><MediaUploadField iconOnly value={lightLogo || '/assets/branding/new%20logo.webp'} onChange={(logo) => onLogo('lightLogo', logo)} content={{ countryImage: '', choose: copy.choose, drop: '', replace: copy.replace, remove: copy.remove }} /></div><div><span className="text-xs font-semibold text-admin-heading">{copy.darkLogo}</span><MediaUploadField iconOnly value={darkLogo || '/assets/branding/new%20logo%20white.webp'} onChange={(logo) => onLogo('darkLogo', logo)} content={{ countryImage: '', choose: copy.choose, drop: '', replace: copy.replace, remove: copy.remove }} /></div></div></section> }
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
