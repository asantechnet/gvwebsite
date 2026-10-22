function PageContainer({ as: Component = 'div', className = '', children }) {
  return <Component className={`mx-auto grid w-full max-w-[82rem] gap-5 sm:gap-[1.65rem] ${className}`}>{children}</Component>
}

export default PageContainer
