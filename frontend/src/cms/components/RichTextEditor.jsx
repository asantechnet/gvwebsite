import { Component, useEffect, useRef, useState } from 'react'
import { EditorContent, Extension, Node, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, mergeAttributes, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { AlignCenter, AlignLeft, AlignRight, AudioLines, Bold, Check, ChevronDown, Columns3, FileVideo, Heading2, Heading3, Highlighter, ImagePlus, Italic, LayoutGrid, Link2, List, ListOrdered, MousePointerClick, Paperclip, Pencil, Plus, Redo2, Replace, Shapes, Trash2, Underline as UnderlineIcon, Undo2, UploadCloud, X } from 'lucide-react'
import en from '@cms/locales/en/editor.json'
import prs from '@cms/locales/prs/editor.json'
import ps from '@cms/locales/ps/editor.json'
import AudioMedia from '@/shared/components/media/AudioMedia.jsx'
import ImageMedia from '@/shared/components/media/ImageMedia.jsx'
import VideoMedia from '@/shared/components/media/VideoMedia.jsx'

const translations = { en, prs, ps }
const headingIconCategories = [
  { key: 'education', icon: '🎓', icons: ['🎓', '📚', '📖', '📘', '📗', '📕', '📙', '📝', '✏️', '🖊️', '📐', '📏', '🔬', '🔭', '🧪', '🧠', '🏫', '👨‍🎓', '👩‍🎓', '💡'] },
  { key: 'travel', icon: '🌍', icons: ['🌍', '🌎', '🌏', '✈️', '🛫', '🛬', '🧳', '🗺️', '🧭', '📍', '🏙️', '🏛️', '🏰', '⛰️', '🏖️', '🚆', '🚗', '🚌', '🚢', '🛂'] },
  { key: 'flags', icon: '🏳️', icons: ['🇦🇫', '🇩🇪', '🇬🇧', '🇺🇸', '🇨🇦', '🇦🇺', '🇫🇷', '🇮🇹', '🇪🇸', '🇳🇱', '🇧🇪', '🇨🇭', '🇦🇹', '🇸🇪', '🇳🇴', '🇩🇰', '🇫🇮', '🇵🇱', '🇨🇿', '🇭🇺', '🇹🇷', '🇦🇪', '🇸🇦', '🇶🇦', '🇮🇷', '🇵🇰', '🇮🇳', '🇨🇳', '🇯🇵', '🇰🇷', '🇲🇾', '🇸🇬', '🇳🇿', '🇷🇺', '🇺🇦', '🇧🇷'] },
  { key: 'work', icon: '💼', icons: ['💼', '🏢', '👔', '🤝', '📊', '📈', '📉', '🧑‍💻', '⚙️', '🛠️', '💰', '💳', '🏦', '🧾', '📋', '🎯', '🚀', '🏆', '🥇', '✅'] },
  { key: 'documents', icon: '📄', icons: ['📄', '📃', '📑', '🗂️', '📁', '📂', '🗃️', '🗄️', '📎', '🔗', '🔖', '🏷️', '✉️', '📨', '📬', '🖨️', '🔏', '🔐', '🪪', '📜'] },
  { key: 'communication', icon: '💬', icons: ['💬', '🗨️', '💭', '📣', '📢', '🔔', '📞', '☎️', '📱', '📧', '📮', '🎙️', '🎧', '📻', '📺', '📷', '🎥', '🌐', '👥', '🙋'] },
  { key: 'alerts', icon: '⚠️', icons: ['⚠️', '❗', '❓', '‼️', '⁉️', '🚨', '⛔', '🛑', '🔴', '🟠', '🟡', '🟢', '🔵', 'ℹ️', '✅', '❌', '☑️', '🔒', '⏰', '📅'] },
  { key: 'general', icon: '⭐', icons: ['⭐', '🌟', '✨', '💫', '🔥', '❤️', '💜', '💙', '🧡', '👍', '👏', '🙌', '💪', '🎉', '🎊', '🎁', '🔑', '📌', '🧩', '♻️'] },
]

const HighlightBox = Node.create({ name: 'highlightBox', group: 'block', content: 'block+', defining: true, parseHTML: () => [{ tag: 'div[data-highlight-box]' }], renderHTML: ({ HTMLAttributes }) => ['div', mergeAttributes(HTMLAttributes, { 'data-highlight-box': '' }), 0] })

const IconHeading = Node.create({
  name: 'heading', group: 'block', content: 'inline*', defining: true,
  addAttributes: () => ({ level: { default: 2 }, icon: { default: null, parseHTML: (element) => element.getAttribute('data-icon'), renderHTML: ({ icon }) => icon ? { 'data-icon': icon } : {} } }),
  parseHTML: () => [{ tag: 'h2', attrs: { level: 2 } }, { tag: 'h3', attrs: { level: 3 } }],
  renderHTML: ({ node, HTMLAttributes }) => [`h${node.attrs.level}`, mergeAttributes(HTMLAttributes), 0],
  addCommands() { return { toggleHeading: (attributes) => ({ commands }) => commands.toggleNode(this.name, 'paragraph', attributes) } },
  addNodeView: () => ReactNodeViewRenderer(IconHeadingNodeView),
})

const InlineIcon = Node.create({
  name: 'inlineIcon', group: 'inline', inline: true, atom: true, selectable: true,
  addAttributes: () => ({ icon: { default: '⭐' } }),
  parseHTML: () => [{ tag: 'span[data-inline-icon]', getAttrs: (element) => ({ icon: element.getAttribute('data-icon') || element.textContent || '⭐' }) }],
  renderHTML: ({ node }) => ['span', { 'data-inline-icon': '', 'data-icon': node.attrs.icon }, node.attrs.icon],
  addNodeView: () => ReactNodeViewRenderer(InlineIconNodeView),
})

const MediaBlock = Node.create({
  name: 'mediaBlock', group: 'block', atom: true, draggable: true,
  addOptions: () => ({ onEdit: () => {} }),
  addAttributes: () => ({ src: { default: '' }, mediaType: { default: 'image' }, name: { default: '' }, title: { default: '' }, caption: { default: '' }, alt: { default: '' }, author: { default: '' }, avatar: { default: '' }, poster: { default: '' }, mimeType: { default: '' } }),
  parseHTML: () => [{ tag: 'figure[data-editor-media]', getAttrs: (element) => ({ src: element.getAttribute('data-src'), mediaType: element.getAttribute('data-media-type'), name: element.getAttribute('data-name'), title: element.getAttribute('data-title'), caption: element.getAttribute('data-caption'), alt: element.getAttribute('data-alt'), author: element.getAttribute('data-author'), avatar: element.getAttribute('data-avatar'), poster: element.getAttribute('data-poster'), mimeType: element.getAttribute('data-mime-type') }) }],
  renderHTML: ({ node }) => { const attrs = node.attrs; const media = attrs.mediaType === 'image' ? ['img', { src: attrs.src, alt: attrs.alt || attrs.title }] : [attrs.mediaType, { src: attrs.src, controls: 'true', preload: 'metadata', poster: attrs.poster || null }]; return ['figure', { 'data-editor-media': '', 'data-src': attrs.src, 'data-media-type': attrs.mediaType, 'data-name': attrs.name, 'data-title': attrs.title, 'data-caption': attrs.caption, 'data-alt': attrs.alt, 'data-author': attrs.author, 'data-avatar': attrs.avatar, 'data-poster': attrs.poster, 'data-mime-type': attrs.mimeType }, media, ['figcaption', {}, attrs.caption || attrs.title || attrs.name]] },
  addNodeView: () => ReactNodeViewRenderer(EditorMediaNodeView),
})

const MediaGrid = Node.create({
  name: 'mediaGrid', group: 'block', atom: true, draggable: true,
  addOptions: () => ({ onEditSlot: () => {} }),
  addAttributes: () => ({ layout: { default: 'two' }, items: { default: [] } }),
  parseHTML: () => [{ tag: 'div[data-media-grid]', getAttrs: (element) => { try { return { layout: element.getAttribute('data-layout') || 'two', items: JSON.parse(element.getAttribute('data-items') || '[]') } } catch { return { layout: 'two', items: [] } } } }],
  renderHTML: ({ node }) => ['div', { 'data-media-grid': '', 'data-layout': node.attrs.layout, 'data-items': JSON.stringify(node.attrs.items) }],
  addNodeView: () => ReactNodeViewRenderer(EditorMediaGridNodeView),
})

const ActionButton = Node.create({
  name: 'actionButton', group: 'block', atom: true,
  addAttributes: () => ({ label: { default: '' }, href: { default: '' } }),
  parseHTML: () => [{ tag: 'div[data-editor-button]', getAttrs: (element) => ({ label: element.getAttribute('data-label'), href: element.getAttribute('data-href') }) }],
  renderHTML: ({ node }) => ['div', { 'data-editor-button': '', 'data-label': node.attrs.label, 'data-href': node.attrs.href }, ['a', { href: node.attrs.href, target: '_blank', rel: 'noopener noreferrer' }, node.attrs.label]],
})

const StructuredAttributes = Extension.create({
  name: 'structuredAttributes',
  addGlobalAttributes: () => [{ types: ['bulletList', 'orderedList'], attributes: { columns: { default: 1, parseHTML: (element) => Number(element.getAttribute('data-columns')) || 1, renderHTML: ({ columns }) => Number(columns) > 1 ? { 'data-columns': columns } : {} } } }],
})

const getLanguage = () => { const lang = document.documentElement.lang; return lang === 'en' ? 'en' : lang === 'ps' ? 'ps' : 'prs' }
const editorExtensions = (copy, onEditMedia, onEditGridSlot) => [StarterKit.configure({ link: false, underline: false, heading: false }), IconHeading, InlineIcon, Underline, Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }), Placeholder.configure({ placeholder: copy.placeholder }), TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'] }), StructuredAttributes, HighlightBox, MediaBlock.configure({ onEdit: onEditMedia }), MediaGrid.configure({ onEditSlot: onEditGridSlot }), ActionButton]
const toolClass = 'grid size-9 place-items-center rounded-lg border transition-colors disabled:opacity-35'

