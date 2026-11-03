import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe2, ShieldCheck } from 'lucide-react'

import { EditorVisibilityToggle } from '@cms/components/EditorPrimitives.jsx'
const cardClass = 'relative rounded-2xl border border-admin-border bg-admin-card shadow-[0_12px_34px_rgb(15_23_42_/.055)]'

function SettingsSection({ content }) {
  const [settings, setSettings] = useState({
    defaultLanguage: 'prs',
    maintenanceMode: false,
  })
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }))

  return <div className="grid items-stretch gap-5 lg:grid-cols-2">
    <SettingsCard icon={Globe2} eyebrow={content.regional.eyebrow} title={content.regional.title} description={content.regional.description}>
      <div className="mt-auto"><LanguageSelect label={content.regional.defaultLanguage} value={settings.defaultLanguage} onChange={(value) => update('defaultLanguage', value)} options={[{ value: 'prs', label: content.languages.prs }, { value: 'ps', label: content.languages.ps }, { value: 'en', label: content.languages.en }]} /></div>
    </SettingsCard>

    <SettingsCard icon={ShieldCheck} eyebrow={content.system.eyebrow} title={content.system.title} description={content.system.description}>
      <div className="mt-auto w-full [&>label]:!w-full"><EditorVisibilityToggle className="!h-11 !min-h-11 !max-h-11" label={content.system.maintenance} checked={settings.maintenanceMode} onChange={(event) => update('maintenanceMode', event.target.checked)} /></div>
    </SettingsCard>
  </div>
}

function SettingsCard({ icon: Icon, title, children }) {
  return <section className={`${cardClass} flex h-full flex-col`}>
    <header className="flex items-center gap-3 rounded-t-2xl border-b border-admin-border bg-[linear-gradient(100deg,var(--editor-field),var(--admin-card))] px-4 py-4 sm:px-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand"><Icon size={19} /></span>
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
  return <div ref={root} className="relative text-xs font-semibold text-admin-heading"><span>{label}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`mt-2 flex h-11 min-h-11 max-h-11 w-full items-center gap-2 rounded-xl border bg-(--editor-input) px-3.5 text-sm font-normal text-admin-heading transition ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border) hover:border-admin-brand'}`}><span dir={selected.value === 'en' ? 'ltr' : 'rtl'} className={`min-w-0 flex-1 truncate text-start text-sm font-semibold leading-6 ${fontClass(selected.value)}`}>{selected.label}</span><ChevronDown size={16} className={`shrink-0 text-admin-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} className={`absolute inset-x-0 top-full z-50 mt-2 grid gap-1 rounded-xl border border-(--editor-field-border) bg-(--admin-card) p-1.5 shadow-[0_18px_45px_rgb(15_23_42_/.28)] transition-all duration-200 motion-reduce:transition-none ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }} className={`flex min-h-11 items-center justify-between rounded-lg px-3.5 text-start text-sm font-semibold leading-6 transition-colors ${fontClass(option.value)} ${option.value === value ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand'}`}><span dir={option.value === 'en' ? 'ltr' : 'rtl'}>{option.label}</span>{option.value === value && <Check size={15} />}</button>)}</div></div>
}

export default SettingsSection
