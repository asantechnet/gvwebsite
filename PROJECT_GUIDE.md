# Global Vision Website Project Guide

This guide is the single source of truth for the Global Vision architecture, general instructions, design rules, accessibility requirements, and development conventions. Read and follow it before making project changes. Update it whenever the structure, stack, branding system, or shared conventions change.

## Current Status

The public navigation includes dedicated opportunity, tourism, scholarship, magazine, services, and supporting-information entries. The opportunities group includes a localized investment directory and country-specific investment routes. Tourism includes localized Afghanistan and world directories with destination cards and detail routes. The independent `/services` directory presents all service posts as cards. The `/scholarships` directory provides localized country, degree, and funding filters, responsive scholarship cards, and slug-based scholarship detail routes rendered through the shared single-post design. Scholarship records are currently static localized seed data and are not yet connected to the backend.

The project is at the frontend foundation stage. React, Vite, Tailwind CSS, brand color tokens, RTL document settings, Dari and Pashto fonts, separate website and CMS source areas, responsive localized `Header` and `Footer` components, and shared UI components for sections, containers, headings, action links, and repeated card patterns are configured. The home page includes responsive hero, opportunity, destination, process, service, testimonial, and consultation sections with Dari and Pashto content. Shared navigation data, matching localized layout translations, pathname-based page selection, slug-based magazine post routes, opportunity category and country-specific opportunity routes, localized service posts, IELTS/TOEFL guides, localized search results, a not-found page, dynamic page metadata, and frontend contact-form validation are implemented. A localized CMS dashboard shell is available at `/dashboard`, with a responsive RTL sidebar, top bar, overview metrics, content status, quick actions, language switching, and theme switching. Frontend-only home, about, contact, magazine, scholarships, opportunities, tourism, and services editors, plus media-library and website-settings screens, are available under their matching `/dashboard/*` routes; backend persistence is not yet connected. CMS route paths are centralized in `src/cms/routes.js`. Recoverable browser drafts are shared across the main editors through `useCmsDraftState`, remain pending until the global Save Changes action is used, and are removed after saving or explicitly discarding navigation. Shared CMS editor primitives own preview actions, tab bars, section headers, field groups, fields, visibility controls, and safe rich-text previews, while focused hooks own tab restoration, collection draft behavior, and save/recovery behavior. The frontend now has normalized multilingual content records, environment-selected mock and API data sources, centralized API/auth/content/upload clients, normalized transport errors, contact and password validation, MIME-and-size upload policies, and CMS session/permission states. These are integration boundaries only: a routing library, Laravel backend, MariaDB integration, real authentication, and persistent server-side CMS editing have not started.

The frontend includes dependency-free Node tests for localized catalog search, scholarship filtering, CMS route resolution, and new locale namespace parity, plus a static validator for localized internal links, external URL syntax, and public asset references.

Shared modal keyboard behavior lives in `src/shared/hooks/useModalFocus.js`. Public and CMS dialogs use it to move focus into the dialog, contain Tab navigation, close with Escape, and restore focus to the invoking control. The website and CMS use a visible border-and-shadow keyboard focus treatment without browser outlines or Tailwind rings. Brand fills retain the canonical orange, while the semantic `accent-text` and `admin-brand-text` tokens use a contrast-safe darker orange in light mode and the existing bright orange in dark mode.

The repository currently contains:

- `frontend/`: the React website application.
- `backend/`: reserved for a future backend and currently empty.
- `AGENTS.md`: repository instructions.
- `PROJECT_GUIDE.md`: this guide.

Do not describe planned functionality as implemented.

## Core Rules

