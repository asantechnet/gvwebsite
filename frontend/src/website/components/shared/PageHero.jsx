import { ArrowLeft } from "lucide-react";

import Breadcrumbs from "@ui/Breadcrumbs.jsx";
import Container from "@ui/Container.jsx";
import Section from "@ui/Section.jsx";
import { useLocalizedHref } from "@website/hooks/useWebsiteLanguage.js";

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
  const primaryActionHref = useLocalizedHref(primaryAction?.href);
  return (
    <Section
      padded={false}
      aria-labelledby="page-hero-title"
      className={`bg-background py-[50px] ${className}`.trim()}
      style={style}
    >
      <Container>
        <div className="relative isolate flex min-h-32 flex-col items-center justify-center overflow-hidden rounded-4xl border border-border bg-surface px-6 py-3 dark:border-gray-600 dark:bg-[#2b3442] md:min-h-36 md:px-10 md:py-4 lg:px-16">
          <div className="pointer-events-none absolute -right-16 -top-16 z-0 size-40 rounded-full bg-brand-orange/20 md:-right-16 md:-top-24 md:size-64" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 z-0 size-48 rounded-full bg-brand-red/15 md:-bottom-32 md:-left-16 md:size-72" />

          {image && (
            <img
              src={image}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full rounded-4xl object-cover"
            />
          )}

          <div className="relative z-20 order-1 mx-auto w-full max-w-2xl text-center lg:order-2">
            <h1
              id="page-hero-title"
              className="font-heading text-xl font-extrabold leading-tight text-foreground md:text-2xl lg:text-3xl"
            >
              {title}
            </h1>
            {description && (
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-foreground-muted md:text-base">
                {description}
              </p>
            )}
            <div className="mt-3 border-t border-border pt-2">
              <Breadcrumbs
                items={breadcrumbs}
                ariaLabel={breadcrumbLabel}
                centered
              />
            </div>
            {primaryAction && (
              <a
                href={primaryActionHref}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-brand-orange/20 transition-colors hover:bg-primary-hover focus-visible:bg-primary-hover"
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
