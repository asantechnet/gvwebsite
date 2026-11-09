import { Component, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { EditorContent, Extension, Node, NodeViewWrapper, ReactNodeViewRenderer, mergeAttributes, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { AlignCenter, AlignLeft, AlignRight, AudioLines, Bold, Check, ChevronDown, Columns3, FileVideo, Heading2, Heading3, Highlighter, ImagePlus, Italic, LayoutGrid, Link2, List, ListOrdered, MousePointerClick, Paperclip, Pencil, Plus, Redo2, Replace, Shapes, Trash2, Underline as UnderlineIcon, Undo2, X } from 'lucide-react'
import AudioMedia from './media/AudioMedia.jsx'
import ImageMedia from './media/ImageMedia.jsx'
import VideoMedia from './media/VideoMedia.jsx'
import { editorTranslations as translations } from './translations.js'
import { sanitizeRichText } from '@/shared/security/sanitizeRichText.js'
import { revokeLocalUpload } from '@/shared/uploads/files.js'
import MediaPickerModal from '@cms/components/MediaPickerModal.jsx'
import englishMedia from '@cms/locales/en/media.json'
import dariMedia from '@cms/locales/prs/media.json'
import pashtoMedia from '@cms/locales/ps/media.json'
import './styles.css'

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

function createIconHeadingNodeView({ node, editor, getPos }) {
  const dom = document.createElement(`h${node.attrs.level}`)
  const contentDOM = document.createElement('span')
  const icon = document.createElement('span')
  const spacer = document.createElement('span')
  const iconValue = document.createElement('span')
  const remove = document.createElement('button')
  dom.className = 'cms-heading-node'
  contentDOM.className = 'cms-heading-content'
  icon.className = 'cms-heading-icon'
  icon.contentEditable = 'false'
  spacer.className = 'cms-heading-icon-spacer'
  spacer.contentEditable = 'false'
  iconValue.className = 'cms-heading-icon-value'
  remove.type = 'button'
  remove.className = 'cms-heading-icon-remove'
  remove.setAttribute('aria-label', 'Remove icon')
  const removeIcon = document.createElement('span')
  removeIcon.setAttribute('aria-hidden', 'true')
  removeIcon.textContent = '×'
  remove.append(removeIcon)
  icon.append(iconValue, remove)
  dom.append(icon, spacer, contentDOM)

  const renderIcon = (value) => {
    iconValue.textContent = value || ''
    icon.hidden = !value
    spacer.hidden = !value
  }
  const renderAlignment = (textAlign) => { dom.style.textAlign = textAlign || '' }
  renderIcon(node.attrs.icon)
  renderAlignment(node.attrs.textAlign)

  icon.addEventListener('click', () => icon.classList.add('is-controls-visible'))
  remove.addEventListener('pointerdown', (event) => event.preventDefault())
  remove.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    const position = getPos()
    const currentNode = editor.state.doc.nodeAt(position)
    if (!currentNode) return
    editor.view.dispatch(editor.state.tr.setNodeMarkup(position, undefined, { ...currentNode.attrs, icon: null }))
    editor.commands.focus()
  })

  return {
    dom,
    contentDOM,
    update(updatedNode) {
      if (updatedNode.type !== node.type || updatedNode.attrs.level !== node.attrs.level) return false
      node = updatedNode
      renderIcon(updatedNode.attrs.icon)
      renderAlignment(updatedNode.attrs.textAlign)
      if (!updatedNode.attrs.icon) icon.classList.remove('is-controls-visible')
      return true
    },
  }
}

