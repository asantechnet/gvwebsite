# Phase 5 SEO report

Completed: 2026-11-04

## Result

The public website now has a centralized multilingual metadata system and build-time SEO snapshots for all currently indexable Dari, Pashto, and English routes. The current static content produces 258 localized URLs. Search results, unknown routes, maintenance mode, and the CMS are excluded from indexing.

## Implemented

- Unique localized title and description resolution for directory and detail routes.
- Clean self-referencing canonicals without search parameters; service aliases canonicalize to the primary slug.
- `fa-AF`, `ps-AF`, `en`, and `x-default` alternate links in page heads and the sitemap.
- Open Graph and Twitter Card metadata with absolute image URLs.
- JSON-LD graphs for `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `BlogPosting`, and `Service`. No unsupported ratings, addresses, or educational-organization claims were invented.
- `noindex` handling for search, 404/unknown routes, maintenance mode, and all CMS routes. Apache responses also send `X-Robots-Tag` for `/dashboard`.
- Build-generated localized HTML metadata snapshots, `sitemap.xml`, and `robots.txt`.
- Shared CMS SEO fields for opportunities, tourism, services, scholarships, and magazine records: SEO title, description, slug, social image, canonical URL, and indexing preference, with length guidance and search-result preview.
- Automated output validation for every generated route, including canonical, language alternates, social metadata, schema JSON, robots directives, sitemap uniqueness, and snapshot existence.

## Crawlability assessment

The application remains a Vite React client-rendered application. Build-time snapshots make metadata, language relationships, robots directives, and a concise `noscript` page summary available without executing JavaScript. Google can render the full client application, but the complete visible body content is not statically rendered for every non-JavaScript crawler.

Full SSR was not introduced because it would require a routing/rendering architecture change immediately before the planned Laravel backend. Dynamic-rendering user-agent workarounds were also avoided. The least disruptive current solution is static metadata generation plus the existing client application.

## Deployment requirements and remaining dependencies

- Set `VITE_SITE_URL` (or `SITE_URL` for the generation script) to the final HTTPS origin during production builds. The current fallback is `https://globalvision.af`.
- Deploy the generated `dist/` directory, including route snapshot directories, `sitemap.xml`, `robots.txt`, and `.htaccess`.
- Confirm Apache enables `mod_rewrite` and `mod_headers`, or translate the same snapshot, SPA fallback, and `X-Robots-Tag` rules to the production web server.
- Submit `/sitemap.xml` in the selected search-engine webmaster tools after launch.
- When Laravel is introduced, return real HTTP 404 status codes for unknown public routes and move metadata/schema generation to server rendering or a maintained static-generation pipeline so full page body content is present in the initial response.
- CMS values currently follow the frontend mock persistence boundary. The backend must persist and expose the SEO fields per locale before editors can affect production records.

## Validation

Run from `frontend/`:

```bash
npm run lint
npm test
npm run build
npm run test:seo
```

The production build runs the SEO generator and validator automatically.
