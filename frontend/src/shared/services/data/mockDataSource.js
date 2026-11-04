import { ALL_CMS_PERMISSIONS, normalizeSession } from '@cms/auth/permissions.js'

const mockSession = normalizeSession({
  user: { id: 'local-admin', name: 'Global Vision', email: 'info@globalvision.af', role: 'administrator' },
  permissions: ALL_CMS_PERMISSIONS,
})

const pause = () => Promise.resolve()

export const mockDataSource = Object.freeze({
  mode: 'mock',
  initialSession: mockSession,
  auth: {
    async session() { await pause(); return mockSession },
    async logout() { await pause(); return null },
  },
  contact: {
    async submit(values) {
      await pause()
      return { id: `local-${Date.now()}`, received: true, values }
    },
  },
})
