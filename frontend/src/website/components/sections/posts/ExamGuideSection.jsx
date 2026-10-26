import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";

import Container from "@ui/Container.jsx";
import Section from "@ui/Section.jsx";

function ExamGuideSection({ exam, content }) {
  return (
    <Section padded={false} className="bg-background py-6 md:py-10 lg:py-14">
      <Container>
        <div className="mx-auto mb-5 flex max-w-4xl flex-wrap items-center justify-start gap-2 text-right text-sm text-foreground-muted">
          <a
            href="/opportunities/exams"
            className="transition-colors hover:text-primary"
          >
            {content.ui.opportunities}
          </a>
          <span className="text-primary">/</span>
          <a
            href="/opportunities/exams"
            className="transition-colors hover:text-primary"
          >
            {content.breadcrumbs.exams}
          </a>
          <span className="text-primary">/</span>
          <span>{exam.name}</span>
        </div>
        <article className="mx-auto max-w-4xl overflow-hidden rounded-4xl border border-border bg-surface shadow-sm dark:border-gray-700 dark:bg-[#2b3442]">
          <div className="relative aspect-16/7">
            <img
              src={exam.image}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
            <h1 className="absolute inset-x-5 bottom-6 font-heading text-3xl font-extrabold text-white md:inset-x-10 md:text-5xl">
              {exam.name}
            </h1>
          </div>
          <div className="p-5 text-right md:p-10 lg:p-14">
            <p className="text-lg leading-9 text-foreground-muted">
              {exam.summary}
            </p>
            <p className="mt-5 rounded-2xl bg-primary/10 p-4 leading-8 text-foreground">
              {content.ui.examIntro}
            </p>
            <ul className="mt-8 space-y-4">
              {exam.sections.map((item) => (
                <li key={item} className="flex gap-3 text-foreground-muted">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-primary"
                    size={20}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href={exam.officialHref}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-[#fff8f3]! transition-colors hover:bg-primary-hover"
            >
              <ExternalLink aria-hidden="true" size={17} />
              {content.ui.officialSite}
            </a>
            <div className="mt-8 border-t border-border pt-5">
              <a
                href="/opportunities/exams"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary"
              >
                <ArrowLeft aria-hidden="true" size={17} />
                {content.ui.examGuides}
              </a>
            </div>
          </div>
        </article>
      </Container>
    </Section>
  );
}

export default ExamGuideSection;
