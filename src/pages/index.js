import * as React from "react"
import { useState, useEffect } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { getStats, getAverageRating } from "../utils/gamification"
import { getCurrentUser } from "../utils/auth"

// PRNG Generator (Mulberry32)
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Deterministic Shuffle
function seededShuffle(array, seed) {
  const rand = mulberry32(seed)
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Day of Year Calculator
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff =
    date -
    start +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

const IndexPage = ({ data }) => {
  const [dailyStory, setDailyStory] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [stats, setStats] = useState({ streak: 0 })

  useEffect(() => {
    // Load auth & stats
    setCurrentUser(getCurrentUser())
    setStats(getStats())

    const today = new Date()
    const year = today.getFullYear()
    const day = getDayOfYear(today)

    const stories = data.allMarkdownRemark.nodes
    if (stories.length > 0) {
      const shuffled = seededShuffle(stories, year)
      const selected = shuffled[(day - 1) % shuffled.length]
      setDailyStory(selected)

      // Generate 3 other recommendations (using day+1, day+2, day+3 seeds)
      const recs = [
        shuffled[day % shuffled.length],
        shuffled[(day + 1) % shuffled.length],
        shuffled[(day + 2) % shuffled.length],
      ]
      setRecommendations(recs)
    }
    setLoading(false)
  }, [data])
  const dailyRatingInfo = dailyStory
    ? getAverageRating(dailyStory.frontmatter.slug)
    : null

  return (
    <Layout>
      <Seo title="Conto do Dia" />

      {/* Hero Welcome Section */}
      <div
        className="hero-section container"
        style={{ padding: "2.5rem 0 1.5rem 0" }}
      >
        <span className="badge">10pages - contos clássicos</span>
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          Olá, {currentUser ? currentUser.username : "leitor"}!
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            marginTop: "0.25rem",
            fontSize: "1.05rem",
          }}
        >
          {stats.streak > 0 ? (
            <span>
              Você está em uma ofensiva de{" "}
              <strong>
                🔥 {stats.streak} {stats.streak === 1 ? "dia" : "dias"}
              </strong>{" "}
              seguidos!
            </span>
          ) : (
            "Desenvolva seu hábito de leitura diária com contos clássicos de até 10 páginas."
          )}
        </p>
      </div>

      <div className="reader-container" style={{ paddingBottom: "3rem" }}>
        {loading ? (
          <div
            className="card"
            style={{ textAlign: "center", padding: "4rem" }}
          >
            <p style={{ color: "var(--text-muted)" }}>Folheando páginas...</p>
          </div>
        ) : dailyStory ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
          >
            {/* Conto do Dia featured card */}
            <div
              className="card"
              style={{
                padding: "2.5rem 2rem",
                border: "2px solid var(--accent)",
                background: "var(--card-bg)",
                boxShadow: "var(--shadow-hover)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  className="badge"
                  style={{
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    margin: 0,
                  }}
                >
                  Estrela do Dia 🌟
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {dailyRatingInfo && dailyRatingInfo.average > 0 && (
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#eab308",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.15rem",
                      }}
                      title={`${dailyRatingInfo.totalVotes} avaliações`}
                    >
                      ★ {dailyRatingInfo.average.toFixed(1)} (
                      {dailyRatingInfo.totalVotes})
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.6,
                      fontWeight: 500,
                    }}
                  >
                    {dailyStory.frontmatter.year}
                  </span>
                </div>
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  margin: "1rem 0 0.5rem 0",
                }}
              >
                {dailyStory.frontmatter.title}
              </h1>

              <p
                style={{
                  fontSize: "1.1rem",
                  color: "var(--accent)",
                  fontWeight: 700,
                  marginBottom: "1rem",
                }}
              >
                por {dailyStory.frontmatter.author}
              </p>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.98rem",
                  lineHeight: 1.5,
                  marginBottom: "2rem",
                }}
              >
                {dailyStory.excerpt}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  ⏱️ Leitura rápida (~8 minutos) &bull;{" "}
                  {dailyStory.frontmatter.category}
                </span>
                <Link
                  to={`/conto/${dailyStory.frontmatter.slug}`}
                  className="btn-primary"
                  style={{ padding: "0.8rem 2rem", fontSize: "1.05rem" }}
                >
                  Iniciar Leitura
                </Link>
              </div>
            </div>

            {/* Recommendations List */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  marginBottom: "1.25rem",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "0.5rem",
                }}
              >
                Recomendados para hoje
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {recommendations.map(story => (
                  <div
                    key={story.frontmatter.slug}
                    className="card"
                    style={{
                      padding: "1.25rem 1.5rem",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ flexGrow: 1, minWidth: "250px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.4rem",
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
                          {story.frontmatter.category}
                        </span>
                        {(() => {
                          const ratingInfo = getAverageRating(
                            story.frontmatter.slug
                          )
                          return ratingInfo.average > 0 ? (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "#eab308",
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.15rem",
                              }}
                              title={`${ratingInfo.totalVotes} avaliações`}
                            >
                              ★ {ratingInfo.average.toFixed(1)}
                            </span>
                          ) : null
                        })()}
                        <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                          &bull; {story.frontmatter.year}
                        </span>
                      </div>
                      <h4
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-serif)",
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {story.frontmatter.title}
                      </h4>
                      <p
                        style={{
                          margin: "0.15rem 0 0 0",
                          fontSize: "0.85rem",
                          color: "var(--accent)",
                          fontWeight: 600,
                        }}
                      >
                        por {story.frontmatter.author}
                      </p>
                    </div>
                    <Link
                      to={`/conto/${story.frontmatter.slug}`}
                      className="btn-primary"
                      style={{ padding: "0.4rem 1.2rem", fontSize: "0.85rem" }}
                    >
                      Ler Obra
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="card"
            style={{ textAlign: "center", padding: "4rem" }}
          >
            <h3>Nenhum conto disponível</h3>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Adicione arquivos markdown no diretório content/contos para
              começar.
            </p>
          </div>
        )}
      </div>
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
        excerpt(pruneLength: 220)
      }
    }
  }
`

export default IndexPage