1. The public website and CMS frontends use React with Vite. The backend uses Laravel and persistent data uses MariaDB.
2. All styling uses Tailwind CSS.
3. Component, section, page, and layout styling belongs in Tailwind utility classes inside the owning JSX file.
4. `src/index.css` owns Tailwind setup, shared branding colors, fonts, light and dark class colors, and minimal global defaults. CMS-only theme variables and primitive behavior live in `src/cms/styles.css`; detailed component styling remains in Tailwind utilities inside JSX.
5. Repeated elements must use reusable, prop driven components.
6. The required feature composition is `reusable components → sections → pages`. Detailed markup, styling, data presentation, and behavior belong in reusable components and sections. Pages only import and compose sections.
7. Do not use CSS outlines or Tailwind ring utilities on clickable elements. Use accessible brand appropriate background, border, shadow, opacity, or color changes for hover and focus feedback.
8. In mobile view, center every practical element, text block, image, control, and content group. Depart from centered alignment only where it would reduce usability, comprehension, accessibility, or form completion.
9. Use the approved Global Vision brand colors.
10. The website and CMS support Dari, Pashto, and English. Dari and Pashto are right to left; English is left to right.
11. Use locally hosted IRANYekan for Dari body text, Vazirmatn for Pashto, Poppins for English, and the shared `font-heading` token for display headings.
12. Route loading states must mirror the order, responsive layout, and recognizable shapes of destination sections.
13. Every visible skeleton must use a future shared `SkeletonBlock` component for consistent shimmer and reduced motion behavior.
14. Use Lucide React for all general interface icons. Use React Icons only for social media brand icons.
15. Keep frontend rendering independent of backend implementation through a dedicated `src/shared/services/api/` layer. Components, sections, and pages must never call Laravel endpoints directly.
16. Keep public website code under `src/website/`, CMS code under `src/cms/`, and code genuinely reused by both applications under `src/shared/`.
17. Store each application's interface translations in its locale-specific JSON directories. Components consume translation keys and must not embed duplicated Dari, Pashto, and English UI copy.

## Goals

- Present Global Vision through a modern, responsive, accessible website.
- Deliver a high quality Dari, Pashto, and English experience at every supported viewport.
- Keep the codebase modular and maintainable.
- Reuse components and structured content instead of duplicating markup.
- Maintain consistent branding, interactions, typography, and spacing.
- Allow future pages and dynamic content integration without unnecessary complexity.

## Project Technology Architecture

| Area | Required technology | Responsibility |
| --- | --- | --- |
| Public website frontend | React, Vite, and Tailwind CSS | Public pages, localized presentation, and interactions |
| CMS frontend | React, Vite, and Tailwind CSS | Content and administration interface |
| Backend | Laravel | API, validation, authentication, authorization, and business logic |
| Database | MariaDB | Persistent website and CMS data |
| General icons | Lucide React | All non-social interface icons |
| Social icons | React Icons | Social media brand icons only |

## Installed Frontend Packages

| Technology | Purpose | Declared version |
| --- | --- | --- |
| React | Component based user interface | `^19.2.8` |
| React DOM | Browser rendering | `^19.2.8` |
| Nivo Bar, Core, and Pie | CMS overview charts and metric visualizations | `^0.99.0` |
| Vite | Development server and production bundler | `^8.3.0` |
| Tailwind CSS | Utility based responsive styling | `^4.3.3` |
| Tailwind Vite plugin | Tailwind and Vite integration | `^4.3.3` |
| Lucide React | All general website and CMS interface icons | `^1.48.0` |
| React Icons | Social media brand icons only | `^5.7.0` |
| Tiptap | Shared CMS rich-text editing | `^3.32.0` |
| DOMPurify | Allowlist-based rich-text sanitization before DOM rendering | `^3.4.17` |
| tsParticles | Public decorative particle backgrounds | `^3.9.1` |
| ESLint | Static analysis | `^10.11.0` |

The frontend uses native ES modules through `"type": "module"`.

## Required and Planned Additions

Install planned tools only when their feature is actively implemented.

