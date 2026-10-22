import { useState } from 'react'
import { useSession } from '../useSession.js'

const fieldInput =
  'w-full min-w-0 border-0 border-b-2 border-ink bg-transparent px-0 py-2.5 text-lg text-ink outline-none placeholder:text-ink/40 focus-visible:border-clay sm:text-2xl'

function Account() {
  const { signIn, signUp } = useSession()
  const [mode, setMode] = useState('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const creating = mode === 'sign-up'

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      if (creating) await signUp(name, email, password)
      else await signIn(email, password)
    } catch (err) {
      setError(err.message || 'Could not sign in')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="mx-auto flex max-w-[760px] flex-col gap-8 px-5 py-16 sm:px-8 lg:px-[72px] lg:py-20" aria-labelledby="account-title">
      <div>
        <p className="text-[13px] leading-none tracking-[0.12em] text-clay-deep uppercase">Account</p>
        <h1 id="account-title" className="mt-5 text-[32px] leading-none font-extrabold sm:text-5xl">
          {creating ? 'Create an account' : 'Sign in'}
        </h1>
        <p className="mt-5 max-w-[42ch] text-base leading-relaxed sm:text-lg">
          Stars and saved photographs stay with your account, including after a refresh.
        </p>
      </div>
      <form className="flex max-w-[560px] flex-col gap-8" onSubmit={onSubmit}>
        {creating ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="account-name">Name</label>
            <input id="account-name" className={fieldInput} name="name" type="text" required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="account-email">Email</label>
          <input id="account-email" className={fieldInput} name="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="account-password">Password</label>
          <input id="account-password" className={fieldInput} name="password" type="password" required minLength={8} autoComplete={creating ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {error ? <p className="text-sm text-clay-deep" role="alert">{error}</p> : null}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <button className="inline-flex min-h-14 min-w-[min(100%,240px)] items-center justify-between gap-8 bg-ink px-5 text-[15px] font-extrabold text-paper hover:bg-clay-deep disabled:opacity-60" type="submit" disabled={pending}>
            <span>{creating ? 'Create account' : 'Sign in'}</span>
            <span aria-hidden="true">→</span>
          </button>
          <button
            className="text-sm text-ink underline decoration-ink/30 underline-offset-4 hover:text-clay"
            type="button"
            onClick={() => {
              setMode(creating ? 'sign-in' : 'sign-up')
              setError('')
            }}
          >
            {creating ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Account
