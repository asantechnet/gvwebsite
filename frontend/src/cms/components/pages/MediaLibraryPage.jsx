import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Eye, FileImage, ImagePlus, Search, Trash2, UploadCloud, X } from 'lucide-react'

import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import useModalFocus from '@/shared/hooks/useModalFocus.js'
import { createLocalUpload, revokeLocalUpload } from '@/shared/uploads/files.js'
import { removeUpload, uploadFile } from '@/shared/services/api/uploads.js'
import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import { showRecordToast } from '@cms/utils/toast.js'
import { closeCmsModal } from '@cms/utils/modalTransition.js'

const seedMedia = [
  ['/assets/images/home/hero-globe.webp', 'hero-globe.webp', 'image'],
  ['/assets/images/destinations/germany.webp', 'germany.webp', 'image'],
  ['/assets/images/destinations/turkiye.webp', 'turkiye.webp', 'image'],
  ['/assets/images/destinations/italy.webp', 'italy.webp', 'image'],
  ['/assets/images/destinations/france.webp', 'france.webp', 'image'],
  ['/assets/images/destinations/netherlands.webp', 'netherlands.webp', 'image'],
  ['/assets/images/team/murtaza.webp', 'murtaza.webp', 'image'],
  ['/assets/branding/new logo.webp', 'global-vision-logo.webp', 'image'],
].map(([url, name, type], index) => ({ id: `seed-${index}`, url, name, type, meta: type === 'image' ? 'Image' : 'File', local: false }))

const formatBytes = (size = 0) => size < 1024 * 1024 ? `${Math.max(0.1, size / 1024).toFixed(1)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`
const getMediaType = (name = '') => /\.(mp4|webm|ogg|mov)$/i.test(name) ? 'video' : /\.(mp3|wav|m4a|aac|flac)$/i.test(name) ? 'audio' : /\.pdf$/i.test(name) ? 'file' : 'image'

function MediaPreviewModal({ item, content, onClose }) {
  const dialogRef = useModalFocus({ onClose })
  const [dimensions, setDimensions] = useState({ id: null, value: '—' })
  const size = item.size ? formatBytes(item.size) : '—'

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', closeOnEscape) }
  }, [onClose])

  return <div className="cms-modal-backdrop fixed inset-0 z-[90] isolate grid place-items-center p-4" role="presentation">
    <button type="button" className="absolute inset-0 border-0 bg-black/70 backdrop-blur-md" aria-label={content.close} onClick={onClose} />
    <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="media-preview-title" className="relative z-10 flex max-h-[calc(100svh-2rem)] w-fit max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-2xl">
      <header className="flex min-w-0 items-center justify-between gap-3 border-b border-admin-border px-3 py-1.5 sm:px-4"><div className="min-w-0"><div className="flex items-center gap-1.5"><h2 id="media-preview-title" className="truncate font-heading text-sm text-admin-heading">{item.name}</h2><span className="shrink-0 rounded-md bg-admin-brand-soft px-1.5 py-0.5 text-[.6rem] font-semibold text-admin-brand-text">{size}</span><span className="shrink-0 rounded-md bg-admin-brand-soft px-1.5 py-0.5 text-[.6rem] font-semibold text-admin-brand-text">{dimensions.id === item.id ? dimensions.value : '—'}</span></div></div><button type="button" onClick={onClose} aria-label={content.close} className="grid size-7 shrink-0 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text"><X size={14} /></button></header>
      <div className="grid min-h-0 max-h-[calc(100svh-7rem)] place-items-center overflow-hidden bg-[#0d1118] p-0">{item.type === 'video' ? <video src={item.url} controls autoPlay onLoadedMetadata={(event) => setDimensions({ id: item.id, value: `${event.currentTarget.videoWidth} × ${event.currentTarget.videoHeight}` })} className="block max-h-[calc(100svh-7rem)] max-w-[calc(100vw-2rem)] object-contain" /> : item.type === 'audio' ? <audio src={item.url} controls autoPlay className="w-[min(32rem,calc(100vw-3rem))]" /> : item.type === 'file' ? <div className="grid place-items-center gap-4 p-8 text-center text-white"><FileImage size={52} className="text-admin-brand-text" /><strong>{item.name}</strong><a href={item.url} target="_blank" rel="noreferrer" className="rounded-xl bg-admin-brand px-4 py-2 text-sm font-semibold text-white">{content.openFile}</a></div> : <img src={item.url} alt={item.name} onLoad={(event) => setDimensions({ id: item.id, value: `${event.currentTarget.naturalWidth} × ${event.currentTarget.naturalHeight}` })} className="block max-h-[calc(100svh-7rem)] max-w-[calc(100vw-2rem)] object-contain" />}</div>
    </section>
  </div>
}

