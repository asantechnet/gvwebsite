import { useEffect, useRef } from 'react'

function useBottomStickySidebar() {
  const sidebarRef = useRef(null)

  useEffect(() => {
    const sidebar = sidebarRef.current
    if (!sidebar) return undefined

    const scrollArea = sidebar.firstElementChild
    const stickyLayout = sidebar.closest('[data-bottom-sticky-layout]')
    const mainContent = stickyLayout?.querySelector('[data-sticky-main]')
    const updateHeight = () => {
      if (mainContent && scrollArea) {
        const needsFullSidebar = mainContent.offsetHeight < scrollArea.scrollHeight
        scrollArea.style.maxHeight = needsFullSidebar ? 'none' : ''
        scrollArea.style.overflowY = needsFullSidebar ? 'visible' : ''
      }

      sidebar.style.setProperty('--sidebar-height', `${sidebar.offsetHeight}px`)
    }
    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(sidebar)
    if (scrollArea) resizeObserver.observe(scrollArea)
    if (mainContent) resizeObserver.observe(mainContent)

    return () => {
      resizeObserver.disconnect()
      if (scrollArea) {
        scrollArea.style.removeProperty('max-height')
        scrollArea.style.removeProperty('overflow-y')
      }
    }
  }, [])

  return sidebarRef
}

export default useBottomStickySidebar
