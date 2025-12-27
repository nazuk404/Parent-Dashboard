import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { Card } from '../ui/card'
import { cn } from '../../lib/utils'

export type GameId = 'numbering' | 'firstAid' | 'storyOrdering' | 'all'

interface GameStats {
  id: GameId
  name: string
  description: string
  totalSessions: number
  avgAccuracy: number
  avgSessionTime: number
  wins: number
  losses: number
  streakDays: number
  recentActivity: {
    date: string
    attempts: number
    correct: number
    accuracy: number
  }[]
  accuracyTrend: {
    session: number
    accuracy: number
  }[]
}

export const mockGames: GameStats[] = [
  {
    id: 'numbering',
    name: 'Numbering',
    description: 'Number sequencing and ordering system',
    totalSessions: 42,
    avgAccuracy: 82.5,
    avgSessionTime: 8.5,
    wins: 35,
    losses: 7,
    streakDays: 5,
    recentActivity: [
      { date: '2025-12-27', attempts: 5, correct: 4, accuracy: 80 },
      { date: '2025-12-26', attempts: 6, correct: 5, accuracy: 83 },
      { date: '2025-12-25', attempts: 4, correct: 3, accuracy: 75 },
      { date: '2025-12-24', attempts: 5, correct: 4, accuracy: 80 },
      { date: '2025-12-23', attempts: 6, correct: 5, accuracy: 83 },
    ],
    accuracyTrend: [
      { session: 1, accuracy: 65 },
      { session: 2, accuracy: 72 },
      { session: 3, accuracy: 68 },
      { session: 4, accuracy: 75 },
      { session: 5, accuracy: 78 },
      { session: 6, accuracy: 80 },
      { session: 7, accuracy: 82 },
      { session: 8, accuracy: 85 },
    ],
  },
  {
    id: 'firstAid',
    name: 'First Aid',
    description: 'First Aid sequencing and emergency response',
    totalSessions: 38,
    avgAccuracy: 78.3,
    avgSessionTime: 10.2,
    wins: 30,
    losses: 8,
    streakDays: 3,
    recentActivity: [
      { date: '2025-12-27', attempts: 6, correct: 5, accuracy: 83 },
      { date: '2025-12-26', attempts: 5, correct: 4, accuracy: 80 },
      { date: '2025-12-25', attempts: 7, correct: 5, accuracy: 71 },
      { date: '2025-12-24', attempts: 5, correct: 4, accuracy: 80 },
      { date: '2025-12-23', attempts: 6, correct: 5, accuracy: 83 },
    ],
    accuracyTrend: [
      { session: 1, accuracy: 60 },
      { session: 2, accuracy: 68 },
      { session: 3, accuracy: 65 },
      { session: 4, accuracy: 72 },
      { session: 5, accuracy: 75 },
      { session: 6, accuracy: 78 },
      { session: 7, accuracy: 80 },
      { session: 8, accuracy: 78 },
    ],
  },
  {
    id: 'storyOrdering',
    name: 'Story Ordering',
    description: 'Story sequencing and narrative comprehension',
    totalSessions: 45,
    avgAccuracy: 85.2,
    avgSessionTime: 7.8,
    wins: 38,
    losses: 7,
    streakDays: 7,
    recentActivity: [
      { date: '2025-12-27', attempts: 4, correct: 4, accuracy: 100 },
      { date: '2025-12-26', attempts: 5, correct: 4, accuracy: 80 },
      { date: '2025-12-25', attempts: 5, correct: 4, accuracy: 80 },
      { date: '2025-12-24', attempts: 4, correct: 4, accuracy: 100 },
      { date: '2025-12-23', attempts: 5, correct: 4, accuracy: 80 },
    ],
    accuracyTrend: [
      { session: 1, accuracy: 70 },
      { session: 2, accuracy: 78 },
      { session: 3, accuracy: 82 },
      { session: 4, accuracy: 80 },
      { session: 5, accuracy: 85 },
      { session: 6, accuracy: 88 },
      { session: 7, accuracy: 85 },
      { session: 8, accuracy: 90 },
    ],
  },
]

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 85) return 'text-emerald-400'
  if (accuracy >= 70) return 'text-sky-400'
  return 'text-amber-400'
}

function getAccuracyBgColor(accuracy: number): string {
  if (accuracy >= 85) return 'bg-emerald-500/20'
  if (accuracy >= 70) return 'bg-sky-500/20'
  return 'bg-amber-500/20'
}

interface GameFilterPanelProps {
  selectedGame: GameId
  onSelectGame: (id: GameId) => void
  overallStreakDays: number
}

