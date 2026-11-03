import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const languages = [{ id: 'en', label: 'English', flag: '🇺🇸' }, { id: 'prs', label: 'دری', flag: '🇦🇫' }, { id: 'ps', label: 'پښتو', flag: '🇦🇫' }]

function LanguageSwitcher({ language, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = languages.find((item) => item.id === language) || languages[1]
  useEffect(() => { if (!open) return undefined; const close = (event) => { if (event.key === 'Escape' || !ref.current?.contains(event.target)) setOpen(false) }; document.addEventListener('pointerdown', close); document.addEventListener('keydown', close); return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close) } }, [open])
  return <div ref={ref} className="relative"><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex h-10 items-center gap-2 rounded-xl border border-(--header-control-border) bg-(--header-control) px-3 text-xs font-semibold text-admin-heading transition hover:border-admin-brand"><span className={`text-lg ${selected.id === 'ps' ? 'translate-y-0.5' : ''}`}>{selected.flag}</span><span className={`max-[520px]:hidden ${selected.id === 'prs' ? '-translate-y-0.5' : selected.id === 'ps' ? '-translate-y-px' : ''}`}>{selected.label}</span><ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <div role="listbox" className="absolute end-0 top-full z-50 mt-2 grid min-w-48 gap-1 rounded-2xl border border-admin-border bg-admin-card p-2 shadow-[0_18px_45px_rgb(15_23_42_/.2)]">{languages.map((item) => <button key={item.id} type="button" role="option" aria-selected={item.id === language} onClick={() => { onChange(item.id); setOpen(false) }} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-start text-sm font-semibold transition ${item.id === language ? 'bg-admin-brand text-white' : 'text-admin-heading hover:bg-admin-brand-soft hover:text-admin-brand'}`}><span className={`text-lg ${item.id === 'ps' ? 'translate-y-0.5' : ''}`}>{item.flag}</span><span className={`flex-1 ${item.id === 'prs' ? '-translate-y-0.5' : item.id === 'ps' ? '-translate-y-px' : ''}`}>{item.label}</span>{item.id === language && <Check size={15} />}</button>)}</div>}</div>
}

export default LanguageSwitcher
