import { normalizeMessage, serializeMessageState } from '@/shared/models/message.js'
import { apiClient } from './client.js'

const messagePath = (id = '') => `/cms/messages${id ? `/${encodeURIComponent(id)}` : ''}`

export const messagesApi = Object.freeze({
  async list(options) {
    const response = await apiClient.get(messagePath(), options)
    return (Array.isArray(response) ? response : response?.items || []).map(normalizeMessage)
  },
  async setUnread(id, unread, options) {
    return normalizeMessage(await apiClient.patch(messagePath(id), serializeMessageState(unread), options))
  },
  remove: (id, options) => apiClient.delete(messagePath(id), options),
})