const IconHeading = Node.create({
  name: 'heading', group: 'block', content: 'inline*', defining: true,
  addAttributes: () => ({ level: { default: 2, renderHTML: () => ({}) }, icon: { default: null, parseHTML: (element) => element.getAttribute('data-icon'), renderHTML: ({ icon }) => icon ? { 'data-icon': icon } : {} } }),
  parseHTML: () => [{ tag: 'h2', attrs: { level: 2 } }, { tag: 'h3', attrs: { level: 3 } }],
  renderHTML: ({ node, HTMLAttributes }) => [`h${node.attrs.level}`, mergeAttributes(HTMLAttributes), 0],
  addCommands() { return { toggleHeading: (attributes) => ({ commands }) => commands.toggleNode(this.name, 'paragraph', attributes) } },
  addNodeView: () => createIconHeadingNodeView,
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

const MultiColumnListNavigation = Extension.create({
  name: 'multiColumnListNavigation',
  priority: 1000,
  addKeyboardShortcuts() {
    const moveBetweenItems = (backward = false) => {
      const { state, view } = this.editor
      const { $from } = state.selection
      let listDepth = -1
      let itemDepth = -1

      for (let depth = $from.depth; depth > 0; depth -= 1) {
        const nodeName = $from.node(depth).type.name
        if (itemDepth < 0 && nodeName === 'listItem') itemDepth = depth
        if (nodeName === 'bulletList' || nodeName === 'orderedList') {
          listDepth = depth
          break
        }
      }

      if (listDepth < 0 || itemDepth !== listDepth + 1) return false
      const list = $from.node(listDepth)
      if (Number(list.attrs.columns) < 2) return false

      const itemIndex = $from.index(listDepth)
      const itemPosition = $from.before(itemDepth)
      const transaction = state.tr
      const selectionNear = state.selection.constructor.near

      if (backward) {
        if (itemIndex === 0) return false
        const previousPosition = itemPosition - list.child(itemIndex - 1).nodeSize
        transaction.setSelection(selectionNear(transaction.doc.resolve(previousPosition + 1), 1))
      } else if (itemIndex < list.childCount - 1) {
        const nextPosition = itemPosition + list.child(itemIndex).nodeSize
        transaction.setSelection(selectionNear(transaction.doc.resolve(nextPosition + 1), 1))
      } else {
        const newItem = state.schema.nodes.listItem.createAndFill()
        if (!newItem) return false
        const insertionPosition = $from.end(listDepth)
        transaction.insert(insertionPosition, newItem)
        transaction.setSelection(selectionNear(transaction.doc.resolve(insertionPosition + 1), 1))
      }

      view.dispatch(transaction.scrollIntoView())
      return true
    }

    return {
      Tab: () => moveBetweenItems(),
      'Shift-Tab': () => moveBetweenItems(true),
    }
  },
})

const getLanguage = () => { const lang = document.documentElement.lang; return lang === 'en' ? 'en' : lang === 'ps' ? 'ps' : 'prs' }
const editorExtensions = (copy, onEditMedia, onEditGridSlot, placeholder) => [StarterKit.configure({ link: false, underline: false, heading: false }), IconHeading, Underline, Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }), Placeholder.configure({ placeholder: placeholder || copy.placeholder }), TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'] }), StructuredAttributes, MultiColumnListNavigation, HighlightBox, MediaBlock.configure({ onEdit: onEditMedia }), MediaGrid.configure({ onEditSlot: onEditGridSlot }), ActionButton]
const toolClass = 'grid h-9 min-w-0 w-full place-items-center rounded-lg border transition-colors disabled:opacity-35 md:size-9 md:min-w-9'

function EditorMediaNodeView({ node, selected, deleteNode, extension, getPos }) {
  const { src, mediaType, name, title, caption, alt, author, avatar, poster, mimeType } = node.attrs
  const displayTitle = title || name
  const media = mediaType === 'audio' ? { audio: { src, type: mimeType, title: displayTitle, speaker: author, speakerLabel: '', avatar: avatar || '/assets/images/team/erfan.webp' } } : mediaType === 'video' ? { video: { src, title: displayTitle, playLabel: displayTitle, poster } } : { imageAlt: alt || displayTitle, imageLabel: caption || displayTitle }
  return <NodeViewWrapper className={`group/media relative my-4 block w-full min-w-0 max-w-full rounded-[1.45rem] transition-shadow ${selected ? 'shadow-[0_0_0_3px_var(--admin-brand)]' : ''}`} contentEditable={false} data-drag-handle><div className={`absolute top-3 end-3 z-20 flex gap-1.5 rounded-xl border border-white/20 bg-black/55 p-1.5 shadow-lg backdrop-blur-md transition-opacity group-hover/media:opacity-100 group-focus-within/media:opacity-100 ${selected ? 'opacity-100' : 'opacity-0'}`}><button type="button" onClick={() => extension.options.onEdit(node.attrs, getPos())} className="grid size-8 place-items-center rounded-lg text-white transition hover:bg-white/20" aria-label="Edit media"><Pencil size={15} /></button><button type="button" onClick={deleteNode} className="grid size-8 place-items-center rounded-lg text-white transition hover:bg-red-600" aria-label="Delete media"><Trash2 size={15} /></button></div>
    {mediaType === 'image' && <ImageMedia post={{ image: src }} media={media} />}
    {mediaType === 'video' && <VideoMedia post={{ image: '' }} media={media} />}
    {mediaType === 'audio' && <AudioMedia media={media} />}
  </NodeViewWrapper>
}

function GridMediaItem({ item }) {
  const displayTitle = item.title || item.name
  if (item.mediaType === 'video') return <VideoMedia fill post={{ image: '' }} media={{ video: { src: item.src, title: displayTitle, playLabel: displayTitle, poster: item.poster } }} />
  if (item.mediaType === 'audio') return <AudioMedia compact media={{ audio: { src: item.src, type: item.mimeType, title: displayTitle, speaker: item.author, speakerLabel: '', avatar: item.avatar || '/assets/images/team/erfan.webp' } }} />
  return <ImageMedia fill post={{ image: item.src }} media={{ imageAlt: item.alt || displayTitle, imageLabel: item.caption || displayTitle }} />
}

function EditorMediaGridNodeView({ node, selected, deleteNode, extension, getPos, updateAttributes }) {
  const { layout, items } = node.attrs
  const copy = translations[getLanguage()]
  const layoutClass = layout === 'two' ? 'sm:grid-cols-2 sm:auto-rows-[15rem]' : layout === 'three' ? 'sm:grid-cols-3 sm:auto-rows-[13rem]' : layout === 'four' ? 'sm:grid-cols-2 sm:auto-rows-[12rem]' : 'sm:grid-cols-3 sm:auto-rows-[10rem]'
  const featured = layout === 'featured-right' || layout === 'featured-left'
  const regularSlotClass = 'sm:h-full'
  const removeSlot = (index) => { const next = [...items]; next[index] = null; updateAttributes({ items: next }) }
  return <NodeViewWrapper className={`group/grid relative my-5 block w-full min-w-0 max-w-full rounded-[1.4rem] p-2 transition-shadow ${selected ? 'shadow-[0_0_0_3px_var(--admin-brand)]' : 'shadow-[0_0_0_1px_var(--admin-border)]'}`} contentEditable={false} data-drag-handle><button type="button" onClick={deleteNode} className="absolute -top-3 end-3 z-30 grid size-8 place-items-center rounded-lg bg-red-600 text-white opacity-0 shadow-lg transition-opacity group-hover/grid:opacity-100 group-focus-within/grid:opacity-100" aria-label={copy.deleteGrid}><Trash2 size={15} /></button><div className={`grid w-full min-w-0 gap-x-3 gap-y-3 ${layoutClass}`}>{items.map((item, index) => { const isFeatured = featured && index === 0; const featuredPosition = !featured ? '' : isFeatured ? (layout === 'featured-left' ? 'sm:col-start-1 sm:col-span-2 sm:row-start-1 sm:row-span-2' : 'sm:col-start-2 sm:col-span-2 sm:row-start-1 sm:row-span-2') : `${layout === 'featured-left' ? 'sm:col-start-3' : 'sm:col-start-1'} ${index === 1 ? 'sm:row-start-1' : 'sm:row-start-2'} sm:h-full`; return <div key={index} className={`group/slot relative min-h-40 min-w-0 max-w-full overflow-hidden rounded-2xl bg-admin-control-soft ${featured ? featuredPosition : regularSlotClass}`}>{item?.src ? <><div className="size-full min-h-0 min-w-0 overflow-hidden"><GridMediaItem item={item} /></div><div className="absolute top-2 end-2 z-20 flex gap-1 rounded-lg bg-black/55 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover/slot:opacity-100 group-focus-within/slot:opacity-100"><button type="button" onClick={() => extension.options.onEditSlot(item, getPos(), index)} className="grid size-7 place-items-center rounded-md text-white hover:bg-white/20" aria-label={copy.editMedia}><Pencil size={14} /></button><button type="button" onClick={() => removeSlot(index)} className="grid size-7 place-items-center rounded-md text-white hover:bg-red-600" aria-label={copy.remove}><Trash2 size={14} /></button></div></> : <button type="button" onClick={() => extension.options.onEditSlot(null, getPos(), index)} className="absolute inset-0.5 grid place-items-center content-center gap-2 rounded-[.875rem] border-2 border-dashed border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand"><Plus size={22} /><span className="text-xs font-semibold">{copy.addMedia}</span></button>}</div> })}</div></NodeViewWrapper>
}

function Tool({ label, Icon, active = false, disabled = false, onClick }) {
  return <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={onClick} className={`${toolClass} ${active ? 'border-admin-brand bg-admin-brand text-white' : 'border-admin-border bg-admin-card text-admin-muted hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand'}`}><Icon size={16} /></button>
}

function EditorDialog({ title, children, confirm, cancel, onConfirm, onClose, modal = false }) {
  if (!modal) return <div className="absolute inset-x-2 top-full z-30 mt-2 rounded-xl border border-admin-border bg-admin-card p-3 shadow-[0_16px_38px_rgba(15,23,42,.2)]" role="dialog" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><div className="mb-3 flex items-center justify-between gap-3"><strong className="text-xs text-admin-heading">{title}</strong><button type="button" onClick={onClose} className="grid size-7 place-items-center rounded-lg text-admin-muted hover:bg-admin-brand-soft hover:text-admin-brand" aria-label={cancel}><X size={15} /></button></div>{children}<div className="mt-3 flex justify-end gap-2"><button type="button" onClick={onClose} className="min-h-9 rounded-lg border border-admin-border px-3 text-xs text-admin-muted">{cancel}</button><button type="button" onClick={onConfirm} className="min-h-9 rounded-lg bg-admin-brand px-3 text-xs font-semibold text-white">{confirm}</button></div></div>
  const modalDialog = <div className="w-[min(42rem,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-2xl" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><header className="flex min-h-12 items-center justify-between gap-3 border-b border-admin-border px-4 py-2"><strong className="text-xs text-admin-heading">{title}</strong><button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-admin-muted transition hover:bg-admin-brand-soft hover:text-admin-brand" aria-label={cancel}><X size={15} /></button></header><div className="p-4">{children}</div><footer className="flex min-h-12 items-center justify-end gap-2 border-t border-admin-border px-4 py-2"><button type="button" onClick={onClose} className="min-h-8 rounded-lg border border-admin-border px-3 text-xs text-admin-muted">{cancel}</button><button type="button" onClick={onConfirm} className="min-h-8 rounded-lg bg-admin-brand px-3 text-xs font-semibold text-white">{confirm}</button></footer></div>
  return createPortal(<div className="gv-rich-text-editor cms-modal-backdrop fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4" onMouseDown={onClose}>{modalDialog}</div>, document.querySelector('.cms-root') || document.body)
}

function MediaPickerField({ label, kind, value, fileName, replace, remove, onFile, onRemove, full = false }) {
  const [pickingMedia, setPickingMedia] = useState(false)
  const language = getLanguage()
  const mediaContent = language === 'en' ? englishMedia : language === 'ps' ? pashtoMedia : dariMedia
  const Icon = kind === 'audio' ? AudioLines : kind === 'video' ? FileVideo : ImagePlus
  const selectMedia = (media) => { onFile(media); setPickingMedia(false) }
  return <div className={`grid gap-1.5 text-xs text-admin-muted ${full ? 'sm:col-span-2' : ''}`}><span>{label}</span>{value ? <div className="relative min-h-28 overflow-hidden rounded-xl border border-(--editor-field-border) bg-(--editor-input)">
    {kind === 'image' && <img src={value} alt="" className="absolute inset-0 size-full object-cover" />}
    {kind === 'video' && <video src={value} muted preload="metadata" className="absolute inset-0 size-full object-cover" />}
    {kind === 'audio' && <div className="absolute inset-0 grid place-items-center content-center gap-2 bg-admin-control-soft text-admin-brand"><AudioLines size={30} /><strong className="max-w-[85%] truncate text-xs text-admin-heading">{fileName}</strong></div>}
    <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pt-10 pb-3"><button type="button" onClick={() => setPickingMedia(true)} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-3 text-[.65rem] font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/25"><Replace size={13} />{replace}</button><button type="button" onClick={onRemove} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-red-300/50 bg-red-600/75 px-3 text-[.65rem] font-semibold text-white backdrop-blur-sm transition hover:bg-red-600"><Trash2 size={13} />{remove}</button></div>
  </div> : <button type="button" onClick={() => setPickingMedia(true)} className="grid min-h-28 w-full place-items-center content-center gap-1.5 rounded-xl border-2 border-dashed border-(--editor-field-border) bg-(--editor-input) p-4 text-center transition hover:border-admin-brand hover:bg-admin-brand-soft"><Icon size={26} className="text-admin-brand" /><strong className="max-w-full truncate text-xs text-admin-heading">{mediaContent.picker.fieldChoose}</strong><span className="text-[.65rem] text-admin-muted">{mediaContent.picker.fieldHelp}</span></button>}{pickingMedia && <MediaPickerModal content={mediaContent} acceptedKinds={[kind]} onClose={() => setPickingMedia(false)} onSelect={selectMedia} />}</div>
}

function MediaTypePicker({ label, value, copy, onChange }) {
  const [open, setOpen] = useState(false)
  const options = [{ value: 'image', label: copy.image, Icon: ImagePlus }, { value: 'video', label: copy.video, Icon: FileVideo }, { value: 'audio', label: copy.audio, Icon: AudioLines }]
  const selected = options.find((option) => option.value === value) || options[0]
  const SelectedIcon = selected.Icon
  return <div className="relative grid gap-1.5 text-xs text-admin-muted sm:col-span-2"><span>{label}</span><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`flex min-h-11 w-full items-center gap-3 rounded-xl border bg-(--editor-input) px-3.5 text-start font-semibold text-admin-heading transition ${open ? 'border-admin-brand shadow-[0_0_0_3px_var(--admin-brand-soft)]' : 'border-admin-border hover:border-admin-brand'}`}><span className="grid size-7 place-items-center rounded-lg bg-admin-brand-soft text-admin-brand"><SelectedIcon size={16} /></span><span className="flex-1">{selected.label}</span><ChevronDown size={16} className={`text-admin-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} /></button>{open && <div role="listbox" className="absolute inset-x-0 top-full z-40 mt-2 grid gap-1 rounded-xl border border-admin-border bg-admin-card p-1.5 shadow-[0_16px_38px_rgba(15,23,42,.22)]">{options.map(({ value: optionValue, label: optionLabel, Icon }) => <button key={optionValue} type="button" role="option" aria-selected={value === optionValue} onClick={() => { onChange(optionValue); setOpen(false) }} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-start text-xs font-semibold transition ${value === optionValue ? 'bg-admin-brand-soft text-admin-brand' : 'text-admin-heading hover:bg-admin-control-soft hover:text-admin-brand'}`}><Icon size={17} /><span className="flex-1">{optionLabel}</span>{value === optionValue && <Check size={15} />}</button>)}</div>}</div>
}

