type ExpNameStripProps = {
  childName: string
  level: number
  currentXp: number
  nextLevelXp: number
}

export function ExpNameStrip({ childName, level, currentXp, nextLevelXp }: ExpNameStripProps) {
  const expPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100))

  return (
    <div className="rounded-xl bg-slate-900/80 px-4 py-3 shadow-sm border border-slate-800">
      {/* Top label row */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span>Progress</span>
        <span>Lv {level}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/50 mb-2.5">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-500 transition-all duration-300"
          style={{ width: `${expPercent}%` }}
        />
      </div>

      {/* Bottom info row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-100">{childName}</span>
        <span className="text-xs font-medium text-emerald-300">
          {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
        </span>
      </div>
    </div>
  )
}
