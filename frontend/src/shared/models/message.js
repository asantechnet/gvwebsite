export function normalizeMessage(record = {}) {
  const createdAt = record.createdAt || record.created_at || new Date().toISOString()

  return {
    id: String(record.id ?? ''),
    title: String(record.title || record.name || ''),
    email: String(record.email || ''),
    service: String(record.service || record.subject || ''),
    timeline: String(record.timeline || ''),
    body: String(record.body || record.message || record.quote || ''),
    createdAt: Number.isNaN(Date.parse(createdAt)) ? new Date().toISOString() : createdAt,
    unread: record.unread === undefined ? !record.readAt && !record.read_at : Boolean(record.unread),
  }
}

export function serializeMessageState(unread) {
  return { unread: Boolean(unread) }
}
