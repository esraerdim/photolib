function formatEuros(cents) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function photographName(work) {
  const match = String(work.src ?? '').toLowerCase().match(/\.(jpe?g|png|webp)$/)
  const ext = match ? `.${match[1] === 'jpeg' ? 'jpg' : match[1]}` : '.jpg'
  const base = String(work.title ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'photograph'
  return `${base}${ext}`
}

function Viewer({ work, position, total, buying, buyError, onBuy, onClose, onPrev, onNext }) {
  return (
    <div
      className="fixed inset-0 z-30 grid grid-rows-[auto_minmax(0,1fr)_auto] bg-paper/95 text-ink"
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title}, ${work.place}, ${work.year}`}
    >
      <div className="flex items-center justify-between gap-4 border-b-2 border-ink/20 px-4 py-3.5 text-[13px] tracking-[0.1em] uppercase">
        <span>
              <b className="font-semibold text-clay-deep">{String(position).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}
        </span>
        <button
          type="button"
          className="inline-flex min-h-10 items-center border border-ink px-3.5 py-2 text-sm font-extrabold tracking-normal text-ink normal-case hover:bg-ink hover:text-paper"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <button type="button" className="min-h-0 p-4" aria-label="Close viewer" onClick={onClose}>
        <img
          className="mx-auto h-full max-h-full w-full object-contain"
          src={work.src}
          width={work.width}
          height={work.height}
          alt={work.alt}
        />
      </button>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t-2 border-ink/20 px-4 pt-3.5 pb-6">
        <span className="text-base font-extrabold sm:text-xl">
          {work.title}, {work.place} <span className="font-normal text-muted">{work.year}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {work.owned ? (
            <a
              href={work.src}
              download={photographName(work)}
              className="inline-flex min-h-10 items-center border border-ink bg-ink px-3.5 py-2 text-sm font-extrabold text-paper no-underline hover:bg-clay"
            >
              Download · yours
            </a>
          ) : (
            <button
              type="button"
              className="inline-flex min-h-10 items-center border border-ink bg-ink px-3.5 py-2 text-sm font-extrabold text-paper hover:bg-clay disabled:opacity-60"
              disabled={buying}
              onClick={onBuy}
            >
              {buying ? 'Opening checkout' : `Buy print · ${formatEuros(work.price_cents)}`}
            </button>
          )}
          <button
            type="button"
            className="inline-flex min-h-10 items-center border border-ink px-3.5 py-2 text-sm font-extrabold hover:bg-ink hover:text-paper"
            onClick={onPrev}
          >
            ← Prev
          </button>
          <button
            type="button"
            className="inline-flex min-h-10 items-center border border-ink px-3.5 py-2 text-sm font-extrabold hover:bg-ink hover:text-paper"
            onClick={onNext}
          >
            Next →
          </button>
        </div>
        {buyError ? (
          <p className="basis-full border-l-2 border-clay-deep bg-paper/60 px-3.5 py-2.5 text-sm text-clay-deep" role="alert">
            {buyError}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default Viewer
