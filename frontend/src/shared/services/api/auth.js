import { apiClient, initializeCsrfCookie } from './client.js'

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
