import PageContainer from '@cms/components/PageContainer.jsx'
import PageHeading from '@cms/components/PageHeading.jsx'
import SettingsSection from '@cms/components/sections/SettingsSection.jsx'

function SettingsPage({ content, language }) {
  return <PageContainer className="max-w-[78rem]">
    <PageHeading
      className="!min-h-0 !px-0 !pt-0 !pb-3"
      breadcrumbs={[{ label: content.dashboard }, { label: content.title }]}
    />
    <SettingsSection content={content} language={language} />
  </PageContainer>
}

export default SettingsPage
