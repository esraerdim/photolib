import { useSession } from '../useSession.js'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

function Header() {
  const { user, ready, screen, setScreen, signOut } = useSession()

  function showSite() {
    setScreen('site')
  }

  return (
    <header id="top" className="sticky top-0 z-10 bg-paper/80 backdrop-blur-[14px]">
      <a
        className="absolute top-[-100px] left-5 z-20 bg-ink px-3.5 py-2.5 text-paper no-underline focus:top-2"
        href="#work"
        onClick={showSite}
      >
        Skip to work
      </a>
      <nav
        className="flex max-w-full flex-wrap items-center gap-x-9 gap-y-3 border-b-2 border-ink/20 px-5 py-3 sm:px-8 lg:px-[72px]"
        aria-label="Primary"
      >
        <a
          className="mr-auto text-lg font-extrabold whitespace-nowrap text-ink no-underline"
          href="#top"
          onClick={showSite}
        >
          Lena Voss
        </a>
        <ul className="m-0 flex list-none gap-9 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <a className="nav-link" href={link.href} onClick={showSite}>
                {link.label}
              </a>
            </li>
          ))}
          {user ? (
            <li>
              <button
                type="button"
                className="nav-link"
                aria-current={screen === 'saved' ? 'page' : undefined}
                onClick={() => setScreen('saved')}
              >
                Saved
              </button>
            </li>
          ) : null}
        </ul>
        {ready && user ? (
          <button type="button" className="btn btn-secondary" onClick={() => signOut()}>
            <span className="btn-label">Sign out</span>
          </button>
        ) : null}
        {ready && !user ? (
          <button
            type="button"
            className="btn btn-secondary"
            aria-current={screen === 'account' ? 'page' : undefined}
            onClick={() => setScreen(screen === 'account' ? 'site' : 'account')}
          >
            <span className="btn-label">Sign in</span>
          </button>
        ) : null}
        <a className="btn btn-primary" href="#contact" onClick={showSite}>
          <span className="btn-label">Book a shoot</span>
        </a>
      </nav>
    </header>
  )
}

export default Header
