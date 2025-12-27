import { RadialBar, RadialBarChart, PolarAngleAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ExpNameStrip } from './ExpNameStrip'

export function ExpRing({
  totalExp,
  nextLevelExp,
  level,
  childName = 'Explorer',
}: {
  totalExp: number
  nextLevelExp: number
  level: number
  childName?: string
}) {
  const progress = Math.min(100, Math.round((totalExp / nextLevelExp) * 100))
  const data = [{ name: 'exp', value: progress, fill: '#22c55e' }]

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">EXP gained</CardTitle>
        <span className="text-sm text-slate-600 dark:text-slate-300">Level {level}</span>
      </CardHeader>

      {/* EXP Progress Strip */}
      <div className="px-4">
        <ExpNameStrip childName={childName} level={level} currentXp={totalExp} nextLevelXp={nextLevelExp} />
      </div>

      <CardContent className="flex flex-1 items-center justify-center">
        <RadialBarChart width={220} height={220} cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={12} background fill="#0ea5e9" />
          <Tooltip formatter={(value) => `${value}% to next level`} />
        </RadialBarChart>
        <div className="absolute text-center">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{progress}%</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">to next level</p>
        </div>
      </CardContent>
      <div className="pb-4 text-center text-sm text-slate-600 dark:text-slate-300">{totalExp} / {nextLevelExp} XP</div>
    </Card>
  )
}
