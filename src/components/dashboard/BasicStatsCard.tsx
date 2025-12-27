import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

type Range = 'day' | 'week' | 'month' | 'all'

interface RangeData {
  playtimeMinutes: number
  avgSessionMinutes: number
  wins: number
  losses: number
  gameStats: Array<{
    name: string
    wins: number
    losses: number
  }>
}

// Mock data for different time ranges
const mockData: Record<Range, RangeData> = {
  day: {
    playtimeMinutes: 45,
    avgSessionMinutes: 15,
    wins: 8,
    losses: 2,
    gameStats: [
      { name: 'First Aid', wins: 4, losses: 0 },
      { name: 'Color Mixing', wins: 2, losses: 1 },
      { name: 'Story Ordering', wins: 2, losses: 1 },
    ],
  },
  week: {
    playtimeMinutes: 280,
    avgSessionMinutes: 16,
    wins: 52,
    losses: 8,
    gameStats: [
      { name: 'First Aid', wins: 22, losses: 2 },
      { name: 'Color Mixing', wins: 18, losses: 3 },
      { name: 'Story Ordering', wins: 12, losses: 3 },
    ],
  },
  month: {
    playtimeMinutes: 1240,
    avgSessionMinutes: 17,
    wins: 195,
    losses: 35,
    gameStats: [
      { name: 'First Aid', wins: 85, losses: 10 },
      { name: 'Color Mixing', wins: 72, losses: 15 },
      { name: 'Story Ordering', wins: 38, losses: 10 },
    ],
  },
  all: {
    playtimeMinutes: 3840,
    avgSessionMinutes: 18,
    wins: 670,
    losses: 95,
    gameStats: [
      { name: 'First Aid', wins: 300, losses: 30 },
      { name: 'Color Mixing', wins: 250, losses: 45 },
      { name: 'Story Ordering', wins: 120, losses: 20 },
    ],
  },
}

// Count-up animation hook
function useCountUp(end: number, duration: number = 0.5) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      setCount(Math.floor(end * progress))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return count
}

interface MetricTileProps {
  title: string
  value: number
  unit: string
  comparison: string
  range: Range
}

function MetricTile({ title, value, unit, comparison, range }: MetricTileProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const displayValue = useCountUp(value, 0.6)
  const rangeLabel = { day: 'today', week: 'this week', month: 'this month', all: 'all time' }[range]

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="group relative"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-150 dark:border-white/10 dark:bg-white/5 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 cursor-pointer"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          {displayValue}
          <span className="ml-1 text-sm text-slate-600 dark:text-slate-300">{unit}</span>
        </p>
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{comparison}</p>
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 pointer-events-none"
        >
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-950/60 dark:to-sky-950/60 px-4 py-2.5 text-xs font-medium text-emerald-900 dark:text-emerald-100 shadow-lg backdrop-blur-sm whitespace-nowrap">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">{comparison}</span>
              <span className="text-emerald-600 dark:text-emerald-200 text-[11px]">{rangeLabel}</span>
            </div>
            
            {/* Arrow */}
            <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 h-0 w-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-emerald-50 dark:border-b-emerald-950/60" />
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface BreakdownModalProps {
  isOpen: boolean
  onClose: () => void
  gameStats: Array<{ name: string; wins: number; losses: number }>
}

function BreakdownModal({ isOpen, onClose, gameStats }: BreakdownModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Win rate breakdown</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {gameStats.map((game) => {
            const total = game.wins + game.losses
            const winPercent = total > 0 ? (game.wins / total) * 100 : 0
            return (
              <div key={game.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">{game.name}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">{Math.round(winPercent)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${winPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {game.wins} wins, {game.losses} loss{game.losses !== 1 ? 'es' : ''}
                </p>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function BasicStatsCard() {
  const [range, setRange] = useState<Range>('week')
  const [modalOpen, setModalOpen] = useState(false)

  const data = mockData[range]
  const winPercent = Math.round((data.wins / (data.wins + data.losses)) * 100)
  const chartData = [
    { name: 'Wins', value: data.wins, fill: '#10b981' },
    { name: 'Losses', value: data.losses, fill: '#64748b' },
  ]

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      {/* Header with range selector */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-slate-300">
            Basic stats
          </h3>
        </div>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'all'] as Range[]).map((r) => (
            <motion.button
              key={r}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all',
                range === r
                  ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                  : 'border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-white/10 dark:text-slate-400 dark:hover:border-emerald-500/30',
              )}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Metric tiles */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <MetricTile
          title="Total playtime"
          value={data.playtimeMinutes}
          unit="min"
          comparison="+8%"
          range={range}
        />
        <MetricTile
          title="Avg session"
          value={data.avgSessionMinutes}
          unit="min"
          comparison="-2%"
          range={range}
        />
      </div>

      {/* Chart section */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Doughnut chart */}
        <motion.div
          key={range}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={() => setModalOpen(true)}
            className="relative h-40 w-40 cursor-pointer transition-transform hover:scale-105"
            title="Click to see breakdown"
          >
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} opacity={0.85} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{winPercent}%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">wins</p>
            </div>
          </button>

          {/* Caption with count-up */}
          <div className="text-center">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Win rate <span className="font-bold text-emerald-600 dark:text-emerald-400">{useCountUp(winPercent)}%</span>
            </p>
          </div>
        </motion.div>

        {/* Summary stats */}
        <motion.div
          key={`summary-${range}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-between gap-4"
        >
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Wins</p>
              <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{data.wins}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Losses</p>
              <p className="mt-1 text-xl font-bold text-slate-600 dark:text-slate-400">{data.losses}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{data.wins + data.losses}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Breakdown modal */}
      <BreakdownModal isOpen={modalOpen} onClose={() => setModalOpen(false)} gameStats={data.gameStats} />
    </section>
  )
}

export default BasicStatsCard
