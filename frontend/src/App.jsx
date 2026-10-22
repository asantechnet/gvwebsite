import DashboardLayout from '@cms/components/layout/DashboardLayout.jsx'
import WebsiteLayout from '@layout/WebsiteLayout.jsx'

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return path === '/dashboard' || path.startsWith('/dashboard/') ? <DashboardLayout /> : <WebsiteLayout />
}

export default App