export function GameFilterPanel({ selectedGame, onSelectGame, overallStreakDays }: GameFilterPanelProps) {

  const gameOptions = [
    { id: 'all' as GameId, label: 'All games' },
    { id: 'numbering' as GameId, label: 'Numbering' },
    { id: 'firstAid' as GameId, label: 'First Aid' },
    { id: 'storyOrdering' as GameId, label: 'Story Ordering' },
  ]

  const displayData = useMemo(() => {
    if (selectedGame === 'all') {
      const totalSessions = mockGames.reduce((sum, g) => sum + g.totalSessions, 0)
      const totalWins = mockGames.reduce((sum, g) => sum + g.wins, 0)
      const avgAccuracy = parseFloat(
        (mockGames.reduce((sum, g) => sum + g.avgAccuracy, 0) / mockGames.length).toFixed(1)
      )
      const avgSessionTime = parseFloat(
        (mockGames.reduce((sum, g) => sum + g.avgSessionTime, 0) / mockGames.length).toFixed(1)
      )

      return {
        isAll: true,
        name: 'All Games',
        description: 'Combined statistics across all games',
        totalSessions,
        avgAccuracy,
        avgSessionTime,
        wins: totalWins,
        losses: mockGames.reduce((sum, g) => sum + g.losses, 0),
        streakDays: overallStreakDays,
        gameComparison: mockGames.map(g => ({
          name: g.name,
          accuracy: g.avgAccuracy,
          sessions: g.totalSessions,
          color: g.id === 'numbering' ? '#10b981' : g.id === 'firstAid' ? '#3b82f6' : '#f59e0b',
        })),
      }
    }

    const game = mockGames.find(g => g.id === selectedGame)!
    return {
      isAll: false,
      ...game,
    }
  }, [selectedGame])

  const winRate = displayData.wins / (displayData.wins + displayData.losses)

  return (
    <section className="space-y-6">
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3">
        {gameOptions.map(option => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectGame(option.id)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-200',
              selectedGame === option.id
                ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg'
                : 'border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-900/60'
            )}
          >
            {option.label}
          </motion.button>
        ))}
      </div>

      {/* Game Details Card */}
      <Card className="border p-6 bg-white border-slate-200 dark:border-slate-700 dark:bg-slate-900/40">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{displayData.name}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{displayData.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <motion.div
              whileHover={{ scale: 1.05, borderColor: '#10b981' }}
              className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 p-4 transition-all duration-200"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">Sessions</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{displayData.totalSessions}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
              className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 p-4 transition-all duration-200"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">Avg accuracy</p>
              <p className={cn('mt-2 text-2xl font-bold', getAccuracyColor(displayData.avgAccuracy))}>
                {displayData.avgAccuracy.toFixed(1)}%
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, borderColor: '#f59e0b' }}
              className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 p-4 transition-all duration-200"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">Avg time</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{displayData.avgSessionTime.toFixed(1)}m</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, borderColor: '#10b981' }}
              className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 p-4 transition-all duration-200"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">Win rate</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">{(winRate * 100).toFixed(0)}%</p>
            </motion.div>
          </div>

          {/* Chart and Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Chart Section */}
            {!displayData.isAll && 'accuracyTrend' in displayData && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/30 p-4">
                <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-300">Accuracy Trend (Last 8 Sessions)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={displayData.accuracyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="session" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#10b981"
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            {displayData.isAll && 'gameComparison' in displayData && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/30 p-4">
                <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-300">Game Comparison</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={displayData.gameComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: 'none' }}
                      labelStyle={{ color: '#ffffff' }}
                      itemStyle={{ color: '#ffffff' }}
                      cursor={false}
                    />
                    <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} activeBar={{ opacity: 0.8 }}>
                      {displayData.gameComparison && displayData.gameComparison.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Activity */}
            {!displayData.isAll && 'recentActivity' in displayData && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/30 p-4">
                <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-300">Recent Activity</h3>
                <div className="space-y-3">
                  {displayData.recentActivity.map((activity: any, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, borderColor: '#10b981' }}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700/50 dark:bg-slate-900/50 px-3 py-2 transition-all duration-200"
                    >
                      <div className="flex-1">
                        <p className="text-xs text-slate-600 dark:text-slate-400">{new Date(activity.date).toLocaleDateString()}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {activity.correct}/{activity.attempts} correct
                        </p>
                      </div>
                      <div
                        className={cn(
                          'rounded px-2 py-1 text-xs font-semibold',
                          getAccuracyBgColor(activity.accuracy),
                          getAccuracyColor(activity.accuracy)
                        )}
                      >
                        {activity.accuracy}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Streak Info (all and per-game) */}
          <div className="rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 dark:from-amber-500/20 dark:to-orange-500/20 dark:border-amber-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">🔥 Current Streak</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-100/70">
                  {displayData.isAll ? 'Across all games (combined play days)' : 'Keep up the great work!'}
                </p>
              </div>
              <span className="rounded-full bg-amber-200 dark:bg-amber-500/30 px-3 py-1 text-sm font-semibold text-amber-900 dark:text-amber-200">
                {displayData.streakDays} days
              </span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
