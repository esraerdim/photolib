import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'

function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default SiteLayout
