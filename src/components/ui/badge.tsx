import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'default' | 'success' | 'warning'

const variantStyles: Record<Variant, string> = {
  default: 'bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-white',
  success: 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/40',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-100 dark:border-amber-500/40',
}

export function Badge({ className, variant = 'default', ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold', variantStyles[variant], className)} {...props} />
}
