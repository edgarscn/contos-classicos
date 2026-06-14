import * as React from "react"
import { useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const StoryTemplate = ({ data }) => {
  const story = data.markdownRemark
  const [fontSize, setFontSize] = useState(1.15) // in rem

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
          <article className="card" style={{ padding: "3rem 2.5rem" }}>
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
