import { useCallback, useEffect, useMemo, useState } from 'react'

import { normalizeMessage } from '@/shared/models/message.js'
import { dataSource } from '@/shared/services/data/index.js'
import { withSkeletonPreview } from '@/shared/utils/loading.js'

function useMessages(enabled = true) {
  const [records, setRecords] = useState([])
  const [status, setStatus] = useState(enabled ? 'loading' : 'idle')
  const [error, setError] = useState(null)
  const [pendingIds, setPendingIds] = useState(() => new Set())

  const load = useCallback(async (signal) => {
    if (!enabled) return
    setStatus('loading')
    setError(null)
    try {
      const messages = await withSkeletonPreview(dataSource.messages.list({ signal }))
      if (signal?.aborted) return
      setRecords(messages.map(normalizeMessage))
      setStatus('ready')
    } catch (loadError) {
      if (signal?.aborted || loadError?.code === 'cancelled') return
      setError(loadError)
      setStatus('error')
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()
    Promise.resolve().then(() => load(controller.signal))
    return () => controller.abort()
  }, [enabled, load])

  const runMutation = useCallback(async (id, operation) => {
    const messageId = String(id)
    setPendingIds((current) => new Set(current).add(messageId))
    setError(null)
    try {
      return await operation(messageId)
    } catch (mutationError) {
      setError(mutationError)
      return null
    } finally {
      setPendingIds((current) => {
        const next = new Set(current)
        next.delete(messageId)
        return next
      })
    }
  }, [])

  const setUnread = useCallback((id, unread) => runMutation(id, async (messageId) => {
    const updated = normalizeMessage(await dataSource.messages.setUnread(messageId, unread))
    setRecords((current) => current.map((message) => message.id === messageId ? updated : message))
    return updated
  }), [runMutation])

  const remove = useCallback((id) => runMutation(id, async (messageId) => {
    await dataSource.messages.remove(messageId)
    setRecords((current) => current.filter((message) => message.id !== messageId))
    return true
  }), [runMutation])

  const reply = useCallback((id, values) => runMutation(id, async (messageId) => {
    const updated = normalizeMessage(await dataSource.messages.reply(messageId, values))
    setRecords((current) => current.map((message) => message.id === messageId ? updated : message))
    return updated
  }), [runMutation])

  return useMemo(() => ({
    records,
    status,
    error,
    unreadCount: records.filter((message) => message.unread).length,
    isPending: (id) => pendingIds.has(String(id)),
    refresh: () => load(),
    setUnread,
    remove,
    reply,
  }), [error, load, pendingIds, records, remove, reply, setUnread, status])
}

export default useMessages
