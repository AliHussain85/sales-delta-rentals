import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2, LockKeyhole } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { session, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const result = await signIn(email.trim(), password)
    if (result.error) {
      setError(result.error)
    }
    setSubmitting(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_55%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 ring-1 ring-gold/30">
            <span className="text-lg font-bold text-gold-light">DR</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Delta Rentals</h1>
          <p className="mt-2 text-sm text-neutral-400">Sign in to access the sales dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/40"
        >
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-300">
            <LockKeyhole className="h-4 w-4 text-gold" />
            Secure login
          </div>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-border bg-neutral-900 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
              placeholder="you@deltarentalsdubai.com"
            />
          </label>

          <label className="mb-5 block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-border bg-neutral-900 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
