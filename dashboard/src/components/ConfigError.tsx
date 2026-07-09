type ConfigErrorProps = {
  message: string
}

export function ConfigError({ message }: ConfigErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="max-w-lg rounded-2xl border border-red-500/30 bg-neutral-900 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-400">
          Configuration error
        </p>
        <p className="mt-4 text-sm leading-relaxed text-neutral-300">{message}</p>
        <div className="mt-6 rounded-xl border border-border bg-neutral-950 p-4 text-left text-xs text-neutral-400">
          <p className="font-semibold text-neutral-200">Netlify fix:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>Site settings → Environment variables</li>
            <li>Add <code className="text-gold">VITE_SUPABASE_URL</code></li>
            <li>Add <code className="text-gold">VITE_SUPABASE_ANON_KEY</code></li>
            <li>Deploys → Trigger deploy → Clear cache and deploy</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
