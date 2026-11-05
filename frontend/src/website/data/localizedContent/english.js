import about from '@website/locales/en/about.json'
import contact from '@website/locales/en/contact.json'
import footer from '@website/locales/en/footer.json'
import guides from '@website/locales/en/guides.json'
import header from '@website/locales/en/header.json'
import home from '@website/locales/en/home.json'
import magazine from '@website/locales/en/magazine.json'
import opportunities from '@website/locales/en/opportunities.json'
import scholarships from '@website/locales/en/scholarships.json'
import search from '@website/locales/en/search.json'
import services from '@website/locales/en/services.json'
import tourism from '@website/locales/en/tourism.json'
import { localizeContentHrefs } from '@website/utils/language.js'

export default localizeContentHrefs({
  about,
  contact,
  footer,
  guides,
  header,
  home,
  magazine,
  opportunities,
  scholarships,
  search,
  services,
  tourism,
}, 'en')
