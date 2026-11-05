import { normalizeSession } from '@cms/auth/permissions.js'
import { apiClient, auditLogsApi, authApi, messagesApi, snapshotsApi, usersApi } from '@/shared/services/api/index.js'

export const apiDataSource = Object.freeze({
  mode: 'api',
  initialSession: null,
  auth: {
    async session(options) {
      try { return normalizeSession(await authApi.session(options)) }
      catch (error) { if (error?.code === 'unauthenticated') return null; throw error }
    },
    async login(credentials, options) { return normalizeSession(await authApi.login(credentials, options)) },
    logout: (options) => authApi.logout(options),
    changePassword: (values, options) => authApi.changePassword(values, options),
    forgotPassword: (values, options) => authApi.forgotPassword(values, options),
    resetPassword: (values, options) => authApi.resetPassword(values, options),
  },
  contact: {
    async submit(values, options) { await authApi.csrf(); return apiClient.post('/contact/messages', values, options) },
  },
  messages: messagesApi,
  auditLogs: auditLogsApi,
  users: usersApi,
  snapshots: snapshotsApi,
})