| Technology | Intended use | Installation trigger |
| --- | --- | --- |
| React Router | Routing, layouts, redirects, and 404 handling | When multiple pages are implemented |
| Vitest | Unit and component tests | When shared logic or interactive components expand |
| React Testing Library | User focused UI and accessibility tests | When automated component testing begins |
| Playwright | Responsive end to end testing | When critical journeys exist |
| Prettier | Automated formatting | When a formatting workflow is introduced |
| Laravel | Required API, validation, authentication, and server logic | When backend work begins |
| MariaDB | Required persistent application and CMS data | When backend persistence begins |

Do not add a dependency when the existing stack can implement the requirement clearly. Every dependency needs an active use case, active maintenance, and no overlap with existing tools.

## Current and Intended Structure

```text
globalvision-website/
├── backend/                    # Future Laravel backend and API
├── frontend/
│   ├── public/
│   │   ├── .htaccess           # Apache fallback for client-side application routes
│   │   └── assets/             # Stable branding, image, flag, and audio assets
│   ├── src/
│   │   ├── website/             # Public website application
│   │   │   ├── components/      # Website layouts, pages, sections, shared, and UI
│   │   │   ├── data/            # Public navigation and presentation data
│   │   │   ├── locales/         # Public Dari, Pashto, and English translations
│   │   │   └── utils/           # Website-only utilities
│   │   ├── cms/                 # CMS application mounted at /dashboard
│   │   │   ├── auth/            # CMS session context, permissions, and route access policy
│   │   │   ├── components/      # CMS layouts, pages, sections, and controls
│   │   │   ├── hooks/           # CMS tab, draft, and collection state hooks
│   │   │   └── locales/         # CMS Dari, Pashto, and English translations
│   │   │   ├── utils/           # CMS-only events and nonvisual helpers
│   │   │   └── routes.js        # Canonical CMS paths and route matching
│   │   ├── shared/              # Cross-application components, models, security, services, uploads, hooks, and utilities
│   │   │   ├── models/          # Stable frontend records independent of API response shapes
│   │   │   ├── security/        # Rich-text sanitization and frontend content-safety policy
│   │   │   ├── services/        # Mock/API data sources and centralized API clients
│   │   │   ├── uploads/         # File validation and local preview lifecycle helpers
│   │   │   └── hooks/           # Behavior shared by website and CMS, including modal focus
│   │   ├── assets/fonts/       # Bundled local fonts
│   │   ├── App.jsx             # Website/CMS application boundary
│   │   ├── index.css           # Tailwind, tokens, fonts, global defaults
│   │   └── main.jsx            # React bootstrap
│   ├── index.html
│   ├── jsconfig.json           # Editor alias support
│   ├── package.json
│   ├── scripts/                 # Frontend validation scripts
│   ├── tests/                   # Dependency-free Node tests
│   ├── eslint.config.js
│   └── vite.config.js
├── AGENTS.md
└── PROJECT_GUIDE.md
```

Populate component subdirectories during implementation. Create data, hooks, services, API, locale, and CMS-specific subdirectories with their first implementation rather than as empty placeholders. Keep generated and local dependency folders such as `node_modules/` and `dist/` out of version control.

## Import Aliases

| Alias | Location |
| --- | --- |
| `@` | `frontend/src` |
| `@website` | `frontend/src/website` |
| `@cms` | `frontend/src/cms` |
| `@components` | `frontend/src/website/components` |
| `@ui` | `frontend/src/website/components/ui` |
| `@shared` | `frontend/src/website/components/shared` |
| `@sections` | `frontend/src/website/components/sections` |
| `@pages` | `frontend/src/website/components/pages` |
| `@layout` | `frontend/src/website/components/layout` |
| `@services` | `frontend/src/shared/services` |

Use aliases across source areas and relative imports for nearby files within one feature. The visual dependency direction inside each application is `layout → pages → sections → shared/ui`. Website and CMS presentation modules must not import each other; only the root application boundary and shared non-application modules may connect them. Lower component layers must not import higher layers.

## Architecture Rules

### Application layer

