import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import { EditorPreviewLink } from '@cms/components/EditorPrimitives.jsx'

function PlaceholderPage({ content, pageKey }) {
  const page = content.groups.flatMap((group) => group.items).find((item) => item.key === pageKey)
  const label = page?.label || content.overview
  return <PageContainer><PageHeading className="!min-h-0 !py-0" breadcrumbs={[{ label: content.overview }, { label }]} action={<EditorPreviewLink>{content.topbar.visitPage}</EditorPreviewLink>} /></PageContainer>
}

export default PlaceholderPage
