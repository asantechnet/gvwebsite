import { LoaderCircle, MapPin } from 'lucide-react'
import { useRef, useState } from 'react'

import { mapsApi } from '@/shared/services/api/maps.js'

function readLocation(value) {
  if (!value) return ''
  try {
    return new URL(value).searchParams.get('q') || ''
  } catch {
    return ''
  }
}

function createMapUrl(location) {
  const query = location.trim()
  return query ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed` : ''
}

function isUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value.trim()).protocol)
  } catch {
    return false
  }
}

function MapPicker({ value, onChange, content, direction = 'ltr' }) {
  const [location, setLocation] = useState(() => readLocation(value))
  const [status, setStatus] = useState('idle')
  const requestId = useRef(0)

  const updateLocation = (nextLocation) => {
    setLocation(nextLocation)
    setStatus('idle')
    if (!isUrl(nextLocation)) onChange(createMapUrl(nextLocation))
  }

  const resolveLocation = async (nextLocation = location) => {
    const url = nextLocation.trim()
    if (!isUrl(url)) return
    const currentRequest = ++requestId.current
    setStatus('loading')
    try {
      const result = await mapsApi.resolve(url)
      if (requestId.current !== currentRequest) return
      setLocation(result.location)
      onChange(result.embedUrl)
      setStatus('success')
    } catch {
      if (requestId.current === currentRequest) setStatus('error')
    }
  }

  return <div className="grid gap-2">
    <label className="relative block min-w-0">
      <span className="mb-2 block text-[.75rem] font-semibold text-admin-heading">{content.locationLabel}</span>
      {status === 'loading' ? <LoaderCircle size={16} className="pointer-events-none absolute end-3 bottom-3.5 animate-spin text-admin-brand-text" /> : <MapPin size={16} className="pointer-events-none absolute end-3 bottom-3.5 text-admin-muted" />}
      <input type="text" dir={direction} value={location} onChange={(event) => updateLocation(event.target.value)} onPaste={(event) => { const pasted = event.clipboardData.getData('text'); if (isUrl(pasted)) window.setTimeout(() => resolveLocation(pasted), 0) }} onBlur={() => resolveLocation()} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); resolveLocation() } }} placeholder={content.locationPlaceholder} className="min-h-11 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 pe-10 text-start text-sm font-normal text-admin-heading outline-none transition placeholder:text-start placeholder:text-admin-muted focus:border-admin-brand" />
    </label>
    {status === 'error' && <span role="alert" className="text-xs font-semibold text-red-600 dark:text-red-300">{content.linkError}</span>}
  </div>
}

export default MapPicker
