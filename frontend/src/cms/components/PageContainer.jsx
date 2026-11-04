function PageContainer({ as: Component = 'div', className = '', children }) {
  return <Component className={`mx-auto grid w-full min-w-0 max-w-[82rem] grid-cols-[minmax(0,1fr)] gap-5 sm:gap-[1.65rem] ${className}`}>{children}</Component>
}

export default PageContainer
