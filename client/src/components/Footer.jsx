function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-9 px-5 pt-10 pb-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-x-16 lg:px-[72px] lg:pt-16">
        <div className="flex min-w-0 flex-col items-start gap-2.5 text-sm leading-normal">
          <p className="text-xl leading-tight font-extrabold">Lena Voss</p>
          <p className="max-w-[26ch] text-muted">
            Architectural photography — Copenhagen and the rest of the Nordics, before eight.
          </p>
        </div>
        <div className="flex min-w-0 flex-col items-start gap-2.5 text-sm leading-normal">
          <p className="text-xs tracking-[0.12em] text-clay-deep uppercase">Studio</p>
          <p>
            Refshalevej 163A
            <br />
            1432 Copenhagen K
          </p>
          <a
            className="border-b border-ink/20 text-ink no-underline hover:border-clay hover:text-clay"
            href="mailto:hello@lenavoss.com"
          >
            hello@lenavoss.com
          </a>
          <a
            className="border-b border-ink/20 text-ink no-underline hover:border-clay hover:text-clay"
            href="tel:+4531425590"
          >
            +45 31 42 55 90
          </a>
        </div>
        <nav className="flex min-w-0 flex-col items-start gap-2.5 text-sm leading-normal" aria-label="Elsewhere">
          <p className="text-xs tracking-[0.12em] text-clay-deep uppercase">Elsewhere</p>
          <a
            className="border-b border-ink/20 text-ink no-underline hover:border-clay hover:text-clay"
            href="https://instagram.com/"
            rel="noopener"
          >
            Instagram
          </a>
          <a
            className="border-b border-ink/20 text-ink no-underline hover:border-clay hover:text-clay"
            href="https://www.behance.net/"
            rel="noopener"
          >
            Behance
          </a>
          <a
            className="border-b border-ink/20 text-ink no-underline hover:border-clay hover:text-clay"
            href="https://www.are.na/"
            rel="noopener"
          >
            Are.na
          </a>
        </nav>
        <div className="flex min-w-0 flex-col items-start gap-2.5 text-sm leading-normal">
          <p className="text-xs tracking-[0.12em] text-clay-deep uppercase">Next available</p>
          <p className="text-[22px] leading-tight font-extrabold lg:text-[28px]">January 2027</p>
          <a
            className="inline-flex min-h-10 items-center gap-1.5 border border-ink px-3.5 py-2 text-sm leading-tight font-extrabold text-ink no-underline hover:bg-ink hover:text-paper"
            href="#contact"
          >
            <span>Book a shoot</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-ink/20 px-5 py-4 text-[12.5px] text-muted sm:px-8 lg:px-[72px] lg:pb-7">
        <span>© 2026 Lena Voss. Sample photographs via Unsplash — replace with your own.</span>
        <a className="text-ink no-underline hover:text-clay" href="#top">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}

export default Footer
