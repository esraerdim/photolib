import { useEffect, useState } from 'react'
import { works } from '../data/works.js'

const shootTypes = [
  'Completed building',
  'Interior',
  'Construction progress',
  'Editorial feature',
]

const fieldInput =
  'w-full min-w-0 border-0 border-b-2 border-ink bg-transparent px-0 py-2.5 text-lg text-ink outline-none placeholder:text-ink/40 focus-visible:border-clay sm:text-2xl'

function MainContent() {
  const [openId, setOpenId] = useState(null)
  const openIndex = works.findIndex((work) => work.id === openId)
  const openWork = openIndex === -1 ? null : works[openIndex]

  useEffect(() => {
    if (!openWork) return undefined

    function onKey(event) {
      if (event.key === 'Escape') setOpenId(null)
      if (event.key === 'ArrowRight') setOpenId(works[(openIndex + 1) % works.length].id)
      if (event.key === 'ArrowLeft') {
        setOpenId(works[(openIndex - 1 + works.length) % works.length].id)
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openWork, openIndex])

  function showNext(step) {
    const next = (openIndex + step + works.length) % works.length
    setOpenId(works[next].id)
  }

  return (
    <>
      <section id="work" className="scroll-mt-16" aria-labelledby="work-title">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-end gap-x-6 gap-y-2 px-5 pt-12 pb-7 sm:px-8 sm:pt-16 lg:px-[72px] lg:pt-20">
          <h2 id="work-title" className="text-3xl leading-none font-extrabold sm:text-5xl lg:text-[56px]">
            Selected work
          </h2>
          <p className="text-[13px] leading-none tracking-[0.12em] text-clay-deep uppercase sm:ml-auto">
            {works.length} photographs · 2021–2026
          </p>
        </div>
        <div className="grid grid-cols-1 gap-0.5 border-y-2 border-ink/20 bg-ink/20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {works.map((work) => (
            <figure key={work.id} id={`work-${work.id}`} className="flex min-w-0 scroll-mt-20 flex-col bg-paper">
              <button
                type="button"
                className="group relative block aspect-[4/5] w-full overflow-hidden bg-sand"
                aria-label={`View ${work.title}, ${work.place}`}
                onClick={() => setOpenId(work.id)}
              >
                <img
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  src={work.src}
                  width={work.width}
                  height={work.height}
                  alt={work.alt}
                  loading="lazy"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-4 text-base font-extrabold text-paper opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-lg">
                  {work.title} <span className="ml-1.5 text-sand">↗</span>
                </span>
              </button>
              <figcaption className="flex justify-between gap-3 px-3 pt-2.5 pb-3 text-[12.5px] leading-snug">
                <span>
                  <b className="font-semibold text-clay-deep">{work.id}</b> {work.title}, {work.place}
                </span>
                <span className="text-muted">{work.year}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="about" className="scroll-mt-16 bg-sage" aria-labelledby="about-title">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-[72px] lg:py-28">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-24">
            <div className="min-w-0">
              <p className="text-[13px] leading-none tracking-[0.12em] text-clay-deep uppercase">About</p>
              <h2 id="about-title" className="my-5 text-[34px] leading-[0.98] font-extrabold sm:text-5xl lg:text-6xl xl:text-[80px]">
                Trained as an architect. Switched sides in 2014.
              </h2>
              <p className="max-w-[44ch] text-[17px] leading-relaxed sm:text-lg lg:text-xl">
                Lena photographs buildings the way she once drew them — in plan, in section, and before the furniture arrives. She works across Denmark, Sweden and Norway, usually before eight.
              </p>
            </div>
            <figure className="relative aspect-[4/5] overflow-hidden bg-paper">
              <img
                className="h-full w-full object-cover"
                src="/assets/img/about.jpg"
                width="1000"
                height="1250"
                alt="Brick lane on a shoot morning"
                loading="lazy"
              />
              <figcaption className="absolute bottom-0 left-0 flex items-baseline gap-2.5 bg-paper px-3.5 py-2.5 text-xs">
                <b className="font-semibold text-clay-deep">On site</b>
                <span>— Nørrebro, 2024</span>
              </figcaption>
            </figure>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t-2 border-ink pt-6 sm:mt-16 lg:mt-20 lg:grid-cols-4 lg:gap-12">
            <div className="min-w-0">
              <dt className="mb-3 text-xs tracking-[0.12em] text-muted uppercase">Based</dt>
              <dd className="text-[22px] leading-tight font-extrabold lg:text-[32px]">Copenhagen</dd>
            </div>
            <div className="min-w-0">
              <dt className="mb-3 text-xs tracking-[0.12em] text-muted uppercase">Since</dt>
              <dd className="text-[22px] leading-tight font-extrabold lg:text-[32px]">2014</dd>
            </div>
            <div className="min-w-0">
              <dt className="mb-3 text-xs tracking-[0.12em] text-muted uppercase">Format</dt>
              <dd className="text-[22px] leading-tight font-extrabold lg:text-[32px]">Large-format and digital</dd>
            </div>
            <div className="min-w-0">
              <dt className="mb-3 text-xs tracking-[0.12em] text-muted uppercase">Available</dt>
              <dd className="text-[22px] leading-tight font-extrabold text-clay-deep lg:text-[32px]">January 2027</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="contact" className="scroll-mt-16 flex flex-col border-t-2 border-ink/20 bg-sky lg:flex-row" aria-labelledby="contact-title">
        <figure className="relative aspect-[4/5] min-w-0 overflow-hidden bg-paper sm:aspect-[5/4] lg:aspect-auto lg:w-[42%] lg:max-w-[600px]">
          <img
            className="h-full w-full object-cover"
            src="/assets/img/contact.jpg"
            width="1000"
            height="1400"
            alt="A sunlit lane before the city wakes"
            loading="lazy"
          />
          <figcaption className="absolute bottom-0 left-0 flex items-baseline gap-2.5 bg-paper px-3.5 py-2.5 text-xs">
            <b className="font-semibold text-clay-deep">07:40</b>
            <span>— Nørrebro, before the first tram</span>
          </figcaption>
        </figure>
        <div className="flex min-w-0 flex-1 flex-col gap-9 px-5 py-12 sm:px-8 sm:py-16 lg:px-[72px] lg:py-20">
          <div>
            <p className="text-[13px] leading-none tracking-[0.12em] text-clay-deep uppercase">Contact</p>
            <h2 id="contact-title" className="my-5 max-w-[14ch] text-[32px] leading-none font-extrabold sm:text-5xl lg:text-[68px]">
              Let's book the morning.
            </h2>
            <p className="max-w-[44ch] text-base leading-relaxed sm:text-lg">
              Tell me about the building and when it will be ready. I reply within two working days — and I shoot before eight.
            </p>
          </div>
          <form className="flex max-w-[760px] flex-col gap-8" action="mailto:hello@lenavoss.com" method="post" encType="text/plain" aria-label="Booking request">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-10">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="f-name">Name</label>
                <input id="f-name" className={fieldInput} name="name" type="text" required autoComplete="name" placeholder="Your name" />
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="f-email">Email</label>
                <input id="f-email" className={fieldInput} name="email" type="email" required autoComplete="email" placeholder="you@studio.com" />
              </div>
            </div>
            <fieldset className="m-0 flex min-w-0 flex-col gap-1.5 border-0 p-0">
              <legend className="mb-2.5 p-0 text-xs tracking-[0.1em] text-muted uppercase">What are we shooting?</legend>
              <div className="flex flex-wrap gap-2">
                {shootTypes.map((type) => (
                  <label key={type} className="cursor-pointer">
                    <input className="peer sr-only" type="radio" name="type" value={type} defaultChecked={type === 'Completed building'} />
                    <span className="inline-block border border-ink px-4 py-2.5 text-sm leading-none peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay hover:bg-ink/10">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="f-date">Preferred dates</label>
              <input id="f-date" className={fieldInput} name="dates" type="text" placeholder="e.g. late March 2027" />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="f-msg">About the project</label>
              <textarea id="f-msg" className={`${fieldInput} resize-y text-base leading-snug sm:text-xl`} name="message" rows="3" placeholder="Location, architect, and what the photographs are for" />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-7 gap-y-4">
              <button className="inline-flex min-h-14 min-w-[min(100%,280px)] items-center justify-between gap-8 bg-ink px-5 text-[15px] font-extrabold text-paper hover:bg-clay-deep" type="submit">
                <span>Send request</span>
                <span aria-hidden="true">→</span>
              </button>
              <span className="text-sm text-muted">
                or write directly — <a className="text-ink hover:text-clay" href="mailto:hello@lenavoss.com">hello@lenavoss.com</a>
              </span>
            </div>
          </form>
        </div>
      </section>

      {openWork ? (
        <div
          className="fixed inset-0 z-30 grid grid-rows-[auto_minmax(0,1fr)_auto] bg-paper/95 text-ink"
          role="dialog"
          aria-modal="true"
          aria-label={`${openWork.title}, ${openWork.place}, ${openWork.year}`}
        >
          <div className="flex items-center justify-between gap-4 border-b-2 border-ink/20 px-4 py-3.5 text-[13px] tracking-[0.1em] uppercase">
            <span>
              <b className="font-semibold text-clay-deep">{openWork.id}</b> / {String(works.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="inline-flex min-h-10 items-center border border-ink px-3.5 py-2 text-sm font-extrabold tracking-normal text-ink normal-case hover:bg-ink hover:text-paper"
              onClick={() => setOpenId(null)}
            >
              Close
            </button>
          </div>
          <button type="button" className="min-h-0 p-4" aria-label="Close viewer" onClick={() => setOpenId(null)}>
            <img
              className="mx-auto h-full max-h-full w-full object-contain"
              src={openWork.src}
              width={openWork.width}
              height={openWork.height}
              alt={openWork.alt}
            />
          </button>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t-2 border-ink/20 px-4 pt-3.5 pb-6">
            <span className="text-base font-extrabold sm:text-xl">
              {openWork.title}, {openWork.place} <span className="font-normal text-muted">{openWork.year}</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex min-h-10 items-center border border-ink px-3.5 py-2 text-sm font-extrabold hover:bg-ink hover:text-paper"
                onClick={() => showNext(-1)}
              >
                ← Prev
              </button>
              <button
                type="button"
                className="inline-flex min-h-10 items-center border border-ink px-3.5 py-2 text-sm font-extrabold hover:bg-ink hover:text-paper"
                onClick={() => showNext(1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default MainContent
