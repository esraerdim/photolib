import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useSession } from '../useSession.js'

function formatEuros(cents) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function photographName(item) {
  const match = String(item.src ?? '').toLowerCase().match(/\.(jpe?g|png|webp)$/)
  const ext = match ? `.${match[1] === 'jpeg' ? 'jpg' : match[1]}` : '.jpg'
  const base = String(item.title ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'photograph'
  return `${base}${ext}`
}

async function withPhotographs(order) {
  if (!order?.items?.some((item) => !item.src)) return order
  const works = await api('/api/works')
  const byId = new Map(works.map((work) => [work.id, work]))
  return {
    ...order,
    items: order.items.map((item) => {
      const work = byId.get(item.workId) ?? works.find((row) => row.title === item.title)
      if (!work?.src) return item
      return {
        ...item,
        src: item.src || work.src,
        alt: item.alt || work.alt,
        place: item.place || work.place,
        year: item.year ?? work.year,
        width: item.width || work.width,
        height: item.height || work.height,
      }
    }),
  }
}

function OrderSuccess({ sessionId }) {
  const { askToSignIn } = useSession()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let ignore = false

    async function load() {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          const next = await withPhotographs(await api(`/api/orders/session/${encodeURIComponent(sessionId)}`, {
            cache: 'no-store',
          }))
          if (ignore) return
          setOrder(next)
          if (next.status === 'paid') {
            setStatus('paid')
            return
          }
          setStatus('pending')
        } catch (err) {
          if (ignore) return
          if (err.status === 401) {
            setStatus('signedOut')
            return
          }
          if (attempt === 4) setStatus('error')
        }
        if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [sessionId])

  const total = (order?.items ?? []).reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  )
  const paid = status === 'paid' && order

  return (
    <section className="border-b-2 border-ink/20">
      <div className={`mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-[72px] ${paid ? 'py-12 lg:py-20' : 'flex min-h-[60vh] flex-col justify-center py-16'}`}>
        {paid ? null : (
          <>
            <p className="text-[13px] tracking-[0.12em] text-clay-deep uppercase">Order</p>
            <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">
              {status === 'pending' ? 'Confirming payment' : null}
              {status === 'loading' ? 'Checking payment' : null}
              {status === 'signedOut' ? 'Sign in to see this order' : null}
              {status === 'error' ? 'Order not found' : null}
            </h1>
            {status === 'pending' ? (
              <p className="mt-4 max-w-[36ch] text-lg">The payment is in. Waiting a moment for confirmation.</p>
            ) : null}
            {status === 'signedOut' ? (
              <button
                type="button"
                className="mt-8 inline-flex min-h-10 w-fit items-center border border-ink bg-ink px-3.5 py-2 text-sm font-extrabold text-paper hover:bg-clay"
                onClick={askToSignIn}
              >
                Sign in
              </button>
            ) : null}
            <a
              href="/"
              className="mt-8 inline-flex min-h-10 w-fit items-center border border-ink px-3.5 py-2 text-sm font-extrabold text-ink no-underline hover:bg-ink hover:text-paper"
            >
              Back to the work
            </a>
          </>
        )}
        {paid ? order.items.map((item) => {
          return (
            <article key={item.workId} className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
              <figure className="min-w-0 bg-sand">
                {item.src ? (
                  <img
                    className="aspect-[4/5] w-full object-cover"
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    alt={item.alt || item.title}
                  />
                ) : null}
              </figure>
              <div className="min-w-0">
                <p className="text-[13px] tracking-[0.12em] text-clay-deep uppercase">Order</p>
                <h1 className="mt-3 text-5xl font-extrabold sm:text-7xl">Paid</h1>
                <p className="mt-6 text-2xl font-extrabold sm:text-3xl">{item.title}</p>
                {item.place ? (
                  <p className="mt-1 text-lg text-muted">{item.place}{item.year ? `, ${item.year}` : ''}</p>
                ) : null}
                <p className="mt-6 text-2xl font-extrabold">{formatEuros(item.unitPriceCents * item.quantity)}</p>
                <p className="mt-3 max-w-[32ch] text-base leading-relaxed">The photograph is yours. Download the file you paid for.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {item.src ? (
                    <a
                      href={item.src}
                      download={photographName(item)}
                      className="inline-flex min-h-10 items-center border border-ink bg-ink px-3.5 py-2 text-sm font-extrabold text-paper no-underline hover:bg-clay"
                    >
                      Download photograph
                    </a>
                  ) : null}
                  <a
                    href="/"
                    className="inline-flex min-h-10 items-center border border-ink px-3.5 py-2 text-sm font-extrabold text-ink no-underline hover:bg-ink hover:text-paper"
                  >
                    Back to the work
                  </a>
                </div>
              </div>
            </article>
          )
        }) : null}
        {paid && order.items.length > 1 ? (
          <p className="mt-10 border-t-2 border-ink pt-4 text-lg font-extrabold">Total {formatEuros(total)}</p>
        ) : null}
      </div>
    </section>
  )
}

export default OrderSuccess
