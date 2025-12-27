import { useState } from 'react'
import type { FormEvent } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { FavoriteModuleSelect, getModuleLabel } from './FavoriteModuleSelect'
import { useProfiles } from '../hooks/useProfiles'

interface Props {
  onClose: () => void
}

export function AddProfileModal({ onClose }: Props) {
  const { addProfile, selectProfile } = useProfiles()
  const [name, setName] = useState('')
  const [age, setAge] = useState<number>(7)
  const [avatarEmoji, setAvatarEmoji] = useState('🌈')
  const [avatarColor, setAvatarColor] = useState('#3b82f6')
  const [favoriteModule, setFavoriteModule] = useState<string>('color-mixing')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    
    // Validation
    if (!trimmedName) {
      alert('Please enter a name')
      return
    }
    if (age < 3 || age > 8) {
      alert('Age must be between 3 and 8')
      return
    }
    
    const profile = addProfile({ 
      name: trimmedName, 
      age, 
      avatarEmoji, 
      avatarColor, 
      favoriteModule: getModuleLabel(favoriteModule) 
    })
    selectProfile(profile.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4">
      <div className="relative overflow-visible w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add a new explorer</h2>
          <button aria-label="Close" className="text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white" onClick={onClose}>
            <X />
          </button>
        </div>

        <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
            Child name
            <input
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
            Age (3-8)
            <input
              type="number"
              min={3}
              max={8}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </label>

          <label className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
            Avatar emoji
            <input
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              value={avatarEmoji}
              onChange={(e) => setAvatarEmoji(e.target.value)}
              maxLength={2}
            />
          </label>

          <label className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
            Accent color
            <input
              type="color"
              className="h-[42px] w-full rounded-xl border border-gray-300 bg-white dark:border-white/10 dark:bg-white/5"
              value={avatarColor}
              onChange={(e) => setAvatarColor(e.target.value)}
            />
          </label>

          <label className="space-y-2 text-sm text-gray-700 dark:text-slate-300 md:col-span-2">
            Favorite module
            <FavoriteModuleSelect value={favoriteModule} onChange={setFavoriteModule} />
          </label>

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create profile</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
