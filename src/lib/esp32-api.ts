import type { ChildDashboard, ActivityEvent, ModuleProgress, StreakDay } from './types'

const modules: ModuleProgress[] = [
  { id: 'first-aid', name: 'First Aid Sequencing', completed: 7, total: 10, accuracy: 0.92, exp: 540, color: '#3b82f6' },
  { id: 'color-mix', name: 'Color Mixing', completed: 6, total: 9, accuracy: 0.88, exp: 480, color: '#f59e0b' },
  { id: 'story-order', name: 'Story Ordering', completed: 5, total: 8, accuracy: 0.9, exp: 430, color: '#a855f7' },
]

const baseDashboard: Record<string, ChildDashboard> = {
  aria: {
    profileId: 'aria',
    level: 8,
    totalExp: 1780,
    nextLevelExp: 2000,
    modules,
    expByModule: modules.map((m) => ({ name: m.name, value: m.exp, color: m.color })),
    achievements: [
      {
        id: 'a1',
        title: 'First Aid Hero',
        description: 'Sequenced all first-aid steps without hints',
        icon: '❤️',
        unlockedAt: daysAgo(2),
        rarity: 'gold',
      },
      {
        id: 'a2',
        title: 'Color Master',
        description: 'Mixed secondary colors in under 60s',
        icon: '🎨',
        unlockedAt: daysAgo(4),
        rarity: 'silver',
      },
      {
        id: 'a3',
        title: 'Story Weaver',
        description: 'Ordered 3-part story flawlessly',
        icon: '📖',
        unlockedAt: daysAgo(7),
        rarity: 'bronze',
      },
    ],
    badges: [
      { id: 'b1', title: 'Lightning Learner', description: 'Finishes steps quickly', icon: '⚡', rarity: 'gold' },
      { id: 'b2', title: 'Curious Thinker', description: 'Asks for new levels often', icon: '🧠', rarity: 'silver' },
      { id: 'b3', title: 'Kind Teammate', description: 'Shares turns nicely', icon: '🤝', rarity: 'bronze' },
    ],
    streak: generateStreak(35),
    activity: [
      {
        id: 'ev1',
        message: 'Completed Color Mixing Level 2 with 95% accuracy',
        module: 'color-mix',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        accuracy: 0.95,
        exp: 50,
      },
      {
        id: 'ev2',
        message: 'Finished First Aid Sequence in 68s',
        module: 'first-aid',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        accuracy: 0.91,
        exp: 65,
      },
      {
        id: 'ev3',
        message: 'Story Ordering Level 3 replayed with hints',
        module: 'story-order',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        accuracy: 0.82,
        exp: 40,
      },
    ],
    stats: {
      playtimeMinutes: 124,
      averageSessionMinutes: 18,
      winRate: 0.86,
    },
    streakCount: 9,
  },
  dev: {
    profileId: 'dev',
    level: 5,
    totalExp: 940,
    nextLevelExp: 1200,
    modules: modules.map((m, idx) => ({ ...m, completed: m.completed - (idx + 1), accuracy: m.accuracy - 0.03 })),
    expByModule: modules.map((m) => ({ name: m.name, value: m.exp - 120, color: m.color })),
    achievements: [
      {
        id: 'a4',
        title: 'Safety Scout',
        description: 'Knows when to ask for help',
        icon: '🛡️',
        unlockedAt: daysAgo(1),
        rarity: 'silver',
      },
    ],
    badges: [
      { id: 'b4', title: 'Gentle Hands', description: 'Careful with the board', icon: '👐', rarity: 'bronze' },
    ],
    streak: generateStreak(35),
    activity: [
      {
        id: 'ev4',
        message: 'Color Mixing Level 1 cleared',
        module: 'color-mix',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        accuracy: 0.89,
        exp: 30,
      },
    ],
    stats: {
      playtimeMinutes: 72,
      averageSessionMinutes: 12,
      winRate: 0.78,
    },
    streakCount: 4,
  },
  mika: {
    profileId: 'mika',
    level: 6,
    totalExp: 1220,
    nextLevelExp: 1500,
    modules: modules.map((m, idx) => ({ ...m, completed: m.completed - (idx === 0 ? 0 : 2), accuracy: m.accuracy + 0.02 })),
    expByModule: modules.map((m) => ({ name: m.name, value: m.exp - 60, color: m.color })),
    achievements: [
      {
        id: 'a5',
        title: 'Calm Solver',
        description: 'Handles retries without frustration',
        icon: '🌿',
        unlockedAt: daysAgo(6),
        rarity: 'bronze',
      },
    ],
    badges: [
      { id: 'b5', title: 'Bright Listener', description: 'Listens to OLED prompts', icon: '👂', rarity: 'silver' },
    ],
    streak: generateStreak(35),
    activity: [
      {
        id: 'ev5',
        message: 'Story Ordering Level 2 complete',
        module: 'story-order',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        accuracy: 0.93,
        exp: 55,
      },
    ],
    stats: {
      playtimeMinutes: 93,
      averageSessionMinutes: 15,
      winRate: 0.82,
    },
    streakCount: 6,
  },
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()
}

function generateStreak(days: number): StreakDay[] {
  return Array.from({ length: days }).map((_, idx) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - idx - 1))
    const value = Math.random() > 0.25 ? Math.ceil(Math.random() * 3) : 0
    return { date: date.toISOString(), value }
  })
}

function randomActivity(_profileId: string): ActivityEvent {
  const module = modules[Math.floor(Math.random() * modules.length)]
  const accuracy = 0.78 + Math.random() * 0.2
  const exp = 20 + Math.floor(Math.random() * 40)
  return {
    id: crypto.randomUUID(),
    message: `${module.name} replayed at ${(accuracy * 100).toFixed(0)}% accuracy`,
    module: module.id,
    timestamp: new Date().toISOString(),
    accuracy,
    exp,
  }
}

export async function fetchDashboard(profileId: string): Promise<ChildDashboard> {
  await delay(350)
  
  // Return existing profile data if available, otherwise return default demo data
  const payload = baseDashboard[profileId]
  if (!payload) {
    // Return default dashboard data for new profiles
    return {
      profileId,
      level: 1,
      totalExp: 0,
      nextLevelExp: 100,
      modules,
      expByModule: modules.map((m) => ({ name: m.name, value: 0, color: m.color })),
      achievements: [
        {
          id: 'welcome',
          title: 'Welcome Explorer!',
          description: 'Started your learning journey',
          icon: '🎉',
          unlockedAt: new Date().toISOString(),
          rarity: 'bronze',
        },
      ],
      badges: [
        { id: 'starter', title: 'Fresh Start', description: 'Begin your adventure', icon: '🌟', rarity: 'bronze' },
      ],
      streak: generateStreak(35),
      activity: [
        {
          id: 'welcome-event',
          message: 'Profile created! Start playing to earn XP',
          module: 'color-mix',
          timestamp: new Date().toISOString(),
          accuracy: 1.0,
          exp: 0,
        },
      ],
      stats: {
        playtimeMinutes: 0,
        averageSessionMinutes: 0,
        winRate: 0,
      },
      streakCount: 0,
    }
  }
  
  return { ...payload }
}

export function subscribeToLiveEvents(profileId: string, onEvent: (event: ActivityEvent) => void) {
  const interval = setInterval(() => {
    onEvent(randomActivity(profileId))
  }, 9000)

  return () => clearInterval(interval)
}

export async function sendWeeklyReport(profileId: string) {
  await delay(500)
  return { ok: true, profileId }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
