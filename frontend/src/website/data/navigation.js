export const headerNavigation = [
  { id: 'home', href: '/' },
  {
    id: 'opportunities',
    href: '/opportunities',
    children: [
      { id: 'study', href: '/opportunities/study' },
      { id: 'migration', href: '/opportunities/migration' },
      { id: 'work', href: '/opportunities/work' },
      { id: 'exams', href: '/opportunities/exams' },
      { id: 'destinationCountry', href: '/opportunities/country' },
    ],
  },
  {
    id: 'services',
    href: '/services',
    children: [
      { id: 'consultation', href: '/services/consultation' },
      { id: 'scholarshipRegistration', href: '/services/scholarship-registration' },
      { id: 'examRegistration', href: '/services/exam-registration' },
      { id: 'migrationRegistration', href: '/services/migration-registration' },
      { id: 'documentPreparation', href: '/services/document-preparation' },
      { id: 'documentProcess', href: '/services/document-process' },
      { id: 'visaResidence', href: '/services/visa' },
    ],
  },
  { id: 'scholarships', href: '/scholarships' },
  { id: 'magazine', href: '/magazine' },
  { id: 'about', href: '/about' },
  { id: 'contact', href: '/contact' },
]
