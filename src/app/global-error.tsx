'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global error]', error)
  }, [error])

  return (
    <html lang="en" className="dark">
      <body style={{ background: '#090c12', color: '#e8edf3', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, padding: '24px' }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Application error</h1>
          <p style={{ fontSize: 13, color: '#6b7280', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: 16 }}>
            {error.message}
          </p>
          {error.digest && (
            <p style={{ fontSize: 11, color: '#4b5563', marginBottom: 16 }}>Digest: {error.digest}</p>
          )}
          <button
            onClick={reset}
            style={{ background: '#15d9d0', color: '#090c12', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
