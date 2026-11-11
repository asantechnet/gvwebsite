import { useCallback, useEffect, useMemo, useState } from 'react'

import { can as hasPermission } from './permissions.js'
import AuthContext from './context.js'
import { setCmsSessionHint } from './sessionHint.js'
import { dataSource } from '@/shared/services/data/index.js'

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => ({ session: dataSource.initialSession, status: dataSource.initialSession ? 'authenticated' : 'loading', error: null }))

  const loadSession = useCallback(async () => {
    setState((current) => ({ ...current, status: 'loading', error: null }))
    try {
      const session = await dataSource.auth.session()
      setCmsSessionHint(Boolean(session))
      setState({ session, status: session ? 'authenticated' : 'unauthenticated', error: null })
    } catch (error) {
      setCmsSessionHint(false)
      setState({ session: null, status: 'error', error })
    }
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const session = await dataSource.auth.session()
      setCmsSessionHint(Boolean(session))
      setState((current) => ({ session, status: session ? 'authenticated' : 'unauthenticated', error: session ? null : current.error }))
      return session
    } catch (error) {
      setCmsSessionHint(false)
      setState({ session: null, status: 'error', error })
      throw error
    }
  }, [])

  useEffect(() => {
    let active = true
    if (!dataSource.initialSession) {
      dataSource.auth.session()
        .then((session) => { if (active) { setCmsSessionHint(Boolean(session)); setState({ session, status: session ? 'authenticated' : 'unauthenticated', error: null }) } })
        .catch((error) => { if (active) { setCmsSessionHint(false); setState({ session: null, status: 'error', error }) } })
    }
    const expire = () => { setCmsSessionHint(false); setState({ session: null, status: 'unauthenticated', error: null }) }
    window.addEventListener('globalvision:session-expired', expire)
    return () => { active = false; window.removeEventListener('globalvision:session-expired', expire) }
  }, [])

  const value = useMemo(() => ({
    ...state,
    can: (permission) => hasPermission(state.session, permission),
    retry: loadSession,
    refreshSession,
    async login(credentials) {
      setState((current) => ({ ...current, error: null }))
      try {
        const session = await dataSource.auth.login(credentials)
        setCmsSessionHint(true)
        setState({ session, status: 'authenticated', error: null })
        return session
      } catch (error) {
        setCmsSessionHint(false)
        setState({ session: null, status: 'unauthenticated', error })
        throw error
      }
    },
    async logout() {
      await dataSource.auth.logout()
      setCmsSessionHint(false)
      setState({ session: null, status: 'unauthenticated', error: null })
    },
    async changePassword(values) {
      const response = await dataSource.auth.changePassword(values)
      setCmsSessionHint(false)
      setState({ session: null, status: 'unauthenticated', error: null })
      return response
    },
    forgotPassword: (values) => dataSource.auth.forgotPassword(values),
    resetPassword: (values) => dataSource.auth.resetPassword(values),
  }), [loadSession, refreshSession, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
