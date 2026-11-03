import { useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

function FilterModal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', closeOnEscape) }
  }, [onClose, open])
  if (!open) return null
  return <div className="cms-modal-backdrop fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4 backdrop-blur-[2px] lg:hidden" onMouseDown={onClose}><section role="dialog" aria-modal="true" aria-labelledby="cms-filter-title" className="w-full max-w-lg overflow-visible rounded-2xl border border-admin-border bg-admin-card shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><header className="flex items-center gap-3 border-b border-admin-border p-4"><span className="grid size-9 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand"><SlidersHorizontal size={17} /></span><h2 id="cms-filter-title" className="min-w-0 flex-1 font-heading text-base text-admin-heading">{title}</h2><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl border border-admin-border text-admin-muted hover:border-admin-brand hover:text-admin-brand" aria-label="Close"><X size={17} /></button></header><div className="grid max-h-[70svh] gap-4 overflow-y-auto p-4">{children}</div></section></div>
}

export default FilterModal
