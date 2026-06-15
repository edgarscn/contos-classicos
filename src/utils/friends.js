// Friends and Social Activity Feed Utility for PWA offline-first simulator
import { getStats, saveStats } from "./gamification"
import { getCurrentUser } from "./auth"

const FRIENDS_PREFIX = "10pages_friends_"
const isBrowser = typeof window !== "undefined"

// Global database of mock users available to search and add
export const MOCK_PROFILES = {
  lucas_machadiano: {
    username: "Lucas_Machadiano",
    bio: "Apaixonado pela literatura brasileira do século XIX. Machado de Assis, Aluísio Azevedo e crônicas cariocas.",
    avatar: "🎩",
    favorites: ["o-alienista", "a-cartomante", "miss-dollar"],
    readHistory: [
      {
        slug: "o-alienista",
        title: "O Alienista",
        author: "Machado de Assis",
        rating: 5,
        date: "2026-06-15T12:30:00Z",
        review:
          "Uma obra-prima absoluta da ironia e análise psicológica. Dr. Simão Bacamarte é icônico.",
      },
      {
        slug: "a-cartomante",
        title: "A Cartomante",
        author: "Machado de Assis",
        rating: 5,
        date: "2026-06-14T10:00:00Z",
        review:
          "A tensão do desfecho me prende mesmo após ler dezenas de vezes. Genial.",
      },
      {
        slug: "o-enfermeiro",
        title: "O Enfermeiro",
        author: "Machado de Assis",
        rating: 4,
        date: "2026-06-11T21:15:00Z",
        review: "Uma reflexão cruel e realista sobre a moral humana.",
      },
    ],
  },
  gothic_reader: {
    username: "Gothic_Reader",
    bio: "Mistério, terror psicológico e o gótico escuro. Edgar Allan Poe e Irmãos Grimm são minhas leituras preferidas.",
    avatar: "👁️‍🗨️",
    favorites: ["o-gato-preto", "o-corvo", "a-queda-da-casa-de-usher"],
    readHistory: [
      {
        slug: "o-gato-preto",
        title: "O Gato Preto",
        author: "Edgar Allan Poe",
        rating: 5,
        date: "2026-06-15T15:20:00Z",
        review:
          "Ninguém constrói o sentimento de culpa e loucura iminente tão bem quanto o Poe.",
      },
      {
        slug: "o-barril-de-amontillado",
        title: "O Barril de Amontillado",
        author: "Edgar Allan Poe",
        rating: 5,
        date: "2026-06-13T22:45:00Z",
        review:
          "Vingança fria e implacável. Sensacional a frieza de Montresor.",
      },
      {
        slug: "chapeuzinho-vermelho",
        title: "Chapeuzinho Vermelho",
        author: "Irmãos Grimm",
        rating: 4,
        date: "2026-06-10T14:30:00Z",
        review:
          "Fascinante ler o conto original. Tem um tom de alerta moral muito forte.",
      },
    ],
  },
  clarice_leitora: {
    username: "Clarice_Leitora",
    bio: "Procurando a alma nas pequenas crônicas. Leitora assídua de Lima Barreto, Raul Pompeia e João do Rio.",
    avatar: "✍️",
    favorites: ["o-homem-que-sabia-javanes", "a-causa-secreta"],
    readHistory: [
      {
        slug: "o-homem-que-sabia-javanes",
        title: "O Homem que Sabia Javanês",
        author: "Lima Barreto",
        rating: 4,
        date: "2026-06-15T09:10:00Z",
        review:
          "Uma sátira hilária e muito atual sobre a farsa do intelectualismo no Brasil.",
      },
      {
        slug: "a-causa-secreta",
        title: "A Causa Secreta",
        author: "Machado de Assis",
        rating: 5,
        date: "2026-06-14T18:30:00Z",
        review:
          "Fortíssima análise psicológica sobre o sadismo. O desfecho causa arrepios.",
      },
      {
        slug: "o-bebe-de-tarlatana-de-gala",
        title: "O Bebê de Tarlatana de Gala",
        author: "João do Rio",
        rating: 4,
        date: "2026-06-12T23:10:00Z",
        review:
          "O gótico urbano carioca na sua melhor forma. Inquietante e poético.",
      },
    ],
  },
  leo_curioso: {
    username: "Leo_Curioso",
    bio: "Explorando contos e lendas tradicionais do folclore mundial. Grimm, Andersen e mitos clássicos.",
    avatar: "🦊",
    favorites: ["o-soldadinho-de-chumbo", "branca-de-neve"],
    readHistory: [
      {
        slug: "o-soldadinho-de-chumbo",
        title: "O Soldadinho de Chumbo",
        author: "Hans Christian Andersen",
        rating: 4,
        date: "2026-06-15T14:15:00Z",
        review:
          "Um conto extremamente poético e melancólico. Andersen escrevia com a alma.",
      },
      {
        slug: "joao-e-maria",
        title: "João e Maria",
        author: "Irmãos Grimm",
        rating: 4,
        date: "2026-06-13T16:00:00Z",
        review:
          "Clássico inesquecível da infância. Ler a tradução direta dá outra perspectiva.",
      },
    ],
  },
}

