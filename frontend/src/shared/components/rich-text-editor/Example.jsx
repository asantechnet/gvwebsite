import { useState } from 'react'

import RichTextEditor from './RichTextEditor.jsx'

export default function RichTextEditorExample() {
  const [content, setContent] = useState('<p>Start writing…</p>')
  return <RichTextEditor value={content} onChange={setContent} language="en" />
}
