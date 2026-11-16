import { ArrowRight } from 'lucide-react'
import { useLocalizedHref } from '@website/hooks/useWebsiteLanguage.js'

import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function NotFoundPage({ content }) {
  const homeHref = useLocalizedHref('/')
  return <Section className="bg-background"><Container><div className="mx-auto max-w-2xl rounded-4xl border border-border bg-surface p-10 text-center"><p className="font-heading text-7xl font-extrabold text-accent-text">404</p><h1 className="mt-4 font-heading text-3xl font-extrabold text-foreground">{content.notFoundTitle}</h1><p className="mt-3 leading-8 text-foreground-muted">{content.notFoundDescription}</p><a href={homeHref} className="mt-7 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold !text-[#fff8f3]"><ArrowRight aria-hidden="true" size={16} />{content.home}</a></div></Container></Section>
}

export default NotFoundPage
