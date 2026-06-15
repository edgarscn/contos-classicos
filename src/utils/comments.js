// Reddit-style threaded comments system for local offline usage
import { getStats, saveStats } from "./gamification"

const COMMENTS_KEY = "10pages_comments"

const isBrowser = typeof window !== "undefined"

// Helper to recursively filter out mock comments
const filterMockComments = commentsList => {
  if (!commentsList) return []
  return commentsList
    .filter(comment => comment && comment.id && !comment.id.startsWith("mock-"))
    .map(comment => {
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: filterMockComments(comment.replies),
        }
      }
      return comment
    })
}

// Purge any pre-existing mock comments from the local database on load
if (isBrowser) {
  try {
    const data = localStorage.getItem(COMMENTS_KEY)
    if (data) {
      const database = JSON.parse(data)
      let modified = false

      Object.keys(database).forEach(slug => {
        const original = database[slug] || []
        const cleaned = filterMockComments(original)
        if (JSON.stringify(original) !== JSON.stringify(cleaned)) {
          database[slug] = cleaned
          modified = true
        }
      })

      if (modified) {
        localStorage.setItem(COMMENTS_KEY, JSON.stringify(database))
      }
    }
  } catch (e) {
    console.error("Error cleaning mock comments from database", e)
  }
}

// Get all comments for a story
export const getComments = (slug, authorName = "", title = "") => {
  if (!isBrowser) return []
  try {
    const data = localStorage.getItem(COMMENTS_KEY)
    const database = data ? JSON.parse(data) : {}

    const comments = database[slug] || []

    // Clean up any mock comments that might be in database[slug]
    const cleaned = filterMockComments(comments)
    if (JSON.stringify(comments) !== JSON.stringify(cleaned)) {
      database[slug] = cleaned
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(database))
    }

    return cleaned
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
