import { apiClient } from './client.js'

export const mapsApi = Object.freeze({
  resolve: (url, options) => apiClient.post('/cms/map-link', { url }, options),
})
