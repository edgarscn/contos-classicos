// Gamification Utility for tracking reading streaks and achievements
import { getCurrentUser, updateCurrentUserStats } from "./auth"

// Helper to get local date string YYYY-MM-DD
export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Helper to check if date string represents yesterday relative to today
const isYesterday = (lastReadStr, today) => {
  if (!lastReadStr) return false
  const lastRead = new Date(lastReadStr + "T12:00:00") // set mid-day to avoid TZ issues
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return getLocalDateString(lastRead) === getLocalDateString(yesterday)
}

const DEFAULT_STATS = {
  readStories: {}, // { [slug]: completionTimestamp }
  streak: 0,
  longestStreak: 0,
  lastReadDate: "",
  unlockedBadges: [],
  favorites: [], // [slug]
  ratings: {}, // { [slug]: ratingValue }
}

// Badges list and metadata
export const BADGES = [
  {
    id: "primeiras-paginas",
    title: "Primeiras Páginas",
    description: "Concluiu a leitura de 1 conto ou crônica.",
    icon: "🎓",
  },
  {
    id: "leitor-voraz",
    title: "Leitor Voraz",
    description: "Leu 5 contos diferentes no total.",
    icon: "📚",
  },
  {
    id: "habito-inicial",
    title: "Hábito Inicial",
    description: "Alcançou 3 dias de ofensiva seguidos.",
    icon: "🔥",
  },
  {
    id: "devorador-livros",
    title: "Devorador de Livros",
    description: "Alcançou 7 dias de ofensiva seguidos.",
    icon: "🏆",
  },
  {
    id: "leitor-noturno",
    title: "Leitor Noturno",
    description: "Concluiu uma leitura entre as 22h e 04h.",
    icon: "🦉",
  },
  {
    id: "critico-literario",
    title: "Crítico Literário",
    description: "Avaliou 5 contos com nota (1 a 5 estrelas).",
    icon: "🌟",
  },
  {
    id: "colecionador",
    title: "Colecionador",
    description: "Adicionou 3 contos aos favoritos.",
    icon: "❤️",
  },
  {
    id: "debatedor",
    title: "Debatedor",
    description: "Escreveu 2 comentários nas discussões de contos.",
    icon: "💬",
  },
  {
    id: "socializador",
    title: "Socializador",
    description: "Adicionou seu primeiro amigo no app.",
    icon: "👥",
  },
]

// Read stats from localStorage (safe for SSR)
export const getStats = () => {
  if (typeof window === "undefined") return DEFAULT_STATS
  try {
    const currentUser = getCurrentUser()
    const statsKey = currentUser
      ? `reading_stats_${currentUser.username.toLowerCase()}`
      : "reading_stats"

    const statsStr = localStorage.getItem(statsKey)
    if (!statsStr) return DEFAULT_STATS
    const parsed = JSON.parse(statsStr)
    return { ...DEFAULT_STATS, ...parsed }
  } catch (e) {
    console.error("Error reading stats", e)
    return DEFAULT_STATS
  }
}

// Save stats to localStorage
export const saveStats = stats => {
  if (typeof window === "undefined") return
  try {
    const currentUser = getCurrentUser()
    const statsKey = currentUser
      ? `reading_stats_${currentUser.username.toLowerCase()}`
      : "reading_stats"

    localStorage.setItem(statsKey, JSON.stringify(stats))

    // If logged in, update their account record as well
    if (currentUser) {
      updateCurrentUserStats(stats)
    }
  } catch (e) {
    console.error("Error saving stats", e)
  }
}

