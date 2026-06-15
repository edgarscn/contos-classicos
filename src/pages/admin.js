import * as React from "react"
import { useState, useEffect } from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { Link } from "gatsby"

const AdminPage = () => {
  const [reports, setReports] = useState([])
  const [activeTab, setActiveTab] = useState("local") // "local" | "netlify"

  // Load reports from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("10pages_local_errors")
        setReports(stored ? JSON.parse(stored) : [])
      } catch (e) {
        console.error("Erro ao carregar relatórios", e)
      }
    }
  }, [])

  // Resolve a single report (delete from local)
  const handleResolveReport = id => {
    const updated = reports.filter(r => r.id !== id)
    setReports(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("10pages_local_errors", JSON.stringify(updated))
    }
  }

  // Clear all reports
  const handleClearAll = () => {
    if (window.confirm("Deseja realmente limpar todos os relatos locais?")) {
      setReports([])
      if (typeof window !== "undefined") {
        localStorage.removeItem("10pages_local_errors")
      }
    }
  }

  const formatDateTime = isoString => {
    try {
      return new Date(isoString).toLocaleString("pt-BR")
    } catch (e) {
      return isoString
    }
  }

  const getErrorTypeBadgeColor = type => {
    switch (type) {
      case "ortografia":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444" } // Red
      case "formatacao":
        return { bg: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" } // Blue
      case "informacao":
        return { bg: "rgba(234, 179, 8, 0.1)", color: "#eab308" } // Yellow
      default:
        return { bg: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" } // Purple
    }
  }

  const getErrorTypeName = type => {
    switch (type) {
      case "ortografia":
        return "Ortografia / Digitação"
      case "formatacao":
        return "Formatação / Layout"
      case "informacao":
        return "Informação Incorreta"
      default:
        return "Outro"
    }
  }

  return (
    <Layout>
      <Seo title="Painel do Administrador" />

      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Navigation / Header */}
        <div style={{ marginBottom: "2rem" }}>
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
              marginBottom: "1rem",
            }}
          >
            ← Voltar para o Acervo
          </Link>
          <h1
            style={{
              fontSize: "2rem",
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            Painel do Administrador 🛠️
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Monitore os relatos de erros enviados pelos leitores e configure os
            canais de recebimento.
          </p>
        </div>

        {/* Tab selection */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            marginBottom: "1.5rem",
            gap: "1.5rem",
          }}
        >
          <button
            onClick={() => setActiveTab("local")}
            style={{
              paddingBottom: "0.75rem",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "local" ? "2px solid var(--accent)" : "none",
              color:
                activeTab === "local" ? "var(--text)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            📋 Relatos Locais ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab("netlify")}
            style={{
              paddingBottom: "0.75rem",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "netlify" ? "2px solid var(--accent)" : "none",
              color:
                activeTab === "netlify" ? "var(--text)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            ⚙️ Configurar Produção
          </button>
        </div>

        {/* Tab 1: Local Reports List */}
        {activeTab === "local" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
                Relatos Capturados neste Navegador
              </h3>
              {reports.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="auth-link-btn"
                  style={{
                    color: "#ef4444",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  Limpar Todos
                </button>
              )}
            </div>

            {reports.length === 0 ? (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "var(--text-muted)",
                }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    display: "block",
                    marginBottom: "1rem",
                  }}
                >
                  🎉
                </span>
                <p style={{ fontSize: "1rem" }}>
                  Nenhum erro relatado localmente neste navegador.
                </p>
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  Para testar, acesse qualquer conto, clique em{" "}
                  <strong>⚠️ Relatar Erro</strong>, envie e volte aqui!
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {reports.map(report => {
                  const badge = getErrorTypeBadgeColor(report.errorType)
                  return (
                    <div
                      key={report.id}
                      className="card"
                      style={{
                        padding: "1.25rem",
                        border: "1px solid var(--border)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              backgroundColor: badge.bg,
                              color: badge.color,
                              display: "inline-block",
                              marginRight: "0.5rem",
                            }}
                          >
                            {getErrorTypeName(report.errorType)}
                          </span>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {formatDateTime(report.timestamp)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleResolveReport(report.id)}
                          className="btn-primary"
                          style={{
                            padding: "0.25rem 0.6rem",
                            fontSize: "0.8rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          ✓ Lido / Corrigido
                        </button>
                      </div>

                      <h4
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: 700,
                          marginBottom: "0.4rem",
                        }}
                      >
                        Conto:{" "}
                        <Link
                          to={`/conto/${report.storySlug}`}
                          style={{
                            color: "var(--accent)",
                            textDecoration: "none",
                          }}
                        >
                          "{report.storyTitle}"
                        </Link>{" "}
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 400,
                            color: "var(--text-muted)",
                          }}
                        >
                          de {report.storyAuthor}
                        </span>
                      </h4>

                      <div
                        style={{
                          background: "var(--bg)",
                          padding: "0.75rem 1rem",
                          borderRadius: "8px",
                          margin: "0.75rem 0",
                          fontSize: "0.95rem",
                          lineHeight: 1.4,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {report.description}
                      </div>

                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        👤 <strong>Relatado por:</strong> {report.reporterName}{" "}
                        &bull; ✉️ {report.reporterEmail}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Production Setup Guides */}
        {activeTab === "netlify" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                  fontFamily: "var(--font-serif)",
                }}
              >
                1. Central de Formulários Netlify (Produção)
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  color: "var(--text-muted)",
                }}
              >
                O app foi configurado com <strong>Netlify Forms</strong>{" "}
                integrado ao backend estático. Qualquer envio de erro em
                produção gera uma captura no banco de dados da sua conta Netlify
                automaticamente.
              </p>
              <div
                style={{
                  background: "var(--bg)",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "1rem 0",
                  fontSize: "0.9rem",
                  lineHeight: 1.4,
                }}
              >
                <strong>Como visualizar os envios no Netlify:</strong>
                <ol style={{ marginLeft: "1.25rem", marginTop: "0.5rem" }}>
                  <li>
                    Faça login no painel do{" "}
                    <a
                      href="https://app.netlify.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent)" }}
                    >
                      Netlify
                    </a>
                    .
                  </li>
                  <li>
                    Selecione o projeto do <strong>10pages</strong>.
                  </li>
                  <li>
                    Acesse a aba <strong>Site configuration</strong> ➔{" "}
                    <strong>Forms</strong> (ou <strong>Site Overview</strong> e
                    clique em "Forms" na barra lateral).
                  </li>
                  <li>
                    Clique no formulário chamado <code>relatar-erro</code> para
                    ler todos os relatos enviados de forma centralizada!
                  </li>
                </ol>
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  color: "var(--text-muted)",
                }}
              >
                💡 <strong>Dica:</strong> Nas configurações de formulários no
                Netlify, você pode cadastrar seu e-mail para receber
                notificações instantâneas toda vez que um leitor enviar um novo
                relatório de erro.
              </p>
            </div>

            <div className="card" style={{ padding: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                  fontFamily: "var(--font-serif)",
                }}
              >
                2. Configurar Destino de Recebimento (E-mail & WhatsApp)
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  color: "var(--text-muted)",
                }}
              >
                O sistema foi simplificado para enviar os relatos diretamente no clique de envio, sem a necessidade de o leitor escolher canais manuais de compartilhamento.
              </p>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  color: "var(--text-muted)",
                  marginTop: "0.5rem",
                }}
              >
                Para alterar o seu e-mail padrão ou o seu telefone de destino nos metadados, basta abrir o arquivo{" "}
                <code style={{ color: "var(--accent)" }}>gatsby-config.js</code>{" "}
                na raiz do projeto e atualizar os seguintes campos em{" "}
                <code>siteMetadata</code>:
              </p>
              <pre
                style={{
                  background: "var(--bg)",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                  overflowX: "auto",
                  marginTop: "0.75rem",
                }}
              >
                {`siteMetadata: {
  ...
  adminEmail: \`edgarscnobrega@gmail.com\`, // Seu e-mail de recebimento
  adminPhone: \`5511999999999\`,          // Seu telefone de suporte (se aplicável)
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AdminPage
