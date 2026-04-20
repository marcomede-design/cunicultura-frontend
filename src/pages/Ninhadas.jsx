import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Ninhadas() {
  const [ninhadas, setNinhadas] = useState([])
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  async function carregar() {
    try {
      const { data } = await api.get("/ninhadas")
      setNinhadas(data)
    } catch {
      setErro("Erro ao carregar ninhadas")
    }
  }

  useEffect(() => { carregar() }, [])

  async function registrarMortalidade(id) {
    const quantidade = parseInt(prompt("Quantidade de mortes:"))
    const causa = prompt("Causa (opcional):")
    if (!quantidade || isNaN(quantidade)) return
    try {
      await api.post(`/ninhadas/${id}/mortalidade`, { quantidade, causa })
      carregar()
    } catch {
      setErro("Erro ao registrar mortalidade")
    }
  }

  async function atualizarPeso(id) {
    const pesoMedioNascer = parseFloat(prompt("Peso médio ao nascer (g):"))
    const pesoMedioDesmame = parseFloat(prompt("Peso médio ao desmame (g):"))
    try {
      await api.patch(`/ninhadas/${id}`, { pesoMedioNascer, pesoMedioDesmame })
      carregar()
    } catch {
      setErro("Erro ao atualizar peso")
    }
  }

  async function registrarSexagem(id) {
    const machos = parseInt(prompt("Quantidade de machos:"))
    const femeas = parseInt(prompt("Quantidade de fêmeas:"))
    try {
      await api.patch(`/ninhadas/${id}`, { machos, femeas })
      carregar()
    } catch {
      setErro("Erro ao registrar sexagem")
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate("/dashboard")} style={styles.voltarBtn}>← Voltar</button>
        <h1 style={styles.logo}>🍼 Ninhadas</h1>
      </header>

      <main style={styles.main}>
        {erro && <p style={styles.erro}>{erro}</p>}

        {ninhadas.length === 0 && (
          <div style={styles.card}>
            <p style={styles.vazio}>Nenhuma ninhada registrada. Registre um parto na página de Reprodução.</p>
          </div>
        )}

        {ninhadas.map(n => (
          <div key={n.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.ninhadaTitulo}>Ninhada #{n.id} — {n.reproducao?.matriz?.nome}</h3>
                <p style={styles.ninhadaSub}>
                  Parto: {new Date(n.reproducao?.dataParto).toLocaleDateString("pt-BR")}
                  {n.reproducao?.dataDesmame && ` · Desmame: ${new Date(n.reproducao.dataDesmame).toLocaleDateString("pt-BR")}`}
                </p>
              </div>
              <span style={{ ...styles.badge, background: "#EAF3DE", color: "#27500A" }}>
                {n.vivosAtual ?? n.nascidosVivos} vivos
              </span>
            </div>

            <div style={styles.grid3}>
              <div style={styles.metric}>
                <p style={styles.metricLabel}>Nascidos</p>
                <p style={styles.metricValue}>{n.totalNascidos}</p>
              </div>
              <div style={styles.metric}>
                <p style={styles.metricLabel}>Vivos</p>
                <p style={styles.metricValue}>{n.nascidosVivos}</p>
              </div>
              <div style={styles.metric}>
                <p style={styles.metricLabel}>Mortalidade</p>
                <p style={styles.metricValue}>{n.taxaMortalidade}</p>
              </div>
              {n.pesoMedioNascer && (
                <div style={styles.metric}>
                  <p style={styles.metricLabel}>Peso nascer</p>
                  <p style={styles.metricValue}>{n.pesoMedioNascer}g</p>
                </div>
              )}
              {n.pesoMedioDesmame && (
                <div style={styles.metric}>
                  <p style={styles.metricLabel}>Peso desmame</p>
                  <p style={styles.metricValue}>{n.pesoMedioDesmame}g</p>
                </div>
              )}
              {n.machos !== null && n.machos !== undefined && (
                <div style={styles.metric}>
                  <p style={styles.metricLabel}>Sexagem</p>
                  <p style={styles.metricValue}>{n.machos}M · {n.femeas}F</p>
                </div>
              )}
            </div>

            {n.mortalidades?.length > 0 && (
              <div style={styles.mortalidadeList}>
                <p style={styles.cardTitle}>Mortalidades registradas</p>
                {n.mortalidades.map((m, i) => (
                  <div key={i} style={styles.mortalidadeItem}>
                    <span style={styles.mortalidadeData}>{new Date(m.data).toLocaleDateString("pt-BR")}</span>
                    <span>{m.quantidade} morte(s)</span>
                    {m.causa && <span style={styles.mortalidadeCausa}>{m.causa}</span>}
                  </div>
                ))}
              </div>
            )}

            <div style={styles.acoes}>
              <button onClick={() => registrarMortalidade(n.id)} style={styles.btnVermelho}>+ Mortalidade</button>
              <button onClick={() => atualizarPeso(n.id)} style={styles.btnCinza}>Atualizar peso</button>
              <button onClick={() => registrarSexagem(n.id)} style={styles.btnCinza}>Registrar sexagem</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

const styles = {
  container: { minHeight: "100vh", background: "#f5f5f0" },
  header: { background: "#fff", borderBottom: "0.5px solid #e0e0d8", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 },
  voltarBtn: { background: "none", border: "0.5px solid #ccc", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: "#666" },
  logo: { fontSize: 20, fontWeight: 500, margin: 0 },
  main: { padding: 24, maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 },
  card: { background: "#fff", border: "0.5px solid #e0e0d8", borderRadius: 12, padding: "1rem 1.25rem" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  ninhadaTitulo: { fontSize: 15, fontWeight: 500, margin: "0 0 4px" },
  ninhadaSub: { fontSize: 12, color: "#888", margin: 0 },
  badge: { fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 6 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8, marginBottom: 12 },
  metric: { background: "#f5f5f0", borderRadius: 8, padding: "8px 12px" },
  metricLabel: { fontSize: 11, color: "#888", margin: "0 0 2px" },
  metricValue: { fontSize: 18, fontWeight: 500, margin: 0 },
  mortalidadeList: { borderTop: "0.5px solid #f0f0e8", paddingTop: 10, marginBottom: 12 },
  cardTitle: { fontSize: 11, fontWeight: 500, color: "#888", margin: "0 0 8px", textTransform: "uppercase" },
  mortalidadeItem: { display: "flex", gap: 12, fontSize: 13, padding: "4px 0" },
  mortalidadeData: { color: "#888" },
  mortalidadeCausa: { color: "#E24B4A" },
  acoes: { display: "flex", gap: 8, flexWrap: "wrap", borderTop: "0.5px solid #f0f0e8", paddingTop: 12 },
  btnVermelho: { background: "none", border: "0.5px solid #E24B4A", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", color: "#E24B4A" },
  btnCinza: { background: "none", border: "0.5px solid #ccc", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", color: "#666" },
  erro: { color: "#E24B4A", fontSize: 13 },
  vazio: { fontSize: 14, color: "#aaa", textAlign: "center", padding: "1rem 0" }
}