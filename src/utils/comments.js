// Reddit-style threaded comments system for local offline usage
import { getStats, saveStats } from "./gamification"

const COMMENTS_KEY = "10pages_comments"

const isBrowser = typeof window !== "undefined"

// Generate mock comments if a story has no comments yet
const generateMockComments = (slug, authorName, title) => {
  const authorLower = authorName ? authorName.toLowerCase() : ""

  let specificComments = []

  if (authorLower.includes("machado")) {
    specificComments = [
      {
        id: "mock-1",
        username: "Machadiano_Carioca",
        text: `A ironia do Machado nesta obra é simplesmente cirúrgica! A forma como ele analisa a vaidade humana em pouquíssimas páginas é de uma genialidade absurda. O que vocês acharam do desfecho?`,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        upvotes: 24,
        downvotes: 2,
        userVote: null,
        replies: [
          {
            id: "mock-1-1",
            username: "Leitora_Atenta",
            text: "Totalmente de acordo! O desfecho é ambíguo de propósito. Ele joga a responsabilidade do julgamento moral para o leitor. Típico dele.",
            timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
            upvotes: 12,
            downvotes: 1,
            userVote: null,
            replies: [],
          },
        ],
      },
      {
        id: "mock-2",
        username: "Bento_Santiago",
        text: `O realismo psicológico aqui me impressiona mais a cada releitura. Não há heróis nem vilões óbvios, apenas a fragilidade humana sendo exposta.`,
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
        upvotes: 15,
        downvotes: 0,
        userVote: null,
        replies: [],
      },
    ]
  } else if (authorLower.includes("poe")) {
    specificComments = [
      {
        id: "mock-1",
        username: "Gothic_Poeta",
        text: `Que atmosfera densa e claustrofóbica. Ninguém constrói o suspense e a decadência mental dos personagens como o Poe. Ler isso à noite dá uma sensação indescritível de arrepio.`,
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        upvotes: 31,
        downvotes: 1,
        userVote: null,
        replies: [
          {
            id: "mock-1-1",
            username: "Raven_Shadow",
            text: "Exatamente! O ritmo que ele cria com as repetições e a escolha das palavras é quase hipnótico. Sensacional.",
            timestamp: new Date(Date.now() - 3600000 * 15).toISOString(),
            upvotes: 14,
            downvotes: 0,
            userVote: null,
            replies: [],
          },
        ],
      },
      {
        id: "mock-2",
        username: "Detetive_Dupin",
        text: `Reparem como a mente humana é o verdadeiro monstro nesta narrativa. O terror psicológico supera qualquer criatura física.`,
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        upvotes: 18,
        downvotes: 2,
        userVote: null,
        replies: [],
      },
    ]
  } else if (authorLower.includes("grimm") || authorLower.includes("coelho")) {
    specificComments = [
      {
        id: "mock-1",
        username: "Folclore_Total",
        text: `É fascinante ler as versões clássicas originais. Elas são muito mais sombrias, misteriosas e cheias de simbolismos do que as adaptações infantis modernas.`,
        timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
        upvotes: 19,
        downvotes: 1,
        userVote: null,
        replies: [
          {
            id: "mock-1-1",
            username: "Chapeuzinho_Retro",
            text: "Sim! Essas histórias tinham funções de alerta social na Idade Média. Preservar o tom original do folclore é essencial.",
            timestamp: new Date(Date.now() - 3600000 * 30).toISOString(),
            upvotes: 9,
            downvotes: 0,
            userVote: null,
            replies: [],
          },
        ],
      },
    ]
  } else {
    // Generic high-quality templates
    specificComments = [
      {
        id: "mock-1",
        username: "Leitor_Voraz",
        text: `Que conto maravilhoso! A brevidade clássica (menos de 10 páginas) é perfeita. Ela nos força a concentrar em cada frase e palavra escolhida pelo autor.`,
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        upvotes: 14,
        downvotes: 0,
        userVote: null,
        replies: [
          {
            id: "mock-1-1",
            username: "Bibliófilo_Nacional",
            text: "Verdade. O formato do conto curto exige uma precisão quase poética. Excelente curadoria do 10pages.",
            timestamp: new Date(Date.now() - 3600000 * 40).toISOString(),
            upvotes: 6,
            downvotes: 0,
            userVote: null,
            replies: [],
          },
        ],
      },
      {
        id: "mock-2",
        username: "Clube_do_Livro",
        text: `Fiquei encantado com a riqueza do vocabulário e a ambientação histórica. Uma janela perfeita para a alma e a linguagem de outras épocas!`,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        upvotes: 11,
        downvotes: 1,
        userVote: null,
        replies: [],
      },
    ]
  }

  return specificComments
}