function HeadingIconPicker({ copy, onSelect }) {
  const [category, setCategory] = useState(headingIconCategories[0].key)
  const selected = headingIconCategories.find((item) => item.key === category) || headingIconCategories[0]
  return <div className="absolute inset-x-2 top-full z-30 mt-2 rounded-xl border border-admin-border bg-admin-card p-2.5 shadow-[0_16px_38px_rgba(15,23,42,.22)]"><div className="mb-2 flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label={copy.headingIcon}>{headingIconCategories.map((item) => <button key={item.key} type="button" role="tab" aria-selected={category === item.key} title={copy[`iconCategory${item.key}`]} onMouseDown={(event) => event.preventDefault()} onClick={() => setCategory(item.key)} className={`flex min-w-max items-center gap-1.5 rounded-lg px-2.5 py-2 text-[.65rem] font-semibold transition ${category === item.key ? 'bg-admin-brand text-white' : 'bg-admin-control-soft text-admin-muted hover:bg-admin-brand-soft hover:text-admin-brand'}`}><span className="text-base">{item.icon}</span><span>{copy[`iconCategory${item.key}`]}</span></button>)}</div><div className="grid max-h-48 grid-cols-7 gap-1 overflow-y-auto sm:grid-cols-10" role="tabpanel">{selected.icons.map((icon, index) => <button key={`${icon}-${index}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onSelect(icon)} className="grid size-9 place-items-center rounded-lg border border-transparent text-lg transition-colors hover:border-admin-brand/40 hover:bg-admin-brand-soft">{icon}</button>)}</div></div>
}

