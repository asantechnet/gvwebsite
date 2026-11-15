import { ExternalLink, Pencil, Trash2 } from 'lucide-react'

function RecordActionButtons({ href, previewLabel, editLabel, deleteLabel, onEdit, onDelete, iconSize = 16, buttonSize = 'size-9' }) {
  const baseClass = `grid ${buttonSize} place-items-center rounded-xl border transition`

  return <>
    <a className={`${baseClass} border-admin-border text-admin-muted hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text dark:hover:text-[color-mix(in_srgb,var(--admin-brand)_30%,white)]`} href={href} target="_blank" rel="noreferrer" aria-label={previewLabel}><ExternalLink size={iconSize} /></a>
    <button type="button" className={`${baseClass} border-admin-border text-admin-brand-text/75 hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text dark:text-[color-mix(in_srgb,var(--admin-brand)_55%,white)] dark:hover:text-[color-mix(in_srgb,var(--admin-brand)_30%,white)]`} onClick={onEdit} aria-label={editLabel}><Pencil size={iconSize} /></button>
    <button type="button" className={`${baseClass} border-red-500/25 text-red-500 hover:border-red-500 hover:bg-red-500/10 dark:border-red-500/50`} onClick={onDelete} aria-label={deleteLabel}><Trash2 size={iconSize} /></button>
  </>
}

export default RecordActionButtons
