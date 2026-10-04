import { ArrowLeft, BriefcaseBusiness, Wrench } from "lucide-react";

import { headerNavigation } from "@/data/navigation.js";

const focusClasses =
  "focus:outline-none focus-visible:outline-none focus-visible:border-primary focus-visible:text-primary";

function FooterLink({ href, children }) {
  const isActive = window.location.pathname === href;

  return (
    <a
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex min-h-9 items-center border-b border-transparent text-sm transition-colors hover:text-primary dark:hover:text-primary ${focusClasses} ${isActive ? "font-extrabold text-primary" : "text-foreground-muted dark:text-gray-200"}`}
    >
      {children}
    </a>
  );
}

function Footer({ content, navigationContent, className = "" }) {
  const opportunities = headerNavigation.find(
    (item) => item.id === "opportunities",
  );
  const services = headerNavigation.find((item) => item.id === "services");
  const primaryLinks = headerNavigation.filter(
    (item) => !item.children?.length,
  );

  return (
    <footer
      className={`relative overflow-hidden border-t border-border bg-surface text-foreground dark:border-gray-600 dark:bg-gray-700 ${className}`.trim()}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-s-28 -top-28 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-36 -inset-e-20 size-80 rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-0 pt-12 sm:px-6 md:pb-0 md:pt-14 xl:px-8">
        <div className="grid gap-10 border-b border-border pb-10 text-center dark:border-gray-500 md:grid-cols-2 md:text-right lg:grid-cols-4 lg:gap-8">
          <div className="mx-auto flex max-w-md flex-col items-center md:mx-0 md:items-start">
            <a
              href="/"
              aria-label={navigationContent.homeLabel}
              className={`rounded-xl border border-border bg-white p-2 shadow-sm ${focusClasses}`}
            >
              <img
                src="/horizontal%20logo.webp"
                alt={navigationContent.logoAlt}
                width="1946"
                height="490"
                className="h-10 w-auto object-contain md:h-12"
              />
            </a>
            <p className="mt-5 text-xs leading-6 text-foreground-muted dark:text-gray-100 md:text-sm md:leading-7">
              {content.description}
            </p>
            <a
              href="/contact"
              className={`mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-5 text-sm font-bold text-brand-white shadow-lg transition-colors hover:border-primary-hover hover:bg-primary-hover ${focusClasses}`}
            >
              {content.consultationLabel}
              <ArrowLeft aria-hidden="true" className="size-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-6 md:contents">
            <nav aria-labelledby="footer-quick-links-heading">
              <h2
                id="footer-quick-links-heading"
                className="font-heading mb-4 text-base font-extrabold text-[#333] dark:text-gray-100"
              >
                {content.quickLinksHeading}
              </h2>
              <ul className="grid justify-items-center gap-1 md:justify-items-start">
                {primaryLinks.map((item) => (
                  <li key={item.id}>
                    <FooterLink href={item.href}>
                      {navigationContent.navigation[item.id]}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-opportunities-heading">
              <h2
                id="footer-opportunities-heading"
                className="font-heading mb-4 inline-flex items-center gap-2 text-base font-extrabold text-[#333] dark:text-gray-100"
              >
                <BriefcaseBusiness
                  aria-hidden="true"
                  className="size-4 text-primary"
                />
                {navigationContent.navigation.opportunities}
              </h2>
              <ul className="grid justify-items-center gap-1 md:justify-items-start">
                {opportunities.children.map((item) => (
                  <li key={item.id}>
                    <FooterLink href={item.href}>
                      {navigationContent.subNavigation.opportunities[item.id]}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <nav aria-labelledby="footer-services-heading">
            <h2
              id="footer-services-heading"
              className="font-heading mb-4 inline-flex items-center gap-2 text-base font-extrabold text-[#333] dark:text-gray-100"
            >
              <Wrench aria-hidden="true" className="size-4 text-primary" />
              {navigationContent.navigation.services}
            </h2>
            <ul className="grid grid-cols-1 justify-items-center gap-x-5 gap-y-1 sm:grid-cols-2 md:justify-items-start lg:grid-cols-1 xl:grid-cols-2">
              {services.children.map((item) => (
                <li key={item.id}>
                  <FooterLink href={item.href}>
                    {navigationContent.subNavigation.services[item.id]}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-4 text-center text-xs leading-6 text-foreground-muted dark:text-gray-300 sm:text-sm md:flex-row md:text-right">
          <p>{content.copyright}</p>
          <p>{content.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
