import { useEffect, useState } from 'react'
import { api } from '../api.js'

function formatEuros(cents) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function formatWhen(value) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function Stat({ label, value }) {
  return (
    <div className="px-5 py-5 sm:px-6">
      <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">{label}</dt>
      <dd className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">{value}</dd>
    </div>
  )
}

function Admin() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    api('/api/admin')
      .then((body) => {
        if (!ignore) setData(body)
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Could not load the studio desk')
      })
    return () => {
      ignore = true
    }
  }, [])

  const paidTotal = (data?.orders ?? []).reduce((sum, order) => sum + order.totalCents, 0)

  return (
    <section className="border-b-2 border-ink/20 bg-paper" aria-labelledby="admin-title">
      <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-[72px] lg:py-16">
        <p className="text-[13px] leading-none tracking-[0.12em] text-clay-deep uppercase">Admin</p>
        <h1
          id="admin-title"
          className="mt-4 max-w-[14ch] text-[40px] leading-none font-extrabold tracking-[-0.03em] sm:text-6xl"
        >
          The desk.
        </h1>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted sm:text-lg">
          Messages from the contact form, and the prints that have been paid for.
        </p>

        {error ? (
          <p className="mt-8 border-l-2 border-clay-deep bg-sand/70 px-3.5 py-2.5 text-sm text-clay-deep" role="alert">
            {error}
          </p>
        ) : null}

        {!data && !error ? (
          <p className="loading-line mt-10 w-fit text-sm tracking-[0.12em] text-muted uppercase">Loading the desk</p>
        ) : null}

        {data ? (
          <>
            <dl className="mt-10 grid divide-y-2 divide-ink/20 border-2 border-ink/20 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
              <Stat label="Inquiries" value={data.inquiries.length} />
              <Stat label="Paid prints" value={data.orders.length} />
              <Stat label="Taken" value={formatEuros(paidTotal)} />
            </dl>

            <div className="mt-14 grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="text-[13px] tracking-[0.16em] uppercase">Inquiries</h2>
                {data.inquiries.length === 0 ? (
                  <p className="mt-6 text-muted">No contact form messages yet.</p>
                ) : (
                  <ul className="mt-6 list-none border-t-2 border-ink/20">
                    {data.inquiries.map((inquiry) => (
                      <li key={inquiry.id} className="border-b-2 border-ink/20 py-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <p className="text-xl font-extrabold tracking-[-0.02em]">{inquiry.name}</p>
                          <time className="text-xs tracking-[0.08em] text-muted uppercase" dateTime={inquiry.createdAt}>
                            {formatWhen(inquiry.createdAt)}
                          </time>
                        </div>
                        <p className="mt-2 text-sm">
                          <a className="text-clay-deep underline decoration-clay/40 underline-offset-4" href={`mailto:${inquiry.email}`}>
                            {inquiry.email}
                          </a>
                        </p>
                        <p className="mt-3 text-sm tracking-[0.08em] text-ink uppercase">
                          {inquiry.shootType}
                          {inquiry.preferredDates ? ` · ${inquiry.preferredDates}` : ''}
                        </p>
                        {inquiry.message ? (
                          <p className="mt-3 max-w-[58ch] text-base leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h2 className="text-[13px] tracking-[0.16em] uppercase">Payments</h2>
                {data.orders.length === 0 ? (
                  <p className="mt-6 text-muted">No one has paid for a print yet.</p>
                ) : (
                  <ul className="mt-6 list-none border-t-2 border-ink/20">
                    {data.orders.map((order) => (
                      <li key={order.id} className="border-b-2 border-ink/20 py-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <p className="text-xl font-extrabold tracking-[-0.02em]">{order.buyerName}</p>
                          <time className="text-xs tracking-[0.08em] text-muted uppercase" dateTime={order.createdAt}>
                            {formatWhen(order.createdAt)}
                          </time>
                        </div>
                        <p className="mt-2 text-sm">
                          <a className="text-clay-deep underline decoration-clay/40 underline-offset-4" href={`mailto:${order.buyerEmail}`}>
                            {order.buyerEmail}
                          </a>
                        </p>
                        <ul className="mt-4 list-none">
                          {order.items.map((item, index) => (
                            <li key={`${order.id}-${index}`} className="flex items-baseline justify-between gap-4 py-1 text-sm">
                              <span>
                                {item.title}
                                {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                              </span>
                              <span className="shrink-0 tabular-nums">{formatEuros(item.unitPriceCents * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 flex items-center justify-between gap-4 border-t border-ink/15 pt-3 text-sm font-semibold">
                          <span className="bg-sage px-2 py-1 text-[11px] tracking-[0.14em] uppercase">Paid</span>
                          <span className="tabular-nums">{formatEuros(order.totalCents)}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                {data.pendingCount > 0 ? (
                  <p className="mt-4 text-sm text-muted">
                    {data.pendingCount === 1
                      ? '1 checkout was started and not paid.'
                      : `${data.pendingCount} checkouts were started and not paid.`}
                  </p>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

export default Admin
