import { toast } from 'sonner'
import englishContent from '@cms/locales/en/dashboard.json'
import dariContent from '@cms/locales/prs/dashboard.json'
import pashtoContent from '@cms/locales/ps/dashboard.json'

export function showToast(message, options = {}) {
  const variant = options.variant === 'danger' ? 'error' : options.variant ?? 'success'
  const notify = toast[variant] ?? toast
  notify(options.title ?? message, {
    description: options.title ? message : undefined,
    duration: options.duration ?? 4000,
    action: options.action ? { label: options.action.label, onClick: options.action.onClick } : undefined,
  })
}

export function showRecordToast(operation) {
  const language = document.documentElement.lang
  const content = language === 'en' ? englishContent : language === 'ps' ? pashtoContent : dariContent
  showToast(content.operationNotifications[operation])
}

export function showDeleteUndoToast({ onUndo, onCommit } = {}) {
  const language = document.documentElement.lang
  const content = language === 'en' ? englishContent : language === 'ps' ? pashtoContent : dariContent
  const copy = content.operationNotifications
  const toastId = `delete-undo-${Date.now()}-${Math.random()}`
  let remaining = 5
  let settled = false
  let interval
  let timeout

  const clear = () => {
    window.clearInterval(interval)
    window.clearTimeout(timeout)
  }
  const undo = async () => {
    if (settled) return
    settled = true
    clear()
    toast.dismiss(toastId)
    try {
      await onUndo?.()
      showToast(copy.recordRestored)
    } catch {
      showToast(copy.undoFailed, { variant: 'danger' })
    }
  }
  const render = () => toast.success(copy.recordDeleted, {
    id: toastId,
    duration: Infinity,
    description: copy.undoCountdown.replace('{seconds}', remaining),
    action: { label: copy.undo, onClick: undo },
  })

  render()
  interval = window.setInterval(() => { remaining -= 1; if (remaining > 0) render() }, 1000)
  timeout = window.setTimeout(async () => {
    if (settled) return
    settled = true
    clear()
    toast.dismiss(toastId)
    try { await onCommit?.() } catch { showToast(copy.deleteFailed, { variant: 'danger' }) }
  }, 5000)
}
