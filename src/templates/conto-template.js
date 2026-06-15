import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import {
  recordCompletion,
  toggleFavorite,
  isFavorite,
  rateStory,
  getRating,
} from "../utils/gamification"
import { getAuthorBio } from "../utils/authorMetadata"
import { getComments, addComment, voteComment } from "../utils/comments"
import { getCurrentUser } from "../utils/auth"

const StoryTemplate = ({ data }) => {
  const story = data.markdownRemark
  const [fontSize, setFontSize] = useState(1.15) // in rem
  const [scrollProgress, setScrollProgress] = useState(0)

  // Custom states for ratings, favorites, comments & share
  const [currentUser, setCurrentUser] = useState(null)
  const [favorited, setFavorited] = useState(false)
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState([])
  const [newCommentText, setNewCommentText] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [shareCopied, setShareCopied] = useState(false)

  const observerRef = useRef(null)
  const isCompletedRef = useRef(false)

  // Track reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Sync user state, ratings, favorites & comments
  useEffect(() => {
    setCurrentUser(getCurrentUser())
    if (story) {
      const slug = story.frontmatter.slug
      setFavorited(isFavorite(slug))
      setRating(getRating(slug))
      setComments(
        getComments(slug, story.frontmatter.author, story.frontmatter.title)
      )
    }

    // Listener to reload comments dynamically
    const handleCommentsUpdated = e => {
      if (e.detail && e.detail.slug === story.frontmatter.slug) {
        setComments(
          getComments(
            story.frontmatter.slug,
            story.frontmatter.author,
            story.frontmatter.title
          )
        )
      }
    }
    window.addEventListener("comments_updated", handleCommentsUpdated)
    return () =>
      window.removeEventListener("comments_updated", handleCommentsUpdated)
  }, [story])

  // Track completion using IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined" || !story) return

    const handleStoryComplete = () => {
      if (isCompletedRef.current) return
      isCompletedRef.current = true

      const slug = story.frontmatter.slug
      const { newBadges, stats, alreadyFinished } = recordCompletion(slug)

      // 1. Confetti rain
      import("canvas-confetti").then(module => {
        const confetti = module.default
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.85 },
        })
      })

      // 2. Dispatch event to show Toast and refresh stats
      if (newBadges.length > 0) {
        newBadges.forEach(badge => {
          window.dispatchEvent(
            new CustomEvent("badge_unlocked", { detail: badge })
          )
        })
      } else if (!alreadyFinished) {
        // First completion of this story: show a standard completion toast
        window.dispatchEvent(
          new CustomEvent("badge_unlocked", {
            detail: {
              id: `completed-${slug}`,
              title: "Leitura Concluída!",
              description: `Você terminou de ler "${story.frontmatter.title}".`,
              icon: "📖",
            },
          })
        )
      } else {
        // Already read before, just refresh the header stats
        window.dispatchEvent(
          new CustomEvent("badge_unlocked", {
            detail: {
              id: `stats-update`,
              title: "Leitura Registrada!",
              description: `Obra concluída novamente. Ofensiva atualizada!`,
              icon: "🔥",
            },
          })
        )
      }
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          handleStoryComplete()
          observer.disconnect() // trigger once per page load
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the trigger element is visible
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [story])

  // Handler functions
  const handleToggleFavorite = () => {
    const slug = story.frontmatter.slug
    const isFav = toggleFavorite(slug)
    setFavorited(isFav)

    window.dispatchEvent(
      new CustomEvent("badge_unlocked", {
        detail: {
          id: `fav-${slug}`,
          title: isFav ? "Conto Favoritado!" : "Favorito Removido",
          description: isFav
            ? `"${story.frontmatter.title}" está na sua estante de favoritos.`
            : `"${story.frontmatter.title}" foi removido dos favoritos.`,
          icon: isFav ? "❤️" : "🤍",
        },
      })
    )
  }

  const handleRate = stars => {
    const slug = story.frontmatter.slug
    rateStory(slug, stars)
    setRating(stars)

    window.dispatchEvent(
      new CustomEvent("badge_unlocked", {
        detail: {
          id: `rate-${slug}`,
          title: "Avaliação Registrada!",
          description: `Você avaliou "${story.frontmatter.title}" com ${stars} estrelas.`,
          icon: "⭐️",
        },
      })
    )
  }

  const handleShare = () => {
    const slug = story.frontmatter.slug
    const url = typeof window !== "undefined" ? window.location.href : ""
    const starsStr = rating > 0 ? `⭐️`.repeat(rating) : ""
    const shareText = `📖 Acabei de ler "${story.frontmatter.title}" de ${
      story.frontmatter.author
    } no 10pages! ${
      starsStr ? `Minha nota: ${starsStr}` : "Leia também!"
    }\nConfira em: ${url}`

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `Ler ${story.frontmatter.title} - 10pages`,
          text: shareText,
          url: url,
        })
        .catch(err => console.error(err))
    } else {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          setShareCopied(true)
          setTimeout(() => setShareCopied(false), 2500)
        })
      }
    }
  }

  const handlePostComment = () => {
    const slug = story.frontmatter.slug
    addComment(
      slug,
      null,
      currentUser ? currentUser.username : "Visitante",
      newCommentText
    )
    setNewCommentText("")
  }

  const handlePostReply = parentId => {
    const slug = story.frontmatter.slug
    addComment(
      slug,
      parentId,
      currentUser ? currentUser.username : "Visitante",
      replyText
    )
    setReplyText("")
    setReplyingTo(null)
  }

  const handleVote = (commentId, voteType) => {
    const slug = story.frontmatter.slug
    voteComment(slug, commentId, voteType)
  }

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 0.1, 1.6))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 0.1, 0.9))
  }

  const authorBio = story ? getAuthorBio(story.frontmatter.author) : null

  // Recursive rendering for Reddit-style threaded comments
  const renderCommentNode = (comment, depth = 0) => {
    const isUserComment = comment.id.startsWith("user-")
    const formattedDate = new Date(comment.timestamp).toLocaleDateString(
      "pt-BR",
      { hour: "2-digit", minute: "2-digit" }
    )

    return (
      <div
        key={comment.id}
        style={{
          paddingLeft: depth > 0 ? "1rem" : "0",
          borderLeft: depth > 0 ? "2px solid var(--border)" : "none",
          marginTop: depth > 0 ? "0.75rem" : "0",
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        {/* Author / Timestamp row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <strong
            style={{
              fontSize: "0.9rem",
              color: isUserComment ? "var(--accent)" : "var(--text)",
            }}
          >
            {comment.username}
          </strong>
          {isUserComment && (
            <span
              style={{
                fontSize: "0.7rem",
                padding: "0.05rem 0.3rem",
                background: "var(--accent-light)",
                color: "var(--accent)",
                borderRadius: "4px",
                fontWeight: 700,
              }}
            >
              VOCÊ
            </span>
          )}
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              opacity: 0.8,
            }}
          >
            &bull; {formattedDate}
          </span>
        </div>

        {/* Comment text */}
        <p
          style={{
            fontSize: "0.95rem",
            margin: "0.15rem 0",
            lineHeight: 1.4,
            textAlign: "left",
          }}
        >
          {comment.text}
        </p>

        {/* Actions row: upvotes/downvotes, reply */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            marginTop: "0.1rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <button
              onClick={() =>
                handleVote(comment.id, comment.userVote === "up" ? null : "up")
              }
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color:
                  comment.userVote === "up" ? "#ff4500" : "var(--text-muted)",
                fontSize: "1.1rem",
                padding: 0,
              }}
              title="Upvote"
            >
              ▲
            </button>
            <span
              style={{
                fontWeight: 700,
                color:
                  comment.userVote === "up"
                    ? "#ff4500"
                    : comment.userVote === "down"
                    ? "#7193ff"
                    : "inherit",
              }}
            >
              {comment.upvotes - comment.downvotes}
            </span>
            <button
              onClick={() =>
                handleVote(
                  comment.id,
                  comment.userVote === "down" ? null : "down"
                )
              }
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color:
                  comment.userVote === "down" ? "#7193ff" : "var(--text-muted)",
                fontSize: "1.1rem",
                padding: 0,
              }}
              title="Downvote"
            >
              ▼
            </button>
          </div>

          <button
            onClick={() =>
              setReplyingTo(replyingTo === comment.id ? null : comment.id)
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--accent)",
              fontWeight: 600,
              padding: 0,
            }}
          >
            Responder
          </button>
        </div>

        {/* Reply form */}
        {replyingTo === comment.id && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "0.5rem",
              paddingLeft: "1rem",
              borderLeft: "2px solid var(--accent)",
            }}
          >
            <textarea
              placeholder={`Escreva uma resposta para ${comment.username}...`}
              className="search-input"
              style={{
                width: "100%",
                height: "60px",
                padding: "0.5rem",
                fontSize: "0.9rem",
                borderRadius: "8px",
                background: "var(--bg)",
              }}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setReplyingTo(null)}
                className="auth-link-btn"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handlePostReply(comment.id)}
                disabled={!replyText.trim()}
                className="btn-primary"
                style={{
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.8rem",
                  borderRadius: "6px",
                }}
              >
                Responder
              </button>
            </div>
          </div>
        )}

        {/* Render child replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {comment.replies.map(reply => renderCommentNode(reply, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (!story) {
    return (
      <Layout>
        <Seo title="Conto Não Encontrado" />
        <div className="reader-container" style={{ paddingTop: "4rem" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <h2>Conto não encontrado</h2>
            <p style={{ marginTop: "1rem" }}>
              Desculpe, o texto solicitado não está no nosso acervo.
            </p>
            <Link
              to="/busca"
              className="btn-primary"
              style={{ marginTop: "1.5rem" }}
            >
              Voltar para a Busca
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Seo
        title={`${story.frontmatter.title} - ${story.frontmatter.author}`}
        description={`Leia o conto clássico ${story.frontmatter.title} de ${story.frontmatter.author} (${story.frontmatter.year}).`}
      />

      {/* Scroll Progress Bar */}
      <div
        className="reading-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />
      <div
        className="reading-progress-bar-vertical"
        style={{ transform: `scaleY(${scrollProgress / 100})` }}
      />

      <div className="container" style={{ padding: "1.5rem 0" }}>
        {/* Back Link */}
        <div className="reader-container" style={{ marginBottom: "1.5rem" }}>
          <Link
            to="/busca"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={e => (e.target.style.color = "var(--text)")}
            onMouseLeave={e => (e.target.style.color = "var(--text-muted)")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar para o Acervo
          </Link>
        </div>

        <div className="reader-container">
          <article className="card reader-card">
            <div className="story-header">
              <span
                className="badge"
                style={{
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                }}
              >
                {story.frontmatter.category}
              </span>
              <h1 className="story-title">{story.frontmatter.title}</h1>
              <div className="story-meta">
                por {story.frontmatter.author} &bull; {story.frontmatter.year}
              </div>
              <div className="divider"></div>

              {/* Favorites and Share */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "0.25rem",
                  marginBottom: "1.5rem",
                }}
              >
                <button
                  onClick={handleToggleFavorite}
                  className="btn-streak-header"
                  style={{
                    borderColor: favorited ? "#ef4444" : "var(--border)",
                    background: favorited ? "rgba(239, 68, 68, 0.05)" : "none",
                    cursor: "pointer",
                  }}
                  title={
                    favorited
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                >
                  <span
                    style={{
                      color: favorited ? "#ef4444" : "var(--text-muted)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {favorited ? "❤️ Favorito" : "🤍 Favoritar"}
                  </span>
                </button>
                <button
                  onClick={handleShare}
                  className="btn-streak-header"
                  style={{ cursor: "pointer" }}
                  title="Compartilhar conto"
                >
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                    }}
                  >
                    {shareCopied ? "✅ Copiado!" : "🔗 Compartilhar"}
                  </span>
                </button>
              </div>
            </div>

            {/* Reading Controls */}
            <div className="reader-controls">
              <button
                onClick={decreaseFontSize}
                className="btn-icon"
                title="Diminuir fonte"
                aria-label="Diminuir fonte"
                style={{ width: "32px", height: "32px" }}
              >
                A-
              </button>
              <span className="font-size-indicator">
                {Math.round(fontSize * 100)}%
              </span>
              <button
                onClick={increaseFontSize}
                className="btn-icon"
                title="Aumentar fonte"
                aria-label="Aumentar fonte"
                style={{ width: "32px", height: "32px" }}
              >
                A+
              </button>
            </div>

            {/* Content Body */}
            <div
              className="story-body"
              style={{ "--reader-font-size": `${fontSize}rem` }}
              dangerouslySetInnerHTML={{ __html: story.html }}
            />

            {/* End of Story Trigger for Observer */}
            <div
              ref={observerRef}
              style={{
                height: "40px",
                margin: "2rem 0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "1.2rem", opacity: 0.4 }}>❦ FIM ❦</span>
            </div>

            <div className="divider" style={{ margin: "2rem auto" }}></div>

            {/* Rating Section */}
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                }}
              >
                O que achou desta leitura?
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "2rem",
                      cursor: "pointer",
                      color: star <= rating ? "#eab308" : "var(--text-muted)",
                      opacity: star <= rating ? 1 : 0.35,
                      transition: "transform 0.15s ease, color 0.15s ease",
                    }}
                    onMouseEnter={e =>
                      (e.target.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={e => (e.target.style.transform = "scale(1)")}
                    title={`Avaliar com ${star} estrelas`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    marginTop: "0.5rem",
                  }}
                >
                  Sua avaliação: {rating} de 5 estrelas
                </p>
              )}
            </div>

            {/* Author Biography Section */}
            {authorBio && (
              <div
                style={{
                  background: "var(--accent-light)",
                  border: "1px dashed var(--accent)",
                  borderRadius: "16px",
                  padding: "1.25rem 1.5rem",
                  marginTop: "2rem",
                  textAlign: "left",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                <h5
                  style={{
                    fontWeight: 700,
                    color: "var(--accent)",
                    marginBottom: "0.4rem",
                    fontSize: "1rem",
                  }}
                >
                  Sobre o Autor
                </h5>
                <p style={{ margin: 0, color: "var(--text)" }}>{authorBio}</p>
              </div>
            )}
          </article>
        </div>

        {/* Reddit-style comments section */}
        <div className="reader-container" style={{ marginTop: "2rem" }}>
          <div className="card" style={{ padding: "2rem 1.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "1.4rem",
                marginBottom: "1.5rem",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>💬 Discussão ({comments.length})</span>
            </h3>

            {/* Write comment form */}
            <div style={{ marginBottom: "2rem" }}>
              <textarea
                placeholder={
                  currentUser
                    ? "O que você achou deste conto? Escreva um comentário..."
                    : "Faça login para escrever um comentário nas discussões..."
                }
                disabled={!currentUser}
                className="search-input"
                style={{
                  width: "100%",
                  height: "80px",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  fontSize: "0.95rem",
                  fontFamily: "var(--font-sans)",
                  resize: "vertical",
                  lineHeight: 1.4,
                  background: "var(--bg)",
                }}
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  onClick={handlePostComment}
                  disabled={!currentUser || !newCommentText.trim()}
                  className="btn-primary"
                  style={{ padding: "0.4rem 1.25rem", fontSize: "0.9rem" }}
                >
                  Enviar Comentário
                </button>
              </div>
            </div>

            {/* Comments list */}
            {comments.length === 0 ? (
              <p
                style={{
                  color: "var(--text-muted)",
                  textAlign: "center",
                  padding: "1rem",
                }}
              >
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {comments.map(c => renderCommentNode(c))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        author
        year
        category
        slug
      }
    }
  }
`

export default StoryTemplate
