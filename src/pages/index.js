import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { recordCompletion } from "../utils/gamification"

// PRNG Generator (Mulberry32)
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Deterministic Shuffle
function seededShuffle(array, seed) {
  const rand = mulberry32(seed);
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Day of Year Calculator
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

const IndexPage = ({ data }) => {
  const [dailyStory, setDailyStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fontSize, setFontSize] = useState(1.15) // in rem
  const [scrollProgress, setScrollProgress] = useState(0)

  const observerRef = useRef(null)
  const isCompletedRef = useRef(false)

  useEffect(() => {
    const today = new Date()
    const year = today.getFullYear()
    const day = getDayOfYear(today)
    
    const stories = data.allMarkdownRemark.nodes
    if (stories.length > 0) {
      const shuffled = seededShuffle(stories, year)
      const selected = shuffled[(day - 1) % shuffled.length]
      setDailyStory(selected)
    }
    setLoading(false)
  }, [data])

  // Track reading progress bar
  useEffect(() => {
    if (loading || !dailyStory) return

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading, dailyStory])

  // Track completion using IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined" || loading || !dailyStory) return

    const handleStoryComplete = () => {
      if (isCompletedRef.current) return
      isCompletedRef.current = true

      const slug = dailyStory.frontmatter.slug
      const { newBadges, stats, alreadyFinished } = recordCompletion(slug)

      // 1. Confetti rain
      import("canvas-confetti").then((module) => {
        const confetti = module.default
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.85 }
        })
      })

      // 2. Dispatch event to show Toast and refresh stats
      if (newBadges.length > 0) {
        newBadges.forEach(badge => {
          window.dispatchEvent(new CustomEvent("badge_unlocked", { detail: badge }))
        })
      } else if (!alreadyFinished) {
        window.dispatchEvent(new CustomEvent("badge_unlocked", {
          detail: {
            id: `completed-${slug}`,
            title: "Leitura Concluída!",
            description: `Você terminou de ler "${dailyStory.frontmatter.title}".`,
            icon: "📖"
          }
        }))
      } else {
        window.dispatchEvent(new CustomEvent("badge_unlocked", {
          detail: {
            id: `stats-update`,
            title: "Leitura Registrada!",
            description: `Obra concluída novamente. Ofensiva atualizada!`,
            icon: "🔥"
          }
        }))
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          handleStoryComplete()
          observer.disconnect() // trigger once per page load
        }
      },
      { threshold: 0.5 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loading, dailyStory])

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 0.1, 1.6))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 0.1, 0.9))
  }

  return (
    <Layout>
      <Seo title="Conto do Dia" />
      
      {/* Scroll Progress Bar */}
      {!loading && dailyStory && (
        <>
          <div 
            className="reading-progress-bar" 
            style={{ width: `${scrollProgress}%` }} 
          />
          <div 
            className="reading-progress-bar-vertical" 
            style={{ transform: `scaleY(${scrollProgress / 100})` }} 
          />
        </>
      )}

      <div className="hero-section container">
        <span className="badge">Recomendação Diária</span>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.5px" }}>
          O Conto do Dia
        </h2>
        <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
          Uma obra clássica selecionada especialmente para hoje.
        </p>
      </div>

      <div className="reader-container">
        {loading ? (
          <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
            <p style={{ color: "var(--text-muted)" }}>Folheando páginas...</p>
          </div>
        ) : dailyStory ? (
          <article className="card" style={{ padding: "3rem 2.5rem" }}>
            <div className="story-header">
              <span className="badge" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                {dailyStory.frontmatter.category}
              </span>
              <h1 className="story-title">{dailyStory.frontmatter.title}</h1>
              <div className="story-meta">
                por {dailyStory.frontmatter.author} &bull; {dailyStory.frontmatter.year}
              </div>
              <div className="divider"></div>
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
              <span className="font-size-indicator">{Math.round(fontSize * 100)}%</span>
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
              style={{ '--reader-font-size': `${fontSize}rem` }}
              dangerouslySetInnerHTML={{ __html: dailyStory.html }} 
            />
            
            {/* End of Story Trigger */}
            <div 
              ref={observerRef} 
              style={{ height: "40px", margin: "2rem 0", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <span style={{ fontSize: "1.2rem", opacity: 0.4 }}>❦ FIM ❦</span>
            </div>
            
            <div style={{ marginTop: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Não quer parar de ler?
              </span>
              <Link to="/busca" className="btn-primary">
                Ver Outros Contos
              </Link>
            </div>
          </article>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
            <h3>Nenhum conto disponível</h3>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Adicione arquivos markdown no diretório content/contos para começar.
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
        html
      }
    }
  }
`

export default IndexPage