- `main.jsx` imports global CSS, mounts React, and renders `App`.
- `src/App.jsx` is the application boundary: `/dashboard` and `/dashboard/*` render the CMS, while `/` and all other public routes render the website.
- `WebsiteLayout` composes the public `Header`, main content region, and `Footer`; `DashboardLayout` composes the CMS sidebar, top bar, and content region.
- Route decisions within each application belong in its layout or a dedicated router when routing is implemented.
- Do not put page markup, content collections, or UI behavior in `main.jsx`.

### Public SEO layer

- Public runtime metadata and structured data are centralized in `src/website/seo/metadata.js`; do not add page-specific DOM metadata effects elsewhere.
- Production builds run `scripts/generate-seo.mjs` after Vite to emit localized route snapshots, `sitemap.xml`, and `robots.txt`, then run `scripts/validate-seo.mjs`.
- Configure the canonical production origin with `VITE_SITE_URL` or `SITE_URL`. The documented fallback is `https://globalvision.af`.
- Indexable routes must provide localized title, description, canonical, social image, and matching Dari, Pashto, English, and `x-default` alternates.
- Search, unknown routes, maintenance responses, and every CMS route remain `noindex`; never add CMS URLs to the sitemap.
- Add new public collections to both runtime route resolution and the build-time route inventory. A route is not SEO-complete until `npm run build` validates its generated snapshot.
- Structured data must describe only visible, factual content. Do not invent organization types, addresses, reviews, ratings, authors, or dates.

### Pages and sections

- One page component represents one route.
- Pages only import and compose sections. They must not contain detailed UI markup, styling, API calls, content arrays, or feature behavior.
- Page-specific sections belong under the owning application's `components/sections/` directory.
- Sections use reusable components for repeated cards, buttons, headings, links, and media.
- Split a section when it contains independently understandable or reusable parts.

### Components and layout

- Application-specific UI, compound components, and layouts belong under the owning application's `components/` directory.
- Cross-application components are added under `src/shared/components/` only when both applications actively use them.
- The portable rich-text editor and its canonical image, video, and audio templates live under `src/shared/components/rich-text-editor/`; application-specific editor and legacy media paths may only re-export those shared implementations for compatibility. Keep its scoped styles, locales, documentation, and public API together so the complete folder remains portable.
- CMS editors must compose shared primitives from `EditorPrimitives.jsx` and `SectionTabBar.jsx` instead of copying their markup or Tailwind classes. Shared tab persistence and scroll-reset behavior must use `useEditorTabs`.
- CMS records with multilingual content keep language-neutral settings such as status, featured state, media, dates, and ordering at the record level, while visible authored fields are isolated under `translations.prs`, `translations.ps`, and `translations.en`. Editor language switching must preserve every locale draft and save all translations together without copying values between languages.
- Full-page CMS editors use one page-level content-language switcher to swap all authored fields together. Keep this content-language state separate from the CMS interface language, preserve drafts for every locale while switching, and use a compact dropdown on mobile rather than adding language controls beside individual fields.
- Supply changeable content, images, links, icons, states, colors, and behavior through props.
- Prefer `children` where composition creates a clearer API.
- Support `className` where consumers need controlled visual extension.
- Do not create a component merely to hide one line of markup.
- Convert repeated controls, cards, headings, labels, icons, fields, media, and content patterns into reusable components.
- Never duplicate headers, footers, navigation, overlays, or page shells inside pages.

### Hooks and data

- Reusable stateful behavior belongs in the owning application's hooks directory, or `src/shared/hooks/` when both applications use it; hook names begin with `use`.
- Hooks return the smallest useful API and clean up listeners, timers, and observers.
- Main CMS editors use `useCmsDraftState` for recoverable pending values. Give every editor a stable route-scoped storage key, keep committed values separate from drafts, and do not write the final setting or content value until the global Save Changes event is received.
- Opportunities, tourism, and services share collection normalization, status drafts, save commits, and post insertion through `useManagedCollection`; their presentation may vary without duplicating collection state rules.
- Website content arrays and navigation belong in `src/website/data/`.
- Nonvisual shared logic belongs under `src/shared/`; application-only logic stays under its owning application.
- Define routes once and reuse their constants.
- Do not duplicate navigation, service, project, publication, or team data.

