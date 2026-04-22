import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

export default function Reproducao() {
  const [reproducoes, setReproducoes] = useState([])
  const [animais, setAnimais] = useState([])
  const [matrizId, setMatrizId] = useState("")
  const [reproducaoId, setReproducaoId] = useState("")
  const [dataCobertura, setDataCobertura] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  async function carregar() {
    try {
      const [repRes, aniRes] = await Promise.all([api.get("/reproducao"), api.get("/animais")])
      setReproducoes(repRes.data)
      setAnimais(aniRes.data)
    } catch {
      setErro("Erro ao carregar dados")
    }
  }

  useEffect(() => { carregar() }, [])

  async function cadastrar(e) {
    e.preventDefault()
    try {
      await api.post("/reproducao", { matrizId: parseInt(matrizId), reproducaoId: parseInt(reproducaoId), dataCobertura, observacoes })
      setMatrizId("")
      setReproducaoId("")
      setDataCobertura("")
      setObservacoes("")
      carregar()
    } catch {
      setErro("Erro ao registrar cobertura")
    }
  }

  async function confirmarPrenhez(id) {
    try {
      await api.patch("/reproducao/" + id + "/confirmar-prenhez")
      carregar()
    } catch {
      setErro("Erro ao confirmar prenhez")
    }
  }

  async function registrarParto(id) {
    const totalNascidos = parseInt(prompt("Total de nascidos:"))
    const nascidosVivos = parseInt(prompt("Nascidos vivos:"))
    const nascidosMortos = totalNascidos - nascidosVivos
    try {
      await api.patch("/reproducao/" + id + "/parto", { totalNascidos, nascidosVivos, nascidosMortos })
      carregar()
    } catch {
      setErro("Erro ao registrar parto")
    }
  }

  const femeas = animais.filter(a => a.sexo === "F")
  const machos = animais.filter(a => a.sexo === "M")

  return (
    <div style={estilosBase.container}>
      <header style={estilosBase.header}>
        <button onClick={() => navigate("/dashboard")} style={estilosBase.voltarBtn}>Voltar</button>
        <h1 style={estilosBase.logo}>Reproducao</h1>
        <div style={{ width: 80 }} />
      </header>
      <main style={{ ...estilosBase.main, maxWidth: 700 }}>
        <div style={estilosBase.card}>
          <p style={estilosBase.cardTitle}>Registrar cobertura</p>
          <form onSubmit={cadastrar} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <select style={estilosBase.input} value={matrizId} onChange={e => setMatrizId(e.target.value)} required>
              <option value="">Selecione a matriz</option>
              {femeas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select style={estilosBase.input} value={reproducaoId} onChange={e => setReproducaoId(e.target.value)} required>
              <option value="">Selecione o reprodutor</option>
              {machos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <input style={estilosBase.input} type="date" value={dataCobertura} onChange={e => setDataCobertura(e.target.value)} required />
            <input style={estilosBase.input} placeholder="Observacoes" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
            <button style={estilosBase.btn} type="submit">Registrar cobertura</button>
          </form>
          {erro && <p style={estilosBase.erro}>{erro}</p>}
        </div>
        <div style={estilosBase.card}>
          <p style={estilosBase.cardTitle}>{"Reproducoes (" + reproducoes.length + ")"}</p>
          {reproducoes.length === 0 && <p style={estilosBase.vazio}>Nenhuma reproducao registrada</p>}
          {reproducoes.map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "0.5px solid " + cores.borda, gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: cores.texto, margin: "0 0 4px" }}>
                  {(r.matriz ? r.matriz.nome : "") + " - cobertura " + new Date(r.dataCobertura).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {!r.confirmadaPrenhez && !r.dataParto && (
                  <button onClick={() => confirmarPrenhez(r.id)} style={estilosBase.btnVerde}>Confirmar prenhez</button>
                )}
                {r.confirmadaPrenhez && !r.dataParto && (
                  <button onClick={() => registrarParto(r.id)} style={{ ...estilosBase.btnVerde, background: cores.info }}>Registrar parto</button>
                )}
                {r.dataParto && (
                  <span style={{ ...estilosBase.badge, background: "#eaf3de", color: "#27500a" }}>Parto registrado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}