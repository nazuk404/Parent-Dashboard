import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { motion } from 'framer-motion'

export function BasicStats({
  playtimeMinutes,
  averageSessionMinutes,
  winRate,
}: {
  playtimeMinutes: number
  averageSessionMinutes: number
  winRate: number
}) {
  const data = [
    { name: 'Wins', value: Math.round(winRate * 100), color: '#22c55e' },
    { name: 'Retries', value: Math.round(100 - winRate * 100), color: '#ef4444' },
  ]

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col gap-4">
        {/* Header */}
        <CardHeader className="items-center justify-between p-0">
          <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">Basic stats</CardTitle>
          <span className="text-xs text-slate-500 dark:text-slate-400">Updated live</span>
        </CardHeader>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-900/80 dark:text-slate-100 p-3 border border-slate-200 dark:border-slate-700 transition duration-150 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-lg hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer"
          >
            <p className="text-xs text-slate-600 dark:text-slate-300">Total playtime</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{playtimeMinutes}m</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-900/80 dark:text-slate-100 p-3 border border-slate-200 dark:border-slate-700 transition duration-150 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-lg hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 cursor-pointer"
          >
            <p className="text-xs text-slate-600 dark:text-slate-300">Avg session</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{averageSessionMinutes}m</p>
          </motion.div>
        </div>
        <CardContent className="flex flex-col items-center justify-center gap-3 p-0">
          <div className="h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} innerRadius={50} outerRadius={70} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name as string]}
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.8)', 
                    border: 'none',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Win rate</p>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{(winRate * 100).toFixed(0)}%</p>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