### Backend integration boundary

- Treat `src/shared/services/api/` as the frontend integration layer between React and Laravel. It serves the middleware-like role of isolating transport and backend contracts from presentation files.
- Keep the base URL, credentials policy, headers, request execution, response parsing, normalized errors, cancellation, and authentication handling in the API service infrastructure.
- Group endpoint operations into domain service modules such as content, projects, publications, contact, authentication, and CMS services.
- Components and sections consume hooks or service functions; they never call `fetch`, Axios, or Laravel URLs directly.
- Convert API responses into stable frontend models in service adapters. Backend response changes should normally require edits in the API layer rather than throughout components and sections.
- Keep display components prop driven so static data, translated content, loading data, and API data use the same component contracts.
- Provide consistent loading, empty, error, and success states without coupling their presentation to Laravel response shapes.
- Select the frontend source with `VITE_DATA_SOURCE=mock|api`; mock remains the default until the backend exists. Configure the real API origin with `VITE_API_BASE_URL` and request timeout with `VITE_API_TIMEOUT_MS`.
- Use cookie-based sessions with `credentials: include` and the Laravel `XSRF-TOKEN` cookie. Never store access tokens or passwords in local storage.
- Normalize unauthenticated, forbidden, validation, timeout, offline, cancellation, and transport failures before they reach UI components.
- Treat frontend permission checks as presentation controls only. Laravel must independently authenticate and authorize every protected operation.

### Frontend security and untrusted content

- Render CMS-authored HTML only through `SafeRichText`, which applies the shared DOMPurify allowlist and safe URL policy. Never add a direct `dangerouslySetInnerHTML` consumer.
- Sanitize rich text when loading it into the editor as defense in depth. The backend must still sanitize and validate the canonical stored value.
- Reject executable URL schemes, inline event handlers, scripts, embedded documents, SVG markup, forms, and unsupported rich-text elements.
- Validate uploads by MIME type and per-kind size policy before previewing or sending them. Browser validation improves feedback but never replaces backend file inspection, safe renaming, storage isolation, malware checks, and authorization.
- Keep local file previews as temporary `blob:` URLs and revoke them when replaced or removed.
- Keep authentication state in memory and model explicit loading, authenticated, unauthenticated, forbidden, and failed-session states.

### Translation architecture

- Store website translations under `src/website/locales/` and CMS translations under `src/cms/locales/`, each with matching `prs/`, `ps/`, and `en/` directories. The public website maps the Dari `prs/` resources to the visible route identifier `dr`.
- Use matching filenames and matching translation-key structures in both language directories.
- Split large translations by stable feature or namespace rather than maintaining one oversized file.
- Use stable semantic keys, not full source sentences as keys.
- Dari (`dr`) is the public website's default and fallback route identifier. Pashto uses `ps` and English uses `en`; legacy `da` and `prs` values normalize to `dr`.
- Every public route is language-prefixed (`/dr`, `/ps`, or `/en`). `/` and legacy unprefixed public paths redirect to the equivalent Dari route, and language switching preserves the current page, query string, and hash.
- While maintenance mode is active, every public route is replaced with the origin root (`/`) before the maintenance page is shown. The blocked path, query string, and hash must not remain in browser history; the active language is retained in application state for the maintenance content.
- Public language switching is driven by the centralized language configuration and changes content, the `data-language` identifier, the accurate document `lang` value, and direction. Dari and Pashto use RTL while English uses LTR.
- Use logical alignment and spacing utilities such as `text-start`, `text-end`, `start-*`, and `end-*` for localized public layouts. Avoid broad language-specific CSS overrides for physical left/right utility classes.
- Reusable components receive translated strings through props or a translation interface; they must not duplicate literal UI copy for both languages.
- Keep backend content fields and frontend translation keys distinct: CMS-managed content comes from the API, while fixed interface labels come from JSON translation files.

