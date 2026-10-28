import { Component, useEffect, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Paperclip, Redo2, Underline as UnderlineIcon, Undo2 } from 'lucide-react'

const editorExtensions = (language) => [StarterKit.configure({ link: false, underline: false, heading: { levels: [2, 3] } }), Underline, Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }), Placeholder.configure({ placeholder: language === 'en' ? 'Write the opportunity content…' : language === 'ps' ? 'د فرصت منځپانګه ولیکئ…' : 'محتوای فرصت را بنویسید...' }), TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'], defaultAlignment: language === 'en' ? 'left' : 'right' })]
const toolClass = 'grid size-9 place-items-center rounded-lg border transition-colors disabled:opacity-35'
const recoverySelections = new WeakMap()

function Tool({ label, Icon, active, disabled, onClick }) {
  return <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={onClick} className={`${toolClass} ${active ? 'border-admin-brand bg-admin-brand text-white' : 'border-admin-border bg-admin-card text-admin-muted hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand'}`}><Icon size={16} /></button>
}

function OpportunityRichTextEditor({ value, onChange }) {
  const language = document.documentElement.lang
  const editor = useEditor({ extensions: editorExtensions(language), content: value || '', immediatelyRender: false, editorProps: { attributes: { dir: 'auto', class: 'cms-opportunity-prose min-h-72 text-start px-4 py-3 text-sm font-normal leading-7 text-admin-heading outline-none' } }, onUpdate: ({ editor: current }) => onChange(current.getHTML()) })
  useEffect(() => { if (editor && value !== editor.getHTML()) editor.commands.setContent(value || '', { emitUpdate: false }) }, [editor, value])
  if (!editor) return <div className="min-h-72 animate-pulse rounded-xl bg-(--editor-field)" />
  const link = () => { const url = window.prompt(language === 'en' ? 'Enter the link address' : language === 'ps' ? 'د لینک پته ولیکئ' : 'آدرس لینک را وارد کنید', editor.getAttributes('link').href || ''); if (url === null) return; if (!url.trim()) editor.chain().focus().unsetLink().run(); else editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run() }
  const attachFile = (file) => { if (!file) return; const url = URL.createObjectURL(file); editor.chain().focus().insertContent({ type: 'text', text: file.name, marks: [{ type: 'link', attrs: { href: url, target: '_blank', rel: 'noopener noreferrer' } }] }).run() }
  const tools = [
    ['Bold', Bold, editor.isActive('bold'), false, () => editor.chain().focus().toggleBold().run()], ['Italic', Italic, editor.isActive('italic'), false, () => editor.chain().focus().toggleItalic().run()], ['Underline', UnderlineIcon, editor.isActive('underline'), false, () => editor.chain().focus().toggleUnderline().run()], ['Link', Link2, editor.isActive('link'), false, link], ['Heading 2', Heading2, editor.isActive('heading', { level: 2 }), false, () => editor.chain().focus().toggleHeading({ level: 2 }).run()], ['Heading 3', Heading3, editor.isActive('heading', { level: 3 }), false, () => editor.chain().focus().toggleHeading({ level: 3 }).run()], ['Bullet list', List, editor.isActive('bulletList'), false, () => editor.chain().focus().toggleBulletList().run()], ['Numbered list', ListOrdered, editor.isActive('orderedList'), false, () => editor.chain().focus().toggleOrderedList().run()], ['Align right', AlignRight, editor.isActive({ textAlign: 'right' }), false, () => editor.chain().focus().setTextAlign('right').run()], ['Align center', AlignCenter, editor.isActive({ textAlign: 'center' }), false, () => editor.chain().focus().setTextAlign('center').run()], ['Align left', AlignLeft, editor.isActive({ textAlign: 'left' }), false, () => editor.chain().focus().setTextAlign('left').run()], ['Undo', Undo2, false, !editor.can().undo(), () => editor.chain().focus().undo().run()], ['Redo', Redo2, false, !editor.can().redo(), () => editor.chain().focus().redo().run()], ['Attach file', Paperclip, false, false, () => document.getElementById('opportunity-editor-file')?.click()],
  ]
  return <div className="overflow-hidden rounded-xl border border-(--editor-field-border) bg-(--editor-input) focus-within:border-admin-brand focus-within:shadow-[0_0_0_3px_var(--admin-brand-soft)]"><div className="flex flex-wrap gap-1.5 border-b border-admin-border bg-(--editor-field) p-2">{tools.map(([label, Icon, active, disabled, onClick]) => <Tool key={label} label={label} Icon={Icon} active={active} disabled={disabled} onClick={onClick} />)}</div><EditorContent editor={editor} /><input id="opportunity-editor-file" type="file" className="sr-only" accept="image/*,.pdf,.doc,.docx" onChange={(event) => attachFile(event.target.files?.[0])} /></div>
}

