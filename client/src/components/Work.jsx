import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useSession } from '../useSession.js'
import Viewer from './Viewer.jsx'
import WorkCard from './WorkCard.jsx'

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

function Work({ savedOnly = false }) {
  const { user, ready, askToSignIn } = useSession()
  const [works, setWorks] = useState([])
  const [status, setStatus] = useState('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const [year, setYear] = useState('all')
  const [openId, setOpenId] = useState(null)
  const years = [...new Set(works.map((work) => work.year))].sort((a, b) => b - a)
  const visible = savedOnly
    ? works.filter((work) => work.saved)
    : year === 'all'
      ? works
      : works.filter((work) => work.year === year)
  const openIndex = visible.findIndex((work) => work.id === openId)
  const openWork = openIndex === -1 ? null : visible[openIndex]

  useEffect(() => {
    if (!ready) return undefined
    let ignore = false

    async function load() {
      for (let attempt = 0; attempt < 4; attempt += 1) {
        try {
          const rows = await api('/api/works')
          if (!ignore) {
            setWorks(rows)
            setStatus('ready')
          }
          return
        } catch {
          if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 700))
        }
      }
      if (!ignore) setStatus('error')
    }

    load()

    return () => {
      ignore = true
    }
  }, [ready, user, reloadKey])

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

  function patchWork(id, patch) {
    setWorks((current) => current.map((work) => (work.id === id ? { ...work, ...patch } : work)))
  }

  async function changeRating(id, value) {
    if (!user) {
      askToSignIn()
      return
    }
    const previous = works.find((work) => work.id === id)?.rating ?? 0
    patchWork(id, { rating: value })
    try {
      await api(`/api/works/${id}/rating`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
      })
    } catch {
      patchWork(id, { rating: previous })
    }
  }

  async function changeSaved(id) {
    if (!user) {
      askToSignIn()
      return
    }
    const previous = works.find((work) => work.id === id)?.saved ?? false
    patchWork(id, { saved: !previous })
    try {
      await api(`/api/works/${id}/save`, {
        method: 'PUT',
        body: JSON.stringify({ saved: !previous }),
      })
    } catch {
      patchWork(id, { saved: previous })
    }
  }

  const title = savedOnly ? 'Saved' : 'Selected work'
  const titleId = savedOnly ? 'saved-title' : 'work-title'

  return (
    <section id={savedOnly ? 'saved' : 'work'} className="scroll-mt-16" aria-labelledby={titleId}>
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end gap-x-6 gap-y-2 px-5 pt-12 pb-7 sm:px-8 sm:pt-16 lg:px-[72px] lg:pt-20">
        <h2 id={titleId} className="text-3xl leading-none font-extrabold sm:text-5xl lg:text-[56px]">
          {title}
        </h2>
        <p className="text-[13px] leading-none tracking-[0.12em] text-clay-deep uppercase sm:ml-auto">
          {status === 'ready' ? `${visible.length} ${visible.length === 1 ? 'photograph' : 'photographs'}` : ''}
          {!savedOnly && status === 'ready' ? (year === 'all' ? ' · 2021–2026' : ` · ${year}`) : ''}
        </p>
      </div>
      {savedOnly ? null : (
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-2 px-5 pb-6 sm:px-8 lg:px-[72px]" role="group" aria-label="Filter by year">
          <YearButton current={year} value="all" onChoose={chooseYear}>All</YearButton>
          {years.map((item) => (
            <YearButton key={item} current={year} value={item} onChoose={chooseYear}>{item}</YearButton>
          ))}
        </div>
      )}
      {status === 'loading' ? <p className="px-5 pb-12 text-muted sm:px-8 lg:px-[72px]">Loading photographs…</p> : null}
      {status === 'error' ? (
        <div className="flex flex-wrap items-center gap-4 px-5 pb-12 sm:px-8 lg:px-[72px]">
          <p className="text-clay-deep">The photographs could not be loaded.</p>
          <button
            type="button"
            className="inline-flex min-h-10 items-center border border-ink bg-paper px-3.5 py-2 text-sm font-extrabold text-ink hover:bg-ink hover:text-paper"
            onClick={() => {
              setStatus('loading')
              setReloadKey((current) => current + 1)
            }}
          >
            Try again
          </button>
        </div>
      ) : null}
      {status === 'ready' && savedOnly && visible.length === 0 ? (
        <p className="max-w-[36ch] px-5 pb-16 text-lg sm:px-8 lg:px-[72px]">No saved photographs yet. Use the heart on a picture to keep it here.</p>
      ) : null}
      {status === 'ready' && visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-0.5 border-y-2 border-ink/20 bg-ink/20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              rating={work.rating ?? 0}
              saved={Boolean(work.saved)}
              onRate={(value) => changeRating(work.id, value)}
              onSave={() => changeSaved(work.id)}
              onOpen={setOpenId}
            />
          ))}
        </div>
      ) : null}
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