## Routing Rules

`App.jsx` selects the website or CMS from `window.location.pathname` without a routing dependency. Canonical CMS paths, href generation, application-boundary detection, and CMS route-key matching are defined in `src/cms/routes.js` and consumed by the shell, sidebar, and top-bar search. `WebsiteLayout` currently selects public pages after removing the required `/dr`, `/ps`, or `/en` prefix. Magazine posts use stable paths in the form `/:language/magazine/post/:slug`; matching language records must share the same slug. Every child item under Opportunities and Services is content of type post, rendered with the shared single-post layout rather than a standalone page component. These posts use their localized canonical navigation path, such as `/dr/opportunities/study`. When routing expands or a routing library is introduced:

`/:language/opportunities` is intentionally not a public route. Its header label is a non-navigating dropdown trigger; only its child routes are navigable. `/:language/services` is an independent directory route, and its cards link to localized service detail routes.

The CMS shell starts at `/dashboard`. Paths below `/dashboard/*` are reserved for CMS content areas and currently render the dashboard shell until their editors are implemented.

- Centralize canonical paths and navigation data.
- Use route constants rather than repeated strings.
- Use stable section IDs and account for fixed headers with `scroll-mt-*`.
- Provide a dedicated not found page.
- Add redirects only for verified legacy URLs.
- Keep navigation labels synchronized with page and section headings.
- Do not leave `href="#"` placeholders in completed work.

## Global Design Rules

### Colors

| Name | Value | Usage |
| --- | --- | --- |
| Global Vision orange | `#f47e26` | Primary accent and calls to action |
| Global Vision purple | `#80027f` | Secondary accent and important actions |
| Global Vision white | `#ffffff` | Brand neutral and clean surfaces |
| Light accent text | `#b6530d` | Contrast-safe orange-family text and icons on light surfaces |
| Light background | `#fffaf5` | Light page background |
| Light foreground | `#333333` | Light primary text and titles |
| Dark background | `#1f2937` (`gray-800`) | Dark page background |
| Dark foreground | `#fff8f3` | Dark primary text |

Shared branding colors, fonts, light and dark class colors, and necessary global animation definitions live in `src/index.css`. CMS-only administrative tokens and primitive behaviors live in `src/cms/styles.css` and remain scoped to `.cms-root`. The site supports explicit `.light` and `.dark` theme classes. Components consume semantic tokens rather than hardcoded theme colors. Detailed component, section, page-shell, and layout styling belongs in JSX through Tailwind utilities.

Use `bg-primary` / `bg-admin-brand` and matching border tokens for canonical orange fills and borders. Use `text-accent-text` on the public website and `text-admin-brand-text` in the CMS for orange-family text and icons so light-mode contrast remains accessible without changing brand-colored fills.

### Language and typography

- Support Dari, Pashto, and English only.
- Keep Dari and Pashto right to left and render English layouts, text, and directional interactions left to right.
- Dari is the initial document language and uses IRANYekan.
- Pashto uses Vazirmatn and must use `lang="ps"`.
- Use `lang="fa"` or `lang="prs"` where Dari context must be explicit.
- Use one `h1` per page with a logical heading hierarchy.
- Avoid excessive font weights and very small body text.
- Avoid hyphens in page copy where natural phrasing is available.
- Always use English digits (`0-9`) in user-facing content, including localized text and numeric labels; never use Persian or Arabic-Indic digits.

### Layout and motion

- Design mobile first, then enhance at `sm`, `md`, `lg`, and `xl`.
- Reuse established maximum widths.
- Maintain balanced vertical rhythm.
- Full screen overlays must fit the viewport.
- Motion should explain state changes rather than decorate everything.
- Avoid unstable hover movement.
- Respect `prefers-reduced-motion` for nonessential motion and skeletons.

### Clickable elements

