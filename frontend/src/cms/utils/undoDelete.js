import { showDeleteUndoToast } from '@cms/utils/toast.js'

export async function deleteWithUndo({ remove, restore, commit, afterRemove }) {
  await remove()
  afterRemove?.()
  showDeleteUndoToast({ onUndo: restore, onCommit: commit })
}

export async function deleteLocalizedSnapshotItemWithUndo({ drafts, index, getItems, setItems, saveImmediate, afterRemove }) {
  const removedByLanguage = Object.fromEntries(Object.entries(drafts).map(([language, draft]) => [language, getItems(draft)[index]]))

  await deleteWithUndo({
    remove: () => saveImmediate((current) => Object.fromEntries(Object.entries(current).map(([language, draft]) => [language, setItems(draft, getItems(draft).filter((_, itemIndex) => itemIndex !== index))]))),
    restore: () => saveImmediate((current) => Object.fromEntries(Object.entries(current).map(([language, draft]) => {
      const items = [...getItems(draft)]
      items.splice(Math.min(index, items.length), 0, removedByLanguage[language])
      return [language, setItems(draft, items)]
    }))),
    afterRemove,
  })
}

export async function deleteCollectionItemWithUndo({ items, index, updateItems, afterRemove }) {
  const removed = items[index]
  await deleteWithUndo({
    remove: () => updateItems((current) => current.filter((_, itemIndex) => itemIndex !== index)),
    restore: () => updateItems((current) => { const restored = [...current]; restored.splice(Math.min(index, restored.length), 0, removed); return restored }),
    afterRemove,
  })
}
