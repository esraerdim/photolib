function About() {
  return (
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
  )
}

export default About
