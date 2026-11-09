import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, FileImage, UploadCloud, X } from 'lucide-react'

import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import useModalFocus from '@/shared/hooks/useModalFocus.js'
import { createLocalUpload, revokeLocalUpload } from '@/shared/uploads/files.js'
import { uploadFile } from '@/shared/services/api/uploads.js'
import { formatMediaBytes, getMediaFormat, getMediaType, seedMedia } from '@cms/data/mediaLibrary.js'

const acceptByKind = { image: 'image/jpeg,image/png,image/webp,image/gif', video: 'video/mp4,video/webm,video/ogg,video/quicktime', audio: 'audio/mpeg,audio/mp4,audio/ogg,audio/wav,audio/x-wav,audio/flac', document: 'application/pdf' }

function MediaPickerModal({ content, acceptedKinds = ['image'], onClose, onSelect }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dimensions, setDimensions] = useState({})
  const [items, setItems] = useCmsDraftState('media', seedMedia)
  const uploadPending = useRef(false)
  const inputRef = useRef(null)
  const dialogRef = useModalFocus({ onClose })
  const acceptedTypes = useMemo(() => acceptedKinds.map((kind) => kind === 'document' ? 'file' : kind), [acceptedKinds])
  const libraryMedia = useMemo(() => items.filter((item) => acceptedTypes.includes(item.type)), [items, acceptedTypes])
  const accept = acceptedKinds.map((kind) => acceptByKind[kind]).filter(Boolean).join(',')

  useEffect(() => {
    let cancelled = false
    libraryMedia.forEach((media) => {
      if (media.type === 'image') {
        const image = new Image()
        image.onload = () => !cancelled && setDimensions((current) => ({ ...current, [media.id]: `${image.naturalWidth} × ${image.naturalHeight}` }))
        image.src = media.url
      } else if (media.type === 'video') {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.onloadedmetadata = () => !cancelled && setDimensions((current) => ({ ...current, [media.id]: `${video.videoWidth} × ${video.videoHeight}` }))
        video.src = media.url
      }
    })
    return () => { cancelled = true }
  }, [libraryMedia])

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
    }
  }, [])

  const chooseFile = async (file) => {
    if (!file || uploadPending.current) return
    const local = createLocalUpload(file, acceptedKinds)
    if (!local.valid) {
      setError(local.code === 'size'
        ? `${content.picker.errorSize} (${formatMediaBytes(local.maxBytes)})`
        : content.picker.errorType)
      return
    }
    uploadPending.current = true
    setUploading(true)
    setError('')
    try {
      const result = await uploadFile(file, { metadata: { kind: local.kind } })
      const media = {
        id: result.path,
        name: result.name || file.name,
        url: result.url,
        size: result.size || file.size,
        type: result.kind === 'document' ? 'file' : result.kind || getMediaType(result.name || file.name),
        meta: `${formatMediaBytes(result.size || file.size)} · ${content[result.kind] || content.file}`,
        local: false,
      }
      revokeLocalUpload(local)
      setItems((current) => [media, ...current.filter((item) => item.id !== media.id)])
      onSelect(media)
    } catch (uploadError) {
      revokeLocalUpload(local)
      setError(uploadError.message)
    } finally {
      uploadPending.current = false
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return createPortal(<div className="cms-modal-backdrop fixed inset-0 z-[155] isolate grid place-items-center p-3 sm:p-4" role="presentation" onMouseDown={(event) => event.stopPropagation()}>
    <button type="button" className="absolute inset-0 w-full border-0 bg-transparent" aria-label={content.picker.close} onClick={onClose} />
    <section ref={dialogRef} tabIndex={-1} className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-[min(100%,52rem)] flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-2xl sm:max-h-[calc(100dvh-2rem)]" role="dialog" aria-modal="true" aria-labelledby="media-picker-title">
      <header className="flex items-center justify-between gap-4 border-b border-admin-border px-4 py-3 sm:px-5"><h2 id="media-picker-title" className="min-w-0 font-heading text-lg text-admin-heading">{content.picker.title}</h2><button type="button" className="grid size-9 shrink-0 place-items-center rounded-xl border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand-text dark:bg-admin-control" aria-label={content.picker.close} onClick={onClose}><X size={18} /></button></header>

      <div className={`mx-[1.1rem] mt-[1.1rem] mb-4 flex flex-col items-center gap-[.8rem] rounded-[.9rem] border-2 border-dashed bg-(--editor-input) px-4 py-[.85rem] text-center text-admin-brand-text transition-[border-color,background-color] duration-200 sm:flex-row sm:text-start ${dragging ? 'border-admin-brand bg-admin-brand-soft' : 'border-(--editor-field-border)'}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false) }} onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files?.[0]) }}>
        <input ref={inputRef} type="file" className="sr-only" disabled={uploading} accept={accept} onChange={(event) => chooseFile(event.target.files?.[0])} />
        <UploadCloud size={25} /><div className="grid min-w-0 gap-[.15rem] sm:flex-1"><strong className="text-[.75rem] text-admin-heading">{uploading ? content.picker.uploading : content.picker.drop}</strong></div><button type="button" className="inline-flex min-h-9 items-center justify-center rounded-xl bg-admin-brand px-4 text-xs font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50" disabled={uploading} onClick={() => inputRef.current?.click()}>{uploading ? content.picker.uploadingButton : content.picker.browse}</button>
      </div>
      <div className="px-[1.1rem] text-xs font-semibold text-admin-heading">{content.picker.uploaded}</div>
      {error && <div className="absolute inset-0 z-20 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.stopPropagation()}><div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-red-500/25 bg-admin-card p-5 text-center shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="media-upload-error-title"><h3 id="media-upload-error-title" className="font-heading text-base text-red-600 dark:text-red-300">{content.picker.errorTitle}</h3><p className="mt-2 text-sm leading-6 text-admin-heading">{error}</p><p className="mt-3 w-full rounded-xl bg-admin-control-soft px-3 py-2 text-xs leading-5 text-admin-muted">{acceptedKinds.length === 1 && acceptedKinds[0] === 'image' ? content.picker.formats : content.picker.formatsMedia}</p><button type="button" className="mt-4 min-h-9 rounded-xl bg-admin-brand px-4 text-xs font-semibold text-white" onClick={() => setError('')}>{content.picker.errorClose}</button></div></div>}
      {libraryMedia.length === 0 && <p className="px-[1.1rem] py-5 text-xs text-admin-muted">{content.picker.empty}</p>}
      {libraryMedia.length > 0 && <div className="flex-none grid max-h-96 grid-cols-2 gap-3 overflow-y-auto p-[1.1rem] sm:grid-cols-3 lg:grid-cols-4">{libraryMedia.map((media) => <button className="group relative min-w-0 overflow-hidden rounded-[.8rem] border border-admin-border bg-(--editor-field) p-0 text-start text-admin-heading transition-[border-color,box-shadow] duration-200 hover:border-admin-brand hover:shadow-[0_10px_24px_rgb(15_23_42/.1)]" type="button" disabled={uploading} key={media.id ?? media.name} onClick={() => onSelect(media)}>{media.type === 'file' || media.type === 'audio' ? <span className="grid aspect-[4/3] place-items-center bg-admin-control-soft text-admin-brand-text"><FileImage size={32} /></span> : media.type === 'video' ? <video className="block aspect-[4/3] w-full object-cover" src={media.url} muted preload="metadata" /> : <img className="block aspect-[4/3] w-full object-cover" src={media.url} alt="" />}<span className="absolute inset-x-2 bottom-2 rounded-lg bg-slate-950/80 px-2 py-1.5 text-white opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"><strong className="block truncate text-[.6875rem]">{media.name}</strong><small className="block truncate text-[.6rem] text-white/80">{media.size ? formatMediaBytes(media.size) : '—'} · {getMediaFormat(media.name, media.type)} · {dimensions[media.id] || '—'}</small></span><Check className="absolute right-2 top-2 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" size={15} /></button>)}</div>}
    </section>
  </div>, document.querySelector('.cms-root') || document.body)
}

export default MediaPickerModal
