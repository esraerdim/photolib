import { useSession } from '../useSession.js'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

function Header() {
  const { user, ready, screen, setScreen, signOut, askToSignIn } = useSession()

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
        className="flex flex-wrap items-center gap-x-3 gap-y-0 border-b-2 border-ink/20 px-4 py-2.5 sm:px-8 sm:py-3 md:flex-nowrap md:gap-x-5 lg:gap-x-8 lg:px-[72px]"
        aria-label="Primary"
      >
        <a
          className="shrink-0 text-base font-extrabold whitespace-nowrap text-ink no-underline sm:text-lg"
          href="#top"
          onClick={showSite}
        >
          Lena Voss
        </a>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5 md:order-last md:ml-0">
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
              onClick={() => (screen === 'account' ? setScreen('site') : askToSignIn())}
            >
              <span className="btn-label">Sign in</span>
            </button>
          ) : null}
          <a className="btn btn-primary" href="#contact" onClick={showSite}>
            <span className="btn-label">
              <span className="md:hidden">Book</span>
              <span className="hidden md:inline">Book a shoot</span>
            </span>
          </a>
        </div>

        <ul className="m-0 order-last flex w-full list-none items-center justify-between gap-4 border-t border-ink/10 py-2.5 pt-2.5 sm:justify-center sm:gap-10 md:order-none md:ml-auto md:w-auto md:justify-start md:gap-7 md:border-0 md:py-0 lg:gap-9">
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
          {user?.role === 'admin' ? (
            <li>
              <button
                type="button"
                className="nav-link"
                aria-current={screen === 'admin' ? 'page' : undefined}
                onClick={() => setScreen('admin')}
              >
                Admin
              </button>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  )
}

export default Header
