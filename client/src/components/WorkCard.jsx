import StarRating from './StarRating.jsx'

function WorkCard({ work, rating, saved, onRate, onSave, onOpen }) {
  return (
    <figure id={`work-${work.id}`} className="flex min-w-0 scroll-mt-20 flex-col bg-paper">
      <button
        type="button"
        className="group relative block aspect-[4/5] w-full overflow-hidden bg-sand"
        aria-label={`View ${work.title}, ${work.place}`}
        onClick={() => onOpen(work.id)}
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
      <figcaption className="flex flex-col gap-2 px-3 pt-2.5 pb-3">
        <div className="flex justify-between gap-3 text-[12.5px] leading-snug">
          <span>
            <b className="font-semibold text-clay-deep">{work.id}</b> {work.title}, {work.place}
          </span>
          <span className="text-muted">{work.year}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <StarRating value={rating} onChange={onRate} />
          <button
            type="button"
            className={`px-0.5 text-lg leading-none ${saved ? 'text-clay' : 'text-ink/25'}`}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${work.title} from saved` : `Save ${work.title}`}
            onClick={onSave}
          >
            {saved ? '♥' : '♡'}
          </button>
        </div>
      </figcaption>
    </figure>
  )
}

export default WorkCard
