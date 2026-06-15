import * as React from "react"
import { useState, useEffect } from "react"
import { graphql, Link, navigate } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { getStats } from "../utils/gamification"
import { getCurrentUser, logout } from "../utils/auth"
import {
  getFriends,
  addFriend,
  removeFriend,
  getFriendFeed,
  searchUsers,
} from "../utils/friends"

const ProfilePage = ({ data }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [friends, setFriends] = useState([])
  const [friendFeed, setFriendFeed] = useState([])
  const [activeTab, setActiveTab] = useState("profile")
  const [friendSearch, setFriendSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [socialMessage, setSocialMessage] = useState(null)

  // Spotify Wrapped states
  const [wrappedActive, setWrappedActive] = useState(false)
  const [wrappedSlide, setWrappedSlide] = useState(0)

  const allStories = data.allMarkdownRemark.nodes

  // Load stats and auth
  const loadProfileData = () => {
    const user = getCurrentUser()
    setCurrentUser(user)
    if (user) {
      setStats(getStats())
      setFriends(getFriends())
      setFriendFeed(getFriendFeed())
    } else {
      setStats(null)
    }
  }

  useEffect(() => {
    loadProfileData()

    // Listen to updates
    const handleStatsUpdated = () => {
      setStats(getStats())
    }
    const handleFriendsUpdated = () => {
      setFriends(getFriends())
      setFriendFeed(getFriendFeed())
    }
    const handleAuthChange = () => {
      loadProfileData()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("stats_updated", handleStatsUpdated)
      window.addEventListener("friends_updated", handleFriendsUpdated)
      window.addEventListener("auth_change", handleAuthChange)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("stats_updated", handleStatsUpdated)
        window.removeEventListener("friends_updated", handleFriendsUpdated)
        window.removeEventListener("auth_change", handleAuthChange)
      }
    }
  }, [])

  // Auto slide for wrapped
  useEffect(() => {
    let timer
    if (wrappedActive) {
      timer = setTimeout(() => {
        if (wrappedSlide < 6) {
          setWrappedSlide(prev => prev + 1)
        } else {
          setWrappedActive(false)
          setWrappedSlide(0)
        }
      }, 5500)
    }
    return () => clearTimeout(timer)
  }, [wrappedActive, wrappedSlide])

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Handle add friend
  const handleAddFriend = username => {
    const res = addFriend(username)
    if (res.success) {
      setSocialMessage({
        type: "success",
        text: `Amigo ${res.profile.username} adicionado com sucesso!`,
      })
      setFriendSearch("")
      setSearchResults([])
    } else {
      setSocialMessage({ type: "error", text: res.error })
    }
    setTimeout(() => setSocialMessage(null), 4000)
  }

  // Handle remove friend
  const handleRemoveFriend = username => {
    if (removeFriend(username)) {
      setSocialMessage({ type: "success", text: "Amigo removido." })
    }
    setTimeout(() => setSocialMessage(null), 3000)
  }

  // Handle friend search input
  const handleSearchChange = e => {
    const val = e.target.value
    setFriendSearch(val)
    if (val.trim()) {
      setSearchResults(searchUsers(val))
    } else {
      setSearchResults([])
    }
  }

  if (!currentUser || !stats) {
    return (
      <Layout>
        <Seo title="Minha Conta" />
        <div
          className="container"
          style={{ padding: "4rem 1rem", textAlign: "center" }}
        >
          <div
            className="card"
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: "3rem 2rem",
            }}
          >
            <span style={{ fontSize: "4rem" }}>👤</span>
            <h2
              style={{
                marginTop: "1rem",
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
              }}
            >
              Acesse Sua Conta
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginTop: "1rem",
                lineHeight: 1.5,
              }}
            >
              Crie uma conta ou faça login para acessar seu perfil literário
              estilo Letterboxd, favoritar contos, avaliar obras, adicionar
              amigos e ver o seu Wrapped de leitura!
            </p>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("open_stats"))
                }
              }}
              className="btn-primary"
              style={{
                marginTop: "2rem",
                width: "100%",
                justifyContent: "center",
              }}
            >
              Fazer Login / Criar Conta
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // Map user's read history to Gatsby story metadata
  const readStoriesList = Object.entries(stats.readStories || {})
    .map(([slug, timestamp]) => {
      const storyMeta = allStories.find(s => s.frontmatter.slug === slug)
      const rating = (stats.ratings && stats.ratings[slug]) || 0
      return {
        slug,
        timestamp,
        rating,
        title: storyMeta
          ? storyMeta.frontmatter.title
          : slug.replace(/-/g, " "),
        author: storyMeta ? storyMeta.frontmatter.author : "Desconhecido",
        year: storyMeta ? storyMeta.frontmatter.year : "",
        category: storyMeta ? storyMeta.frontmatter.category : "",
      }
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // newest read first

  // Map favorites
  const favoriteStoriesList = (stats.favorites || []).map(slug => {
    const storyMeta = allStories.find(s => s.frontmatter.slug === slug)
    const rating = (stats.ratings && stats.ratings[slug]) || 0
    return {
      slug,
      rating,
      title: storyMeta ? storyMeta.frontmatter.title : slug.replace(/-/g, " "),
      author: storyMeta ? storyMeta.frontmatter.author : "Desconhecido",
      year: storyMeta ? storyMeta.frontmatter.year : "",
      category: storyMeta ? storyMeta.frontmatter.category : "",
    }
  })

  // Calculate stats for statistics card and Spotify Wrapped
  const totalReadCount = readStoriesList.length

  // Calculate average rating
  const ratedStories = readStoriesList.filter(s => s.rating > 0)
  const averageRating =
    ratedStories.length > 0
      ? (
          ratedStories.reduce((acc, curr) => acc + curr.rating, 0) /
          ratedStories.length
        ).toFixed(1)
      : "0.0"

  // Calculate rating distribution (for Letterboxd chart)
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ratedStories.forEach(s => {
    if (ratingCounts[s.rating] !== undefined) {
      ratingCounts[s.rating]++
    }
  })
  const maxRatingCount = Math.max(...Object.values(ratingCounts), 1)

  // Find favorite author
  const authorCounts = {}
  readStoriesList.forEach(s => {
    if (s.author && s.author !== "Desconhecido") {
      authorCounts[s.author] = (authorCounts[s.author] || 0) + 1
    }
  })
  const favoriteAuthor =
    Object.keys(authorCounts).length > 0
      ? Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "Nenhum"
  const favoriteAuthorCount =
    Object.keys(authorCounts).length > 0
      ? Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0][1]
      : 0

  // Find favorite genre (category)
  const genreCounts = {}
  readStoriesList.forEach(s => {
    if (s.category) {
      genreCounts[s.category] = (genreCounts[s.category] || 0) + 1
    }
  })
  const favoriteGenre =
    Object.keys(genreCounts).length > 0
      ? Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "Nenhum"
  const favoriteGenreCount =
    Object.keys(genreCounts).length > 0
      ? Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][1]
      : 0

  // Calculate reading hours peak
  const hourCounts = {}
  readStoriesList.forEach(s => {
    try {
      const hr = new Date(s.timestamp).getHours()
      hourCounts[hr] = (hourCounts[hr] || 0) + 1
    } catch (e) {}
  })
  const readingPeakHour =
    Object.keys(hourCounts).length > 0
      ? Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "18"

  // Determine user category
  let readerProfileTitle = "Leitor Aprendiz"
  if (totalReadCount >= 15) readerProfileTitle = "Sábio Crítico"
  else if (totalReadCount >= 8) readerProfileTitle = "Erudito Culto"
  else if (totalReadCount >= 3) readerProfileTitle = "Leitor Voraz"

  return (
    <Layout>
      <Seo title={`Perfil de ${currentUser.username}`} />

      <div
        className="container"
        style={{ paddingBottom: "4rem", paddingTop: "2rem" }}
      >
        {/* Profile Header */}
        <div
          className="card"
          style={{
            marginBottom: "2rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "2rem",
            padding: "2rem",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), #f472b6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div style={{ flexGrow: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.8rem",
                flexWrap: "wrap",
              }}
            >
              <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>
                {currentUser.username}
              </h1>
              <span
                className="badge"
                style={{
                  margin: 0,
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.75rem",
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                }}
              >
                {readerProfileTitle}
              </span>
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                marginTop: "0.25rem",
              }}
            >
              {currentUser.email} &bull; Membro desde{" "}
              {new Date().toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                setWrappedSlide(0)
                setWrappedActive(true)
              }}
              className="btn-primary"
              style={{
                background: "linear-gradient(135deg, #1db954, #191414)",
                color: "#fff",
                borderColor: "#1db954",
              }}
            >
              🎵 Meu Wrapped
            </button>
            <button
              onClick={handleLogout}
              className="btn-icon"
              title="Sair da Conta"
              aria-label="Sair da Conta"
            >
              🚪
            </button>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            borderBottom: "1px solid var(--border)",
            marginBottom: "2rem",
            paddingBottom: "0.5rem",
            overflowX: "auto",
          }}
        >
          <button
            onClick={() => setActiveTab("profile")}
            className={`auth-link-btn ${
              activeTab === "profile" ? "active" : ""
            }`}
            style={{
              padding: "0.5rem 1rem",
              fontWeight: 600,
              borderBottom:
                activeTab === "profile" ? "2px solid var(--accent)" : "none",
              color:
                activeTab === "profile" ? "var(--text)" : "var(--text-muted)",
            }}
          >
            Estatísticas
          </button>
          <button
            onClick={() => setActiveTab("read")}
            className={`auth-link-btn ${activeTab === "read" ? "active" : ""}`}
            style={{
              padding: "0.5rem 1rem",
              fontWeight: 600,
              borderBottom:
                activeTab === "read" ? "2px solid var(--accent)" : "none",
              color: activeTab === "read" ? "var(--text)" : "var(--text-muted)",
            }}
          >
            Contos Lidos ({totalReadCount})
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`auth-link-btn ${
              activeTab === "favorites" ? "active" : ""
            }`}
            style={{
              padding: "0.5rem 1rem",
              fontWeight: 600,
              borderBottom:
                activeTab === "favorites" ? "2px solid var(--accent)" : "none",
              color:
                activeTab === "favorites" ? "var(--text)" : "var(--text-muted)",
            }}
          >
            Favoritos ({favoriteStoriesList.length})
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`auth-link-btn ${
              activeTab === "social" ? "active" : ""
            }`}
            style={{
              padding: "0.5rem 1rem",
              fontWeight: 600,
              borderBottom:
                activeTab === "social" ? "2px solid var(--accent)" : "none",
              color:
                activeTab === "social" ? "var(--text)" : "var(--text-muted)",
            }}
          >
            Amigos ({friends.length})
          </button>
        </div>

        {/* TAB CONTENT: 1. STATS & LETTERBOXD CHART */}
        {activeTab === "profile" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Quick stats cards */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  padding: "1.5rem",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>📖</span>
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Total Lidos
                  </h4>
                  <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800 }}>
                    {totalReadCount}
                  </p>
                </div>
              </div>

              <div
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  padding: "1.5rem",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>🔥</span>
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Ofensiva Atual
                  </h4>
                  <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800 }}>
                    {stats.streak} {stats.streak === 1 ? "dia" : "dias"}
                  </p>
                </div>
              </div>

              <div
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  padding: "1.5rem",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>⚡</span>
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Melhor Ofensiva
                  </h4>
                  <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800 }}>
                    {stats.longestStreak}{" "}
                    {stats.longestStreak === 1 ? "dia" : "dias"}
                  </p>
                </div>
              </div>
            </div>

            {/* Letterboxd-style rating chart */}
            <div
              className="card"
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "0.5rem",
                }}
              >
                Distribuição de Notas (Estilo Letterboxd)
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                {Object.entries(ratingCounts)
                  .reverse()
                  .map(([stars, count]) => {
                    const percent = (count / maxRatingCount) * 100
                    return (
                      <div
                        key={stars}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            minWidth: "50px",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: "var(--text-muted)",
                            textAlign: "right",
                          }}
                        >
                          {stars} ★
                        </span>
                        <div
                          style={{
                            flexGrow: 1,
                            height: "18px",
                            background: "rgba(0,0,0,0.05)",
                            borderRadius: "4px",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${percent}%`,
                              background:
                                "linear-gradient(90deg, var(--accent), #f472b6)",
                              borderRadius: "4px",
                              transition: "width 1s ease",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            minWidth: "25px",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            textAlign: "left",
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    )
                  })}
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.95rem",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>
                  Média de Avaliações:
                </span>
                <strong style={{ color: "var(--accent)" }}>
                  ★ {averageRating}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 2. READ STORIES LIST */}
        {activeTab === "read" && (
          <div className="card" style={{ padding: "2rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "1.3rem",
                marginBottom: "1.5rem",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "0.5rem",
              }}
            >
              Histórico de Leituras
            </h3>

            {readStoriesList.length === 0 ? (
              <p
                style={{
                  color: "var(--text-muted)",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                Você ainda não leu nenhum conto. Que tal escolher um conto hoje?
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {readStoriesList.map(item => (
                  <div
                    key={item.slug}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                    }}
                  >
                    <div style={{ flexGrow: 1 }}>
                      <Link
                        to={`/conto/${item.slug}`}
                        style={{ textDecoration: "none", color: "var(--text)" }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            fontFamily: "var(--font-serif)",
                          }}
                        >
                          {item.title}
                        </h4>
                      </Link>
                      <p
                        style={{
                          margin: "0.2rem 0 0 0",
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        por {item.author} &bull; {item.category}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      {/* Rating stars */}
                      <div style={{ color: "#eab308", fontWeight: 700 }}>
                        {item.rating > 0 ? (
                          Array(item.rating).fill("★").join("")
                        ) : (
                          <span style={{ opacity: 0.35, fontSize: "0.85rem" }}>
                            Sem nota
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Lido em{" "}
                        {new Date(item.timestamp).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: 3. FAVORITES */}
        {activeTab === "favorites" && (
          <div className="card" style={{ padding: "2rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "1.3rem",
                marginBottom: "1.5rem",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "0.5rem",
              }}
            >
              Contos Favoritos
            </h3>

            {favoriteStoriesList.length === 0 ? (
              <p
                style={{
                  color: "var(--text-muted)",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                Nenhum conto favoritado ainda. Clique no ❤️ durante a leitura
                para favoritar!
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {favoriteStoriesList.map(item => (
                  <div
                    key={item.slug}
                    style={{
                      padding: "1.25rem",
                      borderRadius: "16px",
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          className="badge"
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.5rem",
                            margin: 0,
                          }}
                        >
                          {item.category}
                        </span>
                        <span style={{ color: "#ef4444", fontSize: "1.1rem" }}>
                          ❤️
                        </span>
                      </div>
                      <Link
                        to={`/conto/${item.slug}`}
                        style={{ textDecoration: "none", color: "var(--text)" }}
                      >
                        <h4
                          style={{
                            margin: "0.75rem 0 0.25rem 0",
                            fontSize: "1.2rem",
                            fontWeight: 700,
                            fontFamily: "var(--font-serif)",
                          }}
                        >
                          {item.title}
                        </h4>
                      </Link>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.85rem",
                          color: "var(--accent)",
                          fontWeight: 600,
                        }}
                      >
                        {item.author}
                      </p>
                    </div>
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                        {item.year}
                      </span>
                      <Link
                        to={`/conto/${item.slug}`}
                        className="btn-primary"
                        style={{
                          padding: "0.3rem 0.75rem",
                          fontSize: "0.8rem",
                        }}
                      >
                        Ler
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: 4. SOCIAL (FRIENDS & FEED) */}
        {activeTab === "social" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Friends list and Add Friend search */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "0.5rem",
                }}
              >
                Adicionar Amigos
              </h3>

              {socialMessage && (
                <div
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    marginBottom: "1rem",
                    background:
                      socialMessage.type === "success"
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                    color:
                      socialMessage.type === "success" ? "#10b981" : "#ef4444",
                    border: `1px solid ${
                      socialMessage.type === "success"
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(239, 68, 68, 0.2)"
                    }`,
                  }}
                >
                  {socialMessage.text}
                </div>
              )}

              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Pesquisar por nome de usuário..."
                  className="search-input"
                  style={{
                    borderRadius: "10px",
                    padding: "0.6rem 1rem 0.6rem 2.5rem",
                    fontSize: "0.9rem",
                  }}
                  value={friendSearch}
                  onChange={handleSearchChange}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "0.8rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.5,
                  }}
                >
                  🔍
                </span>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                      zIndex: 10,
                      marginTop: "0.5rem",
                      maxHeight: "200px",
                      overflowY: "auto",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {searchResults.map(p => (
                      <div
                        key={p.username}
                        onClick={() => handleAddFriend(p.username)}
                        style={{
                          padding: "0.75rem 1rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          borderBottom: "1px solid var(--border)",
                        }}
                        onMouseEnter={e =>
                          (e.currentTarget.style.background =
                            "rgba(0,0,0,0.03)")
                        }
                        onMouseLeave={e =>
                          (e.currentTarget.style.background = "none")
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === "Enter") handleAddFriend(p.username)
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span>{p.avatar}</span>
                          <strong>{p.username}</strong>
                        </div>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--accent)",
                            fontWeight: 600,
                          }}
                        >
                          + Adicionar
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {friendSearch.trim() && searchResults.length === 0 && (
                  <div
                    onClick={() => handleAddFriend(friendSearch)}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "0.75rem 1rem",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      zIndex: 10,
                      marginTop: "0.5rem",
                      color: "var(--accent)",
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === "Enter") handleAddFriend(friendSearch)
                    }}
                  >
                    Simular e adicionar <strong>"{friendSearch}"</strong>
                  </div>
                )}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "0.5rem",
                }}
              >
                Meus Amigos ({friends.length})
              </h3>

              {friends.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Você ainda não adicionou nenhum amigo.
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {friends.map(friendKey => {
                    // Try to resolve mock profile or default to dynamic profile name
                    const profileName =
                      friendKey.charAt(0).toUpperCase() + friendKey.slice(1)
                    const avatar = friendKey.includes("machado")
                      ? "🎩"
                      : friendKey.includes("gothic")
                      ? "👁️‍"
                      : friendKey.includes("clarice")
                      ? "✍️"
                      : "📖"
                    return (
                      <div
                        key={friendKey}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyindex: "space-between",
                          justifyContent: "space-between",
                          padding: "0.6rem",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          background: "rgba(0,0,0,0.01)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>{avatar}</span>
                          <span
                            style={{ fontWeight: 600, fontSize: "0.95rem" }}
                          >
                            {profileName}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFriend(friendKey)}
                          className="auth-link-btn"
                          style={{
                            color: "#ef4444",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                          }}
                        >
                          Remover
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Letterboxd-style Social Activity Feed */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  marginBottom: "1.25rem",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "0.5rem",
                }}
              >
                Atividade Recente dos Amigos
              </h3>

              {friendFeed.length === 0 ? (
                <p
                  style={{
                    color: "var(--text-muted)",
                    textAlign: "center",
                    padding: "2rem",
                  }}
                >
                  Nenhuma atividade recente encontrada dos seus amigos.
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  {friendFeed.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        paddingBottom: "1rem",
                        borderBottom:
                          idx < friendFeed.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.8rem",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.03)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.avatar}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                          }}
                        >
                          <strong>{item.username}</strong>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {new Date(item.date).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p style={{ margin: "0.2rem 0", fontSize: "0.9rem" }}>
                          leu{" "}
                          <Link
                            to={`/conto/${item.slug}`}
                            style={{
                              fontWeight: 600,
                              color: "var(--text)",
                              textDecoration: "none",
                            }}
                          >
                            {item.title}
                          </Link>
                          <span
                            style={{ color: "#eab308", marginLeft: "0.5rem" }}
                          >
                            {Array(item.rating).fill("★").join("")}
                          </span>
                        </p>
                        {item.review && (
                          <blockquote
                            style={{
                              margin: "0.5rem 0 0 0",
                              paddingLeft: "0.75rem",
                              borderLeft: "2px solid var(--accent)",
                              fontSize: "0.85rem",
                              color: "var(--text-muted)",
                              fontStyle: "italic",
                              lineHeight: 1.4,
                            }}
                          >
                            "{item.review}"
                          </blockquote>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SPOTIFY WRAPPED FULL-SCREEN MODAL */}
      {wrappedActive && (
        <div
          className="modal-overlay"
          style={{
            zIndex: 2000,
            background:
              "radial-gradient(circle at center, #182232 0%, #080a0e 100%)",
            padding: 0,
            overflow: "hidden",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Progress indicator bars */}
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "5%",
              width: "90%",
              display: "flex",
              gap: "0.4rem",
              zIndex: 2010,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map(idx => (
              <div
                key={idx}
                style={{
                  flexGrow: 1,
                  height: "3px",
                  background:
                    idx < wrappedSlide
                      ? "#1db954"
                      : idx === wrappedSlide
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {idx === wrappedSlide && (
                  <div
                    style={{
                      height: "100%",
                      background: "#1db954",
                      animation: "wrappedProgress 5.5s linear forwards",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={() => setWrappedActive(false)}
            style={{
              position: "absolute",
              top: "2.5rem",
              right: "5%",
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "2rem",
              cursor: "pointer",
              zIndex: 2015,
              opacity: 0.8,
            }}
          >
            &times;
          </button>

          {/* Slide container */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem 1.5rem",
              color: "#fff",
              position: "relative",
            }}
          >
            {/* TAP ZONES */}
            <div
              onClick={() => setWrappedSlide(prev => Math.max(0, prev - 1))}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "30%",
                height: "100%",
                zIndex: 2005,
              }}
              role="button"
              tabIndex={0}
              aria-label="Slide anterior"
              onKeyDown={e => {
                if (e.key === "Enter")
                  setWrappedSlide(prev => Math.max(0, prev - 1))
              }}
            />
            <div
              onClick={() => {
                if (wrappedSlide < 6) {
                  setWrappedSlide(prev => prev + 1)
                } else {
                  setWrappedActive(false)
                }
              }}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "70%",
                height: "100%",
                zIndex: 2005,
              }}
              role="button"
              tabIndex={0}
              aria-label="Próximo slide"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (wrappedSlide < 6) setWrappedSlide(prev => prev + 1)
                  else setWrappedActive(false)
                }
              }}
            />

            {/* SLIDE 0: Intro */}
            {wrappedSlide === 0 && (
              <div
                style={{ textAlign: "center", maxWidth: "450px", zIndex: 2008 }}
              >
                <span
                  style={{
                    fontSize: "5rem",
                    display: "block",
                    animation: "bounceBadge 1.5s infinite alternate",
                  }}
                >
                  🎵
                </span>
                <h2
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    color: "#1db954",
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  Wrapped de Leitura
                </h2>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 500,
                    marginTop: "1rem",
                  }}
                >
                  10pages - contos clássicos
                </h3>
                <p
                  style={{
                    opacity: 0.7,
                    marginTop: "1rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Seu ano literário resumido em slides dinâmicos e vibrantes.
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "2rem",
                    fontSize: "0.8rem",
                    opacity: 0.5,
                  }}
                >
                  Toque na direita para continuar &rarr;
                </span>
              </div>
            )}

            {/* SLIDE 1: Total Read */}
            {wrappedSlide === 1 && (
              <div
                style={{ textAlign: "center", maxWidth: "450px", zIndex: 2008 }}
              >
                <h4
                  style={{
                    color: "#1db954",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Obras Concluídas
                </h4>
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    marginTop: "1.5rem",
                  }}
                >
                  Você mergulhou de cabeça nos clássicos!
                </h2>
                <div
                  style={{
                    fontSize: "6rem",
                    fontWeight: 900,
                    margin: "2rem 0",
                    color: "#fff",
                    textShadow: "0 0 20px rgba(29, 185, 84, 0.4)",
                  }}
                >
                  {totalReadCount}
                </div>
                <p style={{ fontSize: "1.2rem", opacity: 0.8 }}>
                  Contos lidos no total. Cada página uma nova viagem!
                </p>
              </div>
            )}

            {/* SLIDE 2: Streaks */}
            {wrappedSlide === 2 && (
              <div
                style={{ textAlign: "center", maxWidth: "450px", zIndex: 2008 }}
              >
                <h4
                  style={{
                    color: "#1db954",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Hábito e Foco
                </h4>
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    marginTop: "1.5rem",
                  }}
                >
                  A constância é sua marca registrada!
                </h2>
                <div
                  style={{
                    fontSize: "6rem",
                    fontWeight: 900,
                    margin: "2rem 0",
                    color: "#ef4444",
                  }}
                >
                  🔥 {stats.longestStreak}
                </div>
                <p style={{ fontSize: "1.2rem", opacity: 0.8 }}>
                  dias foi sua maior sequência diária de leitura acumulada.
                  Hábito de ferro!
                </p>
              </div>
            )}

            {/* SLIDE 3: Favorite Genre */}
            {wrappedSlide === 3 && (
              <div
                style={{ textAlign: "center", maxWidth: "450px", zIndex: 2008 }}
              >
                <h4
                  style={{
                    color: "#1db954",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Estilo Favorito
                </h4>
                <h2
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    marginTop: "1.5rem",
                  }}
                >
                  Seu gosto aponta para uma direção clara...
                </h2>
                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(255,255,255,0.07)",
                    padding: "1.5rem 2.5rem",
                    borderRadius: "24px",
                    margin: "2rem 0",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span style={{ fontSize: "3rem", display: "block" }}>📚</span>
                  <strong
                    style={{
                      fontSize: "1.8rem",
                      color: "#1db954",
                      display: "block",
                      marginTop: "0.5rem",
                    }}
                  >
                    {favoriteGenre}
                  </strong>
                </div>
                <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>
                  Com <strong>{favoriteGenreCount} contos lidos</strong>, este
                  foi seu gênero literário mais explorado.
                </p>
              </div>
            )}

            {/* SLIDE 4: Favorite Author */}
            {wrappedSlide === 4 && (
              <div
                style={{ textAlign: "center", maxWidth: "450px", zIndex: 2008 }}
              >
                <h4
                  style={{
                    color: "#1db954",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Escritor Favorito
                </h4>
                <h2
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    marginTop: "1.5rem",
                  }}
                >
                  Você tem uma conexão profunda com esta mente:
                </h2>
                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(255,255,255,0.07)",
                    padding: "1.5rem 2.5rem",
                    borderRadius: "24px",
                    margin: "2rem 0",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span style={{ fontSize: "3rem", display: "block" }}>✒️</span>
                  <strong
                    style={{
                      fontSize: "1.6rem",
                      color: "#1db954",
                      display: "block",
                      marginTop: "0.5rem",
                      maxWidth: "250px",
                      margin: "0.5rem auto 0 auto",
                    }}
                  >
                    {favoriteAuthor}
                  </strong>
                </div>
                <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>
                  Você devorou <strong>{favoriteAuthorCount} contos</strong>{" "}
                  deste autor!
                </p>
              </div>
            )}

            {/* SLIDE 5: Reading Hour Peak */}
            {wrappedSlide === 5 && (
              <div
                style={{ textAlign: "center", maxWidth: "450px", zIndex: 2008 }}
              >
                <h4
                  style={{
                    color: "#1db954",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Horário Nobre
                </h4>
                <h2
                  style={{
                    fontSize: "2.3rem",
                    fontWeight: 800,
                    marginTop: "1.5rem",
                  }}
                >
                  Sua hora sagrada de leitura:
                </h2>
                <div
                  style={{
                    fontSize: "6rem",
                    fontWeight: 900,
                    margin: "2.5rem 0",
                    color: "#a78bfa",
                  }}
                >
                  ⏰ {readingPeakHour}:00
                </div>
                <p style={{ fontSize: "1.2rem", opacity: 0.8 }}>
                  {parseInt(readingPeakHour) >= 22 ||
                  parseInt(readingPeakHour) < 4
                    ? "Você é um clássico leitor noturno. A noite alimenta sua imaginação!"
                    : parseInt(readingPeakHour) >= 18
                    ? "O entardecer é o seu momento ideal para relaxar com boa literatura."
                    : "Você aproveita o dia para alimentar sua bagagem de leituras clássicas!"}
                </p>
              </div>
            )}

            {/* SLIDE 6: Summary Share */}
            {wrappedSlide === 6 && (
              <div
                style={{ textAlign: "center", maxWidth: "400px", zIndex: 2008 }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "2rem 1.5rem",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      paddingBottom: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3
                      style={{ margin: 0, color: "#1db954", fontWeight: 800 }}
                    >
                      10pages WRAPPED
                    </h3>
                    <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                      {currentUser.username}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.8rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    <div>
                      📖 <strong>Total Lidos:</strong> {totalReadCount} contos
                    </div>
                    <div>
                      🔥 <strong>Melhor Ofensiva:</strong> {stats.longestStreak}{" "}
                      dias
                    </div>
                    <div>
                      📚 <strong>Gênero Favorito:</strong> {favoriteGenre}
                    </div>
                    <div>
                      ✒️ <strong>Autor Favorito:</strong> {favoriteAuthor}
                    </div>
                    <div>
                      ★ <strong>Média de Avaliações:</strong> {averageRating} /
                      5.0
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setWrappedActive(false)}
                  className="btn-primary"
                  style={{
                    marginTop: "2rem",
                    width: "100%",
                    justifyContent: "center",
                    background: "#1db954",
                    color: "#fff",
                    borderColor: "#1db954",
                  }}
                >
                  Concluir Wrapped
                </button>
              </div>
            )}
          </div>

          {/* Wrapped keyframe css override for progress bar */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes wrappedProgress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `,
            }}
          />
        </div>
      )}
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark {
      nodes {
        frontmatter {
          title
          author
          year
          category
          slug
        }
      }
    }
  }
`

export default ProfilePage
