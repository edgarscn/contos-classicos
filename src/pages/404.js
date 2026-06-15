import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <Seo title="Página Não Encontrada" />
    <div
      className="reader-container"
      style={{ padding: "4rem 0", textAlign: "center" }}
    >
      <div className="card" style={{ padding: "3rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
        <h1
          style={{
            fontSize: "2rem",
            fontFamily: "var(--font-serif)",
            marginBottom: "1rem",
          }}
        >
          Página não encontrada
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          A página ou conto que você está procurando não existe ou foi removido.
        </p>
        <Link to="/" className="btn-primary">
          Ir para a Página Inicial
        </Link>
      </div>
    </div>
  </Layout>
)

export default NotFoundPage
