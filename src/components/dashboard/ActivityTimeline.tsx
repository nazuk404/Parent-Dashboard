import { motion } from 'framer-motion'
import type { ActivityEvent } from '../../lib/types'
import { formatDate, formatTime } from '../../lib/utils'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  return (
    <Card>
      <CardHeader className="items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">Recent activity</CardTitle>
        <Badge>Live feed</Badge>
      </CardHeader>
      <div className="space-y-3">
        {events.slice(0, 10).map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className="flex items-start gap-3 rounded-xl bg-slate-50 text-slate-800 dark:bg-slate-900/80 dark:text-slate-100 p-3 border border-slate-200 dark:border-slate-700 transition duration-150 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md hover:bg-slate-100 dark:hover:bg-slate-900/95 cursor-pointer"
          >
            <div className="mt-1 h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <div className="space-y-1">
              <p className="text-sm text-slate-800 dark:text-slate-100">{event.message}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {formatDate(event.timestamp)} • {formatTime(event.timestamp)} • {(event.accuracy * 100).toFixed(0)}% • +{event.exp} EXP
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
