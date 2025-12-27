import type { Badge as BadgeType } from '../../lib/types'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { motion } from 'framer-motion'

export function BadgesGallery({ badges }: { badges: BadgeType[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">Badge gallery</CardTitle>
        <span className="text-xs text-slate-500 dark:text-slate-400">Hover to peek</span>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {badges.map((badge) => (
          <motion.div key={badge.id} whileHover={{ scale: 1.05, y: -4 }} className="group relative rounded-xl bg-slate-50 text-slate-800 dark:bg-slate-900/90 dark:text-slate-100 p-3 text-center border border-slate-200 dark:border-slate-700 transition duration-150 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer">
            <div className="text-2xl">{badge.icon}</div>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{badge.title}</p>
            <p className="text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-300">{badge.rarity}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 opacity-0 transition-opacity duration-150 group-hover:opacity-100">{badge.description}</p>
          </motion.div>
        ))}
        {badges.length === 0 && <p className="text-gray-600 dark:text-slate-400">No badges yet.</p>}
      </div>
    </Card>
  )
}
