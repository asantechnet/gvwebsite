# Global Vision Rich Text Editor

Portable React rich-text editor preserving the CMS editor's toolbar, media templates, responsive layout, localization, and light/dark appearance.

## Copying to another project

Copy this entire `rich-text-editor/` directory. Do not copy only `RichTextEditor.jsx`; the `locales/`, `media/`, `styles.css`, and `translations.js` files are required.

The destination project must process the component's Tailwind CSS utility classes. With Tailwind CSS v4, import Tailwind normally and ensure this copied directory is inside a scanned source path.

Install the exact runtime packages used by the component:

```bash
npm install react@^19.2.8 react-dom@^19.2.8 lucide-react@^1.48.0 \
  @tiptap/react@^3.32.0 @tiptap/starter-kit@^3.32.0 \
  @tiptap/extension-link@^3.32.0 @tiptap/extension-placeholder@^3.32.0 \
  @tiptap/extension-text-align@^3.32.0 @tiptap/extension-underline@^3.32.0
```

The current appearance also expects Tailwind CSS `^4.3.3`. The component imports its own scoped `styles.css`; no CMS stylesheet, router, context, store, or application provider is required.

## Usage

Controlled:

```jsx
import { useState } from 'react'
import RichTextEditor from './rich-text-editor'

function Form() {
  const [html, setHtml] = useState('')
  return <RichTextEditor value={html} onChange={setHtml} language="en" />
}
```

Uncontrolled:

```jsx
<RichTextEditor
  defaultValue="<p>Initial content</p>"
  onChange={(html) => console.log(html)}
  placeholder="Write here…"
/>
```

See `Example.jsx` for a minimal working component.

## Public API

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled HTML value. |
| `defaultValue` | `string` | `''` | Initial HTML for uncontrolled usage. |
| `onChange` | `(html: string) => void` | — | Receives serialized editor HTML. |
| `language` | `'prs' \| 'ps' \| 'en'` | document language | Toolbar language and alignment order. |
| `placeholder` | `string` | localized value | Overrides the localized placeholder. |
| `readOnly` | `boolean` | `false` | Prevents editing and toolbar actions while retaining normal presentation. |
| `disabled` | `boolean` | `false` | Disables editing/actions and applies disabled opacity. |
| `className` | `string` | `''` | Adds a class to the editor root. |

## Included functionality

Bold, italic, underline, links, H2/H3 toggles, heading icons and categories, highlight boxes, bullet/numbered lists, multi-column lists, left/center/right alignment, action buttons, undo/redo, image/video/audio attachments, media editing/removal, and all five media-grid layouts are included. Mobile toolbar categories and desktop toolbar groups are preserved.

Media files selected in the browser use object URLs for preview, matching the current frontend implementation. A production application must upload files and replace object URLs with persistent server URLs before saving durable content.

## Theming

The root class is `gv-rich-text-editor`. Light defaults are self-contained. Dark mode activates when an ancestor has `.dark` or when the editor root has `data-theme="dark"`. Brand and surface colors can be overridden with the documented CSS custom properties in `styles.css`, especially `--admin-brand`, `--admin-card`, `--admin-heading`, `--admin-muted`, and `--editor-input`.
