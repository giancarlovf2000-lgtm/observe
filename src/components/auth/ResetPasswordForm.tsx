'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, KeyRound, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})
type Input = z.infer<typeof schema>

export function ResetPasswordForm() {
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Input>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: Input) {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.updateUser({ password: data.password })
    if (authError) {
      setError(authError.message)
      return
    }
    setDone(true)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="glass-elevated rounded-2xl border border-white/8 p-8">
        {done ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--obs-teal)]/15 border border-[var(--obs-teal)]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-[var(--obs-teal)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Password updated</h2>
              <p className="text-sm text-muted-foreground mt-2">Your new password has been saved.</p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--obs-teal)] hover:underline"
            >
              Go to dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
              <p className="text-sm text-muted-foreground mt-1.5">Choose a strong password for your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm text-muted-foreground">New password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="bg-background/50 border-border/60 focus:border-[var(--obs-teal)] focus:ring-[var(--obs-teal)]/20"
                  {...register('password')}
                />
                {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-sm text-muted-foreground">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="bg-background/50 border-border/60 focus:border-[var(--obs-teal)] focus:ring-[var(--obs-teal)]/20"
                  {...register('confirm')}
                />
                {errors.confirm && <p className="text-xs text-red-400">{errors.confirm.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-10 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating…</>
                ) : (
                  <><KeyRound className="w-4 h-4 mr-2" />Update Password</>
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
