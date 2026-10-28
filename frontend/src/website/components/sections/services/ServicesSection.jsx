import OpportunityDirectorySection from '@sections/opportunities/OpportunityDirectorySection.jsx'

function ServicesSection({ content, sidebarContent }) {
  const cards = content.services.map((service) => ({
    ...service,
    name: service.title,
    imageAlt: service.title,
    href: `/services/${service.slug}`,
  }))

  return <OpportunityDirectorySection content={sidebarContent} cards={cards} title={content.ui.indexTitle} />
}

export default ServicesSection
