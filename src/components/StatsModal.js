import React from "react"
import { BADGES } from "../utils/gamification"

const StatsModal = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null

  const totalReadCount = Object.keys(stats.readStories || {}).length

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="modal-header">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
            🏅 Minhas Conquistas
          </h2>
          <button onClick={onClose} className="btn-close" aria-label="Fechar">
            &times;
          </button>
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
                Ofensiva Atual
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
                Recorde Máximo
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
                Contos Lidos
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
      </div>
    </div>
  )
}

export default StatsModal
