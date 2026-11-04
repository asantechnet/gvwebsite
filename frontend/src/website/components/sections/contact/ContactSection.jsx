import { Mail, MapPin, Music2, Phone, Send } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTelegram, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { useState } from 'react'

import Container from '@ui/Container.jsx'
import Button from '@ui/Button.jsx'
import Section from '@ui/Section.jsx'
import { dataSource } from '@/shared/services/data/index.js'
import { validateContactForm } from '@/shared/utils/validation.js'

function ContactSection({ content }) {
  const [formStatus, setFormStatus] = useState('idle')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const result = validateContactForm(Object.fromEntries(new FormData(form)))
    if (!form.checkValidity() || !result.valid) {
      setFormStatus('error')
      form.reportValidity()
      return
    }
    setFormStatus('sending')
    try {
      await dataSource.contact.submit(result.values)
      form.reset()
      setFormStatus('success')
    } catch {
      setFormStatus('error')
    }
  }

  return (
    <Section padded={false} aria-labelledby="contact-section-title" className="bg-background pb-12.5 pt-0 text-foreground">
      <Container>
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="mx-auto w-full max-w-sm text-start lg:order-1">
            <h2 id="contact-section-title" className="font-heading text-xl font-extrabold leading-tight md:text-2xl lg:text-3xl">
              {content.title}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {content.details.map((detail) => {
                const icons = { phone: Phone, email: Mail, address: MapPin }
                const Icon = icons[detail.type]

                return (
                  <div key={detail.type} className="flex items-center justify-start gap-4 text-start">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/50 text-accent-text">
                      <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-xs text-foreground-muted">{detail.label}</p>
                      {detail.type === 'phone' || detail.type === 'email' ? <a href={detail.type === 'phone' ? `tel:${detail.value.replaceAll(' ', '')}` : `mailto:${detail.value}`} dir="ltr" className={`mt-1 block text-sm font-bold text-foreground transition-colors hover:text-accent-text ${detail.type === 'phone' ? 'whitespace-nowrap' : ''}`}>{detail.value}</a> : <p className="mt-1 text-sm font-bold text-foreground">{detail.value}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-10 flex items-center justify-start gap-3" aria-label={content.socialLabel}>
              {content.socials.map((social) => {
                const icons = { facebook: FaFacebookF, instagram: FaInstagram, linkedin: FaLinkedinIn, telegram: FaTelegram, youtube: FaYoutube, whatsapp: FaWhatsapp, twitter: FaXTwitter, tiktok: Music2 }
                const Icon = icons[social.type] || Music2

                return (
                  <span key={social.type} title={social.label} className="flex size-10 items-center justify-center rounded-full border border-border text-foreground-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-accent-text dark:border-gray-600">
                    <Icon aria-hidden="true" size={17} />
                  </span>
                )
              })}
            </div>
          </div>

          <form className="mx-auto w-full max-w-md text-start lg:order-2" onSubmit={handleSubmit} noValidate>
            <h3 className="sr-only">{content.form.title}</h3>
            <p className="sr-only">{content.form.description}</p>
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {content.form.nameLabel}
                <input required minLength={2} maxLength={120} name="name" autoComplete="name" placeholder={content.form.namePlaceholder} className="min-h-12 rounded-xl border border-border bg-surface-muted px-3 text-start text-sm font-light text-foreground outline-none transition-colors focus:border-primary dark:border-gray-600 dark:bg-[#2b3442]" type="text" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {content.form.emailLabel}
                <input required maxLength={254} name="email" autoComplete="email" placeholder={content.form.emailPlaceholder} dir="ltr" className="min-h-12 rounded-xl border border-border bg-surface-muted px-3 text-start text-sm font-light text-foreground outline-none transition-colors focus:border-primary dark:border-gray-600 dark:bg-[#2b3442]" type="email" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {content.form.subjectLabel}
                <input required minLength={2} maxLength={180} name="subject" placeholder={content.form.subjectPlaceholder} className="min-h-12 rounded-xl border border-border bg-surface-muted px-3 text-start text-sm font-light text-foreground outline-none transition-colors focus:border-primary dark:border-gray-600 dark:bg-[#2b3442]" type="text" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {content.form.messageLabel}
                <textarea required minLength={10} maxLength={5000} name="message" placeholder={content.form.messagePlaceholder} className="min-h-32 resize-y rounded-xl border border-border bg-surface-muted px-3 py-2 text-start text-sm font-light leading-7 text-foreground outline-none transition-colors focus:border-primary dark:border-gray-600 dark:bg-[#2b3442]" />
              </label>
            </div>
            <Button type="submit" icon={Send} disabled={formStatus === 'sending'} aria-busy={formStatus === 'sending'} className="mt-6 min-h-10 w-full border-brand-orange bg-brand-orange px-4 text-center text-sm shadow-md shadow-brand-orange/20 hover:border-primary-hover hover:bg-primary-hover hover:shadow-lg hover:shadow-brand-orange/30 disabled:cursor-wait disabled:opacity-70 sm:w-32">
              {formStatus === 'sending' ? content.form.sendingLabel : content.form.submitLabel}
            </Button>
            <p aria-live="polite" className={`mt-4 text-sm ${formStatus === 'error' ? 'text-brand-red' : 'text-accent-text'}`}>{formStatus === 'success' ? content.form.successMessage : formStatus === 'error' ? content.form.requiredMessage : ''}</p>
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
