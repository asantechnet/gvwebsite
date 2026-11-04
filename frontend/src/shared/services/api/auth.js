import { apiClient } from './client.js'

export const authApi = Object.freeze({
  session: (options) => apiClient.get('/auth/session', options),
  login: (credentials, options) => apiClient.post('/auth/login', credentials, options),
  logout: (options) => apiClient.post('/auth/logout', undefined, options),
  changePassword: (values, options) => apiClient.put('/auth/password', values, options),
})
