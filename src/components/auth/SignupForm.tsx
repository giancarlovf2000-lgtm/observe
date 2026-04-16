'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignupInput = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

  async function onSubmit(data: SignupInput) {
    setError(null)
    const supabase = createClient()

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${siteUrl}/api/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      return
    }

    setSuccess(true)
    // Redirect to dashboard after brief delay
    setTimeout(() => router.push('/onboarding'), 1500)
  }

  if (success) {
    return (
      <div className="w-full max-w-sm">
        <div className="glass-elevated rounded-2xl border border-[var(--obs-teal)]/20 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--obs-teal)]/15 border border-[var(--obs-teal)]/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-[var(--obs-teal)] text-xl">✓</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Account Created</h2>
          <p className="text-sm text-muted-foreground">
            Welcome to OBSERVE. Redirecting to your command center…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="glass-elevated rounded-2xl border border-white/8 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Start monitoring the world in minutes
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm text-muted-foreground">Full name</Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              className="bg-background/50 border-border/60 focus:border-[var(--obs-teal)]"
              {...register('fullName')}
            />
            {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="bg-background/50 border-border/60 focus:border-[var(--obs-teal)]"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              className="bg-background/50 border-border/60 focus:border-[var(--obs-teal)]"
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="bg-background/50 border-border/60 focus:border-[var(--obs-teal)]"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-10 font-medium mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account…</>
            ) : (
              <><UserPlus className="w-4 h-4 mr-2" />Create Account</>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing up, you agree to our{' '}
          <Link href="#" className="text-[var(--obs-teal)] hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="#" className="text-[var(--obs-teal)] hover:underline">Privacy Policy</Link>.
        </p>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--obs-teal)] hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
