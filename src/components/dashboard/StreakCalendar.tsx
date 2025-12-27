import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { cn } from '../../lib/utils'

type DayActivity = {
  date: string // ISO date, e.g. "2025-12-26"
  sessions: number // number of play sessions that day
}

interface StreakCalendarProps {
  data: DayActivity[]
}

// Helper to get intensity level (0-4) based on sessions
const getIntensityLevel = (sessions: number): number => {
  if (sessions === 0) return 0
  if (sessions === 1) return 1
  if (sessions === 2) return 2
  if (sessions <= 4) return 3
  return 4
}

const cellColorsDark: Record<number, string> = {
  0: 'bg-slate-800',
  1: 'bg-emerald-900',
  2: 'bg-emerald-700',
  3: 'bg-emerald-500',
  4: 'bg-emerald-300',
}

const cellColorsLight: Record<number, string> = {
  0: 'bg-slate-300',
  1: 'bg-emerald-200',
  2: 'bg-emerald-300',
  3: 'bg-emerald-400',
  4: 'bg-emerald-500',
}

// Calculate current streak (consecutive days with sessions > 0 up to today)
const calculateStreak = (data: DayActivity[]): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  let streak = 0
  let currentDate = new Date(today)
  
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const dayData = sortedData.find(d => d.date === dateStr)
    
    if (dayData && dayData.sessions > 0) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }
  
  return streak
}

// Generate calendar data for last 27 weeks (about 6 months)
const generateCalendarData = (data: DayActivity[]) => {
  const weeks: Array<Array<{ date: string; sessions: number; dayOfWeek: number }>> = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Start from 27 weeks ago
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - (27 * 7))
  
  // Find the Monday of that week
  const dayOfWeek = startDate.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  startDate.setDate(startDate.getDate() + mondayOffset)
  
  let currentWeek: Array<{ date: string; sessions: number; dayOfWeek: number }> = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const dayData = data.find(d => d.date === dateStr)
    const dayOfWeek = currentDate.getDay()
    
    currentWeek.push({
      date: dateStr,
      sessions: dayData?.sessions || 0,
      dayOfWeek: dayOfWeek === 0 ? 6 : dayOfWeek - 1, // Convert to 0=Mon, 6=Sun
    })
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Add remaining days
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }
  
  return weeks
}

export function StreakCalendar({ data }: StreakCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; sessions: number; x: number; y: number } | null>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  
  const streak = calculateStreak(data)
  const weeks = generateCalendarData(data)
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <Card className="relative space-y-3 rounded-2xl border p-4 shadow-sm bg-white border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
      <CardHeader className="items-center justify-between p-0">
        <div className="flex items-center gap-2">
          <Flame className="text-amber-600 dark:text-amber-400" size={18} />
          <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">Streak calendar</CardTitle>
        </div>
        <span className="rounded-full bg-amber-100 dark:bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200">
          {streak}-day streak
        </span>
      </CardHeader>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 w-max pr-2">
          {/* Day labels column */}
          <div className="flex flex-col gap-1 pr-2">
            <div className="h-3" /> {/* Spacer for alignment */}
            {dayLabels.map((label, idx) => (
              <div key={label} className="flex h-3 items-center text-[11px] text-slate-500 dark:text-slate-400">
                {idx % 2 === 0 ? label : ''}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {/* Month label on first day of month */}
                <div className="h-3 text-[11px] text-slate-500 dark:text-slate-400">
                  {weekIdx === 0 || new Date(week[0].date).getDate() <= 7
                    ? new Date(week[0].date).toLocaleDateString('en-US', { month: 'short' })
                    : ''}
                </div>
                {week.map((day) => {
                  const level = getIntensityLevel(day.sessions)
                  return (
                    <div
                      key={day.date}
                      className={cn(
                        'h-3 w-3 rounded-[4px] transition-colors hover:ring-2 hover:ring-emerald-400 cursor-pointer border border-slate-300/60 dark:border-slate-700/60',
                        isDark ? cellColorsDark[level] : cellColorsLight[level],
                      )}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setHoveredDay({
                          date: day.date,
                          sessions: day.sessions,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 10,
                        })
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${day.sessions} session${day.sessions !== 1 ? 's' : ''}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom tooltip */}
      {hoveredDay && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-900 dark:text-slate-100 shadow-lg border border-slate-300 dark:border-slate-700"
          style={{
            left: hoveredDay.x,
            top: hoveredDay.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {new Date(hoveredDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} –{' '}
          {hoveredDay.sessions} session{hoveredDay.sessions !== 1 ? 's' : ''}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-600 dark:text-slate-400">
        <span>Less</span>
        {[0,1,2,3,4].map((lvl) => (
          <div
            key={lvl}
            className={cn('h-3 w-3 rounded-[4px]', isDark ? cellColorsDark[lvl] : cellColorsLight[lvl])}
          />
        ))}
        <span>More</span>
      </div>
    </Card>
  )
}