- Never apply `outline`, `outline-*`, `ring`, or `ring-*` to clickable controls.
- Hover, active, selected, and keyboard focus states must use accessible changes in border, background, text color, opacity, or shadow.
- Replacing browser focus presentation requires a clear accessible alternative.
- Website and CMS controls use the shared semantic focus border and shadow treatment. Do not suppress it unless a component provides an equally visible state.

## Responsive Standards

- Mobile: below `768px`.
- Tablet: `768px` through `1023px`.
- Desktop: `1024px` and above.
- Test around 375px, 768px, 1024px, 1366px, and 1920px.
- Test narrow and short viewports, especially for full screen navigation.
- Images must intentionally use `object-cover` or `object-contain` and never distort.
- Center all possible mobile elements, text, images, controls, and content groups unless centering harms comprehension, scanning, forms, or accessibility.

## Accessibility Rules

- Give meaningful images descriptive alternative text and decorative images empty alt text.
- Give icon only controls accessible labels.
- Make every interaction keyboard accessible.
- Use `useModalFocus` for modal dialogs so focus enters the modal, remains contained, Escape closes it, and focus returns to its trigger.
- Use semantic `header`, `nav`, `main`, `section`, `article`, and `footer` elements.
- Use `aria-current="page"` for active navigation and breadcrumbs.
- Never remove visible focus feedback without a clear replacement.
- Maintain sufficient text and control contrast.
- Use accurate Dari, Pashto, and English language attributes.
- Preserve logical DOM and keyboard order in RTL layouts.

## Asset Rules

- Put stable assets under `frontend/public/assets/`, grouped by type and purpose. Keep only deployment configuration such as `.htaccess` at the public root.
- Reference public assets with root absolute paths such as `/assets/logo.svg`.
- Use lowercase, hyphenated public filenames and never use spaces in asset paths.
- Keep local fonts in `src/assets/fonts/<family>/` for Vite processing.
- Use descriptive lowercase filenames.
- Compress large photography before production.
- Prefer approved SVG sources for logos and simple scalable graphics.
- Do not add duplicate assets or temporary logo/icon placeholders.

## Icon Rules

- Use Lucide React for every general-purpose interface icon in the public website and CMS.
- Use React Icons only when a social media brand icon is required.
- Do not mix in other icon libraries, handwritten icon SVGs, Unicode symbols, or emoji as interface-icon substitutes when Lucide provides the required icon.
- Give icon-only interactive controls an accessible name.

## Code and Content Rules

- Use functional React components and hooks.
- Use PascalCase for components and filenames; use camelCase for functions, variables, and props.
- Use descriptive prop and handler names.
- Group imports by external dependencies, internal modules, and styles.
- Prefer named data exports and default component exports.
- Never mutate props or imported content.
- Avoid nested component definitions when they can be reused or tested.
- Clean up all timers, listeners, and observers.
- Avoid broad CSS selectors when JSX utilities can scope styling.
- Store repeated content as structured objects or arrays.
- Use stable IDs or unique keys for lists.
- Keep navigation wording synchronized with section headings.
- Format browser tab titles as the localized page name followed by ` | ` and the localized company name. Derive page names directly from the active navigation or content record so CMS edits automatically update titles; use localized contextual patterns only to join opportunity countries and tourism destinations.
- Do not leave placeholder links in completed work.
- Treat final Dari, Pashto, and English copy as distinct authored content.

## Development Commands

Run commands from `frontend/`:

```bash
npm install
npm run dev
npm test
npm run test:links
npm run test:seo
npm run lint
npm run build
npm run preview
```

The production build must pass before a completed change is handed off.

## Validation Checklist

Before completing a code or design change:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Run `git diff --check`.
4. Check all required desktop, tablet, and mobile widths.
5. Check short viewport behavior for overlays and navigation.
6. Verify changed links and anchors.
7. Test keyboard navigation and focus feedback.
8. Confirm images load, retain proportions, and do not overflow.
9. Verify Dari and Pashto fonts and RTL layout, plus English fonts and LTR layout and all language attributes.
10. Confirm no duplicated data or reusable markup.
11. Verify relevant motion with reduced motion enabled.

