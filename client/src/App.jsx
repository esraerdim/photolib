import { useState } from 'react'
import Account from './components/Account.jsx'
import OrderSuccess from './components/OrderSuccess.jsx'
import Work from './components/Work.jsx'
import SiteLayout from './layouts/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import { useSession } from './useSession.js'

function readCheckout() {
  const params = new URLSearchParams(window.location.search)
  return {
    checkout: params.get('checkout'),
    sessionId: params.get('session_id'),
  }
}

function App() {
  const { screen } = useSession()
  const [{ checkout, sessionId }] = useState(readCheckout)
  const showSuccess = checkout === 'success' && sessionId && screen !== 'account'

  return (
    <SiteLayout>
      {screen === 'account' ? <Account /> : null}
      {showSuccess ? <OrderSuccess sessionId={sessionId} /> : null}
      {!showSuccess && screen === 'saved' ? <Work savedOnly /> : null}
      {!showSuccess && screen === 'site' ? <Home /> : null}
    </SiteLayout>
  )
}

export default App
