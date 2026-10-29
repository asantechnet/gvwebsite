import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const languages = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'prs', label: 'دری', flag: '🇦🇫' },
  { id: 'ps', label: 'پښتو', flag: '🇦🇫' },
]

function LanguageSwitcher({ language, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = languages.find((item) => item.id === language) || languages[1]

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => {
      if (event.key === 'Escape' || !rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close) }
  }, [open])

  return <div ref={rootRef} className="relative">
    <button type="button" aria-label="Change language" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="flex h-10 min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface-muted px-2 text-xs font-bold leading-none whitespace-nowrap text-foreground transition-colors hover:border-primary hover:bg-primary/15 focus-visible:border-primary ltr:!font-medium 2xl:gap-2 2xl:px-3 2xl:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
      <span aria-hidden="true" className="grid size-5 shrink-0 translate-y-0 place-items-center text-sm leading-none rtl:translate-y-0.5 2xl:size-6 2xl:text-base">{selected.flag}</span><span className="leading-none rtl:-translate-y-0.5">{selected.label}</span><ChevronDown aria-hidden="true" size={16} className={`shrink-0 transition-transform 2xl:size-[17px] ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div role="listbox" aria-label="Languages" className="absolute end-0 top-full z-[70] mt-2 grid min-w-44 gap-0.5 rounded-2xl border border-border bg-surface p-1.5 shadow-[0_18px_45px_rgba(41,23,18,.2)] dark:border-gray-600 dark:bg-gray-800">
      {languages.map((item) => <button key={item.id} type="button" role="option" aria-selected={item.id === language} onClick={() => { onChange(item.id); setOpen(false) }} className={`flex min-h-10 items-center gap-2 rounded-xl px-2 text-start text-sm font-bold leading-none transition-colors ltr:!font-medium ${item.id === language ? 'bg-primary text-on-primary' : 'text-foreground hover:bg-surface-muted dark:text-gray-100 dark:hover:bg-gray-700'}`}><span aria-hidden="true" className="grid size-6 shrink-0 place-items-center text-base leading-none rtl:translate-y-0.5">{item.flag}</span><span className="flex-1 leading-none rtl:-translate-y-0.5">{item.label}</span>{item.id === language && <Check aria-hidden="true" size={15} />}</button>)}
    </div>}
  </div>
}

export default LanguageSwitcher
