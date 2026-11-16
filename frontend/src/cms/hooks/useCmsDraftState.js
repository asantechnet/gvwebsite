import { useCallback, useEffect, useRef, useState } from 'react'

import {
  announceCmsDraftChange,
  CMS_CHANGES_COMMITTED_EVENT,
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
  const draftRef = useRef(initial.value)
  const [savedInitialValue] = useState(() => structuredClone(initial.recovered ? resolveInitialValue(initialValue) : initial.value))
  const savedValue = useRef(savedInitialValue)
  const dirty = useRef(initial.recovered)
  const immediateSaveQueue = useRef(Promise.resolve())

  useEffect(() => {
    let active = true
    if (initial.recovered) return undefined
    dataSource.snapshots.get(scope)
      .then((snapshot) => {
        if (active && snapshot?.payload && !dirty.current) {
          savedValue.current = structuredClone(snapshot.payload)
          const hydrated = structuredClone(snapshot.payload)
          draftRef.current = hydrated
          setDraftState(hydrated)
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [initial.recovered, scope])

  const setDraft = useCallback((update) => {
    dirty.current = true
    announceCmsDraftChange()
    const next = typeof update === 'function' ? update(draftRef.current) : update
    draftRef.current = next
    setDraftState(next)
  }, [])

  const saveImmediate = useCallback((update) => {
    const applyUpdate = (value) => typeof update === 'function'
      ? update(structuredClone(value))
      : structuredClone(update)

    const save = immediateSaveQueue.current
      .catch(() => {})
      .then(async () => {
        let persistedSnapshot
        try {
          persistedSnapshot = await dataSource.snapshots.get(scope)
        } catch {
          persistedSnapshot = null
        }
        const baseline = persistedSnapshot?.payload ?? savedValue.current
        const updatedBaseline = applyUpdate(baseline)
        const committed = commit ? commit(updatedBaseline) : updatedBaseline
        await dataSource.snapshots.save(scope, committed)
        savedValue.current = structuredClone(committed)
        setDraftState((current) => {
          const next = applyUpdate(current)
          draftRef.current = next
          return next
        })
        return committed
      })

    immediateSaveQueue.current = save
    return save
  }, [commit, scope])

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
        const latestDraft = draftRef.current
        const current = commit ? commit(latestDraft) : latestDraft
        await dataSource.snapshots.save(scope, current)
        dirty.current = false
        savedValue.current = structuredClone(current)
        window.localStorage.removeItem(storageKey)
        if (commit) {
          draftRef.current = current
          setDraftState(current)
        }
        window.dispatchEvent(new CustomEvent(CMS_CHANGES_COMMITTED_EVENT, { detail: { scope, value: current } }))
        event.detail?.resolve?.()
      } catch (error) {
        event.detail?.reject?.(error)
      }
    }
    window.addEventListener(CMS_CHANGES_SAVED_EVENT, saveDraft)
    return () => window.removeEventListener(CMS_CHANGES_SAVED_EVENT, saveDraft)
  }, [commit, scope, storageKey])

  useEffect(() => {
    const discardDraft = () => {
      dirty.current = false
      window.localStorage.removeItem(storageKey)
      const restored = structuredClone(savedValue.current)
      draftRef.current = restored
      setDraftState(restored)
    }
    window.addEventListener(CMS_CHANGES_DISCARDED_EVENT, discardDraft)
    return () => window.removeEventListener(CMS_CHANGES_DISCARDED_EVENT, discardDraft)
  }, [storageKey])

  return [draft, setDraft, { recovered: initial.recovered, saveImmediate }]
}

export default useCmsDraftState
