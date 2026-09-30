import Footer from './Footer.jsx'
import Header from './Header.jsx'

function MainLayout({ children = null }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
