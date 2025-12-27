export type ModuleProgress = {
  id: string
  name: string
  completed: number
  total: number
  accuracy: number
  exp: number
  color: string
}

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  rarity: 'bronze' | 'silver' | 'gold'
}

export type Badge = {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'bronze' | 'silver' | 'gold'
}

export type ActivityEvent = {
  id: string
  message: string
  module: string
  timestamp: string
  accuracy: number
  exp: number
}

export type StreakDay = {
  date: string
  value: number
}

export type ChildDashboard = {
  profileId: string
  level: number
  totalExp: number
  nextLevelExp: number
  modules: ModuleProgress[]
  achievements: Achievement[]
  badges: Badge[]
  streak: StreakDay[]
  activity: ActivityEvent[]
  expByModule: { name: string; value: number; color: string }[]
  stats: {
    playtimeMinutes: number
    averageSessionMinutes: number
    winRate: number
  }
  streakCount: number
}

export type Profile = {
  id: string
  name: string
  age: number
  avatarColor: string
  avatarEmoji: string
  level: number
  exp: number
  streak: number
  favoriteModule: string
}
