import { ArrowUpLeft, Pencil, Trash2 } from 'lucide-react'
import { useCmsInterfaceLanguage } from '@cms/hooks/useCmsLanguage.js'

function EditorPreviewLink({ href = '/', children }) {
  return <a href={href} target="_blank" rel="noreferrer" className="mb-2 inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-[.7rem] border border-admin-border bg-(--primary-action-bg) px-3 py-2 text-[.6875rem] font-semibold text-(--primary-action-text) shadow-[0_8px_20px_rgba(15,23,42,.07)] transition hover:-translate-y-0.5 hover:border-admin-brand hover:text-admin-brand-text hover:shadow-[0_12px_26px_rgba(15,23,42,.11)] sm:w-auto">{children}<ArrowUpLeft size={15} /></a>
}

function EditorSectionHeader({ icon: Icon, title, action, className = '' }) {
  return <header className={`flex flex-wrap items-center gap-4 border-b border-admin-border bg-[linear-gradient(110deg,var(--editor-field),var(--admin-card))] px-5 py-4 sm:px-6 ${className}`}><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text"><Icon size={20} /></span><div className="min-w-0 flex-1"><h2 className="m-0 font-heading text-base text-admin-heading">{title}</h2></div><div className="w-full sm:ms-auto sm:w-auto [&>div]:grid [&>div]:w-full [&>div]:grid-cols-2 [&>div>label]:w-full [&>div>div]:w-full sm:[&>div]:flex sm:[&>div]:w-auto sm:[&>div>label]:w-auto sm:[&>div>div]:w-auto">{action}</div></header>
}

function EditorVisibilityToggle({ label, checked, onChange, className = '' }) {
  const interfaceLanguage = useCmsInterfaceLanguage()
  const isEnglish = interfaceLanguage === 'en'
  return <label className={`inline-flex h-9 min-h-9 max-h-9 w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-xl border border-admin-border bg-admin-control px-3 py-2 text-[.6875rem] font-semibold text-admin-muted sm:w-auto ${className}`}>{label}<input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} /><span aria-hidden="true" className="relative h-5 w-9 shrink-0 rounded-full border border-admin-border bg-[var(--admin-toggle-off)] transition-colors duration-200 peer-checked:border-admin-brand peer-checked:bg-admin-brand"><span className="absolute top-1 size-3 rounded-full bg-white shadow-sm transition-transform duration-200" style={{ left: isEnglish ? '4px' : undefined, right: isEnglish ? undefined : '4px', transform: checked ? `translate(${isEnglish ? '16px' : '-16px'}, 0)` : 'translate(0, 0)' }} /></span></label>
}

function EditorFieldGroup({ title, children, columns = true, className = '' }) {
  return <fieldset className={`grid gap-4 rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4 ${columns ? 'sm:grid-cols-2' : ''} ${className}`}>{title && <legend className="-mb-1 rounded-md bg-admin-card px-2 py-1 text-[.6875rem] font-semibold text-admin-brand-text shadow-[0_1px_2px_rgb(15_23_42_/.06)]">{title}</legend>}{children}</fieldset>
}

function EditorField({ label, value, multiline = false, type = 'text', dir, full = false, rows = 4, hideLabel = false, onChange }) {
  if (!label) return null
  const shared = 'mt-2 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 text-[.8125rem] font-normal text-admin-heading outline-none transition placeholder:text-admin-muted focus:border focus:border-admin-brand'
  const fieldDirection = dir || (type === 'url' ? 'ltr' : undefined)
  return <label className={`block min-w-0 text-[.75rem] font-semibold text-admin-heading ${full ? 'sm:col-span-2' : ''}`}>{!hideLabel && <span>{label}</span>}{multiline ? <textarea aria-label={label} rows={rows} dir={fieldDirection} className={`${shared} resize-y py-3 leading-6 ${fieldDirection === 'ltr' ? 'text-left' : ''}`} value={value} onChange={(event) => onChange(event.target.value)} /> : <input aria-label={label} dir={fieldDirection} type={type} className={`${shared} min-h-11 py-2.5 ${fieldDirection === 'ltr' ? 'text-left' : ''}`} value={value} onChange={(event) => onChange(event.target.value)} />}</label>
}

function EditorNumberedCard({ index, title, language, editLabel, deleteLabel, onEdit, onDelete }) {
  return <article className="flex min-w-0 items-center gap-3 rounded-xl border border-admin-border bg-(--editor-field) p-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[color-mix(in_srgb,var(--admin-brand)_28%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-brand)_15%,var(--admin-card))] text-[.6875rem] font-bold text-admin-brand-text shadow-[0_1px_3px_rgb(15_23_42_/.06)]">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1"><strong dir={language === 'en' ? 'ltr' : 'rtl'} className="block truncate text-[.75rem] text-admin-heading">{title}</strong></span><span className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={onEdit} className="grid size-8 place-items-center rounded-lg border border-admin-border bg-admin-control text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text" aria-label={editLabel}><Pencil size={14} /></button>{onDelete && <button type="button" onClick={onDelete} className="grid size-8 place-items-center rounded-lg border border-red-500/25 dark:border-red-500/50 bg-admin-control text-red-500 transition hover:border-red-500 hover:bg-red-500/10" aria-label={deleteLabel}><Trash2 size={14} /></button>}</span></article>
}

export { EditorField, EditorFieldGroup, EditorNumberedCard, EditorPreviewLink, EditorSectionHeader, EditorVisibilityToggle }
