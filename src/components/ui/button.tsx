import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'outline' | 'ghost' | 'success'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue'
const variantStyles: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 dark:from-blue-500 dark:via-purple-500 dark:to-emerald-400 text-white shadow-md dark:shadow-glow hover:brightness-110 active:scale-[0.99]',
  outline: 'border border-gray-300 text-gray-700 hover:border-gray-400 bg-white hover:bg-gray-50 dark:border-white/10 dark:text-slate-100 dark:hover:border-white/30 dark:bg-white/5',
  ghost: 'text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/5',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-900 dark:hover:bg-emerald-400',
}
const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return <button ref={ref} className={cn(base, variantStyles[variant], sizeStyles[size], className)} {...props} />
  },
)

Button.displayName = 'Button'
