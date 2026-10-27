import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTelegram } from 'react-icons/fa6'
import { useState } from 'react'

import Container from '@ui/Container.jsx'
import Button from '@ui/Button.jsx'
import Section from '@ui/Section.jsx'

function ContactSection({ content }) {
  const [formStatus, setFormStatus] = useState('idle')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) {
      setFormStatus('error')
      event.currentTarget.reportValidity()
      return
    }
    setFormStatus('success')
  }

  return (
    <Section padded={false} aria-labelledby="contact-section-title" className="bg-background pb-12.5 pt-0 text-foreground">
      <Container>
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="mx-auto w-full max-w-sm text-right lg:order-1">
            <h2 id="contact-section-title" className="font-heading text-xl font-extrabold leading-tight md:text-2xl lg:text-3xl">
              {content.title}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {content.details.map((detail) => {
                const icons = { phone: Phone, email: Mail, address: MapPin }
                const Icon = icons[detail.type]

                return (
                  <div key={detail.type} className="flex items-center justify-start gap-4 text-right">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary">
                      <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-xs text-foreground-muted">{detail.label}</p>
                      <p dir={detail.type === 'phone' ? 'ltr' : undefined} className={`mt-1 text-sm font-bold text-foreground ${detail.type === 'phone' ? 'whitespace-nowrap text-right' : ''}`}>{detail.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-10 flex items-center justify-start gap-3" aria-label={content.socialLabel}>
              {content.socials.map((social) => {
                const icons = { facebook: FaFacebookF, instagram: FaInstagram, linkedin: FaLinkedinIn, telegram: FaTelegram }
                const Icon = icons[social.type]

                return (
                  <span key={social.type} aria-label={social.label} title={social.label} className="flex size-10 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors hover:border-primary hover:text-primary dark:border-gray-600">
                    <Icon aria-hidden="true" size={17} />
                  </span>
                )
              })}
            </div>
          </div>

          <form className="mx-auto w-full max-w-md text-right lg:order-2" onSubmit={handleSubmit} noValidate>
            <h3 className="sr-only">{content.form.title}</h3>
            <p className="sr-only">{content.form.description}</p>
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {content.form.nameLabel}
                <input required name="name" autoComplete="name" className="min-h-12 rounded-xl border border-border bg-surface-muted px-3 text-right text-sm font-light text-foreground outline-none transition-colors focus:border-primary dark:border-gray-600 dark:bg-[#2b3442]" type="text" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {content.form.emailLabel}
                <input required name="email" autoComplete="email" dir="ltr" className="min-h-12 rounded-xl border border-border bg-surface-muted px-3 text-right text-sm font-light text-foreground outline-none transition-colors focus:border-primary dark:border-gray-600 dark:bg-[#2b3442]" type="email" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {content.form.subjectLabel}
                <input required name="subject" className="min-h-12 rounded-xl border border-border bg-surface-muted px-3 text-right text-sm font-light text-foreground outline-none transition-colors focus:border-primary dark:border-gray-600 dark:bg-[#2b3442]" type="text" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {content.form.messageLabel}
                <textarea required name="message" className="min-h-32 resize-y rounded-xl border border-border bg-surface-muted px-3 py-2 text-right text-sm font-light leading-7 text-foreground outline-none transition-colors focus:border-primary dark:border-gray-600 dark:bg-[#2b3442]" />
              </label>
            </div>
            <Button type="submit" icon={Send} className="mt-6 min-h-10 w-full border-brand-orange bg-brand-orange px-4 text-center text-sm shadow-md shadow-brand-orange/20 hover:border-primary-hover hover:bg-primary-hover hover:shadow-lg hover:shadow-brand-orange/30 sm:w-32">
              {formStatus === 'sending' ? content.form.sendingLabel : content.form.submitLabel}
            </Button>
            <p aria-live="polite" className={`mt-4 text-sm ${formStatus === 'error' ? 'text-brand-red' : 'text-primary'}`}>{formStatus === 'success' ? content.form.successMessage : formStatus === 'error' ? content.form.requiredMessage : ''}</p>
          </form>
        </div>
        <div className="mx-auto mt-12 w-full max-w-5xl overflow-hidden rounded-3xl border border-border dark:border-gray-700">
          <iframe
            title={content.mapTitle}
            src="https://www.google.com/maps?q=34.529568145213474,69.17050772740252&z=15&output=embed"
            className="h-72 w-full rounded-2xl border-0 sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </Section>
  )
}

export default ContactSection
