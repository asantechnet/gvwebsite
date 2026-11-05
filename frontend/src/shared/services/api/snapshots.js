import { apiClient } from './client.js'

const pathFor = (key) => `/cms/snapshots/${encodeURIComponent(key)}`

export const snapshotsApi = Object.freeze({
  async get(key, options) {
    try { return await apiClient.get(pathFor(key), options) }
    catch (error) { if (error?.status === 404) return null; throw error }
  },
  save: (key, payload, options) => apiClient.put(pathFor(key), { payload, published: true }, options),
  publicList: (options) => apiClient.get('/site/snapshots', options),
})
