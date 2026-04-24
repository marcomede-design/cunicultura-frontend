import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores } from "../styles/tema"

export default function Cadastro() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)
  const navigate = useNavigate()

  async function handleCadastro(e) {
    e.preventDefault()
    if (senha !== confirmar) {
      setErro("As senhas nao conferem")
      return
    }
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres")
      return
    }
    try {
      await api.post("/auth/register", { nome, email, senha })
      setSucesso(true)
      setTimeout(() => navigate("/"), 3000)
    } catch {
      setErro("Email ja cadastrado ou erro no servidor")
    }
  }

  if (sucesso) return (
    React.createElement("div", { style: styles.container },
      React.createElement("div", { style: styles.card },
        React.createElement("div", { style: { fontSize: 48, textAlign: "center", marginBottom: 16 } }, "ok"),
        React.createElement("h2", { style: { fontSize: 20, fontWeight: 500, textAlign: "center", color: cores.texto, margin: "0 0 8px" } }, "Cadastro realizado!"),
        React.createElement("p", { style: { fontSize: 14, color: cores.textoSecundario, textAlign: "center", margin: 0 } }, "Redirecionando para o login...")
      )
    )
  )

  return (
    React.createElement("div", { style: styles.container },
      React.createElement("div", { style: styles.card },
        React.createElement("div", { style: styles.logoArea },
          React.createElement("div", { style: styles.logoIcone }, "ok"),
          React.createElement("h1", { style: styles.titulo }, "Cunicultura"),
          React.createElement("p", { style: styles.subtitulo }, "Crie sua conta gratuita")
        ),
        React.createElement("form", { onSubmit: handleCadastro, style: styles.form },
          React.createElement("div", { style: styles.campo },
            React.createElement("label", { style: styles.label }, "Nome completo"),
            React.createElement("input", { style: styles.input, type: "text", placeholder: "Seu nome", value: nome, onChange: e => setNome(e.target.value), required: true })
          ),
          React.createElement("div", { style: styles.campo },
            React.createElement("label", { style: styles.label }, "Email"),
            React.createElement("input", { style: styles.input, type: "email", placeholder: "seu@email.com", value: email, onChange: e => setEmail(e.target.value), required: true })
          ),
          React.createElement("div", { style: styles.campo },
            React.createElement("label", { style: styles.label }, "Senha"),
            React.createElement("input", { style: styles.input, type: "password", placeholder: "Minimo 6 caracteres", value: senha, onChange: e => setSenha(e.target.value), required: true })
          ),
          React.createElement("div", { style: styles.campo },
            React.createElement("label", { style: styles.label }, "Confirmar senha"),
            React.createElement("input", { style: styles.input, type: "password", placeholder: "Repita a senha", value: confirmar, onChange: e => setConfirmar(e.target.value), required: true })
          ),
          erro && React.createElement("p", { style: styles.erro }, erro),
          React.createElement("button", { style: styles.btn, type: "submit" }, "Criar conta"),
          React.createElement("button", { type: "button", onClick: () => navigate("/"), style: styles.linkBtn }, "Ja tenho conta - Entrar")
        )
      )
    )
  )
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f0" },
  card: { background: "#fff", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 400, border: "0.5px solid #c8d8c8", boxShadow: "0 4px 24px rgba(45,106,79,0.08)" },
  logoArea: { textAlign: "center", marginBottom: "2rem" },
  logoIcone: { fontSize: 48, marginBottom: 8 },
  titulo: { fontSize: 26, fontWeight: 500, margin: "0 0 6px", color: "#1b3a2d" },
  subtitulo: { fontSize: 14, color: "#7a9e7e", margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  campo: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: "#4a7a5a" },
  input: { padding: "10px 14px", borderRadius: 8, border: "1px solid #c8d8c8", fontSize: 14, outline: "none", color: "#1b3a2d" },
  btn: { padding: 12, borderRadius: 8, background: "#2d6a4f", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, cursor: "pointer", marginTop: 4 },
  linkBtn: { background: "none", border: "none", color: "#4a7a5a", fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 0 },
  erro: { color: "#c0392b", fontSize: 13, margin: 0, textAlign: "center" }
}