import * as React from "react"
import { useState, useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import StoryCard from "../components/StoryCard"
import { getStats } from "../utils/gamification"

const SearchPage = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAuthor, setSelectedAuthor] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all") // all, read, unread
  const [favoriteFilter, setFavoriteFilter] = useState("all") // all, favorites
  const [ratingFilter, setRatingFilter] = useState("all") // all, 4plus, 5star
  const [timeFilter, setTimeFilter] = useState("all") // all, short (<5m), medium (5-10m), long (>10m)
  const [sortBy, setSortBy] = useState("title_asc") // title_asc, title_desc, year_asc, year_desc

  const [visibleCount, setVisibleCount] = useState(24)
  const [stats, setStats] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const stories = data.allMarkdownRemark.nodes

  // Load stats once on mount (to check read status, ratings, and favorites)
  useEffect(() => {
    setStats(getStats())
  }, [])

  // Filter and sort stories
  const filteredStories = stories.filter(story => {
    const slug = story.frontmatter.slug
    const title = story.frontmatter.title
      ? story.frontmatter.title.toLowerCase()
      : ""
    const author = story.frontmatter.author
      ? story.frontmatter.author.toLowerCase()
      : ""
    const query = searchQuery.toLowerCase()

    // Search query match
    const matchesSearch = title.includes(query) || author.includes(query)

    // Category match
    const category = story.frontmatter.category
      ? story.frontmatter.category.toLowerCase()
      : ""
    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory.toLowerCase()

    // Author match
    const matchesAuthor =
      selectedAuthor === "all" || author === selectedAuthor.toLowerCase()

    // Status match (read vs unread)
    let matchesStatus = true
    if (stats) {
      const isRead = !!(stats.readStories && stats.readStories[slug])
      if (statusFilter === "read") matchesStatus = isRead
      if (statusFilter === "unread") matchesStatus = !isRead
    }

    // Favorites match
    let matchesFavorite = true
    if (stats && favoriteFilter === "favorites") {
      matchesFavorite = !!(stats.favorites && stats.favorites.includes(slug))
    }

    // Rating match
    let matchesRating = true
    if (stats && ratingFilter !== "all") {
      const rating = (stats.ratings && stats.ratings[slug]) || 0
      if (ratingFilter === "4plus") matchesRating = rating >= 4
      if (ratingFilter === "5star") matchesRating = rating === 5
    }

    // Time to read match
    let matchesTime = true
    const time = story.timeToRead || 5
    if (timeFilter === "short") matchesTime = time <= 5
    if (timeFilter === "medium") matchesTime = time > 5 && time <= 10
    if (timeFilter === "long") matchesTime = time > 10

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAuthor &&
      matchesStatus &&
      matchesFavorite &&
      matchesRating &&
      matchesTime
    )
  })

  // Sort logic
  const sortedStories = [...filteredStories].sort((a, b) => {
    if (sortBy === "title_asc") {
      return a.frontmatter.title.localeCompare(b.frontmatter.title)
    }
    if (sortBy === "title_desc") {
      return b.frontmatter.title.localeCompare(a.frontmatter.title)
    }
    if (sortBy === "year_asc") {
      const yrA = parseInt(a.frontmatter.year) || 9999
      const yrB = parseInt(b.frontmatter.year) || 9999
      return yrA - yrB
    }
    if (sortBy === "year_desc") {
      const yrA = parseInt(a.frontmatter.year) || 0
      const yrB = parseInt(b.frontmatter.year) || 0
      return yrB - yrA
    }
    return 0
  })

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(24)
  }, [
    searchQuery,
    selectedCategory,
    selectedAuthor,
    statusFilter,
    favoriteFilter,
    ratingFilter,
    timeFilter,
    sortBy,
  ])

  // Get unique categories and authors for filters
  const categories = [
    "all",
    ...new Set(
      stories
        .map(s =>
          s.frontmatter.category ? s.frontmatter.category.toLowerCase() : ""
        )
        .filter(Boolean)
    ),
  ]
  const uniqueAuthors = [
    ...new Set(
      stories
        .map(s => (s.frontmatter.author ? s.frontmatter.author.trim() : ""))
        .filter(Boolean)
    ),
  ].sort()

  const storiesToRender = sortedStories.slice(0, visibleCount)

  return (
    <Layout>
      <Seo title="Acervo e Pesquisa" />

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Hero title */}
        <div style={{ textAlign: "center", padding: "2.5rem 0 1.5rem 0" }}>
          <span className="badge">Biblioteca</span>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              fontFamily: "var(--font-serif)",
            }}
          >
            Pesquisar no Acervo
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "0.25rem",
              fontSize: "0.95rem",
            }}
          >
            Busque por título ou autor para ler qualquer conto do nosso acervo (
            {stories.length} obras).
          </p>
        </div>

        {/* Search Controls */}
        <div
          className="search-wrapper"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Main search input */}
          <div className="search-input-container">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Digite o título ou o autor..."
              className="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Buscar contos"
            />
          </div>

          {/* Quick Filters Row */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Category Select */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                minWidth: "140px",
              }}
            >
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="search-input"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  height: "38px",
                  borderRadius: "10px",
                }}
              >
                <option value="all">Todos os gêneros</option>
                {categories
                  .filter(c => c !== "all")
                  .map(c => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Author Select */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                minWidth: "160px",
              }}
            >
              <select
                value={selectedAuthor}
                onChange={e => setSelectedAuthor(e.target.value)}
                className="search-input"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  height: "38px",
                  borderRadius: "10px",
                }}
              >
                <option value="all">Todos os autores</option>
                {uniqueAuthors.map(auth => (
                  <option key={auth} value={auth}>
                    {auth}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                minWidth: "140px",
              }}
            >
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="search-input"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  height: "38px",
                  borderRadius: "10px",
                }}
              >
                <option value="all">Lidos e Não lidos</option>
                <option value="read">Lidos</option>
                <option value="unread">Não lidos</option>
              </select>
            </div>

            {/* Toggle Advanced Filters Button */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn-streak-header"
              style={{
                height: "38px",
                padding: "0 1rem",
                cursor: "pointer",
                borderColor: showAdvanced ? "var(--accent)" : "var(--border)",
              }}
            >
              ⚙️ {showAdvanced ? "Ocultar filtros" : "Mais filtros"}
            </button>
          </div>

          {/* Advanced Filters Drawer */}
          {showAdvanced && (
            <div
              className="card animate-fade-in"
              style={{
                padding: "1.5rem",
                borderRadius: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1.25rem",
                background: "var(--card-bg)",
              }}
            >
              {/* Sort By */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                  }}
                >
                  Ordenar por
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="search-input"
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.85rem",
                    height: "36px",
                    borderRadius: "8px",
                  }}
                >
                  <option value="title_asc">Título (A-Z)</option>
                  <option value="title_desc">Título (Z-A)</option>
                  <option value="year_asc">Ano (Mais antigos)</option>
                  <option value="year_desc">Ano (Mais recentes)</option>
                </select>
              </div>

              {/* Favorites filter */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                  }}
                >
                  Estante
                </span>
                <select
                  value={favoriteFilter}
                  onChange={e => setFavoriteFilter(e.target.value)}
                  className="search-input"
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.85rem",
                    height: "36px",
                    borderRadius: "8px",
                  }}
                >
                  <option value="all">Todas as obras</option>
                  <option value="favorites">Apenas favoritos ❤️</option>
                </select>
              </div>

              {/* Ratings filter */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                  }}
                >
                  Avaliação
                </span>
                <select
                  value={ratingFilter}
                  onChange={e => setRatingFilter(e.target.value)}
                  className="search-input"
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.85rem",
                    height: "36px",
                    borderRadius: "8px",
                  }}
                >
                  <option value="all">Todas as notas</option>
                  <option value="4plus">★ 4.0 ou mais</option>
                  <option value="5star">★ Apenas 5 estrelas</option>
                </select>
              </div>

              {/* Reading time filter */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                  }}
                >
                  Tempo de Leitura
                </span>
                <select
                  value={timeFilter}
                  onChange={e => setTimeFilter(e.target.value)}
                  className="search-input"
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.85rem",
                    height: "36px",
                    borderRadius: "8px",
                  }}
                >
                  <option value="all">Qualquer tempo</option>
                  <option value="short">Rápido (até 5 min)</option>
                  <option value="medium">Médio (5 a 10 min)</option>
                  <option value="long">Longo (mais de 10 min)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "1.5rem 0 1rem 0",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          <span>
            Encontrados: <strong>{sortedStories.length} contos</strong>
          </span>
          {(selectedCategory !== "all" ||
            selectedAuthor !== "all" ||
            statusFilter !== "all" ||
            favoriteFilter !== "all" ||
            ratingFilter !== "all" ||
            timeFilter !== "all" ||
            searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedAuthor("all")
                setStatusFilter("all")
                setFavoriteFilter("all")
                setRatingFilter("all")
                setTimeFilter("all")
                setSortBy("title_asc")
              }}
              className="auth-link-btn"
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              Limpar Filtros
            </button>
          )}
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
            {sortedStories.length > visibleCount && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "3rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  Mostrando {visibleCount} de {sortedStories.length} obras
                  encontradas
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
              Tente redefinir seus filtros ou buscar por outros termos de
              pesquisa.
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
        id
        timeToRead
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
