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
      const { data } = await api.get("/alimentacao/" + id)
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

  const tipoLabel = { racao_seca: "Racao seca", racao_verde: "Racao verde", feno: "Feno", agua: "Agua", outro: "Outro" }

  return (
    <div style={estilosBase.container}>
      <header style={estilosBase.header}>
        <button onClick={() => navigate("/dashboard")} style={estilosBase.voltarBtn}>Voltar</button>
        <h1 style={estilosBase.logo}>Alimentacao</h1>
        <div style={{ width: 80 }} />
      </header>
      <main style={{ ...estilosBase.main, maxWidth: 700 }}>
        <div style={estilosBase.card}>
          <p style={estilosBase.cardTitle}>Registrar alimentacao</p>
          <form onSubmit={cadastrar} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <select style={estilosBase.input} value={animalId} onChange={e => setAnimalId(e.target.value)} required>
              <option value="">Selecione o animal</option>
              {animais.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select style={estilosBase.input} value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="racao_seca">Racao seca</option>
              <option value="racao_verde">Racao verde</option>
              <option value="feno">Feno</option>
              <option value="agua">Agua</option>
              <option value="outro">Outro</option>
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...estilosBase.input, flex: 1 }} type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} required />
              <select style={{ ...estilosBase.input, width: 80 }} value={unidade} onChange={e => setUnidade(e.target.value)}>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="L">L</option>
              </select>
            </div>
            <input style={estilosBase.input} type="date" value={data} onChange={e => setData(e.target.value)} />
            <input style={estilosBase.input} placeholder="Observacoes" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
            <button style={estilosBase.btn} type="submit">Registrar</button>
          </form>
          {erro && <p style={estilosBase.erro}>{erro}</p>}
        </div>
        {animalId && (
          <div style={estilosBase.card}>
            <p style={estilosBase.cardTitle}>Historico de alimentacao</p>
            {registros.length === 0 && <p style={estilosBase.vazio}>Nenhum registro encontrado</p>}
            {registros.map(r => (
              <div key={r.id} style={{ padding: "10px 0", borderBottom: "0.5px solid " + cores.borda }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: cores.texto, margin: "0 0 2px" }}>
                    {tipoLabel[r.tipo] || r.tipo}
                  </p>
                  <span style={{ ...estilosBase.badge, background: "#e8f0e8", color: "#2d6a4f" }}>
                    {r.quantidade + r.unidade}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: cores.textoTerciario, margin: 0 }}>
                  {new Date(r.data).toLocaleDateString("pt-BR") + (r.observacoes ? " - " + r.observacoes : "")}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}