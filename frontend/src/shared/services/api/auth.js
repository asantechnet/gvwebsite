import { apiClient } from './client.js'
import { apiConfig } from './config.js'

async function initializeCsrfCookie() {
  const url = new URL(apiConfig.baseUrl, window.location.origin)
  url.pathname = url.pathname.replace(/\/api\/?$/, '/sanctum/csrf-cookie')
  url.search = ''
  const response = await fetch(url, {
    credentials: apiConfig.credentials,
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
  })
  if (!response.ok) throw new Error('The secure login session could not be initialized.')
}

async function postWithCsrf(path, values, options) {
  await initializeCsrfCookie()
  return apiClient.post(path, values, options)
}

export const authApi = Object.freeze({
  csrf: initializeCsrfCookie,
  session: (options) => apiClient.get('/auth/session', options),
  async login(credentials, options) {
    return postWithCsrf('/auth/login', credentials, options)
  },
  forgotPassword: (values, options) => postWithCsrf('/auth/forgot-password', values, options),
  resetPassword: (values, options) => postWithCsrf('/auth/reset-password', values, options),
  logout: (options) => apiClient.post('/auth/logout', undefined, options),
  changePassword: (values, options) => apiClient.put('/auth/password', values, options),
})
