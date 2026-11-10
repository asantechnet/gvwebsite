import { apiClient } from './client.js'

const pathFor = (key) => `/cms/snapshots/${encodeURIComponent(key)}`
export const SNAPSHOT_UPDATED_EVENT = 'globalvision:snapshot-updated'
export const SNAPSHOT_UPDATED_STORAGE_KEY = 'globalvision-snapshot-updated-at'

function announceSnapshotUpdate(key) {
  const detail = { key, updatedAt: Date.now() }
  window.dispatchEvent(new CustomEvent(SNAPSHOT_UPDATED_EVENT, { detail }))
  try {
    window.localStorage.setItem(SNAPSHOT_UPDATED_STORAGE_KEY, JSON.stringify(detail))
  } catch {
    // The same-tab event still refreshes content when storage is unavailable.
  }
}

export const snapshotsApi = Object.freeze({
  async get(key, options) {
    try { return await apiClient.get(pathFor(key), options) }
    catch (error) { if (error?.status === 404) return null; throw error }
  },
  async save(key, payload, options) {
    const snapshot = await apiClient.put(pathFor(key), { payload, published: true }, options)
    announceSnapshotUpdate(key)
    return snapshot
  },
  publicList: (options) => apiClient.get('/site/snapshots', options),
})
