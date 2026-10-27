import { useEffect, useRef, useState } from 'react'
import { BadgeCheck, BookMarked, BookOpenText, Briefcase, BriefcaseBusiness, Building2, CalendarDays, CircleHelp, ClipboardCheck, FileCheck2, Flag, Globe2, GraduationCap, Handshake, Heart, House, Languages, Laptop, Landmark, Lightbulb, ListChecks, Mail, MapPinned, MessageCircle, Phone, Plane, PlaneTakeoff, Search, School, Settings, ShieldCheck, Star, Stethoscope, UserRound, Users, WalletCards } from 'lucide-react'

const iconOptions = [
  ['BriefcaseBusiness', BriefcaseBusiness], ['Briefcase', Briefcase], ['GraduationCap', GraduationCap], ['School', School], ['BookOpenText', BookOpenText], ['BookMarked', BookMarked],
  ['MapPinned', MapPinned], ['Flag', Flag], ['Globe2', Globe2], ['Building2', Building2], ['Landmark', Landmark], ['Plane', Plane], ['PlaneTakeoff', PlaneTakeoff],
  ['Handshake', Handshake], ['Users', Users], ['UserRound', UserRound], ['Heart', Heart], ['Star', Star], ['BadgeCheck', BadgeCheck], ['ShieldCheck', ShieldCheck],
  ['FileCheck2', FileCheck2], ['ClipboardCheck', ClipboardCheck], ['ListChecks', ListChecks], ['Languages', Languages], ['CalendarDays', CalendarDays], ['WalletCards', WalletCards],
  ['Stethoscope', Stethoscope], ['Laptop', Laptop], ['Mail', Mail], ['Phone', Phone], ['MessageCircle', MessageCircle], ['Search', Search], ['Settings', Settings], ['House', House], ['Lightbulb', Lightbulb], ['CircleHelp', CircleHelp],
]

function IconPicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false)
  const pickerRef = useRef(null)
  const selected = iconOptions.find(([name]) => name === value) || iconOptions[0]
  const SelectedIcon = selected[1]
  useEffect(() => {
    const close = (event) => { if (!pickerRef.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  return <div ref={pickerRef} className="relative mt-2"><button type="button" aria-haspopup="listbox" aria-expanded={open} className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 text-sm text-admin-heading transition hover:border-admin-brand" onClick={() => setOpen((current) => !current)}><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-admin-brand-soft text-admin-brand"><SelectedIcon size={16} /></span><span className="min-w-0 flex-1 truncate text-right text-xs">{selected[0]}</span><span className="shrink-0 text-[.65rem] text-admin-muted">⌄</span></button><div role="listbox" aria-label={label} aria-hidden={!open} inert={!open} className={`cms-icon-picker-options absolute inset-x-0 top-[calc(100%+.35rem)] z-30 grid max-h-56 min-w-0 grid-cols-4 gap-1 overflow-x-hidden overflow-y-auto rounded-xl border border-(--editor-field-border) bg-(--editor-field) p-2 shadow-2xl transition-all duration-200 motion-reduce:transition-none ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>{iconOptions.map(([name, Icon]) => <button type="button" role="option" aria-label={name} aria-selected={value === name} key={name} onClick={() => { onChange(name); setOpen(false) }} className={`grid min-w-0 min-h-12 place-items-center overflow-hidden rounded-lg border px-1 transition ${value === name ? 'border-admin-brand bg-admin-brand-soft text-admin-brand' : 'border-transparent text-admin-muted hover:border-admin-brand hover:bg-admin-control-soft hover:text-admin-heading'}`}><Icon size={19} /></button>)}</div></div>
}

export default IconPicker
