import { apiClient } from './client.js'

export const auditLogsApi = Object.freeze({
  async list(options) {
    const response = await apiClient.get('/cms/audit-logs', options)
    return Array.isArray(response) ? response : response?.items || []
  },
})
