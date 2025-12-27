import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string // emoji or URL
  unlocked: boolean
  progress?: number // 0-100
}

type AchievementRowProps = {
  achievement: Achievement
  featured?: boolean
}

export function AchievementRow({ achievement, featured = false }: AchievementRowProps) {
  const isLocked = !achievement.unlocked
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-4 transition duration-150 hover:bg-slate-100 dark:hover:bg-slate-800/80',
        featured && 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900',
      )}
    >
      <div
        className={cn(
          'grid h-12 w-12 place-items-center rounded-lg bg-slate-200 dark:bg-slate-800 text-2xl text-slate-900 dark:text-slate-50 shadow-inner',
          isLocked && 'grayscale opacity-70',
          featured && 'h-14 w-14 text-3xl',
        )}
      >
        {achievement.icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <p className={cn('text-sm font-semibold text-slate-900 dark:text-slate-50', isLocked && 'text-slate-400 dark:text-slate-500')}>{achievement.title}</p>
          {isLocked ? (
            <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Locked</span>
          ) : achievement.progress !== undefined ? (
            <span className="text-xs text-emerald-300">{achievement.progress}%</span>
          ) : null}
        </div>
        <p className={cn('text-xs text-slate-600 dark:text-slate-300', isLocked && 'text-slate-400 dark:text-slate-500')}>{achievement.description}</p>
        {achievement.progress !== undefined && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500"
              style={{ width: `${Math.min(100, Math.max(0, achievement.progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

type LockedAchievementsStripProps = {
  locked: Achievement[]
  maxVisible?: number
}

export function LockedAchievementsStrip({ locked, maxVisible = 8 }: LockedAchievementsStripProps) {
  const visible = locked.slice(0, maxVisible)
  const remaining = Math.max(0, locked.length - visible.length)

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Locked achievements</div>
      <div className="flex items-center gap-2">
        {visible.map((ach) => (
          <div
            key={ach.id}
            className="grid h-10 w-10 place-items-center rounded-md bg-slate-200 dark:bg-slate-800 text-lg text-slate-400 dark:text-slate-500 grayscale"
            title={ach.title}
          >
            {ach.icon}
          </div>
        ))}
        {remaining > 0 && (
          <div className="grid h-10 w-10 place-items-center rounded-md border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-500 dark:text-slate-400">
            +{remaining}
          </div>
        )}
      </div>
    </div>
  )
}

type AchievementsSectionProps = {
  achievements: Achievement[]
  title?: string
}

type AchievementsModalProps = {
  isOpen: boolean
  onClose: () => void
  achievements: Achievement[]
}

function AchievementsModal({ isOpen, onClose, achievements }: AchievementsModalProps) {
  const unlocked = achievements.filter((a) => a.unlocked)
  const locked = achievements.filter((a) => !a.unlocked)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 p-4 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">All Achievements</h2>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 dark:bg-slate-800 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4">
          {/* Unlocked section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Unlocked ({unlocked.length})
              </h3>
            </div>
            <div className="space-y-2">
              {unlocked.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3 transition hover:bg-slate-100 dark:hover:bg-slate-800/60"
                >
                  <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-slate-200 dark:bg-slate-800 text-lg">
                    {ach.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">{ach.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{ach.description}</p>
                  </div>
                  {ach.progress !== undefined && (
                    <span className="flex-shrink-0 text-xs text-emerald-300">{ach.progress}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Locked section */}
          {locked.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  Locked ({locked.length})
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {locked.map((ach) => (
                  <div
                    key={ach.id}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/30 p-3 transition hover:bg-slate-200 dark:hover:bg-slate-800/40"
                    title={ach.title}
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-200 dark:bg-slate-800 text-2xl grayscale opacity-60 group-hover:opacity-75 transition">
                      {ach.icon}
                    </div>
                    <p className="text-center text-[10px] font-medium text-slate-500 group-hover:text-slate-400 dark:group-hover:text-slate-400 line-clamp-2 transition">
                      {ach.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {achievements.length === 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 text-center text-sm text-slate-600 dark:text-slate-400">
              No achievements yet. Keep playing!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AchievementsSection({ achievements, title = 'Achievements' }: AchievementsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const unlocked = achievements.filter((a) => a.unlocked)
  const locked = achievements.filter((a) => !a.unlocked)
  const percent = achievements.length ? Math.round((unlocked.length / achievements.length) * 100) : 0
  const featured = unlocked[0] ?? locked[0]
  const rest = achievements.filter((a) => a.id !== featured?.id)

  return (
    <>
      <section className="w-full space-y-4 rounded-2xl border border-gray-200 bg-white dark:glass dark:bg-surface-dark dark:border-white/10 p-4 shadow-sm">
      <header className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
          <span className="text-xs text-slate-600 dark:text-slate-400">You've unlocked {unlocked.length} / {achievements.length} ({percent}%)</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </header>

      {featured && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Featured</div>
          <AchievementRow achievement={featured} featured />
        </div>
      )}

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">All achievements</div>
        <div className="space-y-2">
          {rest.map((ach) => (
            <AchievementRow key={ach.id} achievement={ach} />
          ))}
          {rest.length === 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 text-sm text-slate-600 dark:text-slate-400">No achievements yet.</div>
          )}
        </div>
      </div>

      {locked.length > 0 && <LockedAchievementsStrip locked={locked} />}

      <div className="flex gap-3 pt-2">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-medium transition"
        >
          View my achievements
        </Button>
      </div>
    </section>

    <AchievementsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} achievements={achievements} />
    </>
  )
}
