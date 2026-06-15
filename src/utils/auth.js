// Local authentication and account utility for PWA offline capability
import { getLocalDateString } from "./gamification"

const ACCOUNTS_KEY = "10pages_accounts"
const SESSION_KEY = "10pages_current_user"

// Helper to check if window is defined (SSR safety)
const isBrowser = typeof window !== "undefined"

// Read all accounts from localStorage
export const getAccounts = () => {
  if (!isBrowser) return {}
  try {
    const data = localStorage.getItem(ACCOUNTS_KEY)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error("Error reading accounts", e)
    return {}
  }
}

// Save all accounts to localStorage
const saveAccounts = accounts => {
  if (!isBrowser) return
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch (e) {
    console.error("Error saving accounts", e)
  }
}

// Get current active session (username)
export const getCurrentUser = () => {
  if (!isBrowser) return null
  try {
    const user = localStorage.getItem(SESSION_KEY)
    if (!user) return null

    // Fetch profile data
    const accounts = getAccounts()
    const profile = accounts[user]
    if (!profile) return null

    return {
      username: profile.username,
      email: profile.email,
    }
  } catch (e) {
    console.error("Error reading session", e)
    return null
  }
}

// Set active session
const setSession = username => {
  if (!isBrowser) return
  if (username) {
    localStorage.setItem(SESSION_KEY, username)
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
  // Dispatch custom event to notify components of auth changes
  window.dispatchEvent(new Event("auth_change"))
}

// Register a new account
// If guestStats are provided, we import/merge them into the new user
export const register = (username, email, password, guestStats = null) => {
  if (!isBrowser) return { success: false, error: "Ambiente inválido" }

  const cleanUsername = username.trim().toLowerCase()
  const cleanEmail = email.trim().toLowerCase()

  if (!cleanUsername || !cleanEmail || !password) {
    return { success: false, error: "Todos os campos são obrigatórios." }
  }

  if (cleanUsername.length < 3) {
    return {
      success: false,
      error: "O nome de usuário deve ter pelo menos 3 caracteres.",
    }
  }

  const accounts = getAccounts()

  // Check duplicate username
  if (accounts[cleanUsername]) {
    return { success: false, error: "Este nome de usuário já está em uso." }
  }

  // Check duplicate email
  const emailExists = Object.values(accounts).some(
    acc => acc.email === cleanEmail
  )
  if (emailExists) {
    return { success: false, error: "Este e-mail já está cadastrado." }
  }

  // Merge guestStats or create new empty stats
  const initialStats = guestStats
    ? { ...guestStats }
    : {
        readStories: {},
        streak: 0,
        longestStreak: 0,
        lastReadDate: "",
        unlockedBadges: [],
      }

  // Create profile
  accounts[cleanUsername] = {
    username: username.trim(), // keep original casing for display
    email: cleanEmail,
    password: password, // simple storage for offline mockup
    stats: initialStats,
  }

  saveAccounts(accounts)

  // Save specific user stats key
  localStorage.setItem(
    `reading_stats_${cleanUsername}`,
    JSON.stringify(initialStats)
  )

  // Log user in
  setSession(cleanUsername)

  return {
    success: true,
    user: { username: username.trim(), email: cleanEmail },
  }
}

// Login to an existing account
export const login = (usernameOrEmail, password) => {
  if (!isBrowser) return { success: false, error: "Ambiente inválido" }

  const cleanInput = usernameOrEmail.trim().toLowerCase()
  const accounts = getAccounts()

  // Find account by username or email
  let foundUser = null
  if (accounts[cleanInput]) {
    foundUser = accounts[cleanInput]
  } else {
    foundUser = Object.values(accounts).find(acc => acc.email === cleanInput)
  }

  if (!foundUser || foundUser.password !== password) {
    return { success: false, error: "Usuário ou senha incorretos." }
  }

  // Log user in
  setSession(foundUser.username.toLowerCase())

  // Ensure their stats are synced in localStorage
  if (foundUser.stats) {
    localStorage.setItem(
      `reading_stats_${foundUser.username.toLowerCase()}`,
      JSON.stringify(foundUser.stats)
    )
  }

  return {
    success: true,
    user: { username: foundUser.username, email: foundUser.email },
  }
}

// Logout from the current account
export const logout = () => {
  setSession(null)
}

// Update stats for current user
export const updateCurrentUserStats = stats => {
  if (!isBrowser) return
  const user = getCurrentUser()
  if (!user) return

  const cleanUsername = user.username.toLowerCase()
  const accounts = getAccounts()
  if (accounts[cleanUsername]) {
    accounts[cleanUsername].stats = stats
    saveAccounts(accounts)
  }
}
