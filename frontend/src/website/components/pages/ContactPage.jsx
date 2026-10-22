import ContactSection from '@sections/contact/ContactSection.jsx'
import PageHero from '@shared/PageHero.jsx'

function ContactPage({ content }) {
  return (
    <>
      <PageHero {...content.hero} />
      <ContactSection content={content.contact} />
    </>
  )
}

export default ContactPage
