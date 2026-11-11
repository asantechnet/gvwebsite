import { useState } from 'react'
import { ImagePlus, Replace, Trash2 } from 'lucide-react'
import { revokeLocalUpload } from '@/shared/uploads/files.js'
import MediaPickerModal from '@cms/components/MediaPickerModal.jsx'
import { useCmsInterfaceLanguage } from '@cms/hooks/useCmsLanguage.js'
import englishMedia from '@cms/locales/en/media.json'
import dariMedia from '@cms/locales/prs/media.json'
import pashtoMedia from '@cms/locales/ps/media.json'

function MediaUploadField({ value, onChange, content, fill = false, fullWidth = true, iconOnly = false, previewShape = 'wide', imageFit = 'cover' }) {
  const language = useCmsInterfaceLanguage()
  const mediaContent = language === 'en' ? englishMedia : language === 'ps' ? pashtoMedia : dariMedia
  const [pickingMedia, setPickingMedia] = useState(false)
  const selectMedia = (media) => { revokeLocalUpload(value); onChange(media.url); setPickingMedia(false) }
  const previewClass = previewShape === 'icon' ? 'aspect-[16/7] w-full' : previewShape === 'square' ? 'mx-auto aspect-square w-full max-w-64' : 'aspect-[16/7] w-full'
  const imageClass = imageFit === 'contain' ? 'object-contain' : 'object-cover'
  return <div className={`${fullWidth ? 'sm:col-span-2' : ''} ${fill ? 'flex h-full flex-col' : ''}`}>
    <span className="text-xs font-semibold text-admin-heading">{content.countryImage}</span>
    {value ? <div className={`relative mt-2 overflow-visible rounded-xl border border-(--editor-field-border) bg-(--editor-input) ${fill ? 'min-h-48 flex-1' : previewClass}`}>
      <img src={value} alt="" className={`size-full rounded-xl ${imageClass}`} />
      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 rounded-b-xl bg-gradient-to-t from-black/75 via-black/45 to-transparent px-3 pt-10 pb-3">
        <button type="button" aria-label={content.replace} onClick={() => setPickingMedia(true)} className={`group relative inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 text-[.65rem] font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/25 ${iconOnly ? 'w-9 justify-center px-0' : 'px-3'}`}><Replace size={13} />{!iconOnly && content.replace}{iconOnly && <span role="tooltip" className="pointer-events-none absolute bottom-full start-1/2 z-20 mb-2 -translate-x-1/2 max-w-[calc(100vw-2rem)] whitespace-nowrap rounded-lg border border-white/15 bg-[#111a27] px-2.5 py-1.5 text-[.65rem] font-semibold text-white opacity-0 shadow-[0_8px_20px_rgb(0_0_0_/.28)] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{content.replace}</span>}</button>
        <button type="button" aria-label={content.remove} onClick={(event) => { onChange(''); event.currentTarget.dispatchEvent(new Event('input', { bubbles: true })) }} className={`group relative inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-red-300/50 bg-red-600/75 text-[.65rem] font-semibold text-white transition hover:bg-red-600 ${iconOnly ? 'w-9 justify-center px-0' : 'px-3'}`}><Trash2 size={13} />{!iconOnly && content.remove}{iconOnly && <span role="tooltip" className="pointer-events-none absolute bottom-full start-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-[#111a27] px-2.5 py-1.5 text-[.65rem] font-semibold text-white opacity-0 shadow-[0_8px_20px_rgb(0_0_0_/.28)] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{content.remove}</span>}</button>
      </div>
    </div> : <button type="button" aria-label={mediaContent.picker.fieldChoose} onClick={() => setPickingMedia(true)} className={`mt-2 grid min-h-28 w-full place-items-center content-center gap-1.5 rounded-xl border-2 border-dashed border-(--editor-field-border) bg-(--editor-input) p-4 text-center text-admin-brand-text hover:border-admin-brand hover:bg-admin-brand-soft ${fill ? 'flex-1' : ''}`}><ImagePlus size={24} />{!iconOnly && <strong className="text-xs text-admin-heading">{mediaContent.picker.fieldChoose}</strong>}</button>}
    {pickingMedia && <MediaPickerModal content={mediaContent} onClose={() => setPickingMedia(false)} onSelect={selectMedia} />}
  </div>
}

export default MediaUploadField
