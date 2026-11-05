import { useEffect, useRef, useState } from 'react'

import {
  announceCmsDraftChange,
  CMS_CHANGES_DISCARDED_EVENT,
  CMS_CHANGES_SAVED_EVENT,
  getCmsDraftStorageKey,
} from '@cms/utils/draftEvents.js'
import { dataSource } from '@/shared/services/data/index.js'

function resolveInitialValue(initialValue) {
  return typeof initialValue === 'function' ? initialValue() : initialValue
}

function readStoredDraft(storageKey, initialValue) {
  try {
    const storedDraft = window.localStorage.getItem(storageKey)
    return storedDraft === null
      ? { value: resolveInitialValue(initialValue), recovered: false }
      : { value: JSON.parse(storedDraft), recovered: true }
  } catch {
    window.localStorage.removeItem(storageKey)
    return { value: resolveInitialValue(initialValue), recovered: false }
  }
}

function useCmsDraftState(scope, initialValue, { commit } = {}) {
  const storageKey = getCmsDraftStorageKey(scope)
  const [initial] = useState(() => readStoredDraft(storageKey, initialValue))
  const [draft, setDraftState] = useState(initial.value)
  const [savedInitialValue] = useState(() => structuredClone(initial.recovered ? resolveInitialValue(initialValue) : initial.value))
  const savedValue = useRef(savedInitialValue)
  const dirty = useRef(initial.recovered)

  useEffect(() => {
    let active = true
    if (initial.recovered) return undefined
    dataSource.snapshots.get(scope)
      .then((snapshot) => {
        if (active && snapshot?.payload && !dirty.current) {
          savedValue.current = structuredClone(snapshot.payload)
          setDraftState(structuredClone(snapshot.payload))
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [initial.recovered, scope])

  const setDraft = (update) => {
    dirty.current = true
    announceCmsDraftChange()
    setDraftState(update)
  }

  useEffect(() => {
    if (!dirty.current) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft))
    } catch {
      // Keep the in-memory draft when browser storage is unavailable or full.
    }
  }, [draft, storageKey])

  useEffect(() => {
    const saveDraft = async (event) => {
      if (event.detail) event.detail.handled = true
      try {
        const current = commit ? commit(draft) : draft
        await dataSource.snapshots.save(scope, current)
        dirty.current = false
        savedValue.current = structuredClone(current)
        window.localStorage.removeItem(storageKey)
        if (commit) setDraftState(current)
        event.detail?.resolve?.()
      } catch (error) {
        event.detail?.reject?.(error)
      }
    }
    window.addEventListener(CMS_CHANGES_SAVED_EVENT, saveDraft)
    return () => window.removeEventListener(CMS_CHANGES_SAVED_EVENT, saveDraft)
  }, [commit, draft, scope, storageKey])

  useEffect(() => {
    const discardDraft = () => {
      dirty.current = false
      window.localStorage.removeItem(storageKey)
      setDraftState(structuredClone(savedValue.current))
    }
    window.addEventListener(CMS_CHANGES_DISCARDED_EVENT, discardDraft)
    return () => window.removeEventListener(CMS_CHANGES_DISCARDED_EVENT, discardDraft)
  }, [storageKey])

  return [draft, setDraft, { recovered: initial.recovered }]
}

export default useCmsDraftState
