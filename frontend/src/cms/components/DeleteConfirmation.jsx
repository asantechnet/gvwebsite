import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, X } from 'lucide-react'

import useModalFocus from '@/shared/hooks/useModalFocus.js'

function DeleteConfirmation({ children }) {
  const [request, setRequest] = useState(null)
  const resolver = useRef(null)
  const confirm = useCallback((options = {}) => new Promise((resolve) => { resolver.current = resolve; setRequest(options) }), [])
  const close = useCallback((confirmed) => { resolver.current?.(confirmed); resolver.current = null; setRequest(null) }, [])
  useEffect(() => { window.cmsConfirmDelete = confirm; return () => { delete window.cmsConfirmDelete } }, [confirm])
  useEffect(() => {
    if (!request) return undefined
    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.classList.add('cms-modal-open')
    return () => { document.body.style.overflow = previousBodyOverflow; document.documentElement.style.overflow = previousDocumentOverflow; document.documentElement.classList.remove('cms-modal-open') }
  }, [request])
  return <>{children}{request && <DeleteDialog request={request} onClose={close} />}</>
}

function DeleteDialog({ request, onClose }) {
  const isEnglish = document.documentElement.lang === 'en'
  const cancelRef = useRef(null)
  const [closing, setClosing] = useState(false)
  const close = useCallback((confirmed) => { if (closing) return; setClosing(true); window.setTimeout(() => onClose(confirmed), 200) }, [closing, onClose])
  const dialogRef = useModalFocus({ initialFocusRef: cancelRef, onClose: () => close(false) })
  return createPortal(
    <div className={`cms-modal-backdrop fixed inset-0 z-[150] isolate grid place-items-center p-4 sm:p-6 ${closing ? 'animate-cms-modal-backdrop-out' : 'animate-cms-modal-backdrop-in'}`} onClick={() => close(false)}>
      <section ref={dialogRef} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description" className={`relative z-10 w-full max-w-xl rounded-2xl border border-admin-border bg-admin-card p-5 shadow-2xl sm:p-6 ${closing ? 'animate-cms-modal-panel-out' : 'animate-cms-modal-panel-in'}`} style={{ backgroundColor: 'var(--admin-card)', borderColor: 'var(--admin-border)', opacity: 1 }} onClick={(event) => event.stopPropagation()}>
        <div className="relative flex flex-col items-center bg-transparent text-center">
          <button type="button" className="absolute start-0 top-0 grid size-9 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-control-soft hover:text-admin-heading focus-visible:border-admin-brand focus-visible:shadow-[0_0_0_2px_rgb(245_155_34_/.2)]" aria-label="Cancel deletion" onClick={() => close(false)}><X size={17} /></button>
          <span className="mb-4 grid size-14 place-items-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 shadow-[0_8px_20px_rgb(239_68_68/.1)] sm:mb-5 sm:size-16"><Trash2 size={26} strokeWidth={1.65} /></span>
          <h2 id="delete-dialog-title" className="m-0 font-heading text-lg font-semibold tracking-tight text-admin-heading sm:text-xl">{request.title || (isEnglish ? 'Delete this item?' : 'این مورد حذف شود؟')}</h2>
          <p id="delete-dialog-description" className="mt-2.5 mb-0 max-w-xs text-[.75rem] leading-7 break-words text-admin-muted sm:mt-3 sm:text-[.8125rem]">{request.description || (isEnglish ? 'This action cannot be undone.' : 'این عملیات قابل بازگشت نیست.')}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2.5 bg-transparent sm:gap-3">
          <button ref={cancelRef} type="button" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-admin-border bg-admin-control px-4 text-xs font-semibold text-admin-heading transition hover:border-admin-brand hover:bg-admin-control-soft hover:text-admin-brand-text focus-visible:border-admin-brand focus-visible:shadow-[0_0_0_2px_rgb(245_155_34_/.2)]" onClick={() => close(false)}>{isEnglish ? 'Cancel' : 'لغو'}</button>
          <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-600 bg-red-600 px-4 text-xs font-semibold text-white transition hover:border-red-700 hover:bg-red-700 focus-visible:border-red-700 focus-visible:shadow-[0_0_0_2px_rgb(239_68_68/.25)]" onClick={() => close(true)}><Trash2 size={15} />{isEnglish ? 'Delete' : 'حذف'}</button>
        </div>
      </section>
    </div>,
    document.querySelector('.cms-root') || document.body,
  )
}

export default DeleteConfirmation
