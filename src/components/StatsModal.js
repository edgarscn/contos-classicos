import React, { useState, useEffect } from "react"
import { BADGES } from "../utils/gamification"
import { getCurrentUser, login, register, logout } from "../utils/auth"

const StatsModal = ({ isOpen, onClose, stats }) => {
  const [view, setView] = useState("stats") // "stats" | "login" | "register"
  const [user, setUser] = useState(null)
  
  // Form fields
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setUser(getCurrentUser())
      setView("stats")
      setError("")
      clearForm()
    }
  }, [isOpen])

  // Listen to auth changes inside the modal to update local user state
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser())
    }
    if (typeof window !== "undefined") {
      window.addEventListener("auth_change", handleAuthChange)
      return () => window.removeEventListener("auth_change", handleAuthChange)
    }
  }, [])

  const clearForm = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setError("")
  }

  if (!isOpen) return null

  const totalReadCount = Object.keys(stats.readStories || {}).length

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Wait slightly to feel smooth
    setTimeout(() => {
      const res = login(email, password) // email serves as username/email input here
      setLoading(false)
      if (res.success) {
        // Dispatch toast
        window.dispatchEvent(new CustomEvent("badge_unlocked", {
          detail: {
            id: "auth-login-success",
            title: "Sessão Iniciada!",
            description: `Bem-vindo de volta, ${res.user.username}!`,
            icon: "👤"
          }
        }))
        setView("stats")
        clearForm()
      } else {
        setError(res.error)
      }
    }, 400)
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      // Pass guest stats to register to import progress
      const res = register(username, email, password, stats)
      setLoading(false)
      if (res.success) {
        window.dispatchEvent(new CustomEvent("badge_unlocked", {
          detail: {
            id: "auth-register-success",
            title: "Conta Criada!",
            description: `Olá ${res.user.username}! Seu progresso foi importado.`,
            icon: "🎉"
          }
        }))
        setView("stats")
        clearForm()
      } else {
        setError(res.error)
      }
    }, 500)
  }

  const handleLogoutClick = () => {
    logout()
    window.dispatchEvent(new CustomEvent("badge_unlocked", {
      detail: {
        id: "auth-logout-success",
        title: "Sessão Encerrada",
        description: "Você voltou para o modo visitante.",
        icon: "🚪"
      }
    }))
    setView("stats")
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="modal-header">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
            {view === "stats" && "🏅 Minhas Conquistas"}
            {view === "login" && "👤 Entrar"}
            {view === "register" && "📝 Criar Conta"}
          </h2>
          <button onClick={onClose} className="btn-close" aria-label="Fechar">
            &times;
          </button>
        </div>

        {/* View 1: Stats and Badges */}
        {view === "stats" && (
          <>
            {/* User Session Banner */}
            <div className="auth-banner-modal" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 1rem",
              background: "var(--accent-light)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              marginBottom: "1.5rem",
              fontSize: "0.85rem"
            }}>
              {user ? (
                <>
                  <span style={{ color: "var(--text)", fontWeight: 500 }}>
                    👤 Logado como <strong style={{ color: "var(--accent)" }}>{user.username}</strong>
                  </span>
                  <button 
                    onClick={handleLogoutClick}
                    className="auth-link-btn"
                    style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                  >
                    [Sair]
                  </button>
                </>
              ) : (
                <>
                  <span style={{ color: "var(--text-muted)" }}>
                    👤 Visitante (Salvo localmente)
                  </span>
                  <button 
                    onClick={() => { setView("login"); setError(""); }}
                    className="auth-link-btn"
                    style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                  >
                    [Entrar / Criar Conta]
                  </button>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="stats-grid-modal">
              <div className="stat-card-modal">
                <span style={{ fontSize: "1.8rem" }}>🔥</span>
                <div style={{ marginTop: "0.25rem" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                    {stats.streak} {stats.streak === 1 ? "dia" : "dias"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Ofensiva
                  </div>
                </div>
              </div>

              <div className="stat-card-modal">
                <span style={{ fontSize: "1.8rem" }}>🏆</span>
                <div style={{ marginTop: "0.25rem" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                    {stats.longestStreak} {stats.longestStreak === 1 ? "dia" : "dias"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Recorde
                  </div>
                </div>
              </div>

              <div className="stat-card-modal">
                <span style={{ fontSize: "1.8rem" }}>📚</span>
                <div style={{ marginTop: "0.25rem" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                    {totalReadCount}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Obras Lidas
                  </div>
                </div>
              </div>
            </div>

            {/* Badges List */}
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "1.5rem 0 0.75rem 0", color: "var(--text)" }}>
              Medalhas Literárias
            </h3>
            
            <div className="badges-list-modal">
              {BADGES.map(badge => {
                const isUnlocked = stats.unlockedBadges.includes(badge.id)
                return (
                  <div 
                    key={badge.id} 
                    className={`badge-row-modal ${isUnlocked ? "unlocked" : "locked"}`}
                  >
                    <div className="badge-icon-modal">
                      {isUnlocked ? badge.icon : "🔒"}
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: isUnlocked ? "var(--text)" : "var(--text-muted)" }}>
                        {badge.title}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                        {badge.description}
                      </p>
                    </div>
                    {isUnlocked && (
                      <span className="unlocked-check" title="Desbloqueada">
                        ✓
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* View 2: Login Form */}
        {view === "login" && (
          <form onSubmit={handleLoginSubmit} className="auth-form-modal" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            {error && (
              <div className="auth-error-msg" style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#f87171", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Usuário ou E-mail</label>
              <input 
                type="text" 
                className="search-input" 
                style={{ padding: "0.75rem 1rem", fontSize: "0.95rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: edgar ou edgar@exemplo.com"
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Senha</label>
              <input 
                type="password" 
                className="search-input" 
                style={{ padding: "0.75rem 1rem", fontSize: "0.95rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha secreta"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.8rem", marginTop: "0.5rem" }} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Não tem uma conta? </span>
              <button 
                type="button" 
                onClick={() => { setView("register"); setError(""); clearForm(); }}
                className="auth-link-btn"
                style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
              >
                Cadastre-se
              </button>
            </div>
            
            <button 
              type="button" 
              onClick={() => setView("stats")}
              className="auth-link-btn"
              style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", marginTop: "0.5rem" }}
            >
              ← Voltar para Conquistas
            </button>
          </form>
        )}

        {/* View 3: Register Form */}
        {view === "register" && (
          <form onSubmit={handleRegisterSubmit} className="auth-form-modal" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            {error && (
              <div className="auth-error-msg" style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#f87171", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Nome de Usuário</label>
              <input 
                type="text" 
                className="search-input" 
                style={{ padding: "0.75rem 1rem", fontSize: "0.95rem" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: edgar"
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>E-mail</label>
              <input 
                type="email" 
                className="search-input" 
                style={{ padding: "0.75rem 1rem", fontSize: "0.95rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: edgar@exemplo.com"
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Senha</label>
              <input 
                type="password" 
                className="search-input" 
                style={{ padding: "0.75rem 1rem", fontSize: "0.95rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha segura"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.8rem", marginTop: "0.5rem" }} disabled={loading}>
              {loading ? "Cadastrando..." : "Criar Conta & Importar Progresso"}
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Já tem uma conta? </span>
              <button 
                type="button" 
                onClick={() => { setView("login"); setError(""); clearForm(); }}
                className="auth-link-btn"
                style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
              >
                Entrar
              </button>
            </div>
            
            <button 
              type="button" 
              onClick={() => setView("stats")}
              className="auth-link-btn"
              style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", marginTop: "0.5rem" }}
            >
              ← Voltar para Conquistas
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default StatsModal
