const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

function Header() {
  return (
    <header id="top" className="sticky top-0 z-10 bg-paper/80 backdrop-blur-[14px]">
      <a
        className="absolute top-[-100px] left-5 z-20 bg-ink px-3.5 py-2.5 text-paper no-underline focus:top-2"
        href="#work"
      >
        Skip to work
      </a>
      <nav
        className="flex max-w-full flex-wrap items-center gap-x-5 gap-y-2 border-b-2 border-ink/20 px-5 py-3 sm:px-8 lg:px-[72px]"
        aria-label="Primary"
      >
        <a
          className="mr-auto text-lg font-extrabold whitespace-nowrap text-ink no-underline"
          href="#top"
        >
          Lena Voss
        </a>
        <ul className="m-0 flex list-none gap-5 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <a
                className="text-sm text-ink no-underline hover:text-clay"
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          className="inline-flex min-h-10 items-center bg-clay px-3.5 py-2 text-sm leading-tight font-extrabold text-paper no-underline hover:bg-clay-deep"
          href="#contact"
        >
          Book a shoot
        </a>
      </nav>
    </header>
  )
}

export default Header
