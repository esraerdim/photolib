import { useEffect, useState } from 'react'
import { works } from '../data/works.js'
import Viewer from './Viewer.jsx'
import WorkCard from './WorkCard.jsx'

function Work() {
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
          <WorkCard key={work.id} work={work} onOpen={setOpenId} />
        ))}
      </div>
      {openWork ? (
        <Viewer
          work={openWork}
          total={works.length}
          onClose={() => setOpenId(null)}
          onPrev={() => showNext(-1)}
          onNext={() => showNext(1)}
        />
      ) : null}
    </section>
  )
}

export default Work
