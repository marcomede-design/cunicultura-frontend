import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

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
      await api.post("/saude", { animalId, tipo, descricao, tratamento, medicamento, dose, observacoes, data })
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
    <div style={estilosBase.container}>
      <header style={estilosBase.header}>
        <button onClick={() => navigate("/dashboard")} style={estilosBase.voltarBtn}>← Voltar</button>
        <h1 style={estilosBase.logo}>🏥 Saúde</h1>
        <div style={{ width: 80 }} />
      </header>

      <main style={{ ...estilosBase.main, maxWidth: 700 }}>
        <div style={estilosBase.card}>
          <p style={estilosBase.cardTitle}>Registrar ocorrência</p>
          <form onSubmit={cadastrar} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <select style={estilosBase.input} value={animalId} onChange={e => setAnimalId(e.target.value)} required>
              <option value="">Selecione o animal</option>
              {animais.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select style={estilosBase.input} value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="doenca">Doença</option>
              <option value="lesao">Lesão</option>
              <option value="parasita">Parasita</option>
              <option value="outro">Outro</option>
            </select>
            <input style={estilosBase.input} placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required />
            <input style={estilosBase.input} placeholder="Tratamento (opcional)" value={tratamento} onChange={e => setTratamento(e.target.value)} />
            <input style={estilosBase.input} placeholder="Medicamento (opcional)" value={medicamento} onChange={e => setMedicamento(e.target.value)} />
            <input style={estilosBase.input} placeholder="Dose (opcional)" value={dose} onChange={e => setDose(e.target.value)} />
            <input style={estilosBase.input} type="date" value={data} onChange={e => setData(e.target.value)} />
            <input style={estilosBase.input} placeholder="Observações (opcional)" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
            <button style={estilosBase.btn} type="submit">Registrar</button>
          </form>
          {erro && <p style={estilosBase.erro}>{erro}</p>}
        </div>

        {animalId && (
          <div style={estilosBase.card}>
            <p style={estilosBase.cardTitle}>Histórico de saúde</p>
            {registros.length === 0 && <p style={estilosBase.vazio}>Nenhum registro encontrado</p>}
            {registros.map(r => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `0.5px solid ${cores.borda}`, gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ ...estilosBase.badge, background: r.resolvido ? "#eaf3de" : "#fcebeb", color: r.resolvido ? "#27500a" : "#791f1f" }}>
                      {r.resolvido ? "Resolvido" : "Ativo"}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: cores.texto }}>{r.descricao}</span>
                  </div>
                  <p style={{ fontSize: 12, color: cores.textoTerciario, margin: 0 }}>
                    {new Date(r.data).toLocaleDateString("pt-BR")} · {r.tipo}
                    {r.medicamento && ` · ${r.medicamento} ${r.dose || ""}`}
                  </p>
                  {r.tratamento && <p style={{ fontSize: 12, color: cores.primariaClara, margin: "4px 0 0" }}>Tratamento: {r.tratamento}</p>}
                </div>
                {!r.resolvido && (
                  <button onClick={() => resolver(r.id)} style={estilosBase.btnVerde}>Resolver</button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}