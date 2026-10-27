import { useEffect, useRef, useState } from 'react'

function useEditorTabs({ defaultTab, storageKey, tabs }) {
  const [selectedTab, setSelectedTab] = useState(() => {
    const navigation = window.performance.getEntriesByType('navigation')[0]
    const storedTab = navigation?.type === 'reload' ? window.localStorage.getItem(storageKey) : null
    return storedTab && (!tabs || tabs.includes(storedTab)) ? storedTab : defaultTab
  })
  const previousTab = useRef(selectedTab)

  useEffect(() => { window.localStorage.setItem(storageKey, selectedTab) }, [selectedTab, storageKey])
  useEffect(() => {
    if (previousTab.current === selectedTab) return
    window.scrollTo(0, 0)
    previousTab.current = selectedTab
  }, [selectedTab])

  return [selectedTab, setSelectedTab]
}

export default useEditorTabs
