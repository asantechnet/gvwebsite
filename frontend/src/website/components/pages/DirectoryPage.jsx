import DirectorySection from '@sections/directory/DirectorySection.jsx'

function DirectoryPage(props) {
  const isServicesPage = window.location.pathname === '/services'
  const visibleItems = isServicesPage ? props.items.filter((item) => !item.href.endsWith('/document-preparation')) : props.items
  return <DirectorySection {...props} items={visibleItems} hideBanner />
}

export default DirectoryPage
