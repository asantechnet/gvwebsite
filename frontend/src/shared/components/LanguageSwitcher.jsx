import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const languages = [
  { id: 'prs', publicId: 'dr', label: 'دری', flag: '🇦🇫' },
  { id: 'ps', publicId: 'ps', label: 'پښتو', flag: '🇦🇫' },
  { id: 'en', publicId: 'en', label: 'English', flag: '🇺🇸' },
]

function LanguageSwitcher({ language, onChange, languageIds = {}, className = '', optimizeEnglishTypography = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selectedId = languages.find((item) => (languageIds[item.id] || item.id) === language)?.id || 'prs'
  const selected = languages.find((item) => item.id === selectedId) || languages[0]
  const useEnglishTypography = optimizeEnglishTypography && selectedId === 'en'

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => {
      if (event.key === 'Escape' || !ref.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return <div ref={ref} className="language-switcher relative z-[210]">
    <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((value) => !value)} className={`flex h-10 items-center gap-2 rounded-xl border border-[var(--language-switcher-border)] bg-[var(--language-switcher-control)] px-3 text-[var(--language-switcher-heading)] outline-none transition hover:border-[var(--language-switcher-brand)] focus:outline-none focus-visible:border-[var(--language-switcher-brand)] focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--language-switcher-brand)_28%,transparent)] ${useEnglishTypography ? 'text-[.6875rem] font-medium' : 'text-xs font-semibold'} ${className}`}>
      <span className={`${useEnglishTypography ? 'text-base' : 'text-lg'} ${selected.id === 'ps' ? 'translate-y-0.5' : ''}`}>{selected.flag}</span>
      <span className={`max-[520px]:hidden ${selected.id === 'prs' ? '-translate-y-0.5' : selected.id === 'ps' ? '-translate-y-px' : ''}`}>{selected.label}</span>
      <ChevronDown size={15} className={`transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
    </button>
    <div role="listbox" aria-hidden={!open} inert={!open} className={`absolute end-0 top-full z-[220] mt-2 grid w-40 gap-0.5 rounded-xl border border-[var(--language-switcher-border)] bg-[var(--language-switcher-card)] p-1.5 shadow-[0_14px_32px_rgb(15_23_42_/.2)] transition-all duration-200 ease-out motion-reduce:transition-none ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>
      {languages.map((item) => <button key={item.id} type="button" role="option" aria-selected={item.id === selectedId} onClick={() => { onChange(languageIds[item.id] || item.id); setOpen(false) }} className={`flex min-h-9 items-center gap-2 rounded-lg border border-transparent px-2.5 text-start outline-none transition focus:outline-none focus-visible:border-[var(--language-switcher-brand)] focus-visible:shadow-[0_0_0_2px_color-mix(in_srgb,var(--language-switcher-brand)_24%,transparent)] ${useEnglishTypography ? 'text-[.6875rem] font-medium' : 'text-xs font-semibold'} ${item.id === selectedId ? 'bg-[var(--language-switcher-brand)] text-white' : 'text-[var(--language-switcher-heading)] hover:bg-[var(--language-switcher-brand-soft)] hover:text-[var(--language-switcher-brand-text)]'}`}>
        <span className={`${useEnglishTypography ? 'text-sm' : 'text-base'} ${item.id === 'ps' ? 'translate-y-0.5' : ''}`}>{item.flag}</span>
        <span className={`flex-1 ${item.id === 'prs' ? '-translate-y-0.5' : item.id === 'ps' ? '-translate-y-px' : ''}`}>{item.label}</span>
        {item.id === selectedId && <Check size={14} />}
      </button>)}
    </div>
  </div>
}

export default LanguageSwitcher
