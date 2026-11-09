import { ALL_CMS_PERMISSIONS, normalizeSession } from '@cms/auth/permissions.js'
import { normalizeMessage } from '@/shared/models/message.js'

const mockSession = normalizeSession({
  user: { id: 'local-admin', name: 'Global Vision', email: 'info@globalvision.af', role: 'administrator' },
  permissions: ALL_CMS_PERMISSIONS,
})

const pause = () => Promise.resolve()

let mockMessages = [
  { id: 'mock-1', title: 'احمد رضایی', email: 'ahmad@example.com', service: 'مشاوره تحصیلی', timeline: '3 تا 6 ماه آینده', body: 'سلام، برای انتخاب دانشگاه و آماده‌سازی مدارک پذیرش به راهنمایی نیاز دارم.', createdAt: '2026-11-04T08:30:00Z', unread: true },
  { id: 'mock-2', title: 'مریم احمدی', email: 'maryam@example.com', service: 'بورسیه تحصیلی', timeline: 'سال تحصیلی آینده', body: 'لطفاً درباره بورسیه‌های مقطع کارشناسی ارشد و شرایط زبان معلومات بفرستید.', createdAt: '2026-11-03T13:15:00Z', unread: true },
  { id: 'mock-3', title: 'Farid Khan', email: 'farid@example.com', service: 'Work visa consultation', timeline: '', body: 'I would like to understand the document requirements and expected processing timeline.', createdAt: '2026-11-02T10:00:00Z', unread: false },
].map(normalizeMessage)

const cloneMessages = () => mockMessages.map((message) => ({ ...message }))
const mockSnapshots = new Map()
let mockUsers = [mockSession.user]

export const mockDataSource = Object.freeze({
  mode: 'mock',
  initialSession: mockSession,
  auth: {
    async session() { await pause(); return mockSession },
    async login() { await pause(); return mockSession },
    async logout() { await pause(); return null },
    async changePassword() { await pause(); return { message: 'Password updated.' } },
    async forgotPassword() { await pause(); return { message: 'Reset link sent.' } },
    async resetPassword() { await pause(); return { message: 'Password reset.' } },
  },
  contact: {
    async submit(values) {
      await pause()
      const message = normalizeMessage({ id: `local-${Date.now()}`, ...values, service: values.subject, body: values.message, createdAt: new Date().toISOString(), unread: true })
      mockMessages = [message, ...mockMessages]
      return { id: message.id, received: true, values }
    },
  },
  messages: {
    async list() { await pause(); return cloneMessages() },
    async setUnread(id, unread) {
      await pause()
      mockMessages = mockMessages.map((message) => message.id === String(id) ? { ...message, unread: Boolean(unread) } : message)
      return { ...mockMessages.find((message) => message.id === String(id)) }
    },
    async remove(id) {
      await pause()
      mockMessages = mockMessages.filter((message) => message.id !== String(id))
      return null
    },
    async reply(id) {
      await pause()
      mockMessages = mockMessages.map((message) => message.id === String(id) ? { ...message, unread: false, repliedAt: new Date().toISOString() } : message)
      return { ...mockMessages.find((message) => message.id === String(id)) }
    },
  },
  auditLogs: {
    async list() { await pause(); return [] },
  },
  users: {
    async list() { await pause(); return structuredClone(mockUsers) },
    async create(values) { await pause(); const user = { id: `local-${Date.now()}`, name: values.name, email: values.email, role: 'administrator' }; mockUsers.push(user); return structuredClone(user) },
    async update(id, values) { await pause(); mockUsers = mockUsers.map((user) => user.id === String(id) ? { ...user, ...values } : user); return structuredClone(mockUsers.find((user) => user.id === String(id))) },
    async remove(id) { await pause(); mockUsers = mockUsers.filter((user) => user.id !== String(id)); return null },
    async sendPasswordReset() { await pause(); return { message: 'Password reset link sent.' } },
  },
  snapshots: {
    async get(key) { await pause(); return mockSnapshots.get(key) || null },
    async save(key, payload) { await pause(); const snapshot = { key, payload: structuredClone(payload), version: (mockSnapshots.get(key)?.version || 0) + 1 }; mockSnapshots.set(key, snapshot); return snapshot },
    async publicList() { await pause(); return [...mockSnapshots.values()] },
  },
})
