import { ArrowLeft } from "lucide-react";

import Breadcrumbs from "@ui/Breadcrumbs.jsx";
import Container from "@ui/Container.jsx";
import Section from "@ui/Section.jsx";

function PageHero({
  title,
  description,
  breadcrumbs = [],
  image,
  imageAlt = "",
  primaryAction,
  breadcrumbLabel = "Breadcrumb",
  className = "",
  style,
}) {
  return (
    <Section
      padded={false}
      aria-labelledby="page-hero-title"
      className={`bg-background py-6 md:py-10 lg:pb-[6.25rem] lg:pt-12 ${className}`.trim()}
      style={style}
    >
      <Container>
        <div className="relative isolate flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-4xl border border-border bg-surface px-6 py-4 dark:border-gray-600 dark:bg-[#2b3442] md:min-h-56 md:px-10 md:py-6 lg:px-16">
          <div className="pointer-events-none absolute -right-16 -top-16 -z-10 size-40 rounded-full bg-brand-orange/20 md:-right-16 md:-top-24 md:size-64" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 -z-10 size-48 rounded-full bg-brand-red/15 md:-bottom-32 md:-left-16 md:size-72" />

          {image && (
            <img
              src={image}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full rounded-4xl object-cover"
            />
          )}

          <div className="relative order-1 mx-auto w-full max-w-2xl text-center lg:order-2">
            <h1
              id="page-hero-title"
              className="font-heading text-2xl font-extrabold leading-tight text-foreground md:text-3xl lg:text-4xl"
            >
              {title}
            </h1>
            {description && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-foreground-muted md:text-lg">
                {description}
              </p>
            )}
            <div className="mt-5 border-t border-border pt-4">
              <Breadcrumbs
                items={breadcrumbs}
                ariaLabel={breadcrumbLabel}
                centered
              />
            </div>
            {primaryAction && (
              <a
                href={primaryAction.href}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-on-primary shadow-lg shadow-brand-orange/20 transition-colors hover:bg-primary-hover focus-visible:bg-primary-hover"
              >
                {primaryAction.label}
                <ArrowLeft aria-hidden="true" size={18} />
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default PageHero;
