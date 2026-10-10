import { BadgeCheck, Eye, LockKeyhole, ShieldCheck } from 'lucide-react'

import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function StandardsSection({ content }) {
  const icons = [BadgeCheck, Eye, LockKeyhole, ShieldCheck]

  return (
    <Section aria-labelledby="about-standards-title" className="bg-background">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16">
          <div className="text-center md:text-start">
            <h2 id="about-standards-title" className="font-heading text-2xl font-extrabold leading-tight text-foreground md:text-3xl lg:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground-muted md:text-lg md:leading-9">{content.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            {content.items.map((item, index) => {
              const Icon = icons[index]

              return (
                <div key={item.title} className="text-center md:text-start">
                  <Icon aria-hidden="true" className="mx-auto text-primary md:mx-0" size={25} strokeWidth={1.8} />
                  <h3 className="mt-3 font-heading text-base font-extrabold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-foreground-muted">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default StandardsSection
