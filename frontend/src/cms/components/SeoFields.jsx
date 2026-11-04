const copyByLanguage = {
  prs: { title: 'عنوان SEO', description: 'توضیحات متا', slug: 'نامک نشانی', socialImage: 'تصویر شبکه‌های اجتماعی', canonical: 'نشانی canonical', indexing: 'اجازه نمایش در موتورهای جستجو', preview: 'پیش‌نمایش نتیجه جستجو', recommended: 'پیشنهادی' },
  ps: { title: 'د SEO سرلیک', description: 'میټا تشریح', slug: 'د URL نوم', socialImage: 'د ټولنیزو رسنیو انځور', canonical: 'Canonical پته', indexing: 'د لټون انجنونو کې د ښودلو اجازه', preview: 'د لټون پایلې مخکتنه', recommended: 'وړاندیز شوی' },
  en: { title: 'SEO title', description: 'Meta description', slug: 'URL slug', socialImage: 'Social sharing image', canonical: 'Canonical URL', indexing: 'Allow search engine indexing', preview: 'Search result preview', recommended: 'Recommended' },
}

const inputClass = 'mt-2 min-h-11 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 py-2.5 text-sm font-normal text-admin-heading outline-none transition focus:border-admin-brand'

function CharacterHint({ count, limit, language }) {
  const isLong = count > limit
  return <small className={`mt-1.5 block text-[.625rem] ${isLong ? 'text-red-600 dark:text-red-300' : 'text-admin-muted'}`}>{count}/{limit} · {copyByLanguage[language].recommended}</small>
}

function SeoFields({ language = 'prs', value, slug, onSlugChange, onChange }) {
  const copy = copyByLanguage[language] || copyByLanguage.prs
  const title = value.seoTitle || ''
  const description = value.metaDescription || ''
  return <>
    <label className="text-xs font-semibold text-admin-heading"><span>{copy.title}</span><input className={inputClass} value={title} maxLength="70" onChange={(event) => onChange('seoTitle', event.target.value)} /><CharacterHint count={title.length} limit={60} language={language} /></label>
    <label className="text-xs font-semibold text-admin-heading"><span>{copy.slug}</span><input dir="ltr" className={`${inputClass} text-left`} value={slug} onChange={(event) => onSlugChange(event.target.value.replace(/\s+/g, '-'))} /></label>
    <label className="text-xs font-semibold text-admin-heading sm:col-span-2"><span>{copy.description}</span><textarea rows="3" maxLength="170" className={`${inputClass} resize-y leading-6`} value={description} onChange={(event) => onChange('metaDescription', event.target.value)} /><CharacterHint count={description.length} limit={160} language={language} /></label>
    <label className="text-xs font-semibold text-admin-heading"><span>{copy.socialImage}</span><input dir="ltr" className={`${inputClass} text-left`} value={value.socialImage || ''} placeholder="/assets/... or https://" onChange={(event) => onChange('socialImage', event.target.value)} /></label>
    <label className="text-xs font-semibold text-admin-heading"><span>{copy.canonical}</span><input dir="ltr" type="url" className={`${inputClass} text-left`} value={value.canonicalUrl || ''} placeholder="https://" onChange={(event) => onChange('canonicalUrl', event.target.value)} /></label>
    <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-4 text-xs font-semibold text-admin-heading sm:col-span-2">
      <span>{copy.indexing}</span>
      <button type="button" role="switch" aria-checked={value.allowIndexing !== false} onClick={() => onChange('allowIndexing', value.allowIndexing === false)} className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${value.allowIndexing !== false ? 'border-admin-brand bg-admin-brand' : 'border-admin-border bg-[var(--admin-toggle-off)]'}`}><span aria-hidden="true" className={`absolute top-1/2 start-1 size-3 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform ${value.allowIndexing !== false ? 'translate-x-4 rtl:-translate-x-4' : ''}`} /></button>
    </div>
    <div className="rounded-xl border border-admin-border bg-admin-control-soft p-4 sm:col-span-2">
      <span className="text-[.625rem] font-semibold text-admin-muted">{copy.preview}</span>
      <strong className="mt-2 block truncate text-sm text-[#1a0dab] dark:text-[#8ab4f8]">{title || value.title || '—'}</strong>
      <span dir="ltr" className="mt-1 block truncate text-left text-[.6875rem] text-emerald-700 dark:text-emerald-300">/{slug || 'page-slug'}</span>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-admin-muted">{description || value.excerpt || '—'}</p>
    </div>
  </>
}

export default SeoFields
