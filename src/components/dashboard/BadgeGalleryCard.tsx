import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

type BadgeRarity = 'bronze' | 'silver' | 'gold' | 'legendary'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: BadgeRarity
  unlocked: boolean
}

const mockBadges: Badge[] = [
  {
    id: 'first-aid-hero',
    name: 'First Aid Hero',
    description: 'Sequenced all first-aid steps without hints',
    icon: '🫶',
    rarity: 'gold',
    unlocked: true,
  },
  {
    id: 'number-ninja',
    name: 'Number Ninja',
    description: 'Finished 10 numbering puzzles in a row with 100% accuracy',
    icon: '🔢',
    rarity: 'gold',
    unlocked: false,
  },
  {
    id: 'color-wizard',
    name: 'Color Wizard',
    description: 'Mixed all secondary colors correctly on the first try',
    icon: '🎨',
    rarity: 'gold',
    unlocked: false,
  },
  {
    id: 'story-weaver',
    name: 'Story Weaver',
    description: 'Ordered 5 stories in a row with no mistakes',
    icon: '📖',
    rarity: 'silver',
    unlocked: true,
  },
  {
    id: 'daily-explorer',
    name: 'Daily Explorer',
    description: 'Played every day for 7 days',
    icon: '🌞',
    rarity: 'silver',
    unlocked: false,
  },
  {
    id: 'focus-flame',
    name: 'Focus Flame',
    description: 'Completed 3 sessions without quitting',
    icon: '🔥',
    rarity: 'silver',
    unlocked: false,
  },
  {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Improved accuracy by 20% over last week',
    icon: '🚀',
    rarity: 'bronze',
    unlocked: false,
  },
  {
    id: 'hidden-gem',
    name: 'Hidden Gem',
    description: 'Tried all 3 games in one day',
    icon: '💎',
    rarity: 'legendary',
    unlocked: false,
  },
]

function getRarityColor(rarity: BadgeRarity): string {
  switch (rarity) {
    case 'bronze':
      return 'text-amber-400'
    case 'silver':
      return 'text-slate-200'
    case 'gold':
      return 'text-yellow-400'
    case 'legendary':
      return 'text-fuchsia-400'
  }
}

function getRarityBgColor(rarity: BadgeRarity): string {
  switch (rarity) {
    case 'bronze':
      return 'bg-amber-500/20 border-amber-500/30'
    case 'silver':
      return 'bg-slate-500/20 border-slate-500/30'
    case 'gold':
      return 'bg-yellow-500/20 border-yellow-500/30'
    case 'legendary':
      return 'bg-fuchsia-500/20 border-fuchsia-500/30'
  }
}

export function BadgeGalleryCard() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const unlockedBadges = mockBadges.filter(b => b.unlocked)
  const previewBadges = mockBadges.slice(0, 4)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    // Close on Escape key
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscapeKey)
      }
    }
  }, [isOpen])

  return (
    <section className="rounded-2xl border p-6 bg-white border-slate-200 dark:bg-slate-900/40 dark:border-slate-700">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Badge Gallery</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsOpen(true)}
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg transition-all hover:shadow-xl"
        >
          Badges ({unlockedBadges.length}/{mockBadges.length})
        </motion.button>
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {previewBadges.map(badge => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05, y: -2 }}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border p-3 transition-all',
              badge.unlocked
                ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-800/80'
                : 'border-slate-200 bg-slate-100 opacity-80 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900/50 dark:opacity-60 dark:hover:opacity-75'
            )}
          >
            <div
              className={cn('text-2xl', !badge.unlocked && 'opacity-50')}
            >
              {badge.icon}
            </div>
            <div className="text-center">
              <p
                className={cn(
                  'text-xs font-semibold line-clamp-1',
                  badge.unlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-500'
                )}
              >
                {badge.name}
              </p>
              {!badge.unlocked && (
                <span className="text-[10px] text-slate-600">Locked</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Gallery Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onMouseLeave={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onMouseLeave={() => setIsOpen(false)}
              className="absolute right-0 top-full z-20 mt-3 w-full max-w-sm rounded-2xl border p-4 shadow-2xl backdrop-blur-sm sm:max-w-md border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950/95 dark:text-white"
            >
              {/* All Badges Grid */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  All Badges
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {mockBadges.map(badge => (
                    <motion.div
                      key={badge.id}
                      whileHover={{
                        scale: badge.unlocked ? 1.02 : 1,
                        y: badge.unlocked ? -2 : 0,
                      }}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border px-3 py-2 transition-all',
                        badge.unlocked
                          ? cn(
                              'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-800/80',
                              getRarityBgColor(badge.rarity)
                            )
                          : 'border-slate-200 bg-slate-100 opacity-80 dark:border-slate-700 dark:bg-slate-900/50 dark:opacity-50'
                      )}
                    >
                      <div
                        className={cn(
                          'text-xl flex-shrink-0',
                          !badge.unlocked && 'opacity-40'
                        )}
                      >
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              'text-xs font-semibold truncate',
                              badge.unlocked
                                ? 'text-slate-800 dark:text-slate-100'
                                : 'text-slate-600 dark:text-slate-500'
                            )}
                          >
                            {badge.name}
                          </span>
                          {badge.unlocked && (
                            <span
                              className={cn(
                                'text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap',
                                getRarityColor(badge.rarity)
                              )}
                            >
                              {badge.rarity}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] line-clamp-2 text-slate-700 dark:text-slate-500">
                          {badge.description}
                        </p>
                        {!badge.unlocked && (
                          <span className="text-[10px] text-slate-700 dark:text-slate-600 italic">
                            Locked
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-4 border-t pt-3 border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Unlocked:{' '}
                  <span className="font-semibold text-emerald-400">
                    {unlockedBadges.length}/{mockBadges.length}
                  </span>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
