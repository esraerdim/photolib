import { works } from '../data/works.js'

const ticker = [
  { text: 'Architectural photography' },
  { text: 'Copenhagen' },
  { text: 'Booking spring 2026', hot: true },
  { text: 'Commissions across the Nordics' },
]

const shots = [
  {
    id: '02',
    className: 'top-0 left-0 z-[3] aspect-[4/5] w-[58%] -rotate-3',
  },
  {
    id: '04',
    className: 'top-[8%] right-0 z-[2] aspect-[3/4] w-[52%] rotate-[4deg]',
  },
  {
    id: '08',
    className: 'bottom-0 left-[18%] z-[1] aspect-[5/4] w-[62%] rotate-[1.5deg]',
  },
]

function Hero() {
  const board = shots.map((shot) => ({
    ...shot,
    work: works.find((work) => work.id === shot.id),
  }))

  return (
    <section className="bg-sand" aria-labelledby="hero-title">
      <div className="overflow-hidden border-b-2 border-ink/20" aria-hidden="true">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="m-0 flex shrink-0 list-none items-center gap-9 py-[11px] pr-9 pl-0 text-xs leading-none tracking-[0.14em] whitespace-nowrap text-muted uppercase"
            >
              {ticker.map((item) => (
                <li key={`${copy}-${item.text}`} className="flex items-center gap-9">
                  <span className={item.hot ? 'text-clay-deep' : undefined}>{item.text}</span>
                  <span className="size-2 shrink-0 bg-clay" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-5 pt-12 pb-8 sm:gap-12 sm:px-8 sm:pt-16 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-[72px] lg:pt-24 lg:pb-14">
        <div className="min-w-0">
          <h1
            id="hero-title"
            className="text-[42px] leading-[0.96] font-extrabold tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[120px]"
          >
            <span className="block">Light,</span>
            <span className="block">before it</span>
            <span className="block text-clay">settles.</span>
          </h1>
          <div className="mt-6 flex max-w-[40ch] flex-col gap-5 sm:mt-8 lg:mt-10">
            <p className="text-[17px] leading-relaxed sm:text-lg lg:text-xl">
              Lena Voss photographs buildings for architects and publishers — early light, few props, nothing forced.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex min-h-10 items-center border border-ink px-3.5 py-2 text-sm leading-tight font-extrabold text-ink no-underline hover:bg-ink hover:text-paper"
                href="#work"
              >
                See the work
              </a>
              <a
                className="inline-flex min-h-10 items-center px-1.5 py-2 text-sm leading-tight font-extrabold text-clay-deep no-underline hover:bg-clay/15"
                href="#contact"
              >
                Book a shoot
              </a>
            </div>
          </div>
        </div>

        <div className="relative mx-auto aspect-[1/1.05] w-full max-w-[440px] lg:mr-0 lg:ml-auto" aria-hidden="true">
          {board.map((shot) => (
            <div
              key={shot.id}
              className={`absolute overflow-hidden bg-paper p-2 pb-7 shadow-[0_10px_30px_rgba(38,35,31,0.14)] transition duration-300 ease-out hover:z-10 hover:scale-[1.04] hover:rotate-0 hover:shadow-[0_16px_36px_rgba(38,35,31,0.22)] motion-reduce:transition-none ${shot.className}`}
            >
              <img
                className="h-full w-full object-cover"
                src={shot.work.src}
                width={shot.work.width}
                height={shot.work.height}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
