import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, X } from 'lucide-react'

function DeleteConfirmation({ children }) {
  const [request, setRequest] = useState(null)
  const resolver = useRef(null)
  const confirm = useCallback((options = {}) => new Promise((resolve) => { resolver.current = resolve; setRequest(options) }), [])
  const close = useCallback((confirmed) => { resolver.current?.(confirmed); resolver.current = null; setRequest(null) }, [])
  useEffect(() => { window.cmsConfirmDelete = confirm; return () => { delete window.cmsConfirmDelete } }, [confirm])
  return <>{children}{request && <DeleteDialog request={request} onClose={close} />}</>
}

function DeleteDialog({ request, onClose }) {
  const cancelRef = useRef(null)
  useEffect(() => { cancelRef.current?.focus(); const keydown = (event) => { if (event.key === 'Escape') onClose(false) }; document.addEventListener('keydown', keydown); return () => document.removeEventListener('keydown', keydown) }, [onClose])
  return createPortal(<div className="fixed inset-0 z-[150] grid place-items-center p-4"><div className="absolute inset-0 bg-[rgb(8_12_20/.62)] backdrop-blur-[7px]" onClick={() => onClose(false)} /><section role="alertdialog" aria-modal="true" className="relative w-full max-w-[27rem] overflow-hidden rounded-3xl border border-admin-border bg-admin-card shadow-[0_28px_90px_rgb(0_0_0/.3)]"><div className="relative flex flex-col items-center bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--admin-brand)_10%,transparent),transparent_70%)] px-7 pt-8 pb-7 text-center"><button type="button" className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-admin-muted transition hover:bg-admin-control-soft hover:text-admin-heading" aria-label="Cancel deletion" onClick={() => onClose(false)}><X size={17} /></button><span className="mb-5 grid size-16 place-items-center rounded-2xl border border-red-500/15 bg-red-500/10 text-red-600"><Trash2 size={27} strokeWidth={1.65} /></span><h2 className="m-0 font-heading text-xl font-semibold tracking-tight text-admin-heading">{request.title || 'این مورد حذف شود؟'}</h2><p className="mt-3 mb-0 max-w-xs text-[.8125rem] leading-relaxed break-words text-admin-muted">{request.description || 'این عملیات قابل بازگشت نیست.'}</p></div><div className="flex items-center justify-end gap-3 border-t border-admin-border bg-(--editor-field) px-6 py-4"><button ref={cancelRef} type="button" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-admin-border bg-admin-control px-4 text-xs font-semibold text-admin-heading transition hover:bg-admin-control-soft" onClick={() => onClose(false)}>لغو</button><button type="button" className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-600 bg-red-600 px-4 text-xs font-semibold text-white transition hover:border-red-700 hover:bg-red-700" onClick={() => onClose(true)}><Trash2 size={15} />حذف</button></div></section></div>, document.body)
}

export default DeleteConfirmation
