const fs = require('fs')

const ninhadas = `import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

export default function Ninhadas() {
  const [ninhadas, setNinhadas] = useState([])
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  async function carregar() {
    try {
      const { data } = await api.get("/ninhadas")
      setNinhadas(data)
    } catch {
      setErro("Erro ao carregar ninhadas")
    }
  }

  useEffect(() => { carregar() }, [])

  async function registrarMortalidade(id) {
    const quantidade = parseInt(prompt("Quantidade de mortes:"))
    const causa = prompt("Causa (opcional):")
    if (!quantidade || isNaN(quantidade)) return
    try {
      await api.post("/ninhadas/" + id + "/mortalidade", { quantidade, causa })
      carregar()
    } catch {
      setErro("Erro ao registrar mortalidade")
    }
  }

  async function atualizarPeso(id) {
    const pesoMedioNascer = parseFloat(prompt("Peso medio ao nascer (g):"))
    const pesoMedioDesmame = parseFloat(prompt("Peso medio ao desmame (g):"))
    try {
      await api.patch("/ninhadas/" + id, { pesoMedioNascer, pesoMedioDesmame })
      carregar()
    } catch {
      setErro("Erro ao atualizar peso")
    }
  }

  async function registrarSexagem(id) {
    const machos = parseInt(prompt("Quantidade de machos:"))
    const femeas = parseInt(prompt("Quantidade de femeas:"))
    try {
      await api.patch("/ninhadas/" + id, { machos, femeas })
      carregar()
    } catch {
      setErro("Erro ao registrar sexagem")
    }
  }

  return (
    <div style={estilosBase.container}>
      <header style={estilosBase.header}>
        <button onClick={() => navigate("/dashboard")} style={estilosBase.voltarBtn}>Voltar</button>
        <h1 style={estilosBase.logo}>Ninhadas</h1>
        <div style={{ width: 80 }} />
      </header>
      <main style={{ ...estilosBase.main, maxWidth: 700 }}>
        {erro && <p style={estilosBase.erro}>{erro}</p>}
        {ninhadas.length === 0 && (
          <div style={estilosBase.card}>
            <p style={estilosBase.vazio}>Nenhuma ninhada registrada.</p>
          </div>
        )}
        {ninhadas.map(n => (
          <div key={n.id} style={estilosBase.card}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 500, color: cores.texto, margin: "0 0 4px" }}>
                  {"Ninhada #" + n.id + " - " + (n.reproducao && n.reproducao.matriz ? n.reproducao.matriz.nome : "")}
                </h3>
                <p style={{ fontSize: 12, color: cores.textoTerciario, margin: 0 }}>
                  {"Parto: " + (n.reproducao && n.reproducao.dataParto ? new Date(n.reproducao.dataParto).toLocaleDateString("pt-BR") : "")}
                </p>
              </div>
              <span style={{ ...estilosBase.badge, background: "#eaf3de", color: "#27500a" }}>
                {(n.vivosAtual !== null && n.vivosAtual !== undefined ? n.vivosAtual : n.nascidosVivos) + " vivos"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8, marginBottom: 12 }}>
              <div style={estilosBase.metric}>
                <p style={estilosBase.metricLabel}>Nascidos</p>
                <p style={{ ...estilosBase.metricValue, fontSize: 20 }}>{n.totalNascidos}</p>
              </div>
              <div style={estilosBase.metric}>
                <p style={estilosBase.metricLabel}>Vivos</p>
                <p style={{ ...estilosBase.metricValue, fontSize: 20 }}>{n.nascidosVivos}</p>
              </div>
              <div style={estilosBase.metric}>
                <p style={estilosBase.metricLabel}>Mortalidade</p>
                <p style={{ ...estilosBase.metricValue, fontSize: 20 }}>{n.taxaMortalidade}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "0.5px solid " + cores.borda, paddingTop: 12 }}>
              <button onClick={() => registrarMortalidade(n.id)} style={estilosBase.btnVermelho}>+ Mortalidade</button>
              <button onClick={() => atualizarPeso(n.id)} style={estilosBase.btnCinza}>Atualizar peso</button>
              <button onClick={() => registrarSexagem(n.id)} style={estilosBase.btnCinza}>Registrar sexagem</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}`

const reproducao = `import { useEffect, useState } from "react"
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
}`

const alimentacao = `import { useEffect, useState } from "react"
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
}`

fs.writeFileSync('src/pages/Ninhadas.jsx', ninhadas, 'utf8')
fs.writeFileSync('src/pages/Reproducao.jsx', reproducao, 'utf8')
fs.writeFileSync('src/pages/Alimentacao.jsx', alimentacao, 'utf8')
console.log('Todos os arquivos reescritos com sucesso!')