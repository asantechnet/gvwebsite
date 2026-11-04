import { normalizeSession } from '@cms/auth/permissions.js'
import { apiClient, authApi } from '@/shared/services/api/index.js'

export const apiDataSource = Object.freeze({
  mode: 'api',
  initialSession: null,
  auth: {
    async session(options) { return normalizeSession(await authApi.session(options)) },
    logout: (options) => authApi.logout(options),
  },
  contact: {
    submit: (values, options) => apiClient.post('/contact/messages', values, options),
  },
})
