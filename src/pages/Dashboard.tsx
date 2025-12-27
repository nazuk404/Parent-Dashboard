import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import { subscribeToLiveEvents, fetchDashboard, sendWeeklyReport } from '../lib/esp32-api'
import type { ActivityEvent, Profile } from '../lib/types'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle } from '../components/ui/card'
import { AchievementsSection } from '../components/achievements/AchievementsSection'
import { ModulesProgress } from '../components/dashboard/ModulesProgress'
import { StreakCalendar } from '../components/dashboard/StreakCalendar'
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline'
import { BasicStats } from '../components/dashboard/BasicStats'
import { BadgesGallery } from '../components/dashboard/BadgesGallery'
import { GameFilterPanel, mockGames } from '../components/dashboard/GameFilterPanel'
import type { GameId } from '../components/dashboard/GameFilterPanel'
import { BadgeGalleryCard } from '../components/dashboard/BadgeGalleryCard'
import { Skeleton } from '../components/ui/skeleton'

export function Dashboard({ profile, onSelectProfile }: { profile: Profile; onSelectProfile: (id: string | null) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', profile.id],
    queryFn: () => fetchDashboard(profile.id),
    refetchInterval: 15000,
  })
  const [liveEvents, setLiveEvents] = useState<ActivityEvent[]>([])
  const [sendingReport, setSendingReport] = useState(false)
  const [selectedGame, setSelectedGame] = useState<GameId>('all')

  useEffect(() => {
    const unsubscribe = subscribeToLiveEvents(profile.id, (event) => {
      setLiveEvents((prev) => [event, ...prev].slice(0, 15))
    })
    return () => unsubscribe()
  }, [profile.id])

  const events = useMemo(() => {
    const base = data?.activity ?? []
    return [...liveEvents, ...base].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
  }, [data?.activity, liveEvents])

  // Compute current streak from the combined series (All games)
  const overallStreakDays = useMemo(() => {
    if (!data) return 9 // Default to 9 if data not loaded
    const map = new Map<string, number>(data.streak.map(d => [d.date, d.value]))
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let streak = 0
    const cursor = new Date(today)
    for (let i = 0; i < 365; i++) {
      const key = cursor.toISOString().split('T')[0]
      const sessions = map.get(key) ?? 0
      if (sessions > 0) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return streak > 0 ? streak : 9 // Return 9 if calculation results in 0
  }, [data])

  const streakDataForCalendar = useMemo(() => {
    // Helper: generate 9 consecutive days from today going backward
    const generateDefaultStreak = () => {
      const totalDays = 189
      const today = new Date()
      return Array.from({ length: totalDays }, (_, idx) => {
        const d = new Date(today)
        d.setDate(today.getDate() - (totalDays - 1 - idx))
        // Last 9 days get sessions = 1, rest = 0
        const sessions = idx >= totalDays - 9 ? 1 : 0
        return {
          date: d.toISOString().slice(0, 10),
          sessions,
        }
      })
    }

    if (!data) return generateDefaultStreak()

    // All games: use actual combined series returned by API, fallback to default if empty
    if (selectedGame === 'all') {
      const streakData = data.streak.map(day => ({ date: day.date, sessions: day.value }))
      return streakData.length > 0 ? streakData : generateDefaultStreak()
    }

    // Per-game: synthesize streak based on that game's streakDays
    const game = mockGames.find(g => g.id === selectedGame)
    const streakDays = game?.streakDays ?? 0
    const totalDays = 189 // approx 27 weeks for the calendar view
    const today = new Date()
    return Array.from({ length: totalDays }, (_, idx) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (totalDays - 1 - idx))
      const sessions = idx >= totalDays - streakDays ? 1 : 0
      return {
        date: d.toISOString().slice(0, 10),
        sessions,
      }
    })
  }, [data, selectedGame])

  const buildReport = () => {
    if (!data) return null
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(`SnapSense Weekly Report for ${profile.name}`, 12, 18)
    doc.setFontSize(12)
    doc.text(`Level ${data.level} | EXP ${data.totalExp}/${data.nextLevelExp}`, 12, 28)
    doc.text(`Modules cleared: ${data.modules.map((m) => m.name).join(', ')}`, 12, 38)
    doc.text(`Win rate: ${(data.stats.winRate * 100).toFixed(0)}%`, 12, 48)
    doc.text(`Streak: ${data.streakCount} days`, 12, 58)
    doc.text('Highlights:', 12, 72)
    data.activity.slice(0, 5).forEach((ev, idx) => {
      doc.text(`• ${ev.message}`, 16, 84 + idx * 8)
    })
    return doc
  }

  const handleExport = () => {
    const doc = buildReport()
    if (doc) doc.save(`${profile.name}-weekly-report.pdf`)
  }

  const handleWeeklyReport = async () => {
    if (!data) return
    setSendingReport(true)
    const doc = buildReport()
    doc?.output('blob')
    await sendWeeklyReport(profile.id)
    setSendingReport(false)
  }

  const getExpPercent = () => {
    if (!data) return 0
    return Math.min(100, Math.round((data.totalExp / data.nextLevelExp) * 100))
  }

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-64 md:col-span-2" />
      </div>
    )
  }

  const expPercent = getExpPercent()

  return (
    <div className="space-y-6">
      {/* Top hero bar full width */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-emerald-600 border-transparent shadow-lg">
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, y: -4 }}
              onClick={() => onSelectProfile(null)}
              className="grid h-16 w-16 place-items-center rounded-2xl text-3xl shadow-lg cursor-pointer transition-all" 
              style={{ background: profile.avatarColor }}
            >
              {profile.avatarEmoji}
            </motion.div>
              <div>
                <p className="text-sm uppercase tracking-wide text-white/80">Current explorer</p>
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                <p className="text-sm text-white/90">Level {data.level} • {data.totalExp} XP</p>

                {/* EXP Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-white/80">
                    <span>EXP progress</span>
                    <span className="text-emerald-200">{data.totalExp} / {data.nextLevelExp} XP</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-500 transition-all duration-300"
                      style={{ width: `${expPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleWeeklyReport} disabled={sendingReport} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                {sendingReport ? 'Sending…' : 'Send weekly report'}
                <Mail size={16} />
              </Button>
              <Button variant="outline" onClick={handleExport} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Export PDF
                <Download size={16} />
              </Button>
            </div>
          </div>
        </Card>

      {/* Stats grid with consistent alignment */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* BASIC STATS card */}
        <section className="md:col-span-6">
          <BasicStats
            playtimeMinutes={data.stats.playtimeMinutes}
            averageSessionMinutes={data.stats.averageSessionMinutes}
            winRate={data.stats.winRate}
          />
        </section>

        {/* STREAK CALENDAR + BADGE GALLERY stack */}
        <section className="md:col-span-6 flex flex-col gap-6">
          <StreakCalendar data={streakDataForCalendar} />
          <BadgesGallery badges={data.badges} />
        </section>
      </div>

      {/* Games row full width */}
      <ModulesProgress modules={data.modules} />

      {/* Game Filter and Details */}
      <GameFilterPanel
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
        overallStreakDays={overallStreakDays}
      />

      {/* Badge Gallery Card */}
      <BadgeGalleryCard />

      {/* Achievements full width */}
      <AchievementsSection achievements={data.achievements.map(a => ({ ...a, unlocked: true }))} title="Achievements" />

      {/* Activity timeline + Weekly focus */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityTimeline events={events} />
        <Card className="space-y-3">
          <CardHeader className="items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Weekly focus</CardTitle>
            <span className="text-xs text-gray-600 dark:text-slate-400">AI-crafted suggestions</span>
          </CardHeader>
          <div className="space-y-3 text-sm">
            <motion.div whileHover={{ scale: 1.02, x: 4 }} className="rounded-xl bg-emerald-100 dark:bg-emerald-500/10 p-3 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-600/40 transition duration-150 hover:shadow-lg hover:bg-emerald-200/50 dark:hover:bg-emerald-500/20 cursor-pointer">
              Encourage replay of First Aid steps with eyes closed to boost muscle memory.
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, x: 4 }} className="rounded-xl bg-blue-100 dark:bg-blue-500/10 p-3 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-600/40 transition duration-150 hover:shadow-lg hover:bg-blue-200/50 dark:hover:bg-blue-500/20 cursor-pointer">
              Try Gujarati narration mode while ordering the story to reinforce bilingual recall.
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, x: 4 }} className="rounded-xl bg-amber-100 dark:bg-amber-500/10 p-3 text-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-600/40 transition duration-150 hover:shadow-lg hover:bg-amber-200/50 dark:hover:bg-amber-500/20 cursor-pointer">
              Celebrate streak with a small badge reveal confetti on next login.
            </motion.div>
          </div>
        </Card>
      </div>
    </div>
  )
}
