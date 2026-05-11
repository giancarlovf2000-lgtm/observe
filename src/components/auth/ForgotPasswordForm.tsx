'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})
type Input = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Input>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: Input) {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    })
    if (authError) {
      setError(authError.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="glass-elevated rounded-2xl border border-white/8 p-8">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--obs-teal)]/15 border border-[var(--obs-teal)]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-[var(--obs-teal)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                We sent a password reset link to your email address. The link expires in 1 hour.
              </p>
            </div>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-[var(--obs-teal)] hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Forgot password?</h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="bg-background/50 border-border/60 focus:border-[var(--obs-teal)] focus:ring-[var(--obs-teal)]/20"
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-10 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</>
                ) : (
                  <><Mail className="w-4 h-4 mr-2" />Send Reset Link</>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
