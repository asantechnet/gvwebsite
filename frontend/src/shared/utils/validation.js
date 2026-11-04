const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeText(value, maxLength = 10000) {
  return String(value ?? '').trim().slice(0, maxLength)
}

export function validateContactForm(values) {
  const normalized = {
    name: normalizeText(values.name, 120),
    email: normalizeText(values.email, 254).toLocaleLowerCase(),
    subject: normalizeText(values.subject, 180),
    message: normalizeText(values.message, 5000),
  }
  const errors = {}
  if (normalized.name.length < 2) errors.name = 'required'
  if (!emailPattern.test(normalized.email)) errors.email = 'email'
  if (normalized.subject.length < 2) errors.subject = 'required'
  if (normalized.message.length < 10) errors.message = 'required'
  return { errors, valid: Object.keys(errors).length === 0, values: normalized }
}

export function validatePasswordChange({ currentPassword, password, confirmPassword }) {
  const errors = {}
  if (!currentPassword) errors.currentPassword = 'required'
  if (String(password || '').length < 12) errors.password = 'minLength'
  if (password !== confirmPassword) errors.confirmPassword = 'mismatch'
  return { errors, valid: Object.keys(errors).length === 0 }
}
