import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

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

  const femeas = animais.filter(a => a.sexo === "F")
  const machos = animais.filter(a => a.sexo === "M")

  return (
    <div style={estilosBase.container}>
      <header style={estilosBase.header}>
        <button onClick={() => navigate("/dashboard")} style={estilosBase.voltarBtn}>← Voltar</button>
        <h1 style={estilosBase.logo}>🐇 Animais</h1>
        <div style={{ width: 80 }} />
      </header>

      <main style={{ ...estilosBase.main, maxWidth: 600 }}>
        <div style={estilosBase.card}>
          <p style={estilosBase.cardTitle}>Cadastrar animal</p>
          <form onSubmit={cadastrar} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input style={estilosBase.input} placeholder="Nome (ex: F-01)" value={nome} onChange={e => setNome(e.target.value)} required />
            <select style={estilosBase.input} value={sexo} onChange={e => setSexo(e.target.value)}>
              <option value="F">Fêmea</option>
              <option value="M">Macho</option>
            </select>
            <button style={estilosBase.btn} type="submit">Cadastrar</button>
          </form>
          {erro && <p style={estilosBase.erro}>{erro}</p>}
        </div>

        <div style={estilosBase.card}>
          <p style={estilosBase.cardTitle}>Fêmeas ({femeas.length})</p>
          {femeas.length === 0 && <p style={estilosBase.vazio}>Nenhuma fêmea cadastrada</p>}
          {femeas.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${cores.borda}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...estilosBase.badge, background: "#fbeaf0", color: "#72243e" }}>F</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: cores.texto }}>{a.nome}</span>
              </div>
              <button onClick={() => excluir(a.id)} style={estilosBase.btnVermelho}>Excluir</button>
            </div>
          ))}
        </div>

        <div style={estilosBase.card}>
          <p style={estilosBase.cardTitle}>Machos ({machos.length})</p>
          {machos.length === 0 && <p style={estilosBase.vazio}>Nenhum macho cadastrado</p>}
          {machos.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${cores.borda}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...estilosBase.badge, background: "#e6f1fb", color: "#0c447c" }}>M</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: cores.texto }}>{a.nome}</span>
              </div>
              <button onClick={() => excluir(a.id)} style={estilosBase.btnVermelho}>Excluir</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}