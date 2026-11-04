import { useEffect, useRef } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function useModalFocus({ active = true, initialFocusRef, onClose } = {}) {
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!active) return undefined

    const previouslyFocused = document.activeElement
    const dialog = dialogRef.current
    const focusDialog = window.requestAnimationFrame(() => {
      const target = initialFocusRef?.current || dialog?.querySelector(focusableSelector) || dialog
      target?.focus({ preventScroll: true })
    })

    const handleKeyDown = (event) => {
      if (!dialog || [...document.querySelectorAll('[aria-modal="true"]')].at(-1) !== dialog) return
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current?.()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = [...dialog.querySelectorAll(focusableSelector)].filter((element) => element.getClientRects().length)
      if (!focusable.length) {
        event.preventDefault()
        dialog.focus({ preventScroll: true })
        return
      }
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(focusDialog)
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) previouslyFocused.focus({ preventScroll: true })
    }
  }, [active, initialFocusRef])

  return dialogRef
}

export default useModalFocus
