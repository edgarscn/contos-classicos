import React from "react"
import { Link } from "gatsby"

const StoryCard = ({ title, author, year, category, slug, excerpt }) => {
  // Truncate excerpt to avoid very long cards
  const truncatedExcerpt = excerpt && excerpt.length > 180 
    ? excerpt.substring(0, 180).trim() + "..."
    : excerpt

  return (
    <article className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <span className="badge" style={{ marginBottom: 0, fontSize: "0.7rem", padding: "0.25rem 0.6rem" }}>
          {category}
        </span>
        <span style={{ fontSize: "0.85rem", opacity: 0.6, fontWeight: 500 }}>
          {year}
        </span>
      </div>
      
      <h3 style={{ fontSize: "1.4rem", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0.5rem 0 0.25rem 0", lineHeight: 1.3 }}>
        {title}
      </h3>
      
      <p style={{ fontSize: "0.95rem", opacity: 0.8, fontWeight: 600, color: "var(--accent)", marginBottom: "1rem" }}>
        {author}
      </p>
      
      <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "1.5rem", flexGrow: 1, lineHeight: 1.5 }}>
        {truncatedExcerpt}
      </p>
      
      <div>
        <Link to={`/conto/${slug}`} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Ler Obra
        </Link>
      </div>
    </article>
  )
}

export default StoryCard
