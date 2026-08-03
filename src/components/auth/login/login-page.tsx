import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Building2,
  User,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react'

import { useLogin } from '#/hooks/auth/useLogin'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { LOGIN_CONTENT } from '#/utils/login-content.ts'
import { cn } from '#/lib/utils.ts'

const loginSchema = z.object({
  username: z.string().min(1, LOGIN_CONTENT.validation.usernameRequired).trim(),
  password: z.string().min(1, LOGIN_CONTENT.validation.passwordRequired),
})

type LoginFormValues = z.infer<typeof loginSchema>

const copy = LOGIN_CONTENT

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const { mutate: submitLogin, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = (data: LoginFormValues) => {
    submitLogin(data)
  }

  const serverError = error?.message ?? null

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-off-white">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-tan-light/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-tan-accent/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[450px] rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200 bg-white shadow-md rise-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-tan-light border border-slate-200 shadow-xs mb-3">
            <Building2 className="size-8 text-tan-dark" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight display-title text-slate-900 mb-1">
            {copy.branding.title}
          </h1>
          <p className="text-sm text-slate-600 max-w-[340px] mx-auto">
            {copy.branding.subtitle}
          </p>
        </div>

        {serverError && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-xs font-medium mb-5">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-semibold text-slate-900">
              {copy.fields.usernameLabel}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                id="username"
                type="text"
                placeholder={copy.fields.usernamePlaceholder}
                autoComplete="username"
                {...register('username')}
                className={cn(
                  'pl-9 bg-slate-50 border-slate-200 text-slate-900',
                  errors.username && 'border-destructive/60 focus-visible:ring-destructive/30',
                )}
                disabled={isPending}
              />
            </div>
            {errors.username && (
              <p className="flex items-center gap-1 text-[11px] text-destructive font-medium">
                <AlertCircle className="size-3 shrink-0" />
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-900">
              {copy.fields.passwordLabel}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={copy.fields.passwordPlaceholder}
                autoComplete="current-password"
                {...register('password')}
                className={cn(
                  'pl-9 pr-10 bg-slate-50 border-slate-200 text-slate-900',
                  errors.password && 'border-destructive/60 focus-visible:ring-destructive/30',
                )}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer focus:outline-hidden"
                title={
                  showPassword ? copy.actions.hidePassword : copy.actions.showPassword
                }
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1 text-[11px] text-destructive font-medium">
                <AlertCircle className="size-3 shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-5 rounded-xl text-white bg-tan-dark hover:bg-tan-dark/90 focus-visible:ring-[3px] focus-visible:ring-tan-dark/50 shadow-md transition-all duration-300 active:scale-98"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  {copy.actions.signIn}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
