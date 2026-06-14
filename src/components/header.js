import * as React from "react"
import { Link } from "gatsby"
import logo from "../images/logo.png"

const Header = ({ theme, onToggleTheme, streak = 0, onOpenStats, user = null, visible = true }) => {
  const isBrowser = typeof window !== "undefined"
  const currentPath = isBrowser ? window.location.pathname : ""

  return (
    <header className={`site-header ${visible ? "" : "header-hidden"}`}>
      <div className="container header-content">
        <Link to="/" className="site-logo" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img 
            src={logo} 
            alt="10pages logo" 
            style={{ 
              height: "32px", 
              width: "32px", 
              borderRadius: "6px", 
              objectFit: "cover",
              border: "1px solid var(--border)"
            }} 
          />
          <span>10pages</span>
        </Link>
        
        <nav className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${currentPath === "/" || currentPath === "" ? "active" : ""}`}
          >
            Leitura
          </Link>
          <Link 
            to="/busca" 
            className={`nav-link ${currentPath.includes("/busca") ? "active" : ""}`}
          >
            Pesquisar
          </Link>
          
          {/* User profile session indicator */}
          <button
            onClick={onOpenStats}
            className="nav-link"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontWeight: 600,
              fontSize: "0.9rem"
            }}
            title={user ? `Logado como ${user.username}` : "Criar conta / Entrar"}
          >
            <span style={{ fontSize: "1.1rem" }}>👤</span>
            <span className="nav-user-name" style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user ? user.username : "Entrar"}
            </span>
          </button>
          
          {/* Streak button */}
          <button
            onClick={onOpenStats}
            className="btn-streak-header"
            title="Ver minhas estatísticas e conquistas"
            aria-label="Ver estatísticas"
          >
            🔥 <span style={{ fontWeight: 700 }}>{streak}</span>
          </button>
          
          <button 
            onClick={onToggleTheme} 
            className="btn-icon" 
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
