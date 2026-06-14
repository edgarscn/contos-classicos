// Gamification Utility for tracking reading streaks and achievements
import { getCurrentUser, updateCurrentUserStats } from "./auth";

// Helper to get local date string YYYY-MM-DD
export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to check if date string represents yesterday relative to today
const isYesterday = (lastReadStr, today) => {
  if (!lastReadStr) return false;
  const lastRead = new Date(lastReadStr + 'T12:00:00'); // set mid-day to avoid TZ issues
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(lastRead) === getLocalDateString(yesterday);
};

const DEFAULT_STATS = {
  readStories: {}, // { [slug]: completionTimestamp }
  streak: 0,
  longestStreak: 0,
  lastReadDate: "",
  unlockedBadges: []
};

// Badges list and metadata
export const BADGES = [
  {
    id: "primeiras-paginas",
    title: "Primeiras Páginas",
    description: "Concluiu a leitura de 1 conto ou crônica.",
    icon: "🎓"
  },
  {
    id: "leitor-voraz",
    title: "Leitor Voraz",
    description: "Leu 5 contos diferentes no total.",
    icon: "📚"
  },
  {
    id: "habito-inicial",
    title: "Hábito Inicial",
    description: "Alcançou 3 dias de ofensiva seguidos.",
    icon: "🔥"
  },
  {
    id: "devorador-livros",
    title: "Devorador de Livros",
    description: "Alcançou 7 dias de ofensiva seguidos.",
    icon: "🏆"
  },
  {
    id: "leitor-noturno",
    title: "Leitor Noturno",
    description: "Concluiu uma leitura entre as 22h e 04h.",
    icon: "🦉"
  }
];

// Read stats from localStorage (safe for SSR)
export const getStats = () => {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const currentUser = getCurrentUser();
    const statsKey = currentUser ? `reading_stats_${currentUser.username.toLowerCase()}` : "reading_stats";
    
    const statsStr = localStorage.getItem(statsKey);
    if (!statsStr) return DEFAULT_STATS;
    const parsed = JSON.parse(statsStr);
    return { ...DEFAULT_STATS, ...parsed };
  } catch (e) {
    console.error("Error reading stats", e);
    return DEFAULT_STATS;
  }
};

// Save stats to localStorage
export const saveStats = (stats) => {
  if (typeof window === "undefined") return;
  try {
    const currentUser = getCurrentUser();
    const statsKey = currentUser ? `reading_stats_${currentUser.username.toLowerCase()}` : "reading_stats";
    
    localStorage.setItem(statsKey, JSON.stringify(stats));
    
    // If logged in, update their account record as well
    if (currentUser) {
      updateCurrentUserStats(stats);
    }
  } catch (e) {
    console.error("Error saving stats", e);
  }
};

// Record completion of a story
// Returns list of newly unlocked badge objects (empty if none)
export const recordCompletion = (slug) => {
  if (typeof window === "undefined") return { newBadges: [], stats: DEFAULT_STATS };
  
  const stats = getStats();
  const now = new Date();
  const todayStr = getLocalDateString(now);
  const completionHour = now.getHours();

  // If already read today and this story was already completed, just return
  const isAlreadyCompleted = !!stats.readStories[slug];
  
  // Update completed stories list
  stats.readStories[slug] = now.toISOString();

  // Streak update logic
  if (stats.lastReadDate !== todayStr) {
    if (isYesterday(stats.lastReadDate, now)) {
      // Continued streak
      stats.streak += 1;
    } else {
      // Streak broken or starting fresh
      stats.streak = 1;
    }
    stats.longestStreak = Math.max(stats.streak, stats.longestStreak);
    stats.lastReadDate = todayStr;
  }

  // Check badges achievement triggers
  const newlyUnlocked = [];
  const totalReadCount = Object.keys(stats.readStories).length;

  const checkAndUnlock = (badgeId) => {
    if (!stats.unlockedBadges.includes(badgeId)) {
      stats.unlockedBadges.push(badgeId);
      const badgeData = BADGES.find(b => b.id === badgeId);
      if (badgeData) newlyUnlocked.push(badgeData);
    }
  };

  // Badge 1: Primeiras Páginas (1 story read)
  if (totalReadCount >= 1) checkAndUnlock("primeiras-paginas");

  // Badge 2: Leitor Voraz (5 stories read)
  if (totalReadCount >= 5) checkAndUnlock("leitor-voraz");

  // Badge 3: Hábito Inicial (3 days streak)
  if (stats.streak >= 3) checkAndUnlock("habito-inicial");

  // Badge 4: Devorador de Livros (7 days streak)
  if (stats.streak >= 7) checkAndUnlock("devorador-livros");

  // Badge 5: Leitor Noturno (hour between 22:00 and 04:00)
  if (completionHour >= 22 || completionHour < 4) checkAndUnlock("leitor-noturno");

  saveStats(stats);
  
  return {
    newBadges: newlyUnlocked,
    stats,
    alreadyFinished: isAlreadyCompleted
  };
};