// Record completion of a story
// Returns list of newly unlocked badge objects (empty if none)
export const recordCompletion = slug => {
  if (typeof window === "undefined")
    return { newBadges: [], stats: DEFAULT_STATS }

  const stats = getStats()
  const now = new Date()
  const todayStr = getLocalDateString(now)
  const completionHour = now.getHours()

  // If already read today and this story was already completed, just return
  const isAlreadyCompleted = !!stats.readStories[slug]

  // Update completed stories list
  stats.readStories[slug] = now.toISOString()

  // Streak update logic
  if (stats.lastReadDate !== todayStr) {
    if (isYesterday(stats.lastReadDate, now)) {
      // Continued streak
      stats.streak += 1
    } else {
      // Streak broken or starting fresh
      stats.streak = 1
    }
    stats.longestStreak = Math.max(stats.streak, stats.longestStreak)
    stats.lastReadDate = todayStr
  }

  // Check badges achievement triggers
  const newlyUnlocked = []
  const totalReadCount = Object.keys(stats.readStories).length

  const checkAndUnlock = badgeId => {
    if (!stats.unlockedBadges.includes(badgeId)) {
      stats.unlockedBadges.push(badgeId)
      const badgeData = BADGES.find(b => b.id === badgeId)
      if (badgeData) newlyUnlocked.push(badgeData)
    }
  }

  // Badge 1: Primeiras Páginas (1 story read)
  if (totalReadCount >= 1) checkAndUnlock("primeiras-paginas")

  // Badge 2: Leitor Voraz (5 stories read)
  if (totalReadCount >= 5) checkAndUnlock("leitor-voraz")

  // Badge 3: Hábito Inicial (3 days streak)
  if (stats.streak >= 3) checkAndUnlock("habito-inicial")

  // Badge 4: Devorador de Livros (7 days streak)
  if (stats.streak >= 7) checkAndUnlock("devorador-livros")

  // Badge 5: Leitor Noturno (hour between 22:00 and 04:00)
  if (completionHour >= 22 || completionHour < 4)
    checkAndUnlock("leitor-noturno")

  saveStats(stats)

  return {
    newBadges: newlyUnlocked,
    stats,
    alreadyFinished: isAlreadyCompleted,
  }
}

// Dispatch badge unlock event helper
const dispatchBadgeUnlock = badge => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("badge_unlocked", { detail: badge }))
  }
}

// Check and unlock ratings/favorites badges
export const checkCustomBadges = stats => {
  const newlyUnlocked = []
  const checkAndUnlock = badgeId => {
    if (!stats.unlockedBadges) stats.unlockedBadges = []
    if (!stats.unlockedBadges.includes(badgeId)) {
      stats.unlockedBadges.push(badgeId)
      const badgeData = BADGES.find(b => b.id === badgeId)
      if (badgeData) {
        newlyUnlocked.push(badgeData)
        dispatchBadgeUnlock(badgeData)
      }
    }
  }

  const totalRatedCount = Object.keys(stats.ratings || {}).length
  if (totalRatedCount >= 5) checkAndUnlock("critico-literario")

  const totalFavoritesCount = (stats.favorites || []).length
  if (totalFavoritesCount >= 3) checkAndUnlock("colecionador")

  return newlyUnlocked
}

// Toggle favorite status of a story
export const toggleFavorite = slug => {
  if (typeof window === "undefined") return false
  const stats = getStats()
  if (!stats.favorites) stats.favorites = []

  const index = stats.favorites.indexOf(slug)
  let isFav = false
  if (index > -1) {
    stats.favorites.splice(index, 1)
  } else {
    stats.favorites.push(slug)
    isFav = true
  }

  checkCustomBadges(stats)
  saveStats(stats)

  // Dispatch stats update event
  window.dispatchEvent(new CustomEvent("stats_updated"))
  return isFav
}

// Set rating for a story (1-5)
export const rateStory = (slug, rating) => {
  if (typeof window === "undefined") return
  const stats = getStats()
  if (!stats.ratings) stats.ratings = {}

  stats.ratings[slug] = rating

  checkCustomBadges(stats)
  saveStats(stats)

  // Dispatch stats update event
  window.dispatchEvent(new CustomEvent("stats_updated"))
}

// Get rating for a story (defaults to 0)
export const getRating = slug => {
  const stats = getStats()
  return (stats.ratings && stats.ratings[slug]) || 0
}

// Check if a story is favorited
export const isFavorite = slug => {
  const stats = getStats()
  return !!(stats.favorites && stats.favorites.includes(slug))
}