function MediaLibraryPage({ content }) {
  const inputRef = useRef(null)
  const [items, setItems] = useCmsDraftState('media', seedMedia)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [preview, setPreview] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const filtered = useMemo(() => items.filter((item) => (filter === 'all' || item.type === filter) && item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [filter, items, query])
  const allVisibleSelected = filtered.length > 0 && filtered.every((item) => selectedIds.has(item.id))

  useEffect(() => () => { items.filter((item) => item.local).forEach(revokeLocalUpload) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const upload = async (event) => {
    const files = [...(event.target.files || [])]
    event.target.value = ''
    const prepared = files.map((file) => createLocalUpload(file))
    const accepted = prepared.filter((item) => item.valid)
    setUploadError(accepted.length === prepared.length ? '' : content.uploadError)
    try {
      const uploaded = await Promise.all(accepted.map(async (item) => {
        const result = await uploadFile(item.file, { metadata: { kind: item.kind } })
        revokeLocalUpload(item)
        const type = result.kind === 'document' ? 'file' : result.kind || getMediaType(result.name)
        return { id: result.path, name: result.name, url: result.url, size: result.size, type, meta: `${formatBytes(result.size)} · ${content[type] || content.file}`, local: false }
      }))
      setItems((current) => [...uploaded, ...current])
      if (uploaded.length) showRecordToast('recordAdded')
    } catch (error) { accepted.forEach(revokeLocalUpload); setUploadError(error.message) }
  }
  const toggleSelection = (id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next })
  const toggleAll = () => setSelectedIds((current) => { const next = new Set(current); filtered.forEach(({ id }) => { if (allVisibleSelected) next.delete(id); else next.add(id) }); return next })
  const remove = async (ids) => {
    const confirmed = await window.cmsConfirmDelete?.({ title: ids.length === 1 ? content.deleteTitle : content.bulkDeleteTitle.replace('{count}', ids.length), description: content.deleteDescription })
    if (!confirmed) return
    const removable = items.filter((item) => ids.includes(item.id) && !String(item.id).startsWith('seed-'))
    try { await Promise.all(removable.map((item) => removeUpload(item.id))) } catch (error) { setUploadError(error.message); return }
    setItems((current) => { current.filter((item) => ids.includes(item.id) && item.local).forEach(revokeLocalUpload); return current.filter((item) => !ids.includes(item.id)) })
    setSelectedIds((current) => { const next = new Set(current); ids.forEach((id) => next.delete(id)); return next })
    if (preview && ids.includes(preview.id)) setPreview(null)
    if (ids.length) showRecordToast('recordDeleted')
  }

  return <PageContainer className="max-w-[78rem]">
    <PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.dashboard }, { label: content.title }]} action={<button type="button" onClick={() => inputRef.current?.click()} className="mb-2 inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl border border-admin-border bg-(--primary-action-bg) px-3 py-2 text-[.6875rem] font-semibold text-(--primary-action-text) shadow-[0_8px_20px_rgba(15,23,42,.07)] transition hover:-translate-y-0.5 hover:border-admin-brand hover:text-admin-brand-text hover:shadow-[0_12px_26px_rgba(15,23,42,.11)] sm:w-auto"><ImagePlus size={15} />{content.upload}</button>} />
    <input ref={inputRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.mp4,.webm,.ogg,.mov,.mp3,.wav,.m4a,.flac" className="hidden" onChange={upload} />
    {uploadError && <p role="alert" className="-mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-300">{uploadError}</p>}
    <section className="grid gap-2 rounded-2xl border border-admin-border bg-admin-card p-2 shadow-[0_12px_34px_rgb(15_23_42_/.055)] md:grid-cols-[minmax(15rem,.7fr)_minmax(18rem,1fr)]">
      <label className="order-2 flex h-9 min-w-0 items-center gap-2 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3 text-admin-muted transition focus-within:border-admin-brand md:order-1"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="search-field min-w-0 flex-1 bg-transparent text-xs text-admin-heading outline-none" placeholder={content.search} /></label>
      <div className="order-1 grid min-w-0 grid-cols-4 gap-1 rounded-xl border border-(--editor-field-border) bg-(--editor-input) p-1 md:order-2">{[['all', content.all], ['image', content.images], ['video', content.videos], ['audio', content.audios]].map(([value, label]) => <button type="button" key={value} onClick={() => setFilter(value)} className={`min-h-7 rounded-lg px-2 text-[.6875rem] font-semibold transition ${filter === value ? 'bg-admin-brand text-white shadow-sm' : 'text-admin-muted hover:bg-admin-brand-soft hover:text-admin-brand-text'}`}>{label}</button>)}</div>
    </section>
    <section className={`flex min-h-12 flex-nowrap items-center gap-2 rounded-2xl border px-3 py-2 transition sm:gap-3 ${selectedIds.size ? 'border-admin-brand/40 bg-admin-brand-soft shadow-[0_8px_24px_rgb(15_23_42_/.05)]' : 'border-admin-border bg-admin-card'}`}><label className="inline-flex min-w-0 shrink cursor-pointer items-center gap-2 text-xs font-semibold text-admin-heading"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} className="size-4 shrink-0 accent-admin-brand" /><span className="truncate">{content.selectAll}</span></label><span className="me-auto shrink-0 whitespace-nowrap text-[.6875rem] text-admin-muted">{content.selected.replace('{count}', selectedIds.size)}</span><button type="button" aria-label={content.deleteSelected} disabled={!selectedIds.size} onClick={() => remove([...selectedIds])} className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/20 p-0 text-[.6875rem] font-semibold text-red-500 transition hover:border-red-500 hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-500/45 sm:h-9 sm:w-auto sm:gap-2 sm:px-3"><Trash2 size={15} /><span className="hidden sm:inline">{content.deleteSelected}</span></button></section>
    {filtered.length > 0 ? <section className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">{filtered.map((item) => <article key={item.id} className={`relative overflow-hidden rounded-2xl border bg-admin-card shadow-[0_8px_24px_rgb(15_23_42_/.05)] transition hover:-translate-y-0.5 hover:border-admin-brand hover:shadow-[0_16px_38px_rgb(15_23_42_/.1)] ${selectedIds.has(item.id) ? 'border-admin-brand shadow-[0_0_0_2px_var(--admin-brand-soft)]' : 'border-admin-border'}`}>
      <label className="absolute start-2.5 top-2.5 z-20 cursor-pointer"><input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelection(item.id)} className="peer sr-only" /><span className="grid size-5 place-items-center rounded-md bg-slate-950/60 text-white transition peer-checked:text-admin-brand-text"><CheckCircle2 size={14} /></span><span className="sr-only">{content.select} {item.name}</span></label>
      <div role="button" tabIndex="0" onClick={() => setPreview(item)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPreview(item) } }} className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden bg-(--editor-field)">
        {item.type === 'file' ? <span className="grid size-full place-items-center text-admin-brand-text"><FileImage size={36} /></span> : item.type === 'video' ? <video src={item.url} muted className="size-full object-cover" /> : item.type === 'audio' ? <span className="grid size-full place-items-center text-admin-brand-text"><UploadCloud size={36} /></span> : <img src={item.url} alt="" className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />}
        <span className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/55 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"><Eye size={18} />{content.preview}</span>
        <span className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 rounded-lg bg-slate-950/75 px-2 py-1.5 text-white backdrop-blur-md"><strong className="min-w-0 flex-1 truncate text-start text-[.7rem]">{item.name}</strong><button type="button" onClick={(event) => { event.stopPropagation(); remove([item.id]) }} className="grid size-7 shrink-0 place-items-center rounded-md border border-red-400/50 text-red-300 transition hover:bg-red-500/20 hover:text-red-100" aria-label={`${content.delete} ${item.name}`}><Trash2 size={14} /></button></span>
      </div>
    </article>)}</section> : <section className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-admin-border bg-admin-card p-6 text-center"><div><UploadCloud className="mx-auto text-admin-brand-text" size={30} /><h2 className="mt-3 text-sm font-bold text-admin-heading">{content.emptyTitle}</h2><p className="mt-1 text-xs text-admin-muted">{content.emptyDescription}</p></div></section>}
    {preview && <MediaPreviewModal item={preview} content={content} onClose={() => closeCmsModal(() => setPreview(null))} />}
  </PageContainer>
}

export default MediaLibraryPage
