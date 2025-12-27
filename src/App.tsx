import { useEffect, useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import Snowfall from 'react-snowfall'
import { ThemeToggle } from './components/ThemeToggle'
import { BadgeButton } from './components/BadgeButton'
import { Button } from './components/ui/button'
import { useProfiles } from './hooks/useProfiles'
import { ProfileCard } from './components/ProfileCard'
import { AddProfileModal } from './components/AddProfileModal'
import { Dashboard } from './pages/Dashboard'

function App() {
  const { profiles, selectedProfileId, isLoading, selectProfile, initProfiles, removeProfile } = useProfiles()
  const [showAddModal, setShowAddModal] = useState(false)
  const selectedProfile = useMemo(() => profiles.find((p) => p.id === selectedProfileId) ?? null, [profiles, selectedProfileId])
  const [isDark, setIsDark] = useState(false)
  
  // Initialize profiles from localStorage on mount
  useEffect(() => {
    initProfiles()
  }, [])

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen bg-gray-100 text-gray-900 dark:bg-[#0f0f23] dark:text-slate-50">
      {/* Snowfall effect */}
      <Snowfall
        color={isDark ? '#87CEEB' : '#1E90FF'}
        snowflakeCount={200}
        speed={[1.5, 3.0]}
        wind={[-0.5, 1.0]}
        radius={[0.5, 3.0]}
      />
      
      <div className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-70">
        <div className="grid-overlay h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => selectProfile(null)}
              className="flex items-center gap-2 rounded-md px-1 py-1 transition hover:opacity-80 hover:scale-[0.99] focus:outline-none"
            >
              <Sparkles size={20} className="text-emerald-400" />
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Snapsense</h1>
            </button>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">Parent dashboard</h3>
          </div>
          <div className="flex items-center gap-2">
            {selectedProfile && <BadgeButton />}
            <ThemeToggle />
            {selectedProfile && (
              <Button variant="outline" onClick={() => selectProfile(null)}>
                Switch profile
              </Button>
            )}
            <Button onClick={() => setShowAddModal(true)}>Add profile</Button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-lg text-gray-600 dark:text-slate-300">Loading profiles…</p>
          </div>
        ) : !selectedProfile ? (
          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 dark:from-blue-600/20 dark:via-purple-500/15 dark:to-emerald-500/20 p-6 shadow-lg border border-gray-200 dark:border-white/10">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200">Pick a child profile to view progress.</p>
                  <p className="text-sm text-gray-700 dark:text-slate-300">Live data streams from LEDs, OLED cues, and sound feedback will appear in real time.</p>
                </div>
                <div className="flex items-center justify-end text-sm font-medium text-emerald-700 dark:text-emerald-200">Dark navy theme • Rainbow kid accents</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} onSelect={selectProfile} onRemove={removeProfile} />
              ))}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-600 dark:text-slate-300 transition hover:border-indigo-400 dark:hover:border-white/50 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-white/10"
              >
                + Add new profile
                <span className="text-xs text-gray-500 dark:text-slate-400">Age 3-8 | Upload emoji & color</span>
              </button>
            </div>
          </div>
        ) : (
          <Dashboard profile={selectedProfile} onSelectProfile={selectProfile} />
        )}
      </div>

      {showAddModal && <AddProfileModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}

export default App
