import Account from './components/Account.jsx'
import Work from './components/Work.jsx'
import SiteLayout from './layouts/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import { useSession } from './useSession.js'

function App() {
  const { screen } = useSession()

  return (
    <SiteLayout>
      {screen === 'account' ? <Account /> : null}
      {screen === 'saved' ? <Work savedOnly /> : null}
      {screen === 'site' ? <Home /> : null}
    </SiteLayout>
  )
}

export default App
