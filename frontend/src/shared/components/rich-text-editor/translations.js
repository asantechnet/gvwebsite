import en from './locales/en.json'
import prs from './locales/prs.json'
import ps from './locales/ps.json'

const youtubeCopy = {
  en: { youtubeUrl: 'YouTube video link', youtubeHelp: 'Paste a YouTube watch, Shorts, live, embed, or youtu.be link.', youtubeInvalid: 'Enter a valid YouTube video link.', orUploadVideo: 'or upload a video file' },
  prs: { youtubeUrl: 'لینک ویدیوی یوتیوب', youtubeHelp: 'لینک ویدیوی YouTube، Shorts، پخش زنده، embed یا youtu.be را وارد کنید.', youtubeInvalid: 'یک لینک معتبر ویدیوی یوتیوب وارد کنید.', orUploadVideo: 'یا فایل ویدیو بارگذاری کنید' },
  ps: { youtubeUrl: 'د یوټیوب ویډیو لینک', youtubeHelp: 'د YouTube، Shorts، ژوندۍ خپرونې، embed یا youtu.be لینک دننه کړئ.', youtubeInvalid: 'د یوټیوب ویډیو سم لینک دننه کړئ.', orUploadVideo: 'یا د ویډیو فایل پورته کړئ' },
}

export const editorTranslations = {
  en: { ...en, ...youtubeCopy.en },
  prs: { ...prs, ...youtubeCopy.prs },
  ps: { ...ps, ...youtubeCopy.ps },
}
