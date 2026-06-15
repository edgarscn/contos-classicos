import React, { useState, useEffect, useRef } from "react"
import { Link } from "gatsby"
import Header from "./header"
import StatsModal from "./StatsModal"
import { getStats } from "../utils/gamification"
import { getCurrentUser } from "../utils/auth"

const Layout = ({ children }) => {
  const [theme, setTheme] = useState("dark")
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPath, setCurrentPath] = useState("")
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const [stats, setStats] = useState({
    readStories: {},
    streak: 0,
    longestStreak: 0,
    lastReadDate: "",
    unlockedBadges: [],
  })
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    // 1. Theme init
    const savedTheme = localStorage.getItem("theme") || "dark"
    setTheme(savedTheme)
    document.body.className = `${savedTheme}-theme`

    // 2. Auth, Stats & Path init
    setCurrentUser(getCurrentUser())
    setStats(getStats())
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname)
    }

    // 3. Custom event listeners for Gamification and Auth events
    const handleBadgeUnlocked = e => {
      const badge = e.detail
      const toastId = Date.now()

      // Add toast
      setToasts(prev => [...prev, { id: toastId, badge }])

      // Refresh stats
      setStats(getStats())

      // Auto dismiss toast after 4.5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId))
      }, 4500)
    }

    const handleOpenStats = () => {
      setStats(getStats()) // refresh
      setIsStatsOpen(true)
    }

    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser())
      setStats(getStats())
    }

    window.addEventListener("badge_unlocked", handleBadgeUnlocked)
    window.addEventListener("open_stats", handleOpenStats)
    window.addEventListener("auth_change", handleAuthChange)

    return () => {
      window.removeEventListener("badge_unlocked", handleBadgeUnlocked)
      window.removeEventListener("open_stats", handleOpenStats)
      window.removeEventListener("auth_change", handleAuthChange)
    }
  }, [])

  // Monitor location changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLocationChange = () => {
        setCurrentPath(window.location.pathname)
      }
      window.addEventListener("popstate", handleLocationChange)
      return () => window.removeEventListener("popstate", handleLocationChange)
    }
  }, [])

  // Smart Scroll for Immersive Reading
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setHeaderVisible(false)
      } else if (currentScrollY < lastScrollY || currentScrollY <= 10) {
        setHeaderVisible(true)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    localStorage.setItem("theme", nextTheme)
    document.body.className = `${nextTheme}-theme`
  }

  const handleCloseStats = () => {
    setIsStatsOpen(false)
  }

  const dismissToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const isHomeActive = currentPath === "/" || currentPath === ""
  const isBuscaActive = currentPath.includes("/busca")
  const isPerfilActive = currentPath.includes("/perfil")

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        streak={stats.streak}
        onOpenStats={() => setIsStatsOpen(true)}
        user={currentUser}
        visible={headerVisible}
      />

      <main style={{ minHeight: "calc(100vh - 210px)", padding: "2rem 0" }}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} — 10pages - contos clássicos</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.7 }}>
            Leitura diária em domínio público. Feito com amor à literatura.
          </p>
        </div>
      </footer>

      {/* Stats and Badges Panel (also handles login/register) */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={handleCloseStats}
        stats={stats}
      />

      {/* Mobile Bottom Navigation Bar */}
      <nav className={`mobile-bottom-nav ${headerVisible ? "" : "nav-hidden"}`}>
        <Link
          to="/"
          className={`mobile-nav-item ${isHomeActive ? "active" : ""}`}
        >
          <span className="mobile-nav-icon">📖</span>
          <span className="mobile-nav-label">Leitura</span>
        </Link>
        <Link
          to="/busca"
          className={`mobile-nav-item ${isBuscaActive ? "active" : ""}`}
        >
          <span className="mobile-nav-icon">🔍</span>
          <span className="mobile-nav-label">Pesquisar</span>
        </Link>
        {currentUser ? (
          <Link
            to="/perfil"
            className={`mobile-nav-item ${isPerfilActive ? "active" : ""}`}
          >
            <span className="mobile-nav-icon">👤</span>
            <span
              className="mobile-nav-label"
              style={{
                maxWidth: "80px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentUser.username}
            </span>
          </Link>
        ) : (
          <button
            onClick={() => setIsStatsOpen(true)}
            className="mobile-nav-item"
          >
            <span className="mobile-nav-icon">👤</span>
            <span className="mobile-nav-label">Entrar</span>
          </button>
        )}
      </nav>

      {/* Toast Notifications Container */}
      <div className="toasts-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="toast-card"
            onClick={() => dismissToast(toast.id)}
          >
            <div className="toast-icon">{toast.badge.icon || "🏆"}</div>
            <div style={{ flexGrow: 1 }}>
              <div className="toast-title">
                {toast.badge.title || "Conquista Desbloqueada!"}
              </div>
              <div className="toast-desc">{toast.badge.description}</div>
            </div>
            <button className="toast-close">&times;</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default Layout