// Get all comments for a story
export const getComments = (slug, authorName = "", title = "") => {
  if (!isBrowser) return []
  try {
    const data = localStorage.getItem(COMMENTS_KEY)
    const database = data ? JSON.parse(data) : {}

    // Check if comments exist for this story
    if (!database[slug]) {
      // Generate mock comments, save them, and return
      const mocks = generateMockComments(slug, authorName, title)
      database[slug] = mocks
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(database))
      return mocks
    }

    return database[slug]
  } catch (e) {
    console.error("Error reading comments", e)
    return []
  }
}

// Save comments to database
const saveCommentsDatabase = database => {
  if (!isBrowser) return
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(database))
  } catch (e) {
    console.error("Error saving comments database", e)
  }
}

// Helper to recursively find and append a reply or update a comment in the tree
const addReplyToTree = (commentsList, parentId, newComment) => {
  for (let i = 0; i < commentsList.length; i++) {
    if (commentsList[i].id === parentId) {
      if (!commentsList[i].replies) commentsList[i].replies = []
      commentsList[i].replies.push(newComment)
      return true
    }
    if (commentsList[i].replies && commentsList[i].replies.length > 0) {
      const found = addReplyToTree(
        commentsList[i].replies,
        parentId,
        newComment
      )
      if (found) return true
    }
  }
  return false
}

// Add a comment or reply
export const addComment = (slug, parentId, username, text) => {
  if (!isBrowser || !text.trim()) return null

  const data = localStorage.getItem(COMMENTS_KEY)
  const database = data ? JSON.parse(data) : {}
  const commentsList = database[slug] || []

  const newComment = {
    id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    username: username || "Visitante",
    text: text.trim(),
    timestamp: new Date().toISOString(),
    upvotes: 1,
    downvotes: 0,
    userVote: "up", // User automatically upvotes their own comment
    replies: [],
  }

  if (!parentId) {
    // Top level comment
    commentsList.unshift(newComment)
  } else {
    // Reply to nested comment
    addReplyToTree(commentsList, parentId, newComment)
  }

  database[slug] = commentsList
  saveCommentsDatabase(database)

  // Track Debatedor Badge progress
  const stats = getStats()
  if (!stats.unlockedBadges) stats.unlockedBadges = []

  if (!stats.unlockedBadges.includes("debatedor")) {
    // Count user-written comments in database
    let userCommentCount = 0
    const countUserComments = list => {
      list.forEach(c => {
        if (c.id.startsWith("user-")) userCommentCount++
        if (c.replies) countUserComments(c.replies)
      })
    }

    // Scan all stories comments
    Object.values(database).forEach(list => {
      countUserComments(list)
    })

    if (userCommentCount >= 2) {
      stats.unlockedBadges.push("debatedor")
      const badgeData = {
        id: "debatedor",
        title: "Debatedor",
        description: "Escreveu 2 comentários nas discussões de contos.",
        icon: "💬",
      }
      saveStats(stats)
      window.dispatchEvent(
        new CustomEvent("badge_unlocked", { detail: badgeData })
      )
    }
  }

  // Dispatch comments updated event
  window.dispatchEvent(
    new CustomEvent("comments_updated", { detail: { slug } })
  )
  return newComment
}

// Helper to recursively find and vote on a comment in the tree
const voteInTree = (commentsList, commentId, voteType) => {
  for (let i = 0; i < commentsList.length; i++) {
    if (commentsList[i].id === commentId) {
      const comment = commentsList[i]
      const previousVote = comment.userVote

      // Reset previous vote impact
      if (previousVote === "up") {
        comment.upvotes = Math.max(0, comment.upvotes - 1)
      } else if (previousVote === "down") {
        comment.downvotes = Math.max(0, comment.downvotes - 1)
      }

      // Apply new vote impact
      if (voteType === "up") {
        comment.upvotes += 1
        comment.userVote = "up"
      } else if (voteType === "down") {
        comment.downvotes += 1
        comment.userVote = "down"
      } else {
        comment.userVote = null
      }
      return true
    }
    if (commentsList[i].replies && commentsList[i].replies.length > 0) {
      const found = voteInTree(commentsList[i].replies, commentId, voteType)
      if (found) return true
    }
  }
  return false
}

// Vote on a comment
export const voteComment = (slug, commentId, voteType) => {
  if (!isBrowser) return false

  const data = localStorage.getItem(COMMENTS_KEY)
  const database = data ? JSON.parse(data) : {}
  const commentsList = database[slug] || []

  const success = voteInTree(commentsList, commentId, voteType)
  if (success) {
    database[slug] = commentsList
    saveCommentsDatabase(database)
    window.dispatchEvent(
      new CustomEvent("comments_updated", { detail: { slug } })
    )
  }
  return success
}
