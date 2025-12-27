import { Trophy } from 'lucide-react'
import type { Achievement } from '../../lib/types'
import { formatDate } from '../../lib/utils'
import { Card } from '../ui/card'

export function AchievementsGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {achievements.map((ach) => (
        <Card key={ach.id} className="relative overflow-hidden bg-slate-50 text-slate-800 dark:bg-slate-900/90 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
          <div className="absolute inset-0 opacity-10 dark:opacity-20" aria-hidden>
            <div className="grid-overlay h-full w-full" />
          </div>
          <div className="relative space-y-2">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-200 dark:bg-slate-800 text-xl">{ach.icon}</div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{ach.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Unlocked {formatDate(ach.unlockedAt)}</p>
              </div>
              <span className="ml-auto rounded-full bg-amber-100 dark:bg-amber-900/40 px-3 py-1 text-xs uppercase tracking-wide text-amber-800 dark:text-amber-300">
                {ach.rarity}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{ach.description}</p>
          </div>
        </Card>
      ))}
      {achievements.length === 0 && (
        <Card className="flex items-center gap-3 text-gray-600 dark:text-slate-300">
          <Trophy size={18} />
          <span>No achievements yet. First badge unlocks after a completed session.</span>
        </Card>
      )}
    </div>
  )
}
