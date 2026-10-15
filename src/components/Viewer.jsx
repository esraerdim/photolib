function Viewer({ work, total, onClose, onPrev, onNext }) {
  return (
    <div
      className="fixed inset-0 z-30 grid grid-rows-[auto_minmax(0,1fr)_auto] bg-paper/95 text-ink"
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title}, ${work.place}, ${work.year}`}
    >
      <div className="flex items-center justify-between gap-4 border-b-2 border-ink/20 px-4 py-3.5 text-[13px] tracking-[0.1em] uppercase">
        <span>
          <b className="font-semibold text-clay-deep">{work.id}</b> / {String(total).padStart(2, '0')}
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
        <div className="flex gap-2">
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
      </div>
    </div>
  )
}

export default Viewer
