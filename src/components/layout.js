import React, { useState, useEffect } from "react"
import Header from "./header"

const Layout = ({ children }) => {
  const [theme, setTheme] = useState("dark") // default to dark

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    setTheme(savedTheme)
    document.body.className = `${savedTheme}-theme`
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    localStorage.setItem("theme", nextTheme)
    document.body.className = `${nextTheme}-theme`
  }

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main style={{ minHeight: "calc(100vh - 210px)", padding: "2rem 0" }}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} — Contos Clássicos Brasileiros</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.7 }}>
            Leitura diária em domínio público. Feito com amor à literatura.
          </p>
        </div>
      </footer>
    </>
  )
}

export default Layout