function OpportunityRichTextEditor({ value, onChange, language: requestedLanguage, placeholder, readOnly = false, disabled = false, className = '' }) {
  const language = requestedLanguage || getLanguage(); const copy = translations[language] || translations.prs
  const locked = readOnly || disabled
  const emptyAttachment = { mediaType: 'image', src: '', name: '', title: '', caption: '', alt: '', author: '', avatar: '', poster: '', mimeType: '' }
  const mobileToolbarRef = useRef(null)
  const [panel, setPanel] = useState(null); const [mobileToolCategory, setMobileToolCategory] = useState(null); const [linkValue, setLinkValue] = useState(''); const [pendingSelection, setPendingSelection] = useState(null); const [pendingIconSelection, setPendingIconSelection] = useState(null); const [buttonValue, setButtonValue] = useState({ label: '', href: '' }); const [attachment, setAttachment] = useState(emptyAttachment); const [editingMediaPos, setEditingMediaPos] = useState(null); const [editingGridSlot, setEditingGridSlot] = useState(null)
  const openMediaEditor = (attrs, position) => { setAttachment({ ...emptyAttachment, ...attrs }); setEditingMediaPos(position); setPanel('attachment') }
  const openGridSlotEditor = (attrs, position, index) => { setAttachment({ ...emptyAttachment, ...(attrs || {}) }); setEditingMediaPos(null); setEditingGridSlot({ position, index }); setPanel('attachment') }
  const direction = language === 'en' ? 'ltr' : 'rtl'
  const editor = useEditor({ extensions: editorExtensions(copy, openMediaEditor, openGridSlotEditor, placeholder), content: sanitizeRichText(value || ''), editable: !locked, immediatelyRender: false, editorProps: { attributes: { dir: direction, class: 'cms-opportunity-prose h-72 overflow-y-auto text-start px-4 py-3 text-sm font-normal leading-7 text-admin-heading outline-none' } }, onUpdate: ({ editor: current }) => onChange(current.getHTML()) })
  useEffect(() => { if (editor && value !== editor.getHTML()) editor.commands.setContent(sanitizeRichText(value || ''), { emitUpdate: false }) }, [editor, value])
  useEffect(() => { editor?.setEditable(!locked) }, [editor, locked])
  useEffect(() => { editor?.view.dom.setAttribute('dir', direction) }, [direction, editor])
  useEffect(() => {
    const closeMobileLists = (event) => {
      if (mobileToolbarRef.current?.contains(event.target)) return
      setMobileToolCategory(null)
      setPanel((current) => ['icons', 'columns', 'mediaGrid'].includes(current) ? null : current)
    }
    document.addEventListener('pointerdown', closeMobileLists)
    return () => document.removeEventListener('pointerdown', closeMobileLists)
  }, [])
  if (!editor) return <div className="min-h-72 animate-pulse rounded-xl bg-(--editor-field)" />

  const openLink = () => { const { from, to } = editor.state.selection; setPendingSelection({ from, to }); setLinkValue(editor.getAttributes('link').href || ''); setPanel('link') }
  const saveLink = () => { const href = linkValue.trim(); const chain = editor.chain().focus(); if (pendingSelection) chain.setTextSelection(pendingSelection); if (href) chain.setLink({ href }).run(); else chain.unsetLink().run(); setPendingSelection(null); setPanel(null) }
  const saveButton = () => { const label = buttonValue.label.trim(); const href = buttonValue.href.trim(); if (label && href) editor.chain().focus().insertContent({ type: 'actionButton', attrs: { label, href } }).run(); setPanel(null); setButtonValue({ label: '', href: '' }) }
  const chooseAttachmentFile = (media) => { setAttachment((current) => { revokeLocalUpload(current.src); return { ...current, mediaType: media.type, src: media.url, name: media.name, title: current.title || media.name.replace(/\.[^.]+$/, ''), mimeType: '' } }) }
  const chooseAttachmentImage = (key, media) => { setAttachment((current) => { revokeLocalUpload(current[key]); return { ...current, [key]: media.url } }) }
  const insertAttachment = () => { if (!attachment.src) return; const attrs = attachment.mediaType === 'image' ? { ...attachment, alt: attachment.title, caption: attachment.title } : attachment; if (editingGridSlot) editor.chain().focus().command(({ tr, state }) => { const gridNode = state.doc.nodeAt(editingGridSlot.position); if (!gridNode) return false; const items = [...gridNode.attrs.items]; items[editingGridSlot.index] = attrs; tr.setNodeMarkup(editingGridSlot.position, undefined, { ...gridNode.attrs, items }); return true }).run(); else if (editingMediaPos !== null) editor.chain().focus().command(({ tr }) => { tr.setNodeMarkup(editingMediaPos, undefined, attrs); return true }).run(); else editor.chain().focus().insertContent({ type: 'mediaBlock', attrs }).run(); setAttachment(emptyAttachment); setEditingMediaPos(null); setEditingGridSlot(null); setPanel(null) }
  const insertMediaGrid = (layout, slots) => { editor.chain().focus().insertContent({ type: 'mediaGrid', attrs: { layout, items: Array.from({ length: slots }, () => null) } }).run(); setPanel(null) }
  const setColumns = (columns) => { const listType = editor.isActive('orderedList') ? 'orderedList' : editor.isActive('bulletList') ? 'bulletList' : null; const chain = editor.chain().focus(); if (listType) chain.updateAttributes(listType, { columns }).run(); else chain.toggleBulletList().updateAttributes('bulletList', { columns }).run(); setPanel(null) }
  const openHeadingIcons = () => { const { from, to } = editor.state.selection; setPendingIconSelection({ from, to }); setPanel(panel === 'icons' ? null : 'icons') }
  const setHeadingIcon = (icon) => { if (pendingIconSelection) editor.commands.setTextSelection(pendingIconSelection); const chain = editor.chain().focus(); if (editor.isActive('heading')) chain.updateAttributes('heading', { icon }).run(); else if (icon) chain.toggleHeading({ level: 2 }).updateAttributes('heading', { icon }).run(); setPendingIconSelection(null); setPanel(null) }
  const alignTools = language === 'en' ? [[copy.alignLeft, AlignLeft, 'left'], [copy.alignCenter, AlignCenter, 'center'], [copy.alignRight, AlignRight, 'right']] : [[copy.alignRight, AlignRight, 'right'], [copy.alignCenter, AlignCenter, 'center'], [copy.alignLeft, AlignLeft, 'left']]
  const tools = [
    [copy.bold, Bold, editor.isActive('bold'), false, () => editor.chain().focus().toggleBold().run()], [copy.italic, Italic, editor.isActive('italic'), false, () => editor.chain().focus().toggleItalic().run()], [copy.underline, UnderlineIcon, editor.isActive('underline'), false, () => editor.chain().focus().toggleUnderline().run()],
    [copy.link, Link2, editor.isActive('link'), false, openLink], [copy.heading2, Heading2, editor.isActive('heading', { level: 2 }), false, () => editor.chain().focus().toggleHeading({ level: 2 }).run()], [copy.heading3, Heading3, editor.isActive('heading', { level: 3 }), false, () => editor.chain().focus().toggleHeading({ level: 3 }).run()],
    [copy.headingIcon, Shapes, Boolean(editor.getAttributes('heading').icon), false, openHeadingIcons], [copy.highlight, Highlighter, editor.isActive('highlightBox'), false, () => editor.chain().focus().toggleWrap('highlightBox').run()], [copy.bulletList, List, editor.isActive('bulletList'), false, () => editor.chain().focus().toggleBulletList().run()], [copy.numberedList, ListOrdered, editor.isActive('orderedList'), false, () => editor.chain().focus().toggleOrderedList().run()], [copy.listColumns, Columns3, false, false, () => setPanel(panel === 'columns' ? null : 'columns')],
    ...alignTools.map(([label, Icon, alignment]) => [label, Icon, editor.isActive({ textAlign: alignment }), false, () => editor.chain().focus().setTextAlign(alignment).run()]), [copy.button, MousePointerClick, false, false, () => setPanel('button')], [copy.mediaGrid, LayoutGrid, false, false, () => setPanel(panel === 'mediaGrid' ? null : 'mediaGrid')], [copy.undo, Undo2, false, !editor.can().undo(), () => editor.chain().focus().undo().run()], [copy.redo, Redo2, false, !editor.can().redo(), () => editor.chain().focus().redo().run()], [copy.attach, Paperclip, false, false, () => { setAttachment(emptyAttachment); setEditingMediaPos(null); setEditingGridSlot(null); setPanel('attachment') }],
  ]
  const toolGroups = [tools.slice(0, 4), tools.slice(4, 8), tools.slice(8, 11), tools.slice(11, 14), tools.slice(14, 16), tools.slice(16)]
  const mobileToolCategories = [
    { id: 'formatting', label: copy.toolbarFormatting, Icon: Bold, tools: tools.slice(0, 8) },
    { id: 'lists', label: copy.toolbarLists, Icon: List, tools: tools.slice(8, 11) },
    { id: 'alignment', label: copy.toolbarAlignment, Icon: AlignCenter, tools: tools.slice(11, 14) },
    { id: 'insert', label: copy.toolbarInsert, Icon: Plus, tools: [tools[14], tools[15], tools[18]] },
    { id: 'history', label: copy.toolbarHistory, Icon: Undo2, tools: tools.slice(16, 18) },
  ]
  const runToolbarAction = (onClick) => {
    setMobileToolCategory(null)
    setPanel(null)
    onClick()
  }

  const inputClass = 'min-h-10 rounded-lg border border-admin-border bg-(--editor-input) px-3 text-sm text-admin-heading outline-none focus:border-admin-brand'
  return <div className={`gv-rich-text-editor overflow-visible rounded-xl border border-(--editor-field-border) bg-(--editor-input) focus-within:border-admin-brand focus-within:shadow-[0_0_0_3px_var(--admin-brand-soft)] ${disabled ? 'opacity-60' : ''} ${className}`} aria-disabled={disabled || undefined} onClickCapture={(event) => { if (locked && event.target.closest('button')) { event.preventDefault(); event.stopPropagation() } }}><div ref={mobileToolbarRef} className="relative rounded-t-xl border-b border-admin-border bg-(--editor-field) p-2"><div className="grid grid-cols-5 gap-1.5 md:hidden">{mobileToolCategories.map(({ id, label, Icon }) => <button key={id} type="button" disabled={locked} title={label} aria-label={label} aria-expanded={mobileToolCategory === id} onClick={() => { setPanel(null); setMobileToolCategory((current) => current === id ? null : id) }} className={`grid min-h-10 min-w-0 place-items-center rounded-lg border transition ${mobileToolCategory === id ? 'border-admin-brand bg-admin-brand text-white' : 'border-admin-border bg-admin-control-soft text-admin-muted'}`}><Icon size={17} /></button>)}</div>{mobileToolCategory && <div className="absolute inset-x-2 top-full z-20 mt-2 grid grid-cols-4 gap-1 rounded-xl border border-admin-border bg-admin-card p-2 shadow-[0_16px_38px_rgba(15,23,42,.22)] sm:grid-cols-6 md:hidden">{mobileToolCategories.find((category) => category.id === mobileToolCategory)?.tools.map(([label, Icon, active, toolDisabled, onClick]) => <Tool key={label} label={label} Icon={Icon} active={active} disabled={locked || toolDisabled} onClick={() => runToolbarAction(onClick)} />)}</div>}<div className="hidden flex-wrap gap-2 md:flex">{toolGroups.map((group, groupIndex) => <div key={groupIndex} className="flex w-auto flex-wrap gap-1 rounded-[.65rem] border border-admin-border/70 bg-admin-control-soft p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">{group.map(([label, Icon, active, toolDisabled, onClick]) => <Tool key={label} label={label} Icon={Icon} active={active} disabled={locked || toolDisabled} onClick={() => runToolbarAction(onClick)} />)}</div>)}</div>
    {panel === 'link' && <EditorDialog title={copy.linkTitle} confirm={copy.apply} cancel={copy.cancel} onConfirm={saveLink} onClose={() => setPanel(null)}><label className="grid gap-1.5 text-xs text-admin-muted"><span>{copy.linkUrl}</span><input autoFocus dir="ltr" value={linkValue} onChange={(event) => setLinkValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); saveLink() } }} placeholder="https://example.com" className={inputClass} /></label></EditorDialog>}
    {panel === 'button' && <EditorDialog title={copy.buttonTitle} confirm={copy.insert} cancel={copy.cancel} onConfirm={saveButton} onClose={() => setPanel(null)}><div className="grid gap-3"><label className="grid gap-1.5 text-xs text-admin-muted"><span>{copy.buttonLabel}</span><input autoFocus value={buttonValue.label} onChange={(event) => setButtonValue((current) => ({ ...current, label: event.target.value }))} className={inputClass} /></label><label className="grid gap-1.5 text-xs text-admin-muted"><span>{copy.buttonLink}</span><input dir="ltr" value={buttonValue.href} onChange={(event) => setButtonValue((current) => ({ ...current, href: event.target.value }))} placeholder="https://example.com" className={inputClass} /></label></div></EditorDialog>}
    {panel === 'attachment' && <EditorDialog modal title={copy.mediaTitle} confirm={copy.insert} cancel={copy.cancel} onConfirm={insertAttachment} onClose={() => setPanel(null)}><div className="grid max-h-[58vh] gap-4 overflow-y-auto pe-1 sm:grid-cols-2 md:max-h-[calc(100svh-10rem)]"><MediaTypePicker label={copy.mediaType} value={attachment.mediaType} copy={copy} onChange={(mediaType) => setAttachment({ ...emptyAttachment, mediaType })} /><label className="grid gap-1.5 text-xs text-admin-muted sm:col-span-2"><span>{copy.mediaName}</span><input value={attachment.title} onChange={(event) => setAttachment((current) => ({ ...current, title: event.target.value }))} className={inputClass} /></label>{attachment.mediaType === 'image' && <MediaPickerField full label={copy.mediaFile} kind="image" value={attachment.src} fileName={attachment.name} accept="image/*" choose={copy.chooseFile} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={chooseAttachmentFile} onRemove={() => setAttachment((current) => ({ ...current, src: '', name: '', mimeType: '' }))} />}{attachment.mediaType === 'video' && <><MediaPickerField label={copy.mediaFile} kind="video" value={attachment.src} fileName={attachment.name} accept="video/*" choose={copy.chooseVideo} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={chooseAttachmentFile} onRemove={() => setAttachment((current) => ({ ...current, src: '', name: '', mimeType: '' }))} /><MediaPickerField label={copy.videoPoster} kind="image" value={attachment.poster} accept="image/*" choose={copy.chooseImage} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={(file) => chooseAttachmentImage('poster', file)} onRemove={() => setAttachment((current) => ({ ...current, poster: '' }))} /></>}{attachment.mediaType === 'audio' && <><MediaPickerField label={copy.mediaFile} kind="audio" value={attachment.src} fileName={attachment.name} accept="audio/*" choose={copy.chooseAudio} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={chooseAttachmentFile} onRemove={() => setAttachment((current) => ({ ...current, src: '', name: '', mimeType: '' }))} /><MediaPickerField label={copy.authorImage} kind="image" value={attachment.avatar} accept="image/*" choose={copy.chooseImage} drop={copy.dropFile} replace={copy.replace} remove={copy.remove} onFile={(file) => chooseAttachmentImage('avatar', file)} onRemove={() => setAttachment((current) => ({ ...current, avatar: '' }))} /><label className="grid gap-1.5 text-xs text-admin-muted sm:col-span-2"><span>{copy.audioAuthor}</span><input value={attachment.author} onChange={(event) => setAttachment((current) => ({ ...current, author: event.target.value }))} className={inputClass} /></label></>}</div></EditorDialog>}
    {panel === 'mediaGrid' && <div className="absolute inset-x-2 top-full z-30 mt-2 rounded-xl border border-admin-border bg-admin-card p-3 shadow-[0_16px_38px_rgba(15,23,42,.2)]"><strong className="mb-3 block text-xs text-admin-heading">{copy.chooseGrid}</strong><div className="grid gap-2 sm:grid-cols-5">{[{ id: 'two', slots: 2, cells: 'grid-cols-2' }, { id: 'three', slots: 3, cells: 'grid-cols-3' }, { id: 'four', slots: 4, cells: 'grid-cols-2' }, { id: 'featured-right', slots: 3, cells: 'grid-cols-3 grid-rows-2' }, { id: 'featured-left', slots: 3, cells: 'grid-cols-3 grid-rows-2' }].map((template) => <button key={template.id} type="button" onClick={() => insertMediaGrid(template.id, template.slots)} className="grid gap-2 rounded-xl border border-admin-border bg-(--editor-input) p-2 text-center text-[.65rem] font-semibold text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand"><span className={`grid h-14 ${template.id === 'three' ? 'gap-1.5' : 'gap-1'} ${template.cells}`}>{Array.from({ length: template.slots }, (_, index) => { const featuredPreview = template.id.startsWith('featured'); const position = !featuredPreview ? '' : index === 0 ? (template.id === 'featured-left' ? 'col-start-1 col-span-2 row-start-1 row-span-2' : 'col-start-2 col-span-2 row-start-1 row-span-2') : `${template.id === 'featured-left' ? 'col-start-3' : 'col-start-1'} ${index === 1 ? 'row-start-1' : 'row-start-2'}`; return <i key={index} className={`rounded bg-admin-border ${position}`} /> })}</span><span>{copy[template.id.replace('-', '')]}</span></button>)}</div></div>}
    {panel === 'icons' && <HeadingIconPicker copy={copy} onSelect={setHeadingIcon} />}
    {panel === 'columns' && <div className="absolute start-2 top-full z-30 mt-2 flex gap-1 rounded-xl border border-admin-border bg-admin-card p-2 shadow-[0_16px_38px_rgba(15,23,42,.2)]">{[1, 2, 3].map((columns) => <button key={columns} type="button" onClick={() => setColumns(columns)} className="min-h-9 rounded-lg border border-admin-border px-3 text-xs font-semibold text-admin-heading hover:border-admin-brand hover:text-admin-brand">{columns} {copy.columns}</button>)}</div>}
  </div><EditorContent editor={editor} /></div>
}

