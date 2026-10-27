import { ArrowUpLeft } from 'lucide-react'

function EditorPreviewLink({ href = '/', children }) {
  return <a href={href} target="_blank" rel="noreferrer" className="mb-2 inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-[.7rem] border border-admin-border bg-(--primary-action-bg) px-3 py-2 text-[.6875rem] font-semibold text-(--primary-action-text) shadow-[0_8px_20px_rgba(15,23,42,.07)] transition hover:-translate-y-0.5 hover:border-admin-brand hover:text-admin-brand hover:shadow-[0_12px_26px_rgba(15,23,42,.11)] sm:w-auto"><ArrowUpLeft size={15} />{children}</a>
}

function EditorSectionHeader({ icon: Icon, title, action }) {
  return <header className="flex flex-wrap items-center gap-4 border-b border-admin-border bg-[linear-gradient(110deg,var(--editor-field),var(--admin-card))] px-5 py-4 sm:px-6"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand"><Icon size={20} /></span><div className="min-w-0 flex-1"><h2 className="m-0 font-heading text-base text-admin-heading">{title}</h2></div>{action}</header>
}

function EditorVisibilityToggle({ label, checked, onChange }) {
  return <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-admin-border bg-admin-control px-3 py-2 text-[.6875rem] font-semibold text-admin-muted">{label}<input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} /><span aria-hidden="true" className="relative h-5 w-9 shrink-0 rounded-full border border-admin-border bg-[var(--admin-toggle-off)] transition-colors duration-200 peer-checked:border-admin-brand peer-checked:bg-admin-brand after:absolute after:top-1/2 after:right-1 after:size-3 after:-translate-y-1/2 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 peer-checked:after:-translate-x-4" /></label>
}

function EditorFieldGroup({ title, children, columns = true, className = '' }) {
  return <fieldset className={`grid gap-4 rounded-xl border border-(--admin-editor-group-border) bg-(--admin-editor-group-bg) p-4 ${columns ? 'sm:grid-cols-2' : ''} ${className}`}>{title && <legend className="-mb-1 rounded-md bg-admin-card px-2 py-1 text-[.6875rem] font-semibold text-admin-brand shadow-[0_1px_2px_rgb(15_23_42_/.06)]">{title}</legend>}{children}</fieldset>
}

function EditorField({ label, value, multiline = false, type = 'text', dir, full = false, rows = 4, hideLabel = false, onChange }) {
  if (!label) return null
  const shared = 'mt-2 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 text-[.8125rem] font-normal text-admin-heading outline-none transition placeholder:text-admin-muted focus:border focus:border-admin-brand'
  const fieldDirection = dir || (type === 'url' ? 'ltr' : undefined)
  return <label className={`block min-w-0 text-[.75rem] font-semibold text-admin-heading ${full ? 'sm:col-span-2' : ''}`}>{!hideLabel && <span>{label}</span>}{multiline ? <textarea aria-label={label} rows={rows} dir={fieldDirection} className={`${shared} resize-y py-3 leading-6 ${fieldDirection === 'ltr' ? 'text-left' : ''}`} value={value} onChange={(event) => onChange(event.target.value)} /> : <input aria-label={label} dir={fieldDirection} type={type} className={`${shared} min-h-11 py-2.5 ${fieldDirection === 'ltr' ? 'text-left' : ''}`} value={value} onChange={(event) => onChange(event.target.value)} />}</label>
}

export { EditorField, EditorFieldGroup, EditorPreviewLink, EditorSectionHeader, EditorVisibilityToggle }
