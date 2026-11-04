const mediaPolicies = Object.freeze({
  image: { accept: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], maxBytes: 5 * 1024 * 1024 },
  video: { accept: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'], maxBytes: 50 * 1024 * 1024 },
  audio: { accept: ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/flac'], maxBytes: 20 * 1024 * 1024 },
  document: { accept: ['application/pdf'], maxBytes: 10 * 1024 * 1024 },
})

export function getUploadKind(file) {
  return Object.entries(mediaPolicies).find(([, policy]) => policy.accept.includes(file?.type))?.[0] || null
}

export function validateUploadFile(file, allowedKinds = Object.keys(mediaPolicies)) {
  if (typeof File === 'undefined' || !(file instanceof File)) return { code: 'missing', valid: false }
  const kind = getUploadKind(file)
  if (!kind || !allowedKinds.includes(kind)) return { code: 'type', valid: false }
  if (file.size <= 0) return { code: 'empty', valid: false }
  if (file.size > mediaPolicies[kind].maxBytes) return { code: 'size', kind, maxBytes: mediaPolicies[kind].maxBytes, valid: false }
  return { kind, valid: true }
}

export function createLocalUpload(file, allowedKinds) {
  const validation = validateUploadFile(file, allowedKinds)
  if (!validation.valid) return { ...validation, file }
  return {
    file,
    kind: validation.kind,
    name: file.name,
    previewUrl: URL.createObjectURL(file),
    size: file.size,
    valid: true,
  }
}

export function revokeLocalUpload(value) {
  const url = typeof value === 'string' ? value : value?.previewUrl || value?.url
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
}
