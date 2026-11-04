import { normalizeContentRecord, serializeContentRecord } from '@/shared/models/content.js'
import { apiClient } from './client.js'

function collectionPath(collection, id = '') {
  const safeCollection = encodeURIComponent(collection)
  return `/cms/content/${safeCollection}${id ? `/${encodeURIComponent(id)}` : ''}`
}

export const contentApi = Object.freeze({
  async list(collection, options) {
    const records = await apiClient.get(collectionPath(collection), options)
    return (Array.isArray(records) ? records : records?.items || []).map(normalizeContentRecord)
  },
  async get(collection, id, options) {
    return normalizeContentRecord(await apiClient.get(collectionPath(collection, id), options))
  },
  async create(collection, record, options) {
    return normalizeContentRecord(await apiClient.post(collectionPath(collection), serializeContentRecord(record), options))
  },
  async update(collection, record, options) {
    return normalizeContentRecord(await apiClient.put(collectionPath(collection, record.id), serializeContentRecord(record), options))
  },
  remove: (collection, id, options) => apiClient.delete(collectionPath(collection, id), options),
})