// Retrieve friends of current user
export const getFriends = () => {
  if (!isBrowser) return []
  const user = getCurrentUser()
  if (!user) return []

  try {
    const key = `${FRIENDS_PREFIX}${user.username.toLowerCase()}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : ["lucas_machadiano", "gothic_reader"] // default initial friends for demo
  } catch (e) {
    console.error("Error reading friends", e)
    return []
  }
}

// Save friends list
const saveFriends = friendsList => {
  if (!isBrowser) return
  const user = getCurrentUser()
  if (!user) return

  try {
    const key = `${FRIENDS_PREFIX}${user.username.toLowerCase()}`
    localStorage.setItem(key, JSON.stringify(friendsList))
  } catch (e) {
    console.error("Error saving friends list", e)
  }
}

// Add a friend by username
export const addFriend = username => {
  if (!isBrowser) return { success: false, error: "Ambiente inválido" }
  const user = getCurrentUser()
  if (!user)
    return { success: false, error: "Crie uma conta para adicionar amigos" }

  const cleanInput = username.trim().toLowerCase()

  if (cleanInput === user.username.toLowerCase()) {
    return { success: false, error: "Você não pode se adicionar como amigo." }
  }

  const friendsList = getFriends()

  if (friendsList.includes(cleanInput)) {
    return {
      success: false,
      error: "Esse usuário já está na sua lista de amigos.",
    }
  }

  // Find or create profile
  let foundProfile = MOCK_PROFILES[cleanInput]
  if (!foundProfile) {
    // Dynamically generate a nice profile for the custom username so it works smoothly!
    const capitalized = username.charAt(0).toUpperCase() + username.slice(1)
    foundProfile = {
      username: capitalized,
      bio: `Leitor novato no 10pages. Explorando clássicos da literatura.`,
      avatar: "📖",
      favorites: [],
      readHistory: [
        {
          slug: "o-alienista",
          title: "O Alienista",
          author: "Machado de Assis",
          rating: 4,
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          review:
            "Gostei bastante. Achei a leitura desafiadora e muito irônica.",
        },
      ],
    }
    // Save to our MOCK_PROFILES locally
    MOCK_PROFILES[cleanInput] = foundProfile
  }

  friendsList.push(cleanInput)
  saveFriends(friendsList)

  // Unlock Socializador Badge
  const stats = getStats()
  if (!stats.unlockedBadges) stats.unlockedBadges = []
  if (!stats.unlockedBadges.includes("socializador")) {
    stats.unlockedBadges.push("socializador")
    const badgeData = {
      id: "socializador",
      title: "Socializador",
      description: "Adicionou seu primeiro amigo no app.",
      icon: "👥",
    }
    saveStats(stats)
    window.dispatchEvent(
      new CustomEvent("badge_unlocked", { detail: badgeData })
    )
  }

  // Dispatch friends list updated event
  window.dispatchEvent(new Event("friends_updated"))
  return { success: true, profile: foundProfile }
}

// Remove a friend
export const removeFriend = username => {
  if (!isBrowser) return false
  const cleanInput = username.trim().toLowerCase()

  const friendsList = getFriends()
  const index = friendsList.indexOf(cleanInput)
  if (index > -1) {
    friendsList.splice(index, 1)
    saveFriends(friendsList)
    window.dispatchEvent(new Event("friends_updated"))
    return true
  }
  return false
}

// Search users by name query
export const searchUsers = query => {
  const cleanQuery = query.toLowerCase().trim()
  if (!cleanQuery) return []

  return Object.values(MOCK_PROFILES).filter(profile =>
    profile.username.toLowerCase().includes(cleanQuery)
  )
}

// Generate and get merged feed of friends' activities
export const getFriendFeed = () => {
  const friends = getFriends()
  let feed = []

  friends.forEach(friendKey => {
    const profile = MOCK_PROFILES[friendKey]
    if (profile && profile.readHistory) {
      profile.readHistory.forEach(historyItem => {
        feed.push({
          username: profile.username,
          avatar: profile.avatar,
          bio: profile.bio,
          ...historyItem,
        })
      })
    }
  })

  // Sort feed by date (newest first)
  return feed.sort((a, b) => new Date(b.date) - new Date(a.date))
}
