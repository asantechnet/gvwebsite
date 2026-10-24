import { useEffect, useRef, useState } from 'react'

function CountryPicker({ value, options, onChange, label }) {
  const [open, setOpen] = useState(false)
  const pickerRef = useRef(null)
  const selected = options.find((country) => (country.name || country.title) === value) || options[0]
  useEffect(() => {
    const close = (event) => { if (!pickerRef.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  return <div ref={pickerRef} className="relative mt-2"><button type="button" aria-haspopup="listbox" aria-expanded={open} className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 text-sm text-admin-heading transition hover:border-admin-brand" onClick={() => setOpen((current) => !current)}><span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-admin-brand-soft">{selected?.flag && <img src={selected.flag} alt="" className="size-full object-cover" />}</span><span className="min-w-0 flex-1 truncate text-right text-xs">{selected?.name || selected?.title || label}</span><span className="shrink-0 text-[.65rem] text-admin-muted">⌄</span></button>{open && <div role="listbox" aria-label={label} className="cms-icon-picker-options absolute inset-x-0 top-[calc(100%+.35rem)] z-30 grid max-h-56 min-w-0 grid-cols-1 gap-1 overflow-x-hidden overflow-y-auto rounded-xl border border-(--editor-field-border) bg-(--editor-field) p-2 shadow-2xl">{options.map((country) => { const name = country.name || country.title; return <button type="button" role="option" aria-label={name} aria-selected={value === name} key={country.id || name} onClick={() => { onChange(country); setOpen(false) }} className={`flex min-w-0 min-h-11 items-center gap-2 overflow-hidden rounded-lg border px-2 text-right text-xs transition ${value === name ? 'border-admin-brand bg-admin-brand-soft text-admin-brand' : 'border-transparent text-admin-muted hover:border-admin-brand hover:bg-admin-control-soft hover:text-admin-heading'}`}><span className="size-6 shrink-0 overflow-hidden rounded-full"><img src={country.flag} alt="" className="size-full object-cover" /></span><span className="min-w-0 truncate">{name}</span></button> })}</div>}</div>
}

export default CountryPicker
