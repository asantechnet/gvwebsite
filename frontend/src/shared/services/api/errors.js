export class ApiError extends Error {
  constructor(message, { code = 'unknown', status = 0, details = null, cause } = {}) {
    super(message, { cause })
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export function normalizeApiError(error) {
  if (error instanceof ApiError) return error
  if (error?.name === 'AbortError') return new ApiError('The request was cancelled.', { code: 'cancelled', cause: error })
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return new ApiError('You appear to be offline.', { code: 'offline', cause: error })
  return new ApiError('The request could not be completed.', { code: 'network', cause: error })
}
