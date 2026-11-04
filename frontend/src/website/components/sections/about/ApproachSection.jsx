import { HeartHandshake, MessageCircle, Sparkles } from 'lucide-react'

import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function ApproachSection({ content }) {
  const icons = [MessageCircle, Sparkles, HeartHandshake]

  return (
    <Section aria-labelledby="about-approach-title" className="bg-surface-muted dark:bg-[#182230]">
      <Container>
        <h2 id="about-approach-title" className="text-center font-heading text-2xl font-extrabold leading-tight text-foreground md:text-3xl lg:text-4xl">
          {content.title}
        </h2>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {content.items.map((item, index) => {
            const Icon = icons[index]

            return (
              <article key={item.title} className="rounded-3xl bg-surface p-6 text-center dark:bg-[#2b3442] md:p-8">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-accent-text">
                  <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-heading text-lg font-extrabold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-foreground-muted">{item.description}</p>
              </article>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

export default ApproachSection