function RecoveryEditor({ value, onChange, readOnly = false, disabled = false, className = '' }) {
  const inputRef = useRef(null)
  useEffect(() => { if (inputRef.current && document.activeElement !== inputRef.current) inputRef.current.innerHTML = sanitizeRichText(value || '') }, [value])
  return <div className={`gv-rich-text-editor rounded-xl border border-(--editor-field-border) bg-(--editor-input) ${disabled ? 'opacity-60' : ''} ${className}`}><div ref={inputRef} dir="auto" contentEditable={!readOnly && !disabled} suppressContentEditableWarning onInput={(event) => onChange(event.currentTarget.innerHTML)} className="cms-opportunity-prose h-72 overflow-y-auto px-4 py-3 text-sm leading-7 text-admin-heading outline-none" /></div>
}

class EditorBoundary extends Component { constructor(props) { super(props); this.state = { failed: false } } static getDerivedStateFromError() { return { failed: true } } render() { return this.state.failed ? <RecoveryEditor {...this.props} /> : this.props.children } }
export default function RichTextEditor({ value, defaultValue = '', onChange, ...props }) {
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = controlled ? value : internalValue
  const handleChange = (nextValue) => { if (!controlled) setInternalValue(nextValue); onChange?.(nextValue) }
  return <EditorBoundary value={currentValue} onChange={handleChange} {...props}><OpportunityRichTextEditor value={currentValue} onChange={handleChange} {...props} /></EditorBoundary>
}
