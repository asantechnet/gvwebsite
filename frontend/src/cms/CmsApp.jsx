import DashboardLayout from '@cms/components/layout/DashboardLayout.jsx'
import { AuthProvider } from '@cms/auth/AuthContext.jsx'

function CmsApp() {
  return <AuthProvider><DashboardLayout /></AuthProvider>
}

export default CmsApp
