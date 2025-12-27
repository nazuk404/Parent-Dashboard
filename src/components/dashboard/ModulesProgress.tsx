import type { ModuleProgress } from '../../lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { motion } from 'framer-motion'

export function ModulesProgress({ modules }: { modules: ModuleProgress[] }) {
  return (
    <Card>
      <CardHeader className="items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">Games completed</CardTitle>
        <span className="text-xs text-slate-500 dark:text-slate-400">Live accuracy</span>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module) => (
          <motion.div key={module.id} whileHover={{ scale: 1.02 }} className="space-y-2 rounded-xl bg-slate-50 text-slate-800 dark:bg-slate-900/80 dark:text-slate-100 p-3 border border-slate-200 dark:border-slate-700 transition duration-150 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer">
            <div className="flex items-center justify-between text-sm text-slate-800 dark:text-slate-100">
              <span>{module.name}</span>
              <span className="text-emerald-700 dark:text-emerald-300">{module.completed}/{module.total} levels</span>
            </div>
            <Progress value={(module.completed / module.total) * 100} />
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Accuracy</span>
              <span className="text-slate-800 dark:text-slate-200">{(module.accuracy * 100).toFixed(0)}%</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
