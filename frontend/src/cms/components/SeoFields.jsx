const copyByLanguage = {
  prs: { alt: 'متن جایگزین تصویر', title: 'عنوان SEO', description: 'توضیحات متا', recommended: 'پیشنهادی' },
  ps: { alt: 'د انځور بدیل متن', title: 'د SEO سرلیک', description: 'میټا تشریح', recommended: 'وړاندیز شوی' },
  en: { alt: 'Image alt text', title: 'SEO title', description: 'Meta description', recommended: 'Recommended' },
}

const inputClass = 'mt-2 min-h-11 w-full rounded-xl border border-(--editor-field-border) bg-(--editor-input) px-3.5 py-2.5 text-sm font-normal text-admin-heading outline-none transition focus:border-admin-brand'

function CharacterHint({ count, limit, language }) {
  const isLong = count > limit
  return <small className={`mt-1.5 block text-[.625rem] ${isLong ? 'text-red-600 dark:text-red-300' : 'text-admin-muted'}`}>{count}/{limit} · {copyByLanguage[language].recommended}</small>
}

function SeoFields({ language = 'prs', value, onChange }) {
  const copy = copyByLanguage[language] || copyByLanguage.prs
  const title = value.seoTitle || ''
  const description = value.metaDescription || ''
  return <>
    <label className="text-xs font-semibold text-admin-heading"><span>{copy.alt}</span><input className={inputClass} value={value.imageAlt || ''} onChange={(event) => onChange('imageAlt', event.target.value)} /></label>
    <label className="text-xs font-semibold text-admin-heading"><span>{copy.title}</span><input className={inputClass} value={title} maxLength="70" onChange={(event) => onChange('seoTitle', event.target.value)} /><CharacterHint count={title.length} limit={60} language={language} /></label>
    <label className="-mt-4 text-xs font-semibold text-admin-heading sm:col-span-2"><span>{copy.description}</span><textarea rows="3" maxLength="170" className={`${inputClass} resize-y leading-6`} value={description} onChange={(event) => onChange('metaDescription', event.target.value)} /><CharacterHint count={description.length} limit={160} language={language} /></label>
  </>
}

export default SeoFields
