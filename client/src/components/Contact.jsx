const shootTypes = [
  'Completed building',
  'Interior',
  'Construction progress',
  'Editorial feature',
]

const fieldInput =
  'w-full min-w-0 border-0 border-b-2 border-ink bg-transparent px-0 py-2.5 text-lg text-ink outline-none placeholder:text-ink/40 focus-visible:border-clay sm:text-2xl'

function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 flex flex-col border-t-2 border-ink/20 bg-sky lg:flex-row" aria-labelledby="contact-title">
      <figure className="relative aspect-[4/5] w-full min-w-0 overflow-hidden bg-paper sm:aspect-[5/4] lg:aspect-auto lg:w-[42%] lg:max-w-[600px] lg:self-stretch">
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
  )
}

export default Contact
