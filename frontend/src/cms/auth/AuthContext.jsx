import { useCallback, useEffect, useMemo, useState } from 'react'

import { can as hasPermission } from './permissions.js'
import AuthContext from './context.js'
import { dataSource } from '@/shared/services/data/index.js'

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => ({ session: dataSource.initialSession, status: dataSource.initialSession ? 'authenticated' : 'loading', error: null }))

  const loadSession = useCallback(async () => {
    setState((current) => ({ ...current, status: 'loading', error: null }))
    try {
      const session = await dataSource.auth.session()
      setState({ session, status: session ? 'authenticated' : 'unauthenticated', error: null })
    } catch (error) {
      setState({ session: null, status: 'error', error })
    }
  }, [])

  useEffect(() => {
    let active = true
    if (!dataSource.initialSession) {
      dataSource.auth.session()
        .then((session) => { if (active) setState({ session, status: session ? 'authenticated' : 'unauthenticated', error: null }) })
        .catch((error) => { if (active) setState({ session: null, status: 'error', error }) })
    }
    const expire = () => setState({ session: null, status: 'unauthenticated', error: null })
    window.addEventListener('globalvision:session-expired', expire)
    return () => { active = false; window.removeEventListener('globalvision:session-expired', expire) }
  }, [])

  const value = useMemo(() => ({
    ...state,
    can: (permission) => hasPermission(state.session, permission),
    retry: loadSession,
    async login(credentials) {
      setState({ session: null, status: 'loading', error: null })
      try {
        const session = await dataSource.auth.login(credentials)
        setState({ session, status: 'authenticated', error: null })
        return session
      } catch (error) {
        setState({ session: null, status: 'unauthenticated', error })
        throw error
      }
    },
    async logout() {
      await dataSource.auth.logout()
      setState({ session: null, status: 'unauthenticated', error: null })
    },
    async changePassword(values) {
      const response = await dataSource.auth.changePassword(values)
      setState({ session: null, status: 'unauthenticated', error: null })
      return response
    },
    forgotPassword: (values) => dataSource.auth.forgotPassword(values),
    resetPassword: (values) => dataSource.auth.resetPassword(values),
  }), [loadSession, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
