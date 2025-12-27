import { cn } from '../../lib/utils'

export function Progress({ value, className }: { value: number; className?: string }) {
  const width = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10', className)}>
      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-500 dark:to-purple-500" style={{ width: `${width}%` }} />
    </div>
  )
}
