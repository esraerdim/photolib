import { useEffect, useState } from 'react'
import { works } from '../data/works.js'
import Viewer from './Viewer.jsx'
import WorkCard from './WorkCard.jsx'

const years = [...new Set(works.map((work) => work.year))].sort((a, b) => b - a)

function YearButton({ current, value, onChoose, children }) {
  const selected = current === value
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex min-h-10 items-center border px-3.5 py-2 text-sm font-extrabold ${selected ? 'border-ink bg-ink text-paper' : 'border-ink/30 text-ink hover:border-ink'}`}
      onClick={() => onChoose(value)}
    >
      {children}
    </button>
  )
}

function Work() {
  const [year, setYear] = useState('all')
  const [openId, setOpenId] = useState(null)
  const visible = year === 'all' ? works : works.filter((work) => work.year === year)
  const openIndex = visible.findIndex((work) => work.id === openId)
  const openWork = openIndex === -1 ? null : visible[openIndex]

  useEffect(() => {
    if (!openWork) return undefined

    function onKey(event) {
      if (event.key === 'Escape') setOpenId(null)
      if (event.key === 'ArrowRight') setOpenId(visible[(openIndex + 1) % visible.length].id)
      if (event.key === 'ArrowLeft') {
        setOpenId(visible[(openIndex - 1 + visible.length) % visible.length].id)
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openWork, openIndex, visible])

  function showNext(step) {
    const next = (openIndex + step + visible.length) % visible.length
    setOpenId(visible[next].id)
  }

  function chooseYear(nextYear) {
    setYear(nextYear)
    const nextVisible = nextYear === 'all' ? works : works.filter((work) => work.year === nextYear)
    if (openId && !nextVisible.some((work) => work.id === openId)) setOpenId(null)
  }

  return (
    <section id="work" className="scroll-mt-16" aria-labelledby="work-title">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end gap-x-6 gap-y-2 px-5 pt-12 pb-7 sm:px-8 sm:pt-16 lg:px-[72px] lg:pt-20">
        <h2 id="work-title" className="text-3xl leading-none font-extrabold sm:text-5xl lg:text-[56px]">
          Selected work
        </h2>
        <p className="text-[13px] leading-none tracking-[0.12em] text-clay-deep uppercase sm:ml-auto">
          {visible.length} {visible.length === 1 ? 'photograph' : 'photographs'}
          {year === 'all' ? ' · 2021–2026' : ` · ${year}`}
        </p>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-wrap gap-2 px-5 pb-6 sm:px-8 lg:px-[72px]" role="group" aria-label="Filter by year">
        <YearButton current={year} value="all" onChoose={chooseYear}>All</YearButton>
        {years.map((item) => (
          <YearButton key={item} current={year} value={item} onChoose={chooseYear}>{item}</YearButton>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-0.5 border-y-2 border-ink/20 bg-ink/20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((work) => (
          <WorkCard key={work.id} work={work} onOpen={setOpenId} />
        ))}
      </div>
      {openWork ? (
        <Viewer
          work={openWork}
          position={openIndex + 1}
          total={visible.length}
          onClose={() => setOpenId(null)}
          onPrev={() => showNext(-1)}
          onNext={() => showNext(1)}
        />
      ) : null}
    </section>
  )
}

export default Work
