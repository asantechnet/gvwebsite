function Footer({ children = null, className = '' }) {
  return (
    <footer className={`w-full ${className}`.trim()}>
      {children}
    </footer>
  )
}

export default Footer
