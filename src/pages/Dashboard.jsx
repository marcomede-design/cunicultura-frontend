import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Dashboard() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setDados(res.data))
      .catch(() => setErro("Erro ao carregar dados"))
  }, [])

  function sair() {
    localStorage.removeItem("token")
    navigate("/")
  }

  if (erro) return <p style={{ padding: 24, color: "#E24B4A" }}>{erro}</p>
  if (!dados) return <p style={{ padding: 24 }}>Carregando...</p>

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🐇 Cunicultura</h1>
        <button onClick={sair} style={styles.sairBtn}>Sair</button>
      </header>

      <main style={styles.main}>
        <h2 style={styles.sectionTitle}>Visão geral</h2>

        <div style={styles.grid4}>
          <div style={styles.metric}>
            <p style={styles.metricLabel}>Total de animais</p>
            <p style={styles.metricValue}>{dados.animais.total}</p>
            <p style={styles.metricSub}>{dados.animais.femeas} fêmeas · {dados.animais.machos} machos</p>
          </div>
          <div style={styles.metric}>
            <p style={styles.metricLabel}>Partos este mês</p>
            <p style={styles.metricValue}>{dados.reproducao.partosMes}</p>
            <p style={styles.metricSub}>média {dados.reproducao.mediaFilhotes} filhotes</p>
          </div>
          <div style={styles.metric}>
            <p style={styles.metricLabel}>Taxa de mortalidade</p>
            <p style={styles.metricValue}>{dados.mortalidade.taxaMortalidade}%</p>
            <p style={styles.metricSub}>últimos 30 dias</p>
          </div>
          <div style={styles.metric}>
            <p style={styles.metricLabel}>Alertas ativos</p>
            <p style={styles.metricValue}>{dados.alertas.length}</p>
            <p style={styles.metricSub}>pendências</p>
          </div>
        </div>

        {dados.alertas.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Alertas</h3>
            {dados.alertas.map((a, i) => (
              <div key={i} style={styles.alertItem}>
                <div style={{ ...styles.dot, background: a.tipo === "danger" ? "#E24B4A" : a.tipo === "warning" ? "#BA7517" : "#378ADD" }} />
                <div>
                  <p style={styles.alertText}>{a.mensagem}</p>
                  <p style={styles.alertSub}>{a.detalhe}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.navGrid}>
          <button onClick={() => navigate("/animais")} style={styles.navBtn}>🐇 Animais</button>
          <button onClick={() => navigate("/reproducao")} style={styles.navBtn}>🔁 Reprodução</button>
          <button onClick={() => navigate("/ninhadas")} style={styles.navBtn}>🍼 Ninhadas</button>
          <button onClick={() => navigate("/saude")} style={styles.navBtn}>🏥 Saúde</button>
          <button onClick={() => navigate("/alimentacao")} style={styles.navBtn}>🥬 Alimentação</button>
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: { minHeight: "100vh", background: "#f5f5f0" },
  header: { background: "#fff", borderBottom: "0.5px solid #e0e0d8", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 20, fontWeight: 500, margin: 0 },
  sairBtn: { background: "none", border: "0.5px solid #ccc", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: "#666" },
  main: { padding: "24px", maxWidth: 900, margin: "0 auto" },
  sectionTitle: { fontSize: 16, fontWeight: 500, margin: "0 0 16px" },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 20 },
  metric: { background: "#fff", border: "0.5px solid #e0e0d8", borderRadius: 12, padding: "1rem" },
  metricLabel: { fontSize: 13, color: "#888", margin: "0 0 4px" },
  metricValue: { fontSize: 28, fontWeight: 500, margin: "0 0 4px" },
  metricSub: { fontSize: 12, color: "#aaa", margin: 0 },
  card: { background: "#fff", border: "0.5px solid #e0e0d8", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 20 },
  cardTitle: { fontSize: 13, fontWeight: 500, color: "#888", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" },
  alertItem: { display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "0.5px solid #f0f0e8" },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 4 },
  alertText: { fontSize: 13, fontWeight: 500, margin: "0 0 2px" },
  alertSub: { fontSize: 12, color: "#888", margin: 0 },
  navGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 },
  navBtn: { background: "#fff", border: "0.5px solid #e0e0d8", borderRadius: 12, padding: "1rem", fontSize: 15, cursor: "pointer", fontWeight: 500 }
}