import { apiConfig } from './config.js'
import { ApiError, normalizeApiError } from './errors.js'

function readCookie(name) {
  if (typeof document === 'undefined') return ''
  const cookie = document.cookie.split('; ').find((entry) => entry.startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : ''
}

export function getCsrfToken() {
  return readCookie('XSRF-TOKEN')
}

export async function initializeCsrfCookie() {
  const url = new URL(apiConfig.baseUrl, window.location.origin)
  url.pathname = url.pathname.replace(/\/api\/?$/, '/sanctum/csrf-cookie')
  url.search = ''
  const response = await fetch(url, {
    credentials: apiConfig.credentials,
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
  })
  if (!response.ok) throw new ApiError('The secure session could not be initialized.', { code: 'http', status: response.status })
}

function createUrl(path, query) {
  const url = /^https?:\/\//i.test(path) ? new URL(path) : new URL(`${apiConfig.baseUrl}/${String(path).replace(/^\//, '')}`, window.location.origin)
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  })
  return url
}

async function parseResponse(response) {
  if (response.status === 204) return null
  const type = response.headers.get('content-type') || ''
  return type.includes('application/json') ? response.json() : response.text()
}

export async function apiRequest(path, options = {}) {
  const { body, headers, query, signal, timeout = apiConfig.timeout, ...requestOptions } = options
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort('timeout'), timeout)
  const abort = () => controller.abort(signal?.reason)
  if (signal?.aborted) controller.abort(signal.reason)
  else signal?.addEventListener('abort', abort, { once: true })
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const csrfToken = getCsrfToken()

  try {
    const response = await fetch(createUrl(path, query), {
      ...requestOptions,
      credentials: apiConfig.credentials,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(!isFormData && body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
        ...headers,
      },
      body: body === undefined || isFormData ? body : JSON.stringify(body),
    })
    const payload = await parseResponse(response)

    if (!response.ok) {
      const code = response.status === 401 ? 'unauthenticated' : response.status === 403 ? 'forbidden' : response.status === 422 ? 'validation' : 'http'
      if (code === 'unauthenticated' && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('globalvision:session-expired'))
      throw new ApiError(payload?.message || `Request failed with status ${response.status}.`, { code, status: response.status, details: payload?.errors || payload })
    }

    return payload?.data ?? payload
  } catch (error) {
    if (controller.signal.reason === 'timeout') throw new ApiError('The request timed out.', { code: 'timeout', cause: error })
    throw normalizeApiError(error)
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abort)
  }
}

export const apiClient = Object.freeze({
  get: (path, options) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options) => apiRequest(path, { ...options, body, method: 'POST' }),
  put: (path, body, options) => apiRequest(path, { ...options, body, method: 'PUT' }),
  patch: (path, body, options) => apiRequest(path, { ...options, body, method: 'PATCH' }),
  delete: (path, options) => apiRequest(path, { ...options, method: 'DELETE' }),
})
