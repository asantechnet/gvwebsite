import ContactSection from '@sections/contact/ContactSection.jsx'
import FloatingWhatsApp from '@sections/contact/FloatingWhatsApp.jsx'
import PageHero from '@shared/PageHero.jsx'

function ContactPage({ content, language }) {
  const whatsappNumber = content.contact.details.find((detail) => detail.type === 'whatsapp')?.value ?? ''

  return (
    <>
      {content.hero.visible !== false && <PageHero {...content.hero} />}
      <ContactSection content={content.contact} language={language} />
      <FloatingWhatsApp phone={whatsappNumber} label={content.contact.whatsappLabel} language={language} />
    </>
  )
}

export default ContactPage
