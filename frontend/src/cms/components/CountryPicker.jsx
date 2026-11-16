import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

import { getCountries, getCountryCode, normalizeCountrySearch } from '@/shared/utils/countries.js'

function CountryPicker({ value, onChange, label, language = 'prs', searchPlaceholder = '', emptyLabel = '', allLabel = '', compact = false, className = '', options, fallbackIcon = '🌐' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const pickerRef = useRef(null)
  const searchRef = useRef(null)
  const optionsRef = useRef(null)
  const countries = useMemo(() => options || getCountries(language), [language, options])
  const choices = useMemo(() => allLabel ? [{ code: 'all', value: 'all', name: allLabel, flag: '' }, ...countries] : countries, [allLabel, countries])
  const normalizedQuery = normalizeCountrySearch(query)
  const filteredCountries = useMemo(() => choices.filter((country) => !normalizedQuery || normalizeCountrySearch(`${country.name} ${country.code}`).includes(normalizedQuery)), [choices, normalizedQuery])
  const selectedCode = options
    ? choices.find((choice) => choice.code === value || choice.value === value || choice.name === value || Object.values(choice.names || {}).includes(value))?.code || ''
    : getCountryCode(value)
  const selected = choices.find((country) => country.value === value || country.code === value || country.name === value || country.code === selectedCode)
  useEffect(() => {
    const close = (event) => { if (!pickerRef.current?.contains(event.target)) { setOpen(false); setQuery('') } }
    document.addEventListener('pointerdown', close, true)
    return () => document.removeEventListener('pointerdown', close, true)
  }, [])
  useEffect(() => {
    if (!open) return
    window.requestAnimationFrame(() => {
      const optionsElement = optionsRef.current
      const selectedOption = optionsElement?.querySelector('[aria-selected="true"]')
      if (optionsElement && selectedOption) {
        const centeredOffset = selectedOption.offsetTop - ((optionsElement.clientHeight - selectedOption.offsetHeight) / 2)
        optionsElement.scrollTop = Math.max(0, centeredOffset)
      }
      if (window.matchMedia('(min-width: 640px) and (pointer: fine)').matches) searchRef.current?.focus({ preventScroll: true })
    })
  }, [open])

  const closeAndSelect = (country) => { onChange(country); setOpen(false); setQuery('') }
  return <div ref={pickerRef} className={`relative min-w-0 ${className}`} dir={language === 'en' ? 'ltr' : 'rtl'}>
    <button type="button" aria-haspopup="listbox" aria-expanded={open} className={`flex w-full items-center gap-2 rounded-xl border bg-(--editor-input) text-admin-heading transition hover:border-admin-brand ${compact ? 'h-9 px-3 text-xs' : 'min-h-11 px-3.5 text-sm'} ${open ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-(--editor-field-border)'}`} onClick={() => setOpen((current) => !current)}>
      <span aria-hidden="true" className={`${compact ? 'text-base' : 'text-xl'} grid shrink-0 place-items-center`}>{selected?.flag || fallbackIcon}</span>
      <span className="min-w-0 flex-1 truncate text-start text-xs">{selected?.name || value || label}</span>
      <ChevronDown size={compact ? 14 : 16} className={`shrink-0 text-admin-muted transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    <div role="listbox" aria-label={label} aria-hidden={!open} inert={!open} className={`cms-country-picker-popover absolute top-[calc(100%+.35rem)] z-50 grid max-h-72 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-1 overflow-hidden rounded-xl border border-(--editor-field-border) bg-(--editor-field) p-2 shadow-2xl transition-all duration-200 motion-reduce:transition-none ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>
      <label className="flex min-h-9 items-center gap-2 rounded-lg border border-(--editor-field-border) bg-(--editor-input) px-2.5 text-admin-muted focus-within:border-admin-brand"><Search size={14} /><input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} className="search-field min-w-0 flex-1 bg-transparent text-xs text-admin-heading outline-none" /></label>
      <div ref={optionsRef} className="cms-country-picker-options cms-icon-picker-options grid min-h-0 gap-1 overflow-y-auto">{filteredCountries.map((country) => { const active = country.value === value || country.name === value || country.code === selectedCode; return <button type="button" role="option" aria-label={country.name} aria-selected={active} key={country.code} onClick={() => closeAndSelect(country)} className={`flex min-h-10 min-w-0 items-center gap-2 rounded-lg border px-2.5 text-start text-xs transition ${active ? 'border-admin-brand bg-admin-brand-soft text-admin-brand-text' : 'border-transparent text-admin-muted hover:border-admin-brand hover:bg-admin-control-soft hover:text-admin-heading'}`}><span aria-hidden="true" className="w-6 shrink-0 text-center text-lg">{country.flag || fallbackIcon}</span><span className="min-w-0 flex-1 truncate">{country.name}</span>{active && <Check size={14} className="shrink-0" />}</button> })}{filteredCountries.length === 0 && <p className="px-3 py-5 text-center text-xs text-admin-muted">{emptyLabel}</p>}</div>
    </div>
  </div>
}

export default CountryPicker
