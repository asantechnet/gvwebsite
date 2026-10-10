import { Mail, MapPin, Phone } from 'lucide-react'

import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function ContactSection({ content }) {
  return (
    <Section aria-labelledby="contact-section-title" className="bg-background">
      <Container>
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand-orange to-brand-red p-7 text-center text-brand-white sm:p-9 lg:text-start">
            <h2 id="contact-section-title" className="font-heading text-xl font-extrabold leading-tight md:text-2xl lg:text-3xl">
              {content.title}
            </h2>
            <p className="mt-4 text-sm leading-8 text-brand-white/85 md:text-base md:leading-9">{content.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {content.details.map((detail) => {
                const icons = { phone: Phone, email: Mail, address: MapPin }
                const Icon = icons[detail.type]

                return (
                  <div key={detail.type} className="flex items-center justify-center gap-3 text-center lg:justify-start lg:text-start">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-white/15 text-brand-white">
                      <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-xs text-brand-white/70">{detail.label}</p>
                      <p className="mt-1 text-sm font-bold text-brand-white">{detail.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <form className="rounded-[2rem] border border-border bg-surface p-5 dark:border-gray-600 dark:bg-[#2b3442] sm:p-8" onSubmit={(event) => event.preventDefault()}>
            <h3 className="font-heading text-xl font-extrabold text-foreground md:text-2xl">{content.form.title}</h3>
            <p className="mt-2 text-sm leading-7 text-foreground-muted">{content.form.description}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-foreground">
                {content.form.nameLabel}
                <input className="min-h-12 rounded-xl border border-border bg-background px-4 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-foreground-muted focus:border-primary dark:border-gray-600 dark:bg-[#1f2937]" type="text" placeholder={content.form.namePlaceholder} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-foreground">
                {content.form.phoneLabel}
                <input className="min-h-12 rounded-xl border border-border bg-background px-4 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-foreground-muted focus:border-primary dark:border-gray-600 dark:bg-[#1f2937]" type="tel" placeholder={content.form.phonePlaceholder} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-foreground sm:col-span-2">
                {content.form.emailLabel}
                <input className="min-h-12 rounded-xl border border-border bg-background px-4 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-foreground-muted focus:border-primary dark:border-gray-600 dark:bg-[#1f2937]" type="email" placeholder={content.form.emailPlaceholder} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-foreground sm:col-span-2">
                {content.form.messageLabel}
                <textarea className="min-h-32 resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm font-normal leading-7 text-foreground outline-none transition-colors placeholder:text-foreground-muted focus:border-primary dark:border-gray-600 dark:bg-[#1f2937]" placeholder={content.form.messagePlaceholder} />
              </label>
            </div>
            <button type="submit" className="mt-6 min-h-12 w-full rounded-xl bg-primary px-6 font-bold text-on-primary transition-colors hover:bg-primary-hover focus-visible:bg-primary-hover">
              {content.form.submitLabel}
            </button>
          </form>
        </div>
      </Container>
    </Section>
  )
}

export default ContactSection
