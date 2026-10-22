import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'
import ActionLink from '@ui/ActionLink.jsx'

function AboutCtaSection({ content }) {
  return (
    <Section aria-labelledby="about-cta-title" className="bg-background">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="about-cta-title" className="font-heading text-xl font-extrabold leading-tight text-foreground md:text-2xl lg:text-3xl">
            {content.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-foreground-muted md:text-lg md:leading-9">{content.description}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <ActionLink href={content.primaryAction.href}>{content.primaryAction.label}</ActionLink>
            <ActionLink href={content.secondaryAction.href} variant="secondary">
              {content.secondaryAction.label}
            </ActionLink>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default AboutCtaSection
