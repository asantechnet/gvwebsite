import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Languages } from 'lucide-react'

const contentLanguages = [
  { id: 'prs', label: 'دری', direction: 'rtl' },
  { id: 'ps', label: 'پښتو', direction: 'rtl' },
  { id: 'en', label: 'English', direction: 'ltr' },
]

function ContentLanguageSwitcher({ label = 'زبان محتوا', value, onChange, className = '', iconOnlyMobile = false, segmentedOnMobile = false }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const selected = contentLanguages.find((language) => language.id === value) || contentLanguages[0]
  const activeIndex = Math.max(0, contentLanguages.findIndex((language) => language.id === value))

  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  return <div ref={root} className={`relative z-auto min-w-0 w-full shrink [&>div]:w-full sm:w-auto sm:shrink-0 ${segmentedOnMobile ? 'sm:[&>div]:w-[13rem]' : 'sm:[&>div]:w-28'} lg:[&>div]:w-auto ${className}`}>
    <div dir="rtl" className={`relative h-9 max-h-9 items-center gap-1 overflow-hidden rounded-xl border border-admin-border bg-admin-control p-1 ${segmentedOnMobile ? 'flex' : 'hidden lg:flex'}`} role="tablist" aria-label={label}><span aria-hidden="true" className="pointer-events-none absolute inset-y-1 right-1 w-16 rounded-lg bg-admin-brand shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none" style={{ width: segmentedOnMobile ? 'calc((100% - 1rem) / 3)' : undefined, transform: segmentedOnMobile ? `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 0.25}rem))` : `translateX(${-activeIndex * 4.25}rem)` }} />{contentLanguages.map((language) => <button key={language.id} type="button" role="tab" aria-selected={value === language.id} onClick={() => onChange(language.id)} className={`relative z-10 h-7 min-h-7 min-w-16 flex-1 rounded-lg px-2.5 text-[.6875rem] font-semibold transition-colors duration-300 ease-out ${value === language.id ? 'text-white' : 'text-admin-muted hover:bg-admin-control-soft hover:text-admin-heading'}`}><span dir={language.direction}>{language.label}</span></button>)}</div>
    <div className={`relative min-w-0 max-w-full ${segmentedOnMobile ? 'hidden' : 'lg:hidden'} ${iconOnlyMobile ? 'w-11 sm:w-full' : 'w-full'}`}><button type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={label} onClick={() => setOpen((current) => !current)} className={`relative flex h-9 min-h-9 min-w-0 items-center rounded-xl border border-admin-border bg-admin-control text-xs font-semibold text-admin-heading ${iconOnlyMobile ? 'w-11 flex-row justify-center gap-0.5 p-0 sm:w-full sm:justify-start sm:gap-1 sm:px-2' : 'w-full gap-1 px-2 max-[520px]:px-1.5'}`}><Languages size={15} className="shrink-0 text-admin-brand-text" /><span className={`${iconOnlyMobile ? 'hidden sm:block' : ''} min-w-0 flex-1 truncate text-start`} dir={selected.direction}>{selected.label}</span><ChevronDown size={14} className={`${iconOnlyMobile ? 'size-3 sm:size-[14px]' : ''} shrink-0 text-admin-muted transition-transform ${open ? 'rotate-180' : ''}`} /></button><div role="listbox" aria-hidden={!open} inert={!open} className={`absolute end-0 top-full z-50 mt-2 grid min-w-24 gap-1 rounded-xl border border-admin-border bg-admin-card p-1.5 shadow-[0_16px_38px_rgb(15_23_42_/.22)] transition-all duration-200 ease-out ${iconOnlyMobile ? 'w-28 sm:w-full' : 'w-full'} ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{contentLanguages.map((language) => <button key={language.id} type="button" role="option" aria-selected={value === language.id} onClick={() => { onChange(language.id); setOpen(false) }} className={`flex min-h-10 items-center justify-between rounded-lg px-3 text-xs font-semibold ${value === language.id ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-control-soft'}`}><span dir={language.direction}>{language.label}</span>{value === language.id && <Check size={14} />}</button>)}</div></div>
  </div>
}

export default ContentLanguageSwitcher
