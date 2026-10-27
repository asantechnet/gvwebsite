import DirectorySection from '@sections/directory/DirectorySection.jsx'

function DirectoryPage(props) {
  return <DirectorySection {...props} items={props.items} />
}

export default DirectoryPage
