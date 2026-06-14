import * as React from "react"
import { useState, useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import StoryCard from "../components/StoryCard"

const SearchPage = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [visibleCount, setVisibleCount] = useState(24) // Show 24 by default (perfect for 3-col grid)
  
  const stories = data.allMarkdownRemark.nodes

  // Filter stories based on query and category
  const filteredStories = stories.filter(story => {
    const title = story.frontmatter.title ? story.frontmatter.title.toLowerCase() : ""
    const author = story.frontmatter.author ? story.frontmatter.author.toLowerCase() : ""
    const query = searchQuery.toLowerCase()
    const matchesSearch = title.includes(query) || author.includes(query)
    
    const category = story.frontmatter.category ? story.frontmatter.category.toLowerCase() : ""
    const matchesCategory = selectedCategory === "all" || category === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(24)
  }, [searchQuery, selectedCategory])

  // Get unique categories for filtering
  const categories = ["all", ...new Set(stories.map(s => s.frontmatter.category ? s.frontmatter.category.toLowerCase() : "").filter(Boolean))]

  const storiesToRender = filteredStories.slice(0, visibleCount)

  return (
    <Layout>
      <Seo title="Acervo e Pesquisa" />
      
      <div className="container" style={{ paddingBottom: "2rem" }}>
        {/* Hero title */}
        <div style={{ textAlign: "center", padding: "3rem 0 2rem 0" }}>
          <span className="badge">Biblioteca</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
            Pesquisar no Acervo
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Busque por título ou autor para ler qualquer conto do nosso acervo ({stories.length} obras).
          </p>
        </div>

        {/* Search Controls */}
        <div className="search-wrapper">
          <div className="search-input-container">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Digite o título ou o autor..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar contos"
            />
          </div>
          
          {/* Category Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn-primary"
                style={{
                  padding: "0.4rem 1rem",
                  fontSize: "0.85rem",
                  background: selectedCategory === cat ? "var(--accent)" : "var(--card-bg)",
                  color: selectedCategory === cat ? "var(--btn-text)" : "var(--text)",
                  border: `1px solid ${selectedCategory === cat ? "var(--accent)" : "var(--border)"}`,
                  boxShadow: "none"
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Results */}
        {storiesToRender.length > 0 ? (
          <>
            <div className="stories-grid animate-fade-in">
              {storiesToRender.map(story => (
                <StoryCard
                  key={story.id}
                  title={story.frontmatter.title}
                  author={story.frontmatter.author}
                  year={story.frontmatter.year}
                  category={story.frontmatter.category}
                  slug={story.frontmatter.slug}
                  excerpt={story.excerpt}
                />
              ))}
            </div>

            {/* Load More Button */}
            {filteredStories.length > visibleCount && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3rem" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  Mostrando {visibleCount} de {filteredStories.length} obras encontradas
                </p>
                <button
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="btn-primary"
                >
                  Carregar Mais Obras
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state card">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3>Nenhum resultado encontrado</h3>
            <p style={{ marginTop: "0.5rem" }}>
              Tente pesquisar por outros termos ou confira a grafia do nome.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { title: ASC } }) {
      nodes {
        id
        frontmatter {
          title
          author
          year
          category
          slug
        }
        excerpt(pruneLength: 120)
      }
    }
  }
`

export default SearchPage
