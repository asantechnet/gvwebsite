# Global Vision Website Project Guide

This guide is the single source of truth for the Global Vision architecture, general instructions, design rules, accessibility requirements, and development conventions. Read and follow it before making project changes. Update it whenever the structure, stack, branding system, or shared conventions change.

## Current Status

The project is at the frontend foundation stage. React, Vite, Tailwind CSS, brand color tokens, RTL document settings, Dari and Pashto fonts, separate website and CMS source areas, responsive localized `Header` and `Footer` components, and shared UI components for sections, containers, headings, action links, and repeated card patterns are configured. The home page includes responsive hero, opportunity, destination, process, service, testimonial, and consultation sections with Dari and Pashto content. Shared navigation data, matching localized layout translations, pathname-based page selection, slug-based magazine post routes, opportunity and service directory routes, localized service posts, country guides, scholarship guides, IELTS/TOEFL guides, localized search results, a not-found page, dynamic page metadata, and frontend contact-form validation are implemented. An initial localized CMS dashboard shell is available at `/dashboard`, with a responsive RTL sidebar, top bar, overview metrics, content status, quick actions, language switching, and theme switching. A routing library, Laravel backend, MariaDB integration, API, authentication, and functional CMS editors have not started.

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
10. The website supports only Dari and Pashto and is always right to left.
11. Use locally hosted IRANYekan for Dari body text, Vazirmatn for Pashto, and the shared `font-heading` token for Persian and Pashto display headings.
12. Route loading states must mirror the order, responsive layout, and recognizable shapes of destination sections.
13. Every visible skeleton must use a future shared `SkeletonBlock` component for consistent shimmer and reduced motion behavior.
14. Use Lucide React for all general interface icons. Use React Icons only for social media brand icons.
15. Keep frontend rendering independent of backend implementation through a dedicated `src/shared/services/api/` layer. Components, sections, and pages must never call Laravel endpoints directly.
16. Keep public website code under `src/website/`, CMS code under `src/cms/`, and code genuinely reused by both applications under `src/shared/`.
17. Store each application's interface translations in its locale-specific JSON directories. Components consume translation keys and must not embed duplicated Dari and Pashto UI copy.

## Goals

- Present Global Vision through a modern, responsive, accessible website.
- Deliver a high quality Dari and Pashto experience at every supported viewport.
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
│   │   │   ├── locales/         # Public Dari and Pashto translations
│   │   │   └── utils/           # Website-only utilities
│   │   ├── cms/                 # CMS application mounted at /dashboard
│   │   │   ├── components/      # CMS layouts, pages, sections, and controls
│   │   │   └── locales/         # CMS Dari and Pashto translations
│   │   ├── shared/              # Cross-application hooks, services, and utilities
│   │   ├── assets/fonts/       # Bundled local fonts
│   │   ├── App.jsx             # Website/CMS application boundary
│   │   ├── index.css           # Tailwind, tokens, fonts, global defaults
│   │   └── main.jsx            # React bootstrap
│   ├── index.html
│   ├── jsconfig.json           # Editor alias support
│   ├── package.json
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

### Pages and sections

- One page component represents one route.
- Pages only import and compose sections. They must not contain detailed UI markup, styling, API calls, content arrays, or feature behavior.
- Page-specific sections belong under the owning application's `components/sections/` directory.
- Sections use reusable components for repeated cards, buttons, headings, links, and media.
- Split a section when it contains independently understandable or reusable parts.

### Components and layout

- Application-specific UI, compound components, and layouts belong under the owning application's `components/` directory.
- Cross-application components are added under `src/shared/components/` only when both applications actively use them.
- Supply changeable content, images, links, icons, states, colors, and behavior through props.
- Prefer `children` where composition creates a clearer API.
- Support `className` where consumers need controlled visual extension.
- Do not create a component merely to hide one line of markup.
- Convert repeated controls, cards, headings, labels, icons, fields, media, and content patterns into reusable components.
- Never duplicate headers, footers, navigation, overlays, or page shells inside pages.

### Hooks and data

- Reusable stateful behavior belongs in the owning application's hooks directory, or `src/shared/hooks/` when both applications use it; hook names begin with `use`.
- Hooks return the smallest useful API and clean up listeners, timers, and observers.
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

### Translation architecture

- Store website translations under `src/website/locales/` and CMS translations under `src/cms/locales/`, each with matching `prs/` and `ps/` directories.
- Use matching filenames and matching translation-key structures in both language directories.
- Split large translations by stable feature or namespace rather than maintaining one oversized file.
- Use stable semantic keys, not full source sentences as keys.
- Dari (`prs`) is the default and fallback language. Pashto uses `ps`.
- Language switching changes content and the document `lang` value but never changes the RTL direction.
- Reusable components receive translated strings through props or a translation interface; they must not duplicate literal UI copy for both languages.
- Keep backend content fields and frontend translation keys distinct: CMS-managed content comes from the API, while fixed interface labels come from JSON translation files.

## Routing Rules

`App.jsx` selects the website or CMS from `window.location.pathname` without a routing dependency. `WebsiteLayout` currently selects public pages the same way. Magazine posts use stable, language-independent paths in the form `/magazine/post/:slug`; matching Dari and Pashto records must share the same slug. Every child item under Opportunities and Services is content of type post, rendered with the shared single-post layout rather than a standalone page component. These posts may use their canonical navigation path, such as `/opportunities/study`. When routing expands or a routing library is introduced:

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
| Global Vision orange | `#f59b22` | Primary accent and calls to action |
| Global Vision red | `#ec1f27` | Secondary accent and important actions |
| Global Vision white | `#ffffff` | Brand neutral and clean surfaces |
| Light background | `#fffaf5` | Light page background |
| Light foreground | `#333333` | Light primary text and titles |
| Dark background | `#1f2937` (`gray-800`) | Dark page background |
| Dark foreground | `#fff8f3` | Dark primary text |

Shared branding colors, fonts, light and dark class colors, and necessary global animation definitions live in `src/index.css`. CMS-only administrative tokens and primitive behaviors live in `src/cms/styles.css` and remain scoped to `.cms-root`. The site supports explicit `.light` and `.dark` theme classes. Components consume semantic tokens rather than hardcoded theme colors. Detailed component, section, page-shell, and layout styling belongs in JSX through Tailwind utilities.

### Language and typography

- Support Dari and Pashto only.
- Keep the document and all page layouts right to left.
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
- Use semantic `header`, `nav`, `main`, `section`, `article`, and `footer` elements.
- Use `aria-current="page"` for active navigation and breadcrumbs.
- Never remove visible focus feedback without a clear replacement.
- Maintain sufficient text and control contrast.
- Use accurate Dari and Pashto language attributes.
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
- Do not leave placeholder links in completed work.
- Treat final Dari and Pashto copy as distinct authored content.

## Development Commands

Run commands from `frontend/`:

```bash
npm install
npm run dev
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
9. Verify Dari and Pashto fonts, RTL layout, and language attributes.
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
- Provide consistent loading, empty, success, and error states.
- Update this guide before describing backend, CMS, routes, pages, or dependencies as implemented.

## Documentation Maintenance

- Update this guide when dependencies change.
- Update route documentation when routes are implemented.
- Update the structure after meaningful architectural changes.
- Record new global tokens and interaction rules.
- Keep planned technology separate from installed technology.
- Treat this file as the primary project reference.
