import Container from '@ui/Container.jsx'
import Section from '@ui/Section.jsx'

function TeamSection({ content }) {
  return (
    <Section aria-labelledby="about-team-title" className="bg-surface-muted dark:bg-[#182230]">
      <Container>
        <h2 id="about-team-title" className="text-center font-heading text-xl font-extrabold leading-tight text-foreground md:text-2xl lg:text-3xl">
          {content.title}
        </h2>

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {content.members.map((member, index) => (
            <article key={member.role} className="group relative overflow-hidden rounded-[2rem] border border-border bg-surface pb-6 text-center [perspective:800px] dark:border-gray-600 dark:bg-[#2b3442] md:pb-7">
              <div className={`h-2 ${index % 2 === 0 ? 'bg-brand-orange' : 'bg-brand-red'}`} />
              <div className="relative mx-auto -mt-1 flex size-28 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-md shadow-black/10 dark:bg-[#374151] dark:shadow-black/25 md:size-32">
                <img
                  src={member.avatar}
                  alt={member.avatarAlt}
                  className="size-full rounded-full object-cover grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                />
                <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full -rotate-90">
                  <circle cx="50" cy="50" r="47" fill="none" stroke="var(--brand-orange)" strokeWidth="2.5" strokeDasharray="295" strokeDashoffset="295" pathLength="295" className="transition-[stroke-dashoffset] duration-1000 ease-out group-hover:[stroke-dashoffset:0]" />
                </svg>
              </div>
              <h3 className="mt-4 px-2 font-heading text-sm font-extrabold text-foreground md:text-base">{member.name}</h3>
              <p className="mx-auto mt-2 w-fit rounded-full bg-surface-muted px-3 py-1 text-[11px] leading-5 text-foreground-muted dark:bg-gray-800 dark:text-gray-300 md:text-xs">{member.role}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default TeamSection
