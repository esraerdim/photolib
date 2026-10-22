function StarRating({ value, onChange }) {
  return (
    <div className="flex" role="group" aria-label={`Rating, ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        return (
          <button
            key={star}
            type="button"
            className={`px-0.5 text-lg leading-none ${filled ? 'text-clay' : 'text-ink/25'}`}
            aria-label={`Rate ${star} out of 5`}
            aria-pressed={star === value}
            onClick={() => onChange(star === value ? 0 : star)}
          >
            {filled ? '★' : '☆'}
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