function RecoveryEditor({ value, onChange }) {
  const language = document.documentElement.lang
  const inputRef = useRef(null)
  useEffect(() => {
    const input = inputRef.current
    if (input && document.activeElement !== input && input.innerHTML !== (value || '')) input.innerHTML = value || ''
  }, [value])
  const command = (name, argument = null) => { const input = document.getElementById('opportunity-editor-fallback'); input?.focus(); document.execCommand(name, false, argument); onChange(input?.innerHTML || '') }
  const rememberSelection = () => {
    const selection = window.getSelection()
    const input = document.getElementById('opportunity-editor-fallback')
    if (selection?.rangeCount && input?.contains(selection.anchorNode)) recoverySelections.set(input, selection.getRangeAt(0).cloneRange())
  }
  const restoreSelection = () => {
    const selection = window.getSelection()
    const input = document.getElementById('opportunity-editor-fallback')
    const range = input ? recoverySelections.get(input) : null
    if (!range || !selection) return
    selection.removeAllRanges()
    selection.addRange(range)
  }
  const link = () => { rememberSelection(); const url = window.prompt(language === 'en' ? 'Enter the link address' : language === 'ps' ? 'د لینک پته ولیکئ' : 'آدرس لینک را وارد کنید'); if (!url) return; restoreSelection(); command('createLink', url.trim()) }
  const attachFile = (file) => {
    if (!file) return
    restoreSelection()
    const url = URL.createObjectURL(file)
    const safeName = file.name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
    command('insertHTML', `<a href="${url}" target="_blank" rel="noopener noreferrer">${safeName}</a>`)
  }
  const tools = [['Bold', Bold, 'bold'], ['Italic', Italic, 'italic'], ['Underline', UnderlineIcon, 'underline'], ['Link', Link2, link], ['Heading 2', Heading2, 'formatBlock', 'h2'], ['Heading 3', Heading3, 'formatBlock', 'h3'], ['Bullet list', List, 'insertUnorderedList'], ['Numbered list', ListOrdered, 'insertOrderedList'], ['Align right', AlignRight, 'justifyRight'], ['Align center', AlignCenter, 'justifyCenter'], ['Align left', AlignLeft, 'justifyLeft'], ['Undo', Undo2, 'undo'], ['Redo', Redo2, 'redo'], ['Attach file', Paperclip, () => document.getElementById('opportunity-editor-file')?.click()]]
  return <div className="overflow-hidden rounded-xl border border-(--editor-field-border) bg-(--editor-input)"><div className="flex flex-wrap gap-1.5 border-b border-admin-border bg-(--editor-field) p-2">{tools.map(([label, Icon, action, argument]) => <button key={label} type="button" title={label} aria-label={label} onMouseDown={(event) => { event.preventDefault(); rememberSelection() }} onClick={() => typeof action === 'function' ? action() : command(action, argument)} className="grid size-9 place-items-center rounded-lg border border-admin-border bg-admin-card text-admin-muted transition hover:border-admin-brand hover:bg-admin-brand-soft hover:text-admin-brand"><Icon size={16} /></button>)}</div><div ref={inputRef} id="opportunity-editor-fallback" dir="auto" contentEditable suppressContentEditableWarning onInput={(event) => { rememberSelection(); onChange(event.currentTarget.innerHTML) }} onKeyUp={rememberSelection} onMouseUp={rememberSelection} className="cms-opportunity-prose min-h-72 text-start px-4 py-3 text-sm leading-7 text-admin-heading outline-none" aria-label="Post content" /><input id="opportunity-editor-file" type="file" className="sr-only" accept="image/*,.pdf,.doc,.docx" onChange={(event) => attachFile(event.target.files?.[0])} /></div>
}

class EditorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <RecoveryEditor {...this.props} /> : this.props.children }
}

export default function RichTextEditor(props) {
  return <EditorBoundary {...props}><OpportunityRichTextEditor {...props} /></EditorBoundary>
}
