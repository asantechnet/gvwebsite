import { useLayoutEffect, useRef, useState } from 'react'

function SectionTabBar({ sections, icons, selectedSection, onSelect, ariaLabel, className = '', sticky = true }) {
  const scrollRef = useRef(null)
  const buttonRefs = useRef(new Map())
  const [scrollState, setScrollState] = useState({ hasOverflow: false, position: 0, thumbSize: 100 })
  const [activeIndicator, setActiveIndicator] = useState({ start: 0, width: 0, visible: false })

  useLayoutEffect(() => {
    const element = scrollRef.current
    if (!element) return undefined

    const updateScrollState = () => {
      const maxScroll = element.scrollWidth - element.clientWidth
      const hasOverflow = maxScroll > 1
      const thumbSize = hasOverflow ? Math.max(18, (element.clientWidth / element.scrollWidth) * 100) : 100
      const position = hasOverflow ? Math.min(100 - thumbSize, (Math.abs(element.scrollLeft) / maxScroll) * (100 - thumbSize)) : 0
      setScrollState({ hasOverflow, position, thumbSize })
      const activeButton = buttonRefs.current.get(selectedSection)
      if (activeButton) {
        const isRtl = getComputedStyle(element).direction === 'rtl'
        const start = isRtl
          ? element.scrollWidth - activeButton.offsetLeft - activeButton.offsetWidth
          : activeButton.offsetLeft
        setActiveIndicator({ start, width: activeButton.offsetWidth, visible: true })
      }
    }

    updateScrollState()
    const activeButton = buttonRefs.current.get(selectedSection)
    activeButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    let frame = 0
    const handleScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updateScrollState) }
    element.addEventListener('scroll', handleScroll, { passive: true })
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(element)
    if (activeButton) observer.observe(activeButton)
    return () => { cancelAnimationFrame(frame); element.removeEventListener('scroll', handleScroll); observer.disconnect() }
  }, [sections, selectedSection])

  return <nav className={`${sticky ? 'sticky top-15 min-[701px]:top-16' : 'relative'} z-20 min-w-0 max-w-full overflow-hidden rounded-t-[1.1rem] border border-(--admin-tab-bar-border) border-b-2 bg-admin-page shadow-[inset_0_1px_0_rgb(255_255_255_/.45),0_8px_20px_rgb(15_23_42_/.08)] ${className}`} aria-label={ariaLabel} role="tablist"><div className="cms-tab-scroller">
    <div ref={scrollRef} className="cms-tabs-scroll relative flex w-full max-w-full min-w-0 flex-nowrap gap-1 overflow-x-auto overscroll-x-contain p-1.5 sm:gap-1.5 sm:px-2"><span aria-hidden="true" className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-lg bg-(--admin-tab-active-bg) shadow-[0_1px_3px_rgb(15_23_42_/.08)] transition-[inset-inline-start,width,opacity] duration-300 ease-out motion-reduce:transition-none" style={{ insetInlineStart: activeIndicator.start, width: activeIndicator.width, opacity: activeIndicator.visible ? 1 : 0 }} />{Object.entries(sections).map(([key, section]) => { const Icon = icons[key]; const active = selectedSection === key; const label = section.label ?? section; return <button ref={(node) => { if (node) buttonRefs.current.set(key, node); else buttonRefs.current.delete(key) }} type="button" role="tab" aria-selected={active} key={key} onClick={() => onSelect(key)} className={`relative z-10 inline-flex min-h-10 w-max shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 text-center text-[.625rem] font-semibold leading-none outline-none transition-colors focus-visible:border-admin-brand focus-visible:shadow-[0_0_0_2px_rgb(245_155_34_/.24)] sm:min-h-10 sm:px-3 sm:text-[.6875rem] ${active ? 'text-admin-brand-text' : 'text-admin-muted hover:bg-(--admin-tab-hover-bg) hover:text-(--admin-tab-hover-text)'}`}><Icon className="shrink-0" size={14} /><span className="whitespace-nowrap">{label}</span></button> })}</div>
    {scrollState.hasOverflow && <div className="cms-tabs-indicator" aria-hidden="true"><span style={{ width: `${scrollState.thumbSize}%`, insetInlineStart: `${scrollState.position}%` }} /></div>}
  </div></nav>
}

export default SectionTabBar
