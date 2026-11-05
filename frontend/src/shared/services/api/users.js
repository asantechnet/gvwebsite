import { apiClient } from './client.js'

const path = (id = '') => `/cms/users${id ? `/${encodeURIComponent(id)}` : ''}`
export const usersApi = Object.freeze({
  list: (options) => apiClient.get(path(), options),
  create: (values, options) => apiClient.post(path(), values, options),
  update: (id, values, options) => apiClient.put(path(id), values, options),
  remove: (id, currentPassword, options) => apiClient.delete(path(id), { ...options, body: { currentPassword } }),
  sendPasswordReset: (id, currentPassword, options) => apiClient.post(`${path(id)}/password-reset`, { currentPassword }, options),
})
