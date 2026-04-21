import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores } from "../styles/tema"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const { data } = await api.post("/auth/login", { email, senha })
      localStorage.setItem("token", data.token)
      navigate("/dashboard")
    } catch {
      setErro("Email ou senha inválidos")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcone}>🐇</div>
          <h1 style={styles.titulo}>Cunicultura</h1>
          <p style={styles.subtitulo}>Sistema de gestão da granja</p>
        </div>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.campo}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Senha</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>
          {erro && <p style={styles.erro}>{erro}</p>}
          <button style={styles.btn} type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f0" },
  card: { background: "#fff", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 380, border: `0.5px solid #c8d8c8`, boxShadow: "0 4px 24px rgba(45,106,79,0.08)" },
  logoArea: { textAlign: "center", marginBottom: "2rem" },
  logoIcone: { fontSize: 48, marginBottom: 8 },
  titulo: { fontSize: 26, fontWeight: 500, margin: "0 0 6px", color: "#1b3a2d" },
  subtitulo: { fontSize: 14, color: "#7a9e7e", margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  campo: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: "#4a7a5a" },
  input: { padding: "10px 14px", borderRadius: 8, border: "1px solid #c8d8c8", fontSize: 14, outline: "none", color: "#1b3a2d" },
  btn: { padding: 12, borderRadius: 8, background: "#2d6a4f", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, cursor: "pointer", marginTop: 4 },
  erro: { color: "#c0392b", fontSize: 13, margin: 0, textAlign: "center" }
}