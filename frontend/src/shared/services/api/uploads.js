import { apiConfig } from './config.js'
import { getCsrfToken } from './client.js'
import { ApiError, normalizeApiError } from './errors.js'

export function uploadFile(file, { metadata = {}, onProgress, signal } = {}) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)
    Object.entries(metadata).forEach(([key, value]) => formData.append(key, String(value)))
    request.open('POST', `${apiConfig.baseUrl}/cms/uploads`)
    request.withCredentials = true
    request.setRequestHeader('Accept', 'application/json')
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    const csrfToken = getCsrfToken()
    if (csrfToken) request.setRequestHeader('X-XSRF-TOKEN', csrfToken)
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100))
    })
    request.addEventListener('load', () => {
      let payload
      try { payload = request.responseText ? JSON.parse(request.responseText) : null } catch { payload = request.responseText }
      if (request.status >= 200 && request.status < 300) resolve(payload?.data ?? payload)
      else reject(new ApiError(payload?.message || 'The upload failed.', { code: request.status === 422 ? 'validation' : 'http', status: request.status, details: payload?.errors || payload }))
    })
    request.addEventListener('error', () => reject(normalizeApiError(new Error('Upload failed.'))))
    request.addEventListener('abort', () => reject(new ApiError('The upload was cancelled.', { code: 'cancelled' })))
    signal?.addEventListener('abort', () => request.abort(), { once: true })
    request.send(formData)
  })
}
