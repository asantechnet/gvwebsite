import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function OurStorySection({ content }) {
  return (
    <Section aria-labelledby="about-story-title" className="bg-background">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="about-story-title" className="font-heading text-xl font-extrabold leading-tight text-foreground md:text-2xl lg:text-3xl">
            {content.title}
          </h2>
        </div>

        <div className="relative mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3 md:gap-0">
          <div aria-hidden="true" className="absolute inset-x-[16%] top-5 hidden h-px bg-border md:block dark:bg-gray-600" />
          {content.milestones.map((milestone, index) => (
            <article key={milestone.title} className="relative text-center md:px-8">
              <div className="relative z-10 mx-auto flex size-10 items-center justify-center rounded-full border-4 border-background bg-primary text-sm font-black text-brand-white dark:border-gray-800">
                {index + 1}
              </div>
              <h3 className="mt-5 font-heading text-lg font-extrabold text-foreground">{milestone.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-7 text-foreground-muted">{milestone.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default OurStorySection
