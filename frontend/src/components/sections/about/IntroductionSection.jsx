import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function IntroductionSection({ content }) {
  return (
    <Section aria-labelledby="about-introduction-title" className="bg-background">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="about-introduction-title" className="font-heading text-2xl font-extrabold leading-tight text-foreground md:text-3xl lg:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-foreground-muted md:text-lg md:leading-9">{content.description}</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-1 md:gap-0">
          {content.values.map((value, index) => (
            <div key={value.title} className="relative px-1 text-center md:px-8 md:first:ps-0 md:last:pe-0 md:not-first:border-s md:border-border md:dark:border-gray-600">
              <span className="mx-auto flex size-7 items-center justify-center rounded-full border border-primary/50 text-[10px] font-black text-primary md:size-9 md:text-xs">
                0{index + 1}
              </span>
              <h3 className="mt-3 font-heading text-[11px] font-extrabold text-foreground sm:text-xs md:mt-4 md:text-base">{value.title}</h3>
              <p className="mx-auto mt-1 max-w-xs text-[9px] leading-4 text-foreground-muted sm:text-[10px] md:mt-2 md:text-xs md:leading-6">{value.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default IntroductionSection
