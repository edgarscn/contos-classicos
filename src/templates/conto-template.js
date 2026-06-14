import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { recordCompletion } from "../utils/gamification"

const StoryTemplate = ({ data }) => {
  const story = data.markdownRemark
  const [fontSize, setFontSize] = useState(1.15) // in rem
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const observerRef = useRef(null)
  const isCompletedRef = useRef(false)

  // Track reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track completion using IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined" || !story) return

    const handleStoryComplete = () => {
      if (isCompletedRef.current) return
      isCompletedRef.current = true

      const slug = story.frontmatter.slug
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
        // First completion of this story: show a standard completion toast
        window.dispatchEvent(new CustomEvent("badge_unlocked", {
          detail: {
            id: `completed-${slug}`,
            title: "Leitura Concluída!",
            description: `Você terminou de ler "${story.frontmatter.title}".`,
            icon: "📖"
          }
        }))
      } else {
        // Already read before, just refresh the header stats
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
      { threshold: 0.5 } // Trigger when 50% of the trigger element is visible
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [story])

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 0.1, 1.6))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 0.1, 0.9))
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
            <Link to="/busca" className="btn-primary" style={{ marginTop: "1.5rem" }}>
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
              transition: "color var(--transition-fast)"
            }}
            onMouseEnter={(e) => e.target.style.color = "var(--text)"}
            onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar para o Acervo
          </Link>
        </div>

        <div className="reader-container">
          <article className="card reader-card">
            <div className="story-header">
              <span className="badge" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                {story.frontmatter.category}
              </span>
              <h1 className="story-title">{story.frontmatter.title}</h1>
              <div className="story-meta">
                por {story.frontmatter.author} &bull; {story.frontmatter.year}
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
              dangerouslySetInnerHTML={{ __html: story.html }} 
            />

            {/* End of Story Trigger for Observer */}
            <div 
              ref={observerRef} 
              style={{ height: "40px", margin: "2rem 0", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <span style={{ fontSize: "1.2rem", opacity: 0.4 }}>❦ FIM ❦</span>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($id: String!) {
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
