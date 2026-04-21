import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

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

  const tipoLabel = {
    racao_seca: "Ração seca",
    racao_verde: "Ração verde",
    feno: "Feno",
    agua: "Água",
    outro: "Outro"
  }

  return (
    <div style={estilosBase.container}>
      <header style={estilosBase.header}>
        <button onClick={() => navigate("/dashboard")} style={estilosBase.voltarBtn}>← Voltar</button>
        <h1 style={estilosBase.logo}>🥬 Alimentação</h1>
        <div style={{ width: 80 }} />
      </header>

      <main style={{ ...estilosBase.main, maxWidth: 700 }}>
        <div style={estilosBase.card}>
          <p style={estilosBase.cardTitle}>Registrar alimentação</p>
          <form onSubmit={cadastrar} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <select style={estilosBase.input} value={animalId} onChange={e => setAnimalId(e.target.value)} required>
              <option value="">Selecione o animal</option>
              {animais.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select style={estilosBase.input} value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="racao_seca">Ração seca</option>
              <option value="racao_verde">Ração verde</option>
              <option value="feno">Feno</option>
              <option value="agua">Água</option>
              <option value="outro">Outro</option>