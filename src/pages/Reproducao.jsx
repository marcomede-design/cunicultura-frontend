import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Reproducao() {
  const [reproducoes, setReproducoes] = useState([])
  const [animais, setAnimais] = useState([])
  const [matrizId, setMatrizId] = useState("")
  const [reproducaoId, setReproducaoId] = useState("")
  const [dataCobertura, setDataCobertura] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  async function carregar() {
    try {
      const [repRes, aniRes] = await Promise.all([
        api.get("/reproducao"),
        api.get("/animais")
      ])
      setReproducoes(repRes.data)
      setAnimais(aniRes.data)
    } catch {
      setErro("Erro ao carregar dados")
    }
  }

  useEffect(() => { carregar() }, [])

  async function cadastrar(e) {
    e.preventDefault()
    try {
      await api.post("/reproducao", {
        matrizId: parseInt(matrizId),
        reproducaoId: parseInt(reproducaoId),
        dataCobertura,
        observacoes
      })
      setMatrizId("")
      setReproducaoId("")
      setDataCobertura("")
      setObservacoes("")
      carregar()
    } catch {
      setErro("Erro ao registrar cobertura")
    }
  }

  async function confirmarPrenhez(id) {
    try {
      await api.patch(`/reproducao/${id}/confirmar-prenhez`)
      carregar()
    } catch {
      setErro("Erro ao confirmar prenhez")
    }
  }

  async function registrarParto(id) {
    const totalNascidos = parseInt(prompt("Total de nascidos:"))
    const nascidosVivos = parseInt(prompt("Nascidos vivos:"))
    const nascidosMortos = totalNascidos - nascidosVivos
    try {
      await api.patch(`/reproducao/${id}/parto`, { totalNascidos, nascidosVivos, nascidosMortos })
      carregar()
    } catch {
      setErro("Erro ao registrar parto")
    }
  }

  const femeas = animais.filter(a => a.sexo === "F")
  const machos = animais.filter(a => a.sexo === "M")

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate("/dashboard")} style={styles.voltarBtn}>← Voltar</button>
        <h1 style={styles.logo}>🔁 Reprodução</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Registrar cobertura</h3>
          <form onSubmit={cadastrar} style={styles.form}>
            <select style={styles.input} value={matrizId} onChange={e => setMatrizId(e.target.value)} required>
              <option value="">Selecione a matriz (fêmea)</option>
              {femeas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select style={styles.input} value={reproducaoId} onChange={e => setReproducaoId(e.target.value)} required>
              <option value="">Selecione o reprodutor (macho)</option>
              {machos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <input
              style={styles.input}
              type="date"
              value={dataCobertura}
              onChange={e => setDataCobertura(e.target.value)}
              required
            />
            <input
              style={styles.input}
              placeholder="Observações (opcional)"
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
            />
            <button style={styles.btn} type="submit">Registrar cobertura</button>
          </form>
          {erro && <p style={styles.erro}>{erro}</p>}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Reproduções ({reproducoes.length})</h3>
          {reproducoes.length === 0 && <p style={styles.vazio}>Nenhuma reprodução registrada</p>}
          {reproducoes.map(r => (
            <div key={r.id} style={styles.repItem}>
              <div style={{ flex: 1 }}>
                <div style={styles.repNome}>{r.matriz?.nome} — cobertura {new Date(r.dataCobertura).toLocaleDateString("pt-BR")}</div>
                {r.alertas?.map((a, i) => <div key={i} style={styles.alerta}>{a}</div>)}
              </div>
              <div style={styles.acoes}>
                {!r.confirmadaPrenhez && !r.dataParto && (
                  <button onClick={() => confirmarPrenhez(r.id)} style={styles.btnVerde}>Confirmar prenhez</button>
                )}
                {r.confirmadaPrenhez && !r.dataParto && (
                  <button onClick={() => registrarParto(r.id)} style={styles.btnAzul}>Registrar parto</button>
                )}
                {r.dataParto && <span style={styles.badgeGreen}>Parto registrado</span>}
              </div>
            </div>
          ))}
        </div>
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
  cardTitle: { fontSize: 13, fontWeight: 500, color: "#888", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: "10px 14px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 14, outline: "none" },
  btn: { padding: 11, borderRadius: 8, background: "#1D9E75", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, cursor: "pointer" },
  erro: { color: "#E24B4A", fontSize: 13, margin: "8px 0 0" },
  vazio: { fontSize: 14, color: "#aaa", textAlign: "center", padding: "1rem 0" },
  repItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "0.5px solid #f0f0e8", gap: 12 },
  repNome: { fontSize: 14, fontWeight: 500, marginBottom: 4 },
  alerta: { fontSize: 12, color: "#BA7517", marginTop: 2 },
  acoes: { display: "flex", gap: 8, flexShrink: 0 },
  btnVerde: { background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" },
  btnAzul: { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" },
  badgeGreen: { background: "#EAF3DE", color: "#27500A", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 6 }
}