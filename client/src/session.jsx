import { useEffect, useState } from 'react'
import { api } from './api.js'
import { SessionContext } from './useSession.js'

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [screen, setScreen] = useState('site')
  const [accountIntent, setAccountIntent] = useState(null)

  async function refresh() {
    const session = await api('/api/auth/get-session')
    const nextUser = session?.user ?? null
    setUser(nextUser)
    return nextUser
  }

  useEffect(() => {
    let ignore = false
    api('/api/auth/get-session')
      .then((session) => {
        if (!ignore) setUser(session?.user ?? null)
      })
      .catch(() => {
        if (!ignore) setUser(null)
      })
      .finally(() => {
        if (!ignore) setReady(true)
      })
    return () => {
      ignore = true
    }
  }, [])

  async function signIn(email, password) {
    await api('/api/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    await refresh()
    setAccountIntent(null)
    setScreen('site')
  }

  async function signUp(name, email, password) {
    await api('/api/auth/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    await refresh()
    setAccountIntent(null)
    setScreen('site')
  }

  async function signOut() {
    await api('/api/auth/sign-out', { method: 'POST', body: '{}' })
    setUser(null)
    setAccountIntent(null)
    setScreen('site')
  }

  function askToSignIn(intent) {
    setAccountIntent(intent === 'buy' ? 'buy' : null)
    setScreen('account')
    window.scrollTo(0, 0)
  }

  return (
    <SessionContext.Provider value={{ user, ready, screen, setScreen, accountIntent, signIn, signUp, signOut, askToSignIn }}>
      {children}
    </SessionContext.Provider>
  )
}