## Future Dynamic Platform Rules

When backend or content management work begins:

- Build the backend with Laravel and use MariaDB as its database.
- Load dynamic content through the dedicated `src/shared/services/api/` layer rather than scattered component requests.
- Let the backend own validation, authorization, business rules, serialization, uploads, and database access.
- Use migrations for every schema change.
- Limit public responses to required fields.
- Protect administrative APIs with authentication and role authorization.
- Validate and sanitize server input even when frontend validation exists.
- Keep secrets in environment files and never commit credentials.
- Keep React presentation files insulated from endpoint paths and raw Laravel response structures so normal backend changes remain localized to services and adapters.
- Persist the public light-mode and dark-mode logos in CMS settings. The public website, CMS shell, and maintenance page must all read those logo values through the shared API layer so a settings change updates every consumer.
- Treat the contact email managed on the CMS contact page as the single source of truth. The public contact page and maintenance page must use the same backend value.
- Persist the primary and secondary branding colors in CMS settings and expose them as shared dynamic theme tokens for both the public website and CMS, including the maintenance page.
- Provide consistent loading, empty, success, and error states.
- Update this guide before describing backend, CMS, routes, pages, or dependencies as implemented.

## Documentation Maintenance

- Update this guide when dependencies change.
- Update route documentation when routes are implemented.
- Update the structure after meaningful architectural changes.
- Record new global tokens and interaction rules.
- Keep planned technology separate from installed technology.
- Treat this file as the primary project reference.

## Optimization Progress

- Phase 1 — Inspection and baseline: completed on 2026-11-04. The baseline passed ESLint, Node tests, localized link/asset validation, and the production build. The initial production JavaScript bundle measured 1,692.41 kB raw and 480.46 kB gzip.
- Phase 2 — Safe cleanup and architecture: completed on 2026-11-04. CMS routes were centralized, recoverable Save Changes drafts were standardized across the main editors, opportunities/services/tourism collection state was extracted to a focused hook, the duplicate add/edit collection modal was consolidated, and the unreachable legacy opportunity manager and obsolete reset-event code were removed. Route and locale architecture tests were added. Four representative baseline screenshots remained pixel-identical after the work.
- Phase 3 — Styling and UI quality: completed on 2026-11-04. Shared page-grid constraints and off-canvas containment removed narrow-mobile CMS clipping, including long localized opportunity and scholarship cards. The required 320, 375, 430, 768, 1024, and 1280 viewport checks passed across RTL/LTR and light/dark samples. Shared modal focus management, semantic keyboard focus feedback, reduced-motion handling for moving language indicators, contrast-safe accent-text tokens, and maintenance-language retention were added without redesigning the interface.
- Phase 4 — Database, API, and frontend security readiness: completed on 2026-11-04. Stable multilingual content models, centralized credentialed API clients, mock/API source selection, normalized request errors, CMS session and permission states, contact/password validation, MIME-and-size upload policies, progress-ready upload transport, and DOMPurify-backed rich-text rendering were introduced. The frontend remains on the mock source by default; Laravel must provide the documented contracts, authentication, authorization, validation, sanitization, upload inspection, and persistence. The dependency audit's high-severity development-tool findings were resolved through non-breaking updates; six moderate ESLint-chain advisories remain without a non-breaking fix.
- Phase 5 — SEO, metadata, and indexability: completed on 2026-11-04. Centralized localized metadata, canonicals, hreflang, social previews, structured data, CMS SEO fields, build-time route snapshots, sitemap and robots generation, CMS noindex response headers, and automated validation now cover 258 public language URLs. Full body SSR, real HTTP 404 responses, persisted CMS SEO values, and final production-origin/server configuration remain Laravel or deployment dependencies documented in `SEO_REPORT.md`.
- Phases 6–8 remain pending explicit approval. Current known limitations include the unsplit application bundle, incomplete messages behavior, mock-only persistence, and absent server-side enforcement. These belong to their approved later phases or backend implementation.
