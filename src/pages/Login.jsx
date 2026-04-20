import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

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
        <h1 style={styles.title}>🐇 Cunicultura</h1>
        <p style={styles.subtitle}>Sistema de gestão da granja</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          {erro && <p style={styles.erro}>{erro}</p>}
          <button style={styles.btn} type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f0" },
  card: { background: "#fff", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 380, border: "0.5px solid #e0e0d8" },
  title: { fontSize: 28, fontWeight: 500, margin: "0 0 4px", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#888", textAlign: "center", margin: "0 0 2rem" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { padding: "10px 14px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 14, outline: "none" },
  btn: { padding: "11px", borderRadius: 8, background: "#1D9E75", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, cursor: "pointer", marginTop: 4 },
  erro: { color: "#E24B4A", fontSize: 13, margin: 0 }
}