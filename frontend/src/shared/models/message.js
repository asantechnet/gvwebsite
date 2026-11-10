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
    replySubject: String(record.replySubject || record.reply_subject || ''),
    replyBody: String(record.replyBody || record.reply_body || ''),
    repliedAt: record.repliedAt || record.replied_at || null,
  }
}

export function serializeMessageState(unread) {
  return { unread: Boolean(unread) }
}
