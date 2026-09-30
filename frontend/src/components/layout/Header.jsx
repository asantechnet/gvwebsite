function Header({ children = null, className = '' }) {
  return (
    <header className={`w-full ${className}`.trim()}>
      {children}
    </header>
  )
}

export default Header
