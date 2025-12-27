import { motion } from 'framer-motion'
import { ChevronRight, Flame, Trash2 } from 'lucide-react'
import type { Profile } from '../lib/types'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'

interface Props {
  profile: Profile
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

export function ProfileCard({ profile, onSelect, onRemove }: Props) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Remove ${profile.name}'s profile? This action cannot be undone.`)) {
      onRemove(profile.id)
    }
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="rainbow-border relative h-full rounded-2xl bg-gradient-to-br from-white/5 via-white/0 to-white/5 dark:from-white/5 dark:via-white/0 dark:to-white/5 p-[1px]"
        >
          <div className="flex h-full flex-col justify-between gap-4 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-surface dark:to-background p-5 shadow-lg border border-gray-200 dark:border-transparent">
            <div className="flex items-start gap-3">
              <button
                onClick={handleRemove}
                className="absolute top-3 right-3 rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition"
                aria-label="Remove profile"
                title="Remove profile"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid h-14 w-14 place-items-center rounded-2xl text-2xl shadow-lg" style={{ backgroundColor: profile.avatarColor }}>
                {profile.avatarEmoji}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{profile.name}</p>
                  <Badge variant="success">Lv {profile.level}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300">Age {profile.age} • Prefers {profile.favoriteModule}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300">
                <span>EXP</span>
                <span className="font-semibold text-gray-900 dark:text-white">{profile.exp}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-500 dark:to-purple-500" style={{ width: `${Math.min(100, (profile.exp % 1000) / 10)}%` }} />
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-200">
                <Flame size={16} className="text-amber-600 dark:text-amber-400" />
                <span>{profile.streak}-day streak</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => onSelect(profile.id)}>
              Open dashboard
              <ChevronRight size={16} />
            </Button>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{profile.name} • Age {profile.age}</p>
          <p className="text-sm opacity-90">Level {profile.level} • {profile.streak}-day streak</p>
          <p className="text-sm opacity-75">{profile.exp} EXP • {profile.favoriteModule}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
