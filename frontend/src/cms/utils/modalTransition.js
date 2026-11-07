const MODAL_TRANSITION_MS = 200

export function closeCmsModal(afterClose) {
  const panels = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')]
  const panel = panels.at(-1)
  const backdrop = panel?.closest('.cms-modal-backdrop') || panel?.parentElement
  if (!backdrop) { afterClose(); return }
  if (backdrop.classList.contains('animate-cms-modal-backdrop-out')) return
  backdrop.classList.remove('animate-cms-modal-backdrop-in')
  backdrop.classList.add('animate-cms-modal-backdrop-out')
  panel?.classList.remove('animate-cms-modal-panel-in')
  panel?.classList.add('animate-cms-modal-panel-out')
  window.setTimeout(afterClose, MODAL_TRANSITION_MS)
}
