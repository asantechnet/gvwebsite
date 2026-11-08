import { ExternalLink, MapPin, Search } from 'lucide-react'
import { useState } from 'react'

const defaultQuery = 'Global Vision, Kabul, Afghanistan'

function getMapQuery(value) {
  try {
    return new URL(value).searchParams.get('q') || defaultQuery
  } catch {
    return defaultQuery
  }
}

function createEmbedUrl(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query.trim())}&z=15&output=embed`
}

function createGoogleMapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`
}

function MapPicker({ value, onChange, content }) {
  const [query, setQuery] = useState(() => getMapQuery(value))

  const selectLocation = (event) => {
    event.preventDefault()
    const nextQuery = query.trim()
    if (nextQuery) onChange(createEmbedUrl(nextQuery))
  }

  return <div className="grid gap-3">
    <form className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={selectLocation}>
      <label className="relative block min-w-0">
        <span className="mb-2 block text-[.75rem] font-semibold text-admin-heading">{content.searchLabel}</span>
        <Search size={16} className="pointer-events-none absolute end-3 bottom-3.5 text-admin-muted" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={content.searchPlaceholder} className="min-h-11 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 pe-10 text-sm font-normal text-admin-heading outline-none transition placeholder:text-admin-muted focus:border-admin-brand" />
      </label>
      <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-xl border border-admin-brand bg-admin-brand px-4 text-xs font-semibold text-white transition hover:bg-orange-500"><MapPin size={15} />{content.select}</button>
    </form>
    <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-control-soft">
      <iframe title={content.previewTitle} src={value || createEmbedUrl(query)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full border-0 sm:h-80" />
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="m-0 text-[.6875rem] leading-5 text-admin-muted">{content.help}</p>
      <a href={createGoogleMapsUrl(query)} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1.5 rounded-xl border border-admin-border bg-admin-control px-3 text-[.6875rem] font-semibold text-admin-muted transition hover:border-admin-brand hover:text-admin-brand-text">{content.openGoogleMaps}<ExternalLink size={13} /></a>
    </div>
  </div>
}

export default MapPicker