function IconHeadingNodeView({ node, updateAttributes }) {
  const [controlsVisible, setControlsVisible] = useState(false)
  const Tag = `h${node.attrs.level}`
  return <NodeViewWrapper as={Tag} className="group/icon-heading relative" onClick={() => setControlsVisible(true)}>{node.attrs.icon && <span className="relative me-2 inline-grid size-10 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--admin-brand)_36%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-brand)_19%,var(--admin-card))] font-sans text-lg align-middle shadow-[0_5px_14px_color-mix(in_srgb,var(--admin-brand)_14%,transparent)]" contentEditable={false}><span>{node.attrs.icon}</span><button type="button" aria-label="Remove icon" onClick={(event) => { event.stopPropagation(); updateAttributes({ icon: null }); setControlsVisible(false) }} className={`absolute -top-1.5 -end-1.5 grid size-4.5 place-items-center rounded-full border border-white bg-red-600 text-white shadow-md transition-opacity hover:bg-red-700 md:opacity-0 md:group-hover/icon-heading:opacity-100 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}><X size={10} strokeWidth={3} /></button></span>}<NodeViewContent as="span" /></NodeViewWrapper>
}

function InlineIconNodeView({ node, deleteNode, selected }) {
  const [controlsVisible, setControlsVisible] = useState(false)
  return <NodeViewWrapper as="span" className="group/inline-icon relative me-2 inline-grid size-8 place-items-center rounded-lg border border-[color-mix(in_srgb,var(--admin-brand)_36%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-brand)_19%,var(--admin-card))] font-sans text-base align-middle shadow-[0_3px_9px_color-mix(in_srgb,var(--admin-brand)_12%,transparent)]" contentEditable={false} onClick={() => setControlsVisible(true)}><span>{node.attrs.icon}</span><button type="button" aria-label="Remove icon" onClick={(event) => { event.stopPropagation(); deleteNode() }} className={`absolute -top-1.5 -end-1.5 grid size-4.5 place-items-center rounded-full border border-white bg-red-600 text-white shadow-md transition-opacity hover:bg-red-700 md:opacity-0 md:group-hover/inline-icon:opacity-100 ${selected || controlsVisible ? 'opacity-100' : 'opacity-0'}`}><X size={10} strokeWidth={3} /></button></NodeViewWrapper>
}

function EditorMediaNodeView({ node, selected, deleteNode, extension, getPos }) {
  const { src, mediaType, name, title, caption, alt, author, avatar, poster, mimeType } = node.attrs
  const displayTitle = title || name
  const media = mediaType === 'audio' ? { audio: { src, type: mimeType, title: displayTitle, speaker: author, speakerLabel: '', avatar: avatar || '/assets/images/team/erfan.webp' } } : mediaType === 'video' ? { video: { src, title: displayTitle, playLabel: displayTitle, poster } } : { imageAlt: alt || displayTitle, imageLabel: caption || displayTitle }
  return <NodeViewWrapper className={`group/media relative my-4 rounded-[1.45rem] transition-shadow ${selected ? 'shadow-[0_0_0_3px_var(--admin-brand)]' : ''}`} contentEditable={false} data-drag-handle><div className={`absolute top-3 end-3 z-20 flex gap-1.5 rounded-xl border border-white/20 bg-black/55 p-1.5 shadow-lg backdrop-blur-md transition-opacity group-hover/media:opacity-100 group-focus-within/media:opacity-100 ${selected ? 'opacity-100' : 'opacity-0'}`}><button type="button" onClick={() => extension.options.onEdit(node.attrs, getPos())} className="grid size-8 place-items-center rounded-lg text-white transition hover:bg-white/20" aria-label="Edit media"><Pencil size={15} /></button><button type="button" onClick={deleteNode} className="grid size-8 place-items-center rounded-lg text-white transition hover:bg-red-600" aria-label="Delete media"><Trash2 size={15} /></button></div>
    {mediaType === 'image' && <ImageMedia post={{ image: src }} media={media} />}
    {mediaType === 'video' && <VideoMedia post={{ image: '' }} media={media} />}
    {mediaType === 'audio' && <AudioMedia media={media} />}
  </NodeViewWrapper>
}

function GridMediaItem({ item }) {
  const displayTitle = item.title || item.name
  if (item.mediaType === 'video') return <VideoMedia post={{ image: '' }} media={{ video: { src: item.src, title: displayTitle, playLabel: displayTitle, poster: item.poster } }} />
  if (item.mediaType === 'audio') return <AudioMedia media={{ audio: { src: item.src, type: item.mimeType, title: displayTitle, speaker: item.author, speakerLabel: '', avatar: item.avatar || '/assets/images/team/erfan.webp' } }} />
  return <ImageMedia post={{ image: item.src }} media={{ imageAlt: item.alt || displayTitle, imageLabel: item.caption || displayTitle }} />
}

function EditorMediaGridNodeView({ node, selected, deleteNode, extension, getPos, updateAttributes }) {
  const { layout, items } = node.attrs
  const copy = translations[getLanguage()]
  const layoutClass = layout === 'two' ? 'sm:grid-cols-2' : layout === 'three' ? 'sm:grid-cols-3' : layout === 'four' ? 'sm:grid-cols-2' : 'sm:grid-cols-3 sm:grid-rows-2'
  const featured = layout === 'featured-right' || layout === 'featured-left'
  const removeSlot = (index) => { const next = [...items]; next[index] = null; updateAttributes({ items: next }) }
  return <NodeViewWrapper className={`group/grid relative my-5 rounded-[1.4rem] p-2 transition-shadow ${selected ? 'shadow-[0_0_0_3px_var(--admin-brand)]' : 'shadow-[0_0_0_1px_var(--admin-border)]'}`} contentEditable={false} data-drag-handle><button type="button" onClick={deleteNode} className="absolute -top-3 end-3 z-30 grid size-8 place-items-center rounded-lg bg-red-600 text-white opacity-0 shadow-lg transition-opacity group-hover/grid:opacity-100 group-focus-within/grid:opacity-100" aria-label={copy.deleteGrid}><Trash2 size={15} /></button><div className={`grid gap-3 ${layoutClass}`}>{items.map((item, index) => <div key={index} className={`group/slot relative min-h-40 overflow-hidden rounded-2xl bg-admin-control-soft ${featured && index === 0 ? `sm:col-span-2 sm:row-span-2 ${layout === 'featured-left' ? 'sm:order-last' : ''}` : ''}`}>{item?.src ? <><GridMediaItem item={item} /><div className="absolute top-2 end-2 z-20 flex gap-1 rounded-lg bg-black/55 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover/slot:opacity-100 group-focus-within/slot:opacity-100"><button type="button" onClick={() => extension.options.onEditSlot(item, getPos(), index)} className="grid size-7 place-items-center rounded-md text-white hover:bg-white/20" aria-label={copy.editMedia}><Pencil size={14} /></button><button type="button" onClick={() => removeSlot(index)} className="grid size-7 place-items-center rounded-md text-white hover:bg-red-600" aria-label={copy.remove}><Trash2 size={14} /></button></div></> : <button type="button" onClick={() => extension.options.onEditSlot(null, getPos(), index)} className="grid size-full min-h-40 place-items-center content-center gap-2 border-2 border-dashed border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand"><Plus size={22} /><span className="text-xs font-semibold">{copy.addMedia}</span></button>}</div>)}</div></NodeViewWrapper>
}

function Tool({ label, Icon, active = false, disabled = false, onClick }) {
  return <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={onClick} className={`${toolClass} ${active ? 'border-admin-brand bg-admin-brand text-white' : 'border-admin-border bg-admin-card text-admin-muted hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand'}`}><Icon size={16} /></button>
}

function EditorDialog({ title, children, confirm, cancel, onConfirm, onClose }) {
  return <div className="absolute inset-x-2 top-full z-30 mt-2 rounded-xl border border-admin-border bg-admin-card p-3 shadow-[0_16px_38px_rgba(15,23,42,.2)]" role="dialog" aria-label={title}><div className="mb-3 flex items-center justify-between gap-3"><strong className="text-xs text-admin-heading">{title}</strong><button type="button" onClick={onClose} className="grid size-7 place-items-center rounded-lg text-admin-muted hover:bg-admin-brand-soft hover:text-admin-brand" aria-label={cancel}><X size={15} /></button></div>{children}<div className="mt-3 flex justify-end gap-2"><button type="button" onClick={onClose} className="min-h-9 rounded-lg border border-admin-border px-3 text-xs text-admin-muted">{cancel}</button><button type="button" onClick={onConfirm} className="min-h-9 rounded-lg bg-admin-brand px-3 text-xs font-semibold text-white">{confirm}</button></div></div>
}

function MediaPickerField({ label, kind, value, fileName, accept, choose, drop, replace, remove, onFile, onRemove, full = false }) {
  const inputRef = useRef(null)
  const Icon = kind === 'audio' ? AudioLines : kind === 'video' ? FileVideo : ImagePlus
  const selectFile = (file) => { if (file) onFile(file) }
  return <div className={`grid gap-1.5 text-xs text-admin-muted ${full ? 'sm:col-span-2' : ''}`}><span>{label}</span>{value ? <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]) }} className="relative min-h-28 overflow-hidden rounded-xl border border-(--editor-field-border) bg-(--editor-input)">
    {kind === 'image' && <img src={value} alt="" className="absolute inset-0 size-full object-cover" />}
    {kind === 'video' && <video src={value} muted preload="metadata" className="absolute inset-0 size-full object-cover" />}
    {kind === 'audio' && <div className="absolute inset-0 grid place-items-center content-center gap-2 bg-admin-control-soft text-admin-brand"><AudioLines size={30} /><strong className="max-w-[85%] truncate text-xs text-admin-heading">{fileName}</strong></div>}
    <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pt-10 pb-3"><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-3 text-[.65rem] font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/25"><Replace size={13} />{replace}</button><button type="button" onClick={onRemove} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-red-300/50 bg-red-600/75 px-3 text-[.65rem] font-semibold text-white backdrop-blur-sm transition hover:bg-red-600"><Trash2 size={13} />{remove}</button></div>
  </div> : <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]) }} className="grid min-h-28 w-full place-items-center content-center gap-1.5 rounded-xl border-2 border-dashed border-(--editor-field-border) bg-(--editor-input) p-4 text-center transition hover:border-admin-brand hover:bg-admin-brand-soft"><Icon size={26} className="text-admin-brand" /><strong className="max-w-full truncate text-xs text-admin-heading">{choose}</strong><span className="text-[.65rem] text-admin-muted"><UploadCloud size={13} className="me-1 inline" />{drop}</span></button>}<input ref={inputRef} type="file" accept={accept} className="sr-only" onChange={(event) => { selectFile(event.target.files?.[0]); event.target.value = '' }} /></div>
}

function MediaTypePicker({ label, value, copy, onChange }) {
  const [open, setOpen] = useState(false)
  const options = [{ value: 'image', label: copy.image, Icon: ImagePlus }, { value: 'video', label: copy.video, Icon: FileVideo }, { value: 'audio', label: copy.audio, Icon: AudioLines }]
  const selected = options.find((option) => option.value === value) || options[0]
  const SelectedIcon = selected.Icon
  return <div className="relative grid gap-1.5 text-xs text-admin-muted sm:col-span-2"><span>{label}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`flex min-h-11 w-full items-center gap-3 rounded-xl border bg-(--editor-input) px-3.5 text-start font-semibold text-admin-heading transition ${open ? 'border-admin-brand shadow-[0_0_0_3px_var(--admin-brand-soft)]' : 'border-admin-border hover:border-admin-brand'}`}><span className="grid size-7 place-items-center rounded-lg bg-admin-brand-soft text-admin-brand"><SelectedIcon size={16} /></span><span className="flex-1">{selected.label}</span><ChevronDown size={16} className={`text-admin-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} /></button>{open && <div role="listbox" className="absolute inset-x-0 top-full z-40 mt-2 grid gap-1 rounded-xl border border-admin-border bg-admin-card p-1.5 shadow-[0_16px_38px_rgba(15,23,42,.22)]">{options.map(({ value: optionValue, label: optionLabel, Icon }) => <button key={optionValue} type="button" role="option" aria-selected={value === optionValue} onClick={() => { onChange(optionValue); setOpen(false) }} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-start text-xs font-semibold transition ${value === optionValue ? 'bg-admin-brand-soft text-admin-brand' : 'text-admin-heading hover:bg-admin-control-soft hover:text-admin-brand'}`}><Icon size={17} /><span className="flex-1">{optionLabel}</span>{value === optionValue && <Check size={15} />}</button>)}</div>}</div>
}

function HeadingIconPicker({ copy, onSelect, onRemove }) {
  const [category, setCategory] = useState(headingIconCategories[0].key)
  const selected = headingIconCategories.find((item) => item.key === category) || headingIconCategories[0]
  return <div className="absolute inset-x-2 top-full z-30 mt-2 rounded-xl border border-admin-border bg-admin-card p-2.5 shadow-[0_16px_38px_rgba(15,23,42,.22)]"><div className="mb-2 flex items-center gap-2"><div className="flex min-w-0 flex-1 gap-1 overflow-x-auto pb-1" role="tablist" aria-label={copy.headingIcon}>{headingIconCategories.map((item) => <button key={item.key} type="button" role="tab" aria-selected={category === item.key} title={copy[`iconCategory${item.key}`]} onClick={() => setCategory(item.key)} className={`flex min-w-max items-center gap-1.5 rounded-lg px-2.5 py-2 text-[.65rem] font-semibold transition ${category === item.key ? 'bg-admin-brand text-white' : 'bg-admin-control-soft text-admin-muted hover:bg-admin-brand-soft hover:text-admin-brand'}`}><span className="text-base">{item.icon}</span><span>{copy[`iconCategory${item.key}`]}</span></button>)}</div><button type="button" onClick={onRemove} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 text-[.65rem] font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"><X size={14} />{copy.removeIcon}</button></div><div className="grid max-h-48 grid-cols-7 gap-1 overflow-y-auto sm:grid-cols-10" role="tabpanel">{selected.icons.map((icon, index) => <button key={`${icon}-${index}`} type="button" onClick={() => onSelect(icon)} className="grid size-9 place-items-center rounded-lg border border-transparent text-lg transition hover:scale-105 hover:border-admin-brand/40 hover:bg-admin-brand-soft">{icon}</button>)}</div></div>
}

function OpportunityRichTextEditor({ value, onChange }) {
  const language = getLanguage(); const copy = translations[language]
  const emptyAttachment = { mediaType: 'image', src: '', name: '', title: '', caption: '', alt: '', author: '', avatar: '', poster: '', mimeType: '' }
  const [panel, setPanel] = useState(null); const [linkValue, setLinkValue] = useState(''); const [pendingSelection, setPendingSelection] = useState(null); const [buttonValue, setButtonValue] = useState({ label: '', href: '' }); const [attachment, setAttachment] = useState(emptyAttachment); const [editingMediaPos, setEditingMediaPos] = useState(null); const [editingGridSlot, setEditingGridSlot] = useState(null)
  const openMediaEditor = (attrs, position) => { setAttachment({ ...emptyAttachment, ...attrs }); setEditingMediaPos(position); setPanel('attachment') }
  const openGridSlotEditor = (attrs, position, index) => { setAttachment({ ...emptyAttachment, ...(attrs || {}) }); setEditingMediaPos(null); setEditingGridSlot({ position, index }); setPanel('attachment') }
  const editor = useEditor({ extensions: editorExtensions(copy, openMediaEditor, openGridSlotEditor), content: value || '', immediatelyRender: false, editorProps: { attributes: { dir: 'auto', class: 'cms-opportunity-prose min-h-72 text-start px-4 py-3 text-sm font-normal leading-7 text-admin-heading outline-none' } }, onUpdate: ({ editor: current }) => onChange(current.getHTML()) })
  useEffect(() => { if (editor && value !== editor.getHTML()) editor.commands.setContent(value || '', { emitUpdate: false }) }, [editor, value])
  if (!editor) return <div className="min-h-72 animate-pulse rounded-xl bg-(--editor-field)" />

  const openLink = () => { const { from, to } = editor.state.selection; setPendingSelection({ from, to }); setLinkValue(editor.getAttributes('link').href || ''); setPanel('link') }
  const saveLink = () => { const href = linkValue.trim(); const chain = editor.chain().focus(); if (pendingSelection) chain.setTextSelection(pendingSelection); if (href) chain.setLink({ href }).run(); else chain.unsetLink().run(); setPendingSelection(null); setPanel(null) }
  const saveButton = () => { const label = buttonValue.label.trim(); const href = buttonValue.href.trim(); if (label && href) editor.chain().focus().insertContent({ type: 'actionButton', attrs: { label, href } }).run(); setPanel(null); setButtonValue({ label: '', href: '' }) }
  const chooseAttachmentFile = (file) => { if (!file) return; const detectedType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : attachment.mediaType; setAttachment((current) => ({ ...current, mediaType: detectedType, src: URL.createObjectURL(file), name: file.name, title: current.title || file.name.replace(/\.[^.]+$/, ''), mimeType: file.type })) }
  const chooseAttachmentImage = (key, file) => { if (file) setAttachment((current) => ({ ...current, [key]: URL.createObjectURL(file) })) }
  const insertAttachment = () => { if (!attachment.src) return; const attrs = attachment.mediaType === 'image' ? { ...attachment, alt: attachment.title, caption: attachment.title } : attachment; if (editingGridSlot) editor.chain().focus().command(({ tr, state }) => { const gridNode = state.doc.nodeAt(editingGridSlot.position); if (!gridNode) return false; const items = [...gridNode.attrs.items]; items[editingGridSlot.index] = attrs; tr.setNodeMarkup(editingGridSlot.position, undefined, { ...gridNode.attrs, items }); return true }).run(); else if (editingMediaPos !== null) editor.chain().focus().command(({ tr }) => { tr.setNodeMarkup(editingMediaPos, undefined, attrs); return true }).run(); else editor.chain().focus().insertContent({ type: 'mediaBlock', attrs }).run(); setAttachment(emptyAttachment); setEditingMediaPos(null); setEditingGridSlot(null); setPanel(null) }
  const insertMediaGrid = (layout, slots) => { editor.chain().focus().insertContent({ type: 'mediaGrid', attrs: { layout, items: Array.from({ length: slots }, () => null) } }).run(); setPanel(null) }
  const setColumns = (columns) => { const listType = editor.isActive('orderedList') ? 'orderedList' : editor.isActive('bulletList') ? 'bulletList' : null; const chain = editor.chain().focus(); if (listType) chain.updateAttributes(listType, { columns }).run(); else chain.toggleBulletList().updateAttributes('bulletList', { columns }).run(); setPanel(null) }
  const setHeadingIcon = (icon) => { if (icon) { if (!editor.isActive('heading')) editor.chain().focus().toggleHeading({ level: 2 }).run(); const start = editor.state.selection.$from.start(); const firstNode = editor.state.doc.nodeAt(start); if (firstNode?.type.name === 'inlineIcon') editor.chain().focus().command(({ tr }) => { tr.setNodeMarkup(start, undefined, { icon }); return true }).setTextSelection(start + 1).run(); else editor.chain().focus().insertContentAt(start, { type: 'inlineIcon', attrs: { icon } }).setTextSelection(start + 1).run() } else if (editor.isActive('inlineIcon')) editor.chain().focus().deleteSelection().run(); setPanel(null) }
  const alignTools = language === 'en' ? [[copy.alignLeft, AlignLeft, 'left'], [copy.alignCenter, AlignCenter, 'center'], [copy.alignRight, AlignRight, 'right']] : [[copy.alignRight, AlignRight, 'right'], [copy.alignCenter, AlignCenter, 'center'], [copy.alignLeft, AlignLeft, 'left']]
  const tools = [
    [copy.bold, Bold, editor.isActive('bold'), false, () => editor.chain().focus().toggleBold().run()], [copy.italic, Italic, editor.isActive('italic'), false, () => editor.chain().focus().toggleItalic().run()], [copy.underline, UnderlineIcon, editor.isActive('underline'), false, () => editor.chain().focus().toggleUnderline().run()],
    [copy.link, Link2, editor.isActive('link'), false, openLink], [copy.heading2, Heading2, editor.isActive('heading', { level: 2 }), false, () => editor.chain().focus().toggleHeading({ level: 2 }).run()], [copy.heading3, Heading3, editor.isActive('heading', { level: 3 }), false, () => editor.chain().focus().toggleHeading({ level: 3 }).run()],
    [copy.headingIcon, Shapes, editor.isActive('inlineIcon'), false, () => setPanel(panel === 'icons' ? null : 'icons')], [copy.highlight, Highlighter, editor.isActive('highlightBox'), false, () => editor.chain().focus().toggleWrap('highlightBox').run()], [copy.bulletList, List, editor.isActive('bulletList'), false, () => editor.chain().focus().toggleBulletList().run()], [copy.numberedList, ListOrdered, editor.isActive('orderedList'), false, () => editor.chain().focus().toggleOrderedList().run()], [copy.listColumns, Columns3, false, false, () => setPanel(panel === 'columns' ? null : 'columns')],
    ...alignTools.map(([label, Icon, alignment]) => [label, Icon, editor.isActive({ textAlign: alignment }), false, () => editor.chain().focus().setTextAlign(alignment).run()]), [copy.button, MousePointerClick, false, false, () => setPanel('button')], [copy.mediaGrid, LayoutGrid, false, false, () => setPanel(panel === 'mediaGrid' ? null : 'mediaGrid')], [copy.undo, Undo2, false, !editor.can().undo(), () => editor.chain().focus().undo().run()], [copy.redo, Redo2, false, !editor.can().redo(), () => editor.chain().focus().redo().run()], [copy.attach, Paperclip, false, false, () => { setAttachment(emptyAttachment); setEditingMediaPos(null); setEditingGridSlot(null); setPanel('attachment') }],
  ]
  const toolGroups = [tools.slice(0, 4), tools.slice(4, 8), tools.slice(8, 11), tools.slice(11, 14), tools.slice(14, 16), tools.slice(16)]

  const inputClass = 'min-h-10 rounded-lg border border-admin-border bg-(--editor-input) px-3 text-sm text-admin-heading outline-none focus:border-admin-brand'
  return <div className="overflow-visible rounded-xl border border-(--editor-field-border) bg-(--editor-input) focus-within:border-admin-brand focus-within:shadow-[0_0_0_3px_var(--admin-brand-soft)]"><div className="relative flex flex-wrap gap-2 rounded-t-xl border-b border-admin-border bg-(--editor-field) p-2">{toolGroups.map((group, groupIndex) => <div key={groupIndex} className="flex flex-wrap gap-1 rounded-[.65rem] border border-admin-border/70 bg-admin-control-soft p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">{group.map(([label, Icon, active, disabled, onClick]) => <Tool key={label} label={label} Icon={Icon} active={active} disabled={disabled} onClick={onClick} />)}</div>)}
    {panel === 'link' && <EditorDialog title={copy.linkTitle} confirm={copy.apply} cancel={copy.cancel} onConfirm={saveLink} onClose={() => setPanel(null)}><label className="grid gap-1.5 text-xs text-admin-muted"><span>{copy.linkUrl}</span><input autoFocus dir="ltr" value={linkValue} onChange={(event) => setLinkValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); saveLink() } }} placeholder="https://example.com" className={inputClass} /></label></EditorDialog>}
    {panel === 'button' && <EditorDialog title={copy.buttonTitle} confirm={copy.insert} cancel={copy.cancel} onConfirm={saveButton} onClose={() => setPanel(null)}><div className="grid gap-3"><label className="grid gap-1.5 text-xs text-admin-muted"><span>{copy.buttonLabel}</span><input autoFocus value={buttonValue.label} onChange={(event) => setButtonValue((current) => ({ ...current, label: event.target.value }))} className={inputClass} /></label><label className="grid gap-1.5 text-xs text-admin-muted"><span>{copy.buttonLink}</span><input dir="ltr" value={buttonValue.href} onChange={(event) => setButtonValue((current) => ({ ...current, href: event.target.value }))} placeholder="https://example.com" className={inputClass} /></label></div></EditorDialog>}
    {panel === 'attachment' && <EditorDialog title={copy.mediaTitle} confirm={copy.insert} cancel={copy.cancel} onConfirm={insertAttachment} onClose={() => setPanel(null)}><div className="grid max-h-[58vh] gap-4 overflow-y-auto pe-1 sm:grid-cols-2"><MediaTypePicker label={copy.mediaType} value={attachment.mediaType} copy={copy} onChange={(mediaType) => setAttachment({ ...emptyAttachment, mediaType })} /><label className="grid gap-1.5 text-xs text-admin-muted sm:col-span-2"><span>{copy.mediaName}</span><input value={attachment.title} onChange={(event) => setAttachment((current) => ({ ...current, title: event.target.value }))} className={inputClass} /></label>{attachment.mediaType === 'image' && <MediaPickerField full label={copy.mediaFile} kind="image" value={attachment.src} fileName={attachment.name} accept="image/*" choose={copy.chooseFile} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={chooseAttachmentFile} onRemove={() => setAttachment((current) => ({ ...current, src: '', name: '', mimeType: '' }))} />}{attachment.mediaType === 'video' && <><MediaPickerField label={copy.mediaFile} kind="video" value={attachment.src} fileName={attachment.name} accept="video/*" choose={copy.chooseVideo} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={chooseAttachmentFile} onRemove={() => setAttachment((current) => ({ ...current, src: '', name: '', mimeType: '' }))} /><MediaPickerField label={copy.videoPoster} kind="image" value={attachment.poster} accept="image/*" choose={copy.chooseImage} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={(file) => chooseAttachmentImage('poster', file)} onRemove={() => setAttachment((current) => ({ ...current, poster: '' }))} /></>}{attachment.mediaType === 'audio' && <><MediaPickerField label={copy.mediaFile} kind="audio" value={attachment.src} fileName={attachment.name} accept="audio/*" choose={copy.chooseAudio} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={chooseAttachmentFile} onRemove={() => setAttachment((current) => ({ ...current, src: '', name: '', mimeType: '' }))} /><MediaPickerField label={copy.authorImage} kind="image" value={attachment.avatar} accept="image/*" choose={copy.chooseImage} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={(file) => chooseAttachmentImage('avatar', file)} onRemove={() => setAttachment((current) => ({ ...current, avatar: '' }))} /><label className="grid gap-1.5 text-xs text-admin-muted sm:col-span-2"><span>{copy.audioAuthor}</span><input value={attachment.author} onChange={(event) => setAttachment((current) => ({ ...current, author: event.target.value }))} className={inputClass} /></label></>}</div></EditorDialog>}
    {panel === 'mediaGrid' && <div className="absolute inset-x-2 top-full z-30 mt-2 rounded-xl border border-admin-border bg-admin-card p-3 shadow-[0_16px_38px_rgba(15,23,42,.2)]"><strong className="mb-3 block text-xs text-admin-heading">{copy.chooseGrid}</strong><div className="grid gap-2 sm:grid-cols-5">{[{ id: 'two', slots: 2, cells: 'grid-cols-2' }, { id: 'three', slots: 3, cells: 'grid-cols-3' }, { id: 'four', slots: 4, cells: 'grid-cols-2' }, { id: 'featured-right', slots: 3, cells: 'grid-cols-3 grid-rows-2' }, { id: 'featured-left', slots: 3, cells: 'grid-cols-3 grid-rows-2' }].map((template) => <button key={template.id} type="button" onClick={() => insertMediaGrid(template.id, template.slots)} className="grid gap-2 rounded-xl border border-admin-border bg-(--editor-input) p-2 text-center text-[.65rem] font-semibold text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand"><span className={`grid h-14 gap-1 ${template.cells}`}>{Array.from({ length: template.slots }, (_, index) => <i key={index} className={`rounded bg-admin-border ${template.id.startsWith('featured') && index === 0 ? `col-span-2 row-span-2 ${template.id === 'featured-left' ? 'order-last' : ''}` : ''}`} />)}</span><span>{copy[template.id.replace('-', '')]}</span></button>)}</div></div>}
    {panel === 'icons' && <HeadingIconPicker copy={copy} onSelect={setHeadingIcon} onRemove={() => setHeadingIcon(null)} />}
    {panel === 'columns' && <div className="absolute start-2 top-full z-30 mt-2 flex gap-1 rounded-xl border border-admin-border bg-admin-card p-2 shadow-[0_16px_38px_rgba(15,23,42,.2)]">{[1, 2, 3].map((columns) => <button key={columns} type="button" onClick={() => setColumns(columns)} className="min-h-9 rounded-lg border border-admin-border px-3 text-xs font-semibold text-admin-heading hover:border-admin-brand hover:text-admin-brand">{columns} {copy.columns}</button>)}</div>}
  </div><EditorContent editor={editor} /></div>
}

function RecoveryEditor({ value, onChange }) {
  const inputRef = useRef(null)
  useEffect(() => { if (inputRef.current && document.activeElement !== inputRef.current) inputRef.current.innerHTML = value || '' }, [value])
  return <div className="rounded-xl border border-(--editor-field-border) bg-(--editor-input)"><div ref={inputRef} dir="auto" contentEditable suppressContentEditableWarning onInput={(event) => onChange(event.currentTarget.innerHTML)} className="cms-opportunity-prose min-h-72 px-4 py-3 text-sm leading-7 text-admin-heading outline-none" /></div>
}

class EditorBoundary extends Component { constructor(props) { super(props); this.state = { failed: false } } static getDerivedStateFromError() { return { failed: true } } render() { return this.state.failed ? <RecoveryEditor {...this.props} /> : this.props.children } }
export default function RichTextEditor(props) { return <EditorBoundary {...props}><OpportunityRichTextEditor {...props} /></EditorBoundary> }
