import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Animais() {
  const [animais, setAnimais] = useState([])
  const [nome, setNome] = useState("")
  const [sexo, setSexo] = useState("F")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  async function carregar() {
    try {
      const { data } = await api.get("/animais")
      setAnimais(data)
    } catch {
      setErro("Erro ao carregar animais")
    }
  }

  useEffect(() => { carregar() }, [])

  async function cadastrar(e) {
    e.preventDefault()
    try {
      await api.post("/animais", { nome, sexo })
      setNome("")
      setSexo("F")
      carregar()
    } catch {
      setErro("Erro ao cadastrar animal")
    }
  }

  async function excluir(id) {
    if (!confirm("Excluir este animal?")) return
    try {
      await api.delete(`/animais/${id}`)
      carregar()
    } catch {
      setErro("Erro ao excluir animal")
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate("/dashboard")} style={styles.voltarBtn}>← Voltar</button>
        <h1 style={styles.logo}>🐇 Animais</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Cadastrar animal</h3>
          <form onSubmit={cadastrar} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Nome (ex: F-01)"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
            <select style={styles.input} value={sexo} onChange={e => setSexo(e.target.value)}>
              <option value="F">Fêmea</option>
              <option value="M">Macho</option>
            </select>
            <button style={styles.btn} type="submit">Cadastrar</button>
          </form>
          {erro && <p style={styles.erro}>{erro}</p>}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Animais cadastrados ({animais.length})</h3>
          {animais.length === 0 && <p style={styles.vazio}>Nenhum animal cadastrado</p>}
          {animais.map(a => (
            <div key={a.id} style={styles.animalItem}>
              <div>
                <span style={styles.animalNome}>{a.nome}</span>
                <span style={{ ...styles.badge, background: a.sexo === "F" ? "#FBEAF0" : "#E6F1FB", color: a.sexo === "F" ? "#72243E" : "#0C447C" }}>
                  {a.sexo === "F" ? "Fêmea" : "Macho"}
                </span>
              </div>
              <button onClick={() => excluir(a.id)} style={styles.excluirBtn}>Excluir</button>
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
  main: { padding: 24, maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 },
  card: { background: "#fff", border: "0.5px solid #e0e0d8", borderRadius: 12, padding: "1rem 1.25rem" },
  cardTitle: { fontSize: 13, fontWeight: 500, color: "#888", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: "10px 14px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 14, outline: "none" },
  btn: { padding: 11, borderRadius: 8, background: "#1D9E75", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, cursor: "pointer" },
  erro: { color: "#E24B4A", fontSize: 13, margin: "8px 0 0" },
  vazio: { fontSize: 14, color: "#aaa", textAlign: "center", padding: "1rem 0" },
  animalItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid #f0f0e8" },
  animalNome: { fontSize: 14, fontWeight: 500, marginRight: 8 },
  badge: { fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 6 },
  excluirBtn: { background: "none", border: "0.5px solid #E24B4A", borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: "#E24B4A" }
}