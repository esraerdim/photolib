import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useSession } from '../useSession.js'

function formatEuros(cents) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
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
          const next = await api(`/api/orders/session/${encodeURIComponent(sessionId)}`)
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

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1400px] flex-col justify-center px-5 py-16 sm:px-8 lg:px-[72px]">
      <p className="text-[13px] tracking-[0.12em] text-clay-deep uppercase">Order</p>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">
        {status === 'paid' ? 'Paid' : null}
        {status === 'pending' ? 'Confirming payment' : null}
        {status === 'loading' ? 'Checking payment' : null}
        {status === 'signedOut' ? 'Sign in to see this order' : null}
        {status === 'error' ? 'Order not found' : null}
      </h1>
      {status === 'pending' ? (
        <p className="mt-4 max-w-[36ch] text-lg">The payment is in. Waiting a moment for confirmation.</p>
      ) : null}
      {status === 'paid' && order ? (
        <ul className="mt-8 max-w-xl border-t-2 border-ink">
          {order.items.map((item) => (
            <li key={item.workId} className="flex items-baseline justify-between gap-6 border-b border-ink/20 py-3">
              <span className="text-lg font-extrabold">{item.title}</span>
              <span>{formatEuros(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
          <li className="flex items-baseline justify-between gap-6 py-3 text-lg font-extrabold">
            <span>Total</span>
            <span>{formatEuros(total)}</span>
          </li>
        </ul>
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
    </section>
  )
}

export default OrderSuccess
