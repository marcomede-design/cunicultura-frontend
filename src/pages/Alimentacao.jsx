import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Alimentacao() {
  const [animais, setAnimais] = useState([])
  const [registros, setRegistros] = useState([])
  const [animalId, setAnimalId] = useState("")
  const [tipo, setTipo] = useState("racao_seca")
  const [quantidade, setQuantidade] = useState("")
  const [unidade, setUnidade] = useState("g")
  const [observacoes, setObservacoes] = useState("")
  const [data, setData] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  async function carregarAnimais() {
    try {
      const { data } = await api.get("/animais")
      setAnimais(data)
    } catch {
      setErro("Erro ao carregar animais")
    }
  }

  async function carregarRegistros(id) {
    if (!id) return
    try {
      const { data } = await api.get(`/alimentacao/${id}`)
      setRegistros(data)
    } catch {
      setErro("Erro ao carregar registros")
    }
  }

  useEffect(() => { carregarAnimais() }, [])
  useEffect(() => { carregarRegistros(animalId) }, [animalId])

  async function cadastrar(e) {
    e.preventDefault()
    try {
      await api.post("/alimentacao", { animalId, tipo, quantidade, unidade, observacoes, data })
      setQuantidade("")
      setObservacoes("")
      setData("")
      carregarRegistros(animalId)
    } catch {
      setErro("Erro ao registrar")
    }
  }

  const tipoLabel = { racao_seca: "Ração seca", racao_verde: "Ração verde", feno: "Feno", agua: "Água", outro: "Outro" }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate("/dashboard")} style={styles.voltarBtn}>← Voltar</button>
        <h1 style={styles.logo}>🥬 Alimentação</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Registrar alimentação</h3>
          <form onSubmit={cadastrar} style={styles.form}>
            <select style={styles.input} value={animalId} onChange={e => setAnimalId(e.target.value)} required>
              <option value="">Selecione o animal</option>
              {animais.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select style={styles.input} value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="racao_seca">Ração seca</option>
              <option value="racao_verde">Ração verde</option>
              <option value="feno">Feno</option>
              <option value="agua">Água</option>
              <option value="outro">Outro</option>
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...styles.input, flex: 1 }} type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} required />
              <select style={{ ...styles.input, width: 80 }} value={unidade} onChange={e => setUnidade(e.target.value)}>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="L">L</option>
              </select>
            </div>
            <input style={styles.input} type="date" value={data} onChange={e => setData(e.target.value)} />
            <input style={styles.input} placeholder="Observações (opcional)" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
            <button style={styles.btn} type="submit">Registrar</button>
          </form>
          {erro && <p style={styles.erro}>{erro}</p>}
        </div>

        {animalId && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Histórico de alimentação</h3>
            {registros.length === 0 && <p style={styles.vazio}>Nenhum registro encontrado</p>}
            {registros.map(r => (
              <div key={r.id} style={styles.item}>
                <div>
                  <p style={styles.itemNome}>{tipoLabel[r.tipo] || r.tipo} — {r.quantidade}{r.unidade}</p>
                  <p style={styles.itemSub}>{new Date(r.data).toLocaleDateString("pt-BR")}{r.observacoes && ` · ${r.observacoes}`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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
  item: { padding: "10px 0", borderBottom: "0.5px solid #f0f0e8" },
  itemNome: { fontSize: 14, fontWeight: 500, margin: "0 0 2px" },
  itemSub: { fontSize: 12, color: "#888", margin: 0 }
}