const configuredBaseUrl = import.meta.env?.VITE_API_BASE_URL?.trim()

export const apiConfig = Object.freeze({
  baseUrl: (configuredBaseUrl || '/api').replace(/\/$/, ''),
  credentials: 'include',
  timeout: Number(import.meta.env?.VITE_API_TIMEOUT_MS) || 15000,
})

export const dataSourceMode = import.meta.env?.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock'
