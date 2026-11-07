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
