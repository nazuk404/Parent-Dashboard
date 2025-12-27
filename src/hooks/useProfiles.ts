import { create } from 'zustand'
import type { Profile } from '../lib/types'

const STORAGE_KEY = 'snapsense-profiles'

// Demo profiles to use if no profiles exist in localStorage
const demoProfiles: Profile[] = [
  {
    id: 'aria',
    name: 'Aria',
    age: 7,
    avatarColor: '#3b82f6',
    avatarEmoji: '🎈',
    level: 8,
    exp: 1780,
    streak: 9,
    favoriteModule: 'Color Mixing',
  },
  {
    id: 'dev',
    name: 'Dev',
    age: 5,
    avatarColor: '#10b981',
    avatarEmoji: '🚀',
    level: 5,
    exp: 940,
    streak: 4,
    favoriteModule: 'First Aid Sequencing',
  },
]

// Load profiles from localStorage or return demo profiles
const loadProfiles = (): Profile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : demoProfiles
    }
  } catch (error) {
    console.error('Failed to load profiles from localStorage:', error)
  }
  return demoProfiles
}

// Save profiles to localStorage
const saveProfiles = (profiles: Profile[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  } catch (error) {
    console.error('Failed to save profiles to localStorage:', error)
  }
}

interface ProfileState {
  profiles: Profile[]
  selectedProfileId: string | null
  isLoading: boolean
  selectProfile: (id: string | null) => void
  addProfile: (payload: Omit<Profile, 'id' | 'level' | 'exp' | 'streak'>) => Profile
  removeProfile: (id: string) => void
  initProfiles: () => void
}

export const useProfiles = create<ProfileState>((set, get) => ({
  profiles: [],
  selectedProfileId: null,
  isLoading: true,
  
  initProfiles: () => {
    const profiles = loadProfiles()
    saveProfiles(profiles) // Ensure they're saved
    set({ profiles, isLoading: false })
  },
  
  selectProfile: (id) => set({ selectedProfileId: id }),
  
  addProfile: ({ name, age, avatarColor, avatarEmoji, favoriteModule }) => {
    const id = crypto.randomUUID()
    const newProfile: Profile = {
      id,
      name,
      age,
      avatarColor,
      avatarEmoji,
      favoriteModule,
      level: 1,
      exp: 0,
      streak: 0,
    }
    const updatedProfiles = [...get().profiles, newProfile]
    set({ profiles: updatedProfiles })
    saveProfiles(updatedProfiles)
    return newProfile
  },
  
  removeProfile: (id) => {
    const updatedProfiles = get().profiles.filter((p) => p.id !== id)
    set({ 
      profiles: updatedProfiles,
      selectedProfileId: get().selectedProfileId === id ? null : get().selectedProfileId
    })
    saveProfiles(updatedProfiles)
  },
}))
