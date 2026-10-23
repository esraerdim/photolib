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

  function switchMode(next) {
    setMode(next)
    setError('')
  }

  return (
    <section
      className="flex min-h-[calc(100dvh-6.5rem)] flex-col border-b-2 border-ink/20 bg-sand md:min-h-[calc(100dvh-4.5rem)] lg:flex-row"
      aria-labelledby="account-title"
    >
      <figure className="relative aspect-[4/3] w-full min-w-0 overflow-hidden bg-paper sm:aspect-[16/10] lg:aspect-auto lg:w-[44%] lg:max-w-[640px] lg:min-h-full lg:self-stretch">
        <img
          className="h-full w-full object-cover"
          src="/assets/img/about.jpg"
          width="1000"
          height="1400"
          alt="Soft morning light across a concrete facade"
        />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent px-5 pt-16 pb-5 text-paper sm:px-8">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase opacity-80">Studio access</p>
            <p className="mt-1.5 max-w-[22ch] text-lg leading-snug font-semibold sm:text-xl">
              Keep the work you love close.
            </p>
          </div>
          <span className="shrink-0 text-xs tracking-[0.12em] uppercase opacity-70">Lena Voss</span>
        </figcaption>
      </figure>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-5 py-10 sm:px-8 sm:py-14 lg:px-16 lg:py-20 xl:px-24">
        <div className="mx-auto w-full max-w-[440px]">
          <p className="text-[13px] leading-none tracking-[0.12em] text-clay-deep uppercase">Account</p>
          <h1
            id="account-title"
            className="mt-5 text-[36px] leading-[0.96] font-extrabold tracking-[-0.03em] sm:text-5xl"
          >
            {creating ? (
              <>
                Join the <span className="text-clay">studio.</span>
              </>
            ) : (
              <>
                Welcome <span className="text-clay">back.</span>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-muted sm:text-lg">
            {creating
              ? 'Create an account to rate photographs and save the ones you want to return to.'
              : 'Sign in to pick up your saved photographs and ratings right where you left them.'}
          </p>

          <div
            className="mt-9 flex border-b-2 border-ink/15"
            role="tablist"
            aria-label="Account mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!creating}
              className={`relative -mb-0.5 flex-1 px-1 pb-3 text-[13px] tracking-[0.14em] uppercase transition-colors ${
                !creating
                  ? 'border-b-2 border-ink font-semibold text-ink'
                  : 'border-b-2 border-transparent text-muted hover:text-ink'
              }`}
              onClick={() => switchMode('sign-in')}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={creating}
              className={`relative -mb-0.5 flex-1 px-1 pb-3 text-[13px] tracking-[0.14em] uppercase transition-colors ${
                creating
                  ? 'border-b-2 border-ink font-semibold text-ink'
                  : 'border-b-2 border-transparent text-muted hover:text-ink'
              }`}
              onClick={() => switchMode('sign-up')}
            >
              Create account
            </button>
          </div>

          <form className="mt-9 flex flex-col gap-7" onSubmit={onSubmit}>
            {creating ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="account-name">
                  Name
                </label>
                <input
                  id="account-name"
                  className={fieldInput}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="account-email">
                Email
              </label>
              <input
                id="account-email"
                className={fieldInput}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@studio.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-[0.1em] text-muted uppercase" htmlFor="account-password">
                Password
              </label>
              <input
                id="account-password"
                className={fieldInput}
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete={creating ? 'new-password' : 'current-password'}
                placeholder={creating ? 'At least 8 characters' : '••••••••'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error ? (
              <p className="border-l-2 border-clay-deep bg-paper/60 px-3.5 py-2.5 text-sm text-clay-deep" role="alert">
                {error}
              </p>
            ) : null}

            <button
              className="btn btn-primary mt-1 min-h-14 w-full justify-between gap-8 px-5 text-[15px] font-extrabold tracking-normal normal-case disabled:opacity-60"
              type="submit"
              disabled={pending}
            >
              <span className="btn-label">{creating ? 'Create account' : 'Sign in'}</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Account
