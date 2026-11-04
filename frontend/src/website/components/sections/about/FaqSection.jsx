import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import Container from '@ui/Container.jsx'
import Button from '@ui/Button.jsx'
import Section from '@ui/Section.jsx'

function FaqSection({ content }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <Section aria-labelledby="about-faq-title" className="bg-surface-muted dark:bg-[#182230]">
      <Container>
        <h2 id="about-faq-title" className="text-center font-heading text-xl font-extrabold leading-tight text-foreground md:text-2xl lg:text-3xl">
          {content.title}
        </h2>

        <div className="mx-auto mt-10 grid max-w-3xl gap-3">
          {content.items.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div key={item.question} className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${isOpen ? 'border-primary/60 bg-surface' : 'border-border bg-surface/60 dark:border-gray-600'} dark:bg-[#2b3442]`}>
                <Button
                  unstyled
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`about-faq-answer-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex min-h-12 w-full items-center justify-between gap-4 px-5 py-2 text-start font-heading text-sm font-extrabold text-foreground md:px-6 md:py-2.5 md:text-base"
                >
                  <span>{item.question}</span>
                  <ChevronDown aria-hidden="true" className={`shrink-0 text-accent-text transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
                </Button>
                <div id={`about-faq-answer-${index}`} className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="min-h-0 overflow-hidden">
                    <p className="border-t border-border/70 px-5 pb-5 pt-4 text-sm leading-7 text-foreground-muted md:px-6 dark:border-gray-600">{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

export default FaqSection
