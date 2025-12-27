import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award } from 'lucide-react'
import { cn } from '../lib/utils'

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
      return 'text-slate-300'
    case 'gold':
      return 'text-yellow-400'
    case 'legendary':
      return 'text-fuchsia-400'
  }
}

function getRarityBorder(rarity: BadgeRarity): string {
  switch (rarity) {
    case 'bronze':
      return 'border-amber-500/30'
    case 'silver':
      return 'border-slate-500/30'
    case 'gold':
      return 'border-yellow-500/30'
    case 'legendary':
      return 'border-fuchsia-500/30'
  }
}

export function BadgeButton() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelPos, setPanelPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const unlockedCount = mockBadges.filter(b => b.unlocked).length
  const lockedCount = mockBadges.length - unlockedCount

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

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    function updatePosition() {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const panelWidth = 384 // w-96
      const sidePadding = 12
      const left = Math.min(Math.max(rect.left, sidePadding), window.innerWidth - panelWidth - sidePadding)
      const top = rect.bottom + 8
      setPanelPos({ top, left })
    }

    if (isOpen) {
      updatePosition()
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
      window.addEventListener('resize', updatePosition)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscapeKey)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all',
          isOpen
            ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg'
            : 'border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-slate-500'
        )}
      >
        <Award size={14} />
        <span>{unlockedCount}/{mockBadges.length}</span>
      </motion.button>

      {/* Floating Badge Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{ position: 'fixed', top: panelPos.top, left: panelPos.left }}
              className="z-50 mt-2 w-96 max-w-[calc(100vw-1rem)] rounded-2xl border p-4 shadow-2xl backdrop-blur-sm border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950/95 dark:text-white"
            >
              {/* Title */}
              <div className="mb-4 flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">All Badges</h3>
                <div className="flex gap-3 text-xs">
                  <span className="text-emerald-400">
                    <span className="font-bold">{unlockedCount}</span> Unlocked
                  </span>
                  <span className="text-slate-600 dark:text-slate-500">
                    <span className="font-bold">{lockedCount}</span> Locked
                  </span>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {/* Unlocked Section */}
                {unlockedCount > 0 && (
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                      🔓 Unlocked ({unlockedCount})
                    </h4>
                    <div className="space-y-2">
                      {mockBadges
                        .filter(b => b.unlocked)
                        .map(badge => (
                          <motion.div
                            key={badge.id}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                              'flex items-center gap-3 rounded-lg border px-3 py-2 transition-all bg-slate-50 dark:bg-slate-800/50',
                              getRarityBorder(badge.rarity)
                            )}
                          >
                            <div className="text-xl flex-shrink-0">{badge.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">
                                  {badge.name}
                                </span>
                                <span
                                  className={cn(
                                    'text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap',
                                    getRarityColor(badge.rarity)
                                  )}
                                >
                                  {badge.rarity.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-[10px] line-clamp-1 text-slate-600 dark:text-slate-500">
                                {badge.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Locked Section */}
                {lockedCount > 0 && (
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      🔒 Locked ({lockedCount})
                    </h4>
                    <div className="space-y-2">
                      {mockBadges
                        .filter(b => !b.unlocked)
                        .map(badge => (
                          <motion.div
                            key={badge.id}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                              'flex items-center gap-3 rounded-lg border px-3 py-2 transition-all opacity-80 bg-slate-100 dark:bg-slate-900/50',
                              getRarityBorder(badge.rarity)
                            )}
                          >
                            <div className="text-xl flex-shrink-0 opacity-50">
                              {badge.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold truncate text-slate-600 dark:text-slate-500">
                                  {badge.name}
                                </span>
                                <span
                                  className={cn(
                                    'text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap',
                                    getRarityColor(badge.rarity)
                                  )}
                                >
                                  {badge.rarity.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-[10px] line-clamp-1 text-slate-700 dark:text-slate-600">
                                {badge.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Stats */}
              <div className="mt-4 border-t pt-3 text-xs border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <p>
                  Progress:{' '}
                  <span className="font-bold text-emerald-400">
                    {Math.round((unlockedCount / mockBadges.length) * 100)}%
                  </span>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
