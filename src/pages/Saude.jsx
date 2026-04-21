import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Saude() {
  const [animais, setAnimais] = useState([])
  const [registros, setRegistros] = useState([])
  const [animalId, setAnimalId] = useState("")
  const [tipo, setTipo] = useState("doenca")
  const [descricao, setDescricao] = useState("")
  const [tratamento, setTratamento] = useState("")
  const [medicamento, setMedicamento] = useState("")
  const [dose, setDose] = useState("")
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
      const { data } = await api.get(`/saude/${id}`)
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
      await api.post("/saude", {
        animalId, tipo, descricao, tratamento,
        medicamento, dose, observacoes, data
      })
      setDescricao("")
      setTratamento("")
      setMedicamento("")
      setDose("")
      setObservacoes("")
      setData("")
      carregarRegistros(animalId)
    } catch {
      setErro("Erro ao registrar")
    }
  }

  async function resolver(id) {
    try {
      await api.patch(`/saude/${id}/resolver`)
      carregarRegistros(animalId)
    } catch {
      setErro("Erro ao resolver")
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate("/dashboard")} style={styles.voltarBtn}>← Voltar</button>
        <h1 style={styles.logo}>🏥 Saúde</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Registrar ocorrência</h3>
          <form onSubmit={cadastrar} style={styles.form}>
            <select style={styles.input} value={animalId} onChange={e => setAnimalId(e.target.value)} required>
              <option value="">Selecione o animal</option>
              {animais.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select style={styles.input} value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="doenca">Doença</option>
              <option value="lesao">Lesão</option>
              <option value="parasita">Parasita</option>
              <option value="outro">Outro</option>
            </select>
            <input style={styles.input} placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required />
            <input style={styles.input} placeholder="Tratamento (opcional)" value={tratamento} onChange={e => setTratamento(e.target.value)} />
            <input style={styles.input} placeholder="Medicamento (opcional)" value={medicamento} onChange={e => setMedicamento(e.target.value)} />
            <input style={styles.input} placeholder="Dose (opcional)" value={dose} onChange={e => setDose(e.target.value)} />
            <input style={styles.input} type="date" value={data} onChange={e => setData(e.target.value)} />
            <input style={styles.input} placeholder="Observações (opcional)" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
            <button style={styles.btn} type="submit">Registrar</button>
          </form>
          {erro && <p style={styles.erro}>{erro}</p>}
        </div>

        {animalId && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Histórico de saúde</h3>
            {registros.length === 0 && <p style={styles.vazio}>Nenhum registro encontrado</p>}
            {registros.map(r => (
              <div key={r.id} style={styles.item}>
                <div style={{ flex: 1 }}>
                  <div style={styles.itemTitulo}>
                    <span style={{ ...styles.badge, background: r.resolvido ? "#EAF3DE" : "#FCEBEB", color: r.resolvido ? "#27500A" : "#791F1F" }}>
                      {r.resolvido ? "Resolvido" : "Ativo"}
                    </span>
                    <span style={styles.itemNome}>{r.descricao}</span>
                  </div>
                  <p style={styles.itemSub}>
                    {new Date(r.data).toLocaleDateString("pt-BR")} · {r.tipo}
                    {r.medicamento && ` · ${r.medicamento} ${r.dose || ""}`}
                  </p>
                  {r.tratamento && <p style={styles.itemTratamento}>Tratamento: {r.tratamento}</p>}
                </div>
                {!r.resolvido && (
                  <button onClick={() => resolver(r.id)} style={styles.btnVerde}>Resolver</button>
                )}
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
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "0.5px solid #f0f0e8", gap: 12 },
  itemTitulo: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  itemNome: { fontSize: 14, fontWeight: 500 },
  itemSub: { fontSize: 12, color: "#888", margin: 0 },
  itemTratamento: { fontSize: 12, color: "#1D9E75", margin: "4px 0 0" },
  badge: { fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 6 },
  btnVerde: { background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", flexShrink: 0 }
}