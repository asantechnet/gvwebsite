import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Check, CircleX, RotateCcw, Save } from 'lucide-react'

import { getCmsRouteKey } from '@cms/routes.js'
import useModalFocus from '@/shared/hooks/useModalFocus.js'
import {
  CMS_CHANGES_DISCARDED_EVENT,
  CMS_DRAFT_DIRTY_EVENT,
  hasRecoverableCmsDraft,
  requestCmsSave,
} from '@cms/utils/draftEvents.js'

const copy = {
  prs: { actions: 'اقدامات صفحه', saved: 'تغییرات ذخیره شد', failed: 'تغییرات ذخیره نشد. دوباره تلاش کنید.', saving: 'در حال ذخیره…', dirty: 'تغییرات ذخیره‌نشده دارید.', clean: 'تغییری برای ذخیره وجود ندارد.', reset: 'بازنشانی', saveChanges: 'ذخیره تغییرات', leave: 'بدون ذخیره خارج شوید؟', leaveDescription: 'تغییرات شما هنوز ذخیره نشده است.', cancel: 'لغو', discard: 'صرف‌نظر', save: 'ذخیره' },
  ps: { actions: 'د پاڼې کړنې', saved: 'بدلونونه خوندي شول', failed: 'بدلونونه خوندي نه شول. بیا هڅه وکړئ.', saving: 'خوندي کېږي…', dirty: 'تاسو ناخوندي بدلونونه لرئ.', clean: 'د خوندي کولو لپاره بدلون نشته.', reset: 'بیا تنظیمول', saveChanges: 'بدلونونه خوندي کړئ', leave: 'له خوندي کولو پرته ووځئ؟', leaveDescription: 'ستاسو بدلونونه لا نه دي خوندي شوي.', cancel: 'لغوه', discard: 'پرېښودل', save: 'خوندي کول' },
  en: { actions: 'Page actions', saved: 'Changes saved', failed: 'Changes could not be saved. Try again.', saving: 'Saving…', dirty: 'You have unsaved changes.', clean: 'There are no changes to save.', reset: 'Reset', saveChanges: 'Save changes', leave: 'Leave without saving?', leaveDescription: 'Your changes have not been saved yet.', cancel: 'Cancel', discard: 'Discard', save: 'Save' },
}

function UnsavedChangesBar({ sidebarCollapsed = false }) {
  const labels = copy[document.documentElement.lang] || copy.prs
  const [dirty, setDirty] = useState(() => hasRecoverableCmsDraft(getCmsRouteKey(window.location.pathname)))
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [leavePrompt, setLeavePrompt] = useState(false)
  const [promptClosing, setPromptClosing] = useState(false)
  const [pendingHref, setPendingHref] = useState(null)
  const allowNavigation = useRef(false)

  useEffect(() => {
    const mark = (event) => {
      if (event.target.closest?.('#dashboard-content') && event.target.type !== 'search') {
        setDirty(true)
        setSaved(false)
      }
    }
    document.addEventListener('input', mark, true)
    document.addEventListener('change', mark, true)
    return () => {
      document.removeEventListener('input', mark, true)
      document.removeEventListener('change', mark, true)
    }
  }, [])

  useEffect(() => {
    const markDirty = () => {
      setDirty(true)
      setSaved(false)
    }
    window.addEventListener(CMS_DRAFT_DIRTY_EVENT, markDirty)
    return () => window.removeEventListener(CMS_DRAFT_DIRTY_EVENT, markDirty)
  }, [])

  useEffect(() => {
    const warn = (event) => {
      if (dirty && !allowNavigation.current) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => {
    const intercept = (event) => {
      const link = event.target.closest?.('a[href]')
      if (!dirty || !link || link.target === '_blank' || link.hasAttribute('download') || link.origin !== window.location.origin) return
      if (!link.href || link.href === window.location.href) return
      event.preventDefault()
      event.stopPropagation()
      setPendingHref(link.href)
      setLeavePrompt(true)
    }
    document.addEventListener('click', intercept, true)
    return () => document.removeEventListener('click', intercept, true)
  }, [dirty])

  useEffect(() => {
    const interceptReloadShortcut = (event) => {
      const reloadShortcut = event.key === 'F5' || ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'r')
      if (!dirty || !reloadShortcut) return
      event.preventDefault()
      event.stopPropagation()
      setPendingHref(window.location.href)
      setLeavePrompt(true)
    }
    window.addEventListener('keydown', interceptReloadShortcut, true)
    return () => window.removeEventListener('keydown', interceptReloadShortcut, true)
  }, [dirty])

  useEffect(() => {
    if (!leavePrompt) return undefined
    const bodyOverflow = document.body.style.overflow
    const documentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.classList.add('cms-modal-open')
    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = documentOverflow
      document.documentElement.classList.remove('cms-modal-open')
    }
  }, [leavePrompt])

  const closePrompt = () => {
    if (promptClosing) return
    setPromptClosing(true)
    window.setTimeout(() => {
      setLeavePrompt(false)
      setPromptClosing(false)
      setPendingHref(null)
    }, 200)
  }

  const continueNavigation = async (saveChanges) => {
    if (promptClosing) return
    const href = pendingHref
    if (saveChanges) {
      setSaving(true)
      setSaveError(false)
      try { await requestCmsSave() } catch { setSaving(false); setSaveError(true); setLeavePrompt(false); setPromptClosing(false); return }
      setSaving(false)
    }
    setPromptClosing(true)
    window.setTimeout(() => {
      allowNavigation.current = Boolean(href)
      setDirty(false)
      setLeavePrompt(false)
      setPromptClosing(false)
      setPendingHref(null)
      if (saveChanges) {
        setSaved(true)
        window.setTimeout(() => setSaved(false), 2200)
      } else {
        window.dispatchEvent(new Event(CMS_CHANGES_DISCARDED_EVENT))
      }
      if (href) window.location.assign(href)
    }, 200)
  }

  const save = async () => {
    setSaving(true)
    setSaveError(false)
    try {
      await requestCmsSave()
      setDirty(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
    } catch {
      setSaveError(true)
      setDirty(true)
    } finally {
      setSaving(false)
    }
  }

  const promptRef = useModalFocus({ active: leavePrompt, onClose: closePrompt })

  if (window.location.pathname.startsWith('/dashboard/messages')) return null

  const desktopInset = sidebarCollapsed
    ? 'rtl:lg:right-[calc(5.25rem+1rem)] ltr:lg:left-[calc(5.25rem+1rem)]'
    : 'rtl:lg:right-[calc(var(--sidebar-width)+1rem)] ltr:lg:left-[calc(var(--sidebar-width)+1rem)]'

  return <>
    <aside className={`pointer-events-none fixed inset-x-3 bottom-[.55rem] z-[38] min-[701px]:bottom-[.85rem] min-[701px]:inset-x-4 ${desktopInset}`} aria-label={labels.actions}>
      <div className="pointer-events-auto mx-auto flex min-h-[3.15rem] w-[min(100%,78rem)] items-center justify-between gap-4 rounded-[.82rem] border border-[color-mix(in_srgb,var(--admin-brand)_26%,var(--admin-border))] bg-(--admin-topbar) p-[.38rem] shadow-[0_18px_55px_rgb(15_23_42_/.18),inset_0_1px_0_rgb(255_255_255_/.08)] backdrop-blur-[20px] min-[701px]:min-h-16 min-[701px]:rounded-2xl min-[701px]:px-3 min-[701px]:py-[.65rem]">
        <span className={`hidden items-center gap-1.5 text-[.75rem] font-medium min-[701px]:inline-flex ${saved ? 'font-semibold text-[#168a52]' : dirty ? 'font-semibold text-[#d97706]' : 'text-admin-muted'}`}>
          {saveError ? labels.failed : saving ? labels.saving : saved ? <><Check size={14} />{labels.saved}</> : dirty ? labels.dirty : labels.clean}
        </span>
        <div className="flex w-full items-center gap-[.38rem] min-[701px]:w-auto min-[701px]:gap-[.55rem]">
          <button type="button" disabled={!dirty || saving} className="inline-flex min-h-9 flex-1 items-center justify-center gap-[.35rem] rounded-[.55rem] border border-admin-brand bg-admin-brand px-[.7rem] py-[.42rem] text-[.6875rem] font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:border-admin-border disabled:bg-admin-control-soft disabled:text-admin-muted min-[701px]:flex-none" onClick={save}><Save size={14} />{saving ? labels.saving : labels.saveChanges}</button>
        </div>
      </div>
    </aside>

    {leavePrompt && <div className={`cms-modal-backdrop fixed inset-0 z-[125] isolate grid place-items-center p-4 ${promptClosing ? 'animate-cms-modal-backdrop-out' : 'animate-cms-modal-backdrop-in'}`} onClick={closePrompt}>
      <section ref={promptRef} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby="unsaved-dialog-title" aria-describedby="unsaved-dialog-description" className={`relative z-10 grid w-[min(100%,27rem)] justify-items-center rounded-[1.1rem] border border-admin-border bg-admin-card px-6 py-6 text-center shadow-2xl ${promptClosing ? 'animate-cms-modal-panel-out' : 'animate-cms-modal-panel-in'}`} onClick={(event) => event.stopPropagation()}>
        <span className="grid size-[3.2rem] place-items-center rounded-[.95rem] bg-[rgb(217_119_6/.12)] text-[#d97706]"><AlertTriangle size={22} /></span>
        <h2 id="unsaved-dialog-title" className="mt-4 mb-2 font-heading text-[1.15rem] text-admin-heading">{labels.leave}</h2>
        <p id="unsaved-dialog-description" className="m-0 max-w-[23rem] text-[.75rem] leading-[1.65] text-admin-muted">{labels.leaveDescription}</p>
        <div className="mt-5 grid w-full gap-2 sm:grid-cols-3">
          <button type="button" className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-admin-border bg-admin-control px-3 text-xs font-semibold text-admin-muted transition hover:border-admin-brand hover:bg-admin-control-soft hover:text-admin-heading" onClick={closePrompt}><CircleX size={14} />{labels.cancel}</button>
          <button type="button" className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-red-500/60 bg-red-600/20 px-3 text-xs font-semibold text-red-500 transition hover:border-red-500 hover:bg-red-600 hover:text-white" onClick={() => continueNavigation(false)}><RotateCcw size={14} />{labels.discard}</button>
          <button type="button" className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg bg-admin-brand px-3 text-xs font-semibold text-white transition hover:bg-orange-500" onClick={() => continueNavigation(true)}><Save size={14} />{labels.save}</button>
        </div>
      </section>
    </div>}
  </>
}

export default UnsavedChangesBar
