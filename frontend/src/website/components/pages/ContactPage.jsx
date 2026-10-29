import ContactSection from '@sections/contact/ContactSection.jsx'
import FloatingWhatsApp from '@sections/contact/FloatingWhatsApp.jsx'
import PageHero from '@shared/PageHero.jsx'

function ContactPage({ content, language }) {
  const phone = content.contact.details.find((detail) => detail.type === 'phone')?.value ?? ''

  return (
    <>
      <PageHero {...content.hero} />
      <ContactSection content={content.contact} />
      <FloatingWhatsApp phone={phone} label={content.contact.whatsappLabel} language={language} />
    </>
  )
}

export default ContactPage
