const fs = require('fs')

const engorda = `import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

export default function Engorda() {
  const [lotes, setLotes] = useState([])
  const [loteAtivo, setLoteAtivo] = useState(null)
  const [aba, setAba] = useState("lotes")
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [qtdAnimais, setQtdAnimais] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  const [pesData, setPesData] = useState("")
  const [pesoTotal, setPesoTotal] = useState("")
  const [pesQtd, setPesQtd] = useState("")
  const [pesObs, setPesObs] = useState("")

  const [conData, setConData] = useState("")
  const [conTipo, setConTipo] = useState("racao_comercial")
  const [conMarca, setConMarca] = useState("")
  const [conQtd, setConQtd] = useState("")
  const [conUnidade, setConUnidade] = useState("kg")
  const [conObs, setConObs] = useState("")

  async function carregar() {
    try {
      const { data } = await api.get("/engorda/lotes")
      setLotes(data)
    } catch {
      setErro("Erro ao carregar lotes")
    }
  }

  useEffect(() => { carregar() }, [])

  async function criarLote(e) {
    e.preventDefault()
    try {
      await api.post("/engorda/lotes", { nome, descricao, dataInicio, qtdAnimais })
      setNome("")
      setDescricao("")
      setDataInicio("")
      setQtdAnimais("")
      carregar()
    } catch {
      setErro("Erro ao criar lote")
    }
  }

  async function encerrarLote(id) {
    if (!confirm("Encerrar este lote?")) return
    try {
      await api.patch("/engorda/lotes/" + id + "/encerrar")
      carregar()
    } catch {
      setErro("Erro ao encerrar lote")
    }
  }

  async function registrarPesagem(e) {
    e.preventDefault()
    try {
      await api.post("/engorda/lotes/" + loteAtivo.id + "/pesagens", { data: pesData, pesoTotal, qtdAnimais: pesQtd, observacoes: pesObs })
      setPesData("")
      setPesoTotal("")
      setPesQtd("")
      setPesObs("")
      carregar()
      const { data } = await api.get("/engorda/lotes/" + loteAtivo.id)
      setLoteAtivo(lotes.find(l => l.id === loteAtivo.id))
    } catch {
      setErro("Erro ao registrar pesagem")
    }
  }

  async function registrarConsumo(e) {
    e.preventDefault()
    try {
      await api.post("/engorda/lotes/" + loteAtivo.id + "/consumos", { data: conData, tipo: conTipo, marca: conMarca, quantidade: conQtd, unidade: conUnidade, observacoes: conObs })
      setConData("")
      setConMarca("")
      setConQtd("")
      setConObs("")
      carregar()
    } catch {
      setErro("Erro ao registrar consumo")
    }
  }

  function corCA(ca) {
    if (!ca) return { bg: "#f5f5f0", cor: cores.textoTerciario }
    const v = parseFloat(ca)
    if (v <= 3) return { bg: "#eaf3de", cor: "#27500a" }
    if (v <= 4.5) return { bg: "#faeeda", cor: "#633806" }
    return { bg: "#fcebeb", cor: "#791f1f" }
  }

  const loteSelecionado = loteAtivo ? lotes.find(l => l.id === loteAtivo.id) : null

  return (
    React.createElement("div", { style: estilosBase.container },
      React.createElement("header", { style: estilosBase.header },
        React.createElement("button", { onClick: () => navigate("/dashboard"), style: estilosBase.voltarBtn }, "Voltar"),
        React.createElement("h1", { style: estilosBase.logo }, "Conversao Alimentar"),
        React.createElement("div", { style: { width: 80 } })
      ),
      React.createElement("main", { style: { ...estilosBase.main, maxWidth: 800 } },
        erro && React.createElement("p", { style: estilosBase.erro }, erro),

        !loteAtivo && React.createElement("div", null,
          React.createElement("div", { style: estilosBase.card },
            React.createElement("p", { style: estilosBase.cardTitle }, "Novo lote de engorda"),
            React.createElement("form", { onSubmit: criarLote, style: { display: "flex", flexDirection: "column", gap: 10 } },
              React.createElement("input", { style: estilosBase.input, placeholder: "Nome do lote (ex: Lote Abril 2026)", value: nome, onChange: e => setNome(e.target.value), required: true }),
              React.createElement("input", { style: estilosBase.input, placeholder: "Descricao (opcional)", value: descricao, onChange: e => setDescricao(e.target.value) }),
              React.createElement("input", { style: estilosBase.input, type: "date", value: dataInicio, onChange: e => setDataInicio(e.target.value), required: true }),
              React.createElement("input", { style: estilosBase.input, type: "number", placeholder: "Quantidade de animais", value: qtdAnimais, onChange: e => setQtdAnimais(e.target.value) }),
              React.createElement("button", { style: estilosBase.btn, type: "submit" }, "Criar lote")
            )
          ),

          React.createElement("div", { style: estilosBase.card },
            React.createElement("p", { style: estilosBase.cardTitle }, "Lotes (" + lotes.length + ")"),
            lotes.length === 0 && React.createElement("p", { style: estilosBase.vazio }, "Nenhum lote cadastrado"),
            lotes.map(l => {
              const ca = corCA(l.conversaoAlimentar)
              return React.createElement("div", { key: l.id, style: { padding: "14px 0", borderBottom: "0.5px solid " + cores.borda } },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 } },
                  React.createElement("div", null,
                    React.createElement("h3", { style: { fontSize: 15, fontWeight: 500, color: cores.texto, margin: "0 0 2px" } }, l.nome),
                    React.createElement("p", { style: { fontSize: 12, color: cores.textoTerciario, margin: 0 } },
                      "Inicio: " + new Date(l.dataInicio).toLocaleDateString("pt-BR") +
                      (l.dataFim ? " - Fim: " + new Date(l.dataFim).toLocaleDateString("pt-BR") : " - Em andamento")
                    )
                  ),
                  React.createElement("span", { style: { ...estilosBase.badge, background: l.ativo ? "#eaf3de" : "#f0f0e8", color: l.ativo ? "#27500a" : cores.textoTerciario } },
                    l.ativo ? "Ativo" : "Encerrado"
                  )
                ),
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, marginBottom: 10 } },
                  React.createElement("div", { style: estilosBase.metric },
                    React.createElement("p", { style: estilosBase.metricLabel }, "Animais"),
                    React.createElement("p", { style: { ...estilosBase.metricValue, fontSize: 18 } }, l.qtdAnimais)
                  ),
                  React.createElement("div", { style: estilosBase.metric },
                    React.createElement("p", { style: estilosBase.metricLabel }, "Ganho (kg)"),
                    React.createElement("p", { style: { ...estilosBase.metricValue, fontSize: 18 } }, l.ganho)
                  ),
                  React.createElement("div", { style: estilosBase.metric },
                    React.createElement("p", { style: estilosBase.metricLabel }, "Consumo (kg)"),
                    React.createElement("p", { style: { ...estilosBase.metricValue, fontSize: 18 } }, l.totalConsumo)
                  ),
                  React.createElement("div", { style: { ...estilosBase.metric, background: ca.bg } },
                    React.createElement("p", { style: { ...estilosBase.metricLabel, color: ca.cor } }, "Conv. Alimentar"),
                    React.createElement("p", { style: { ...estilosBase.metricValue, fontSize: 18, color: ca.cor } }, l.conversaoAlimentar ? l.conversaoAlimentar + ":1" : "-")
                  )
                ),
                Object.keys(l.consumoPorMarca).length > 0 && React.createElement("div", { style: { marginBottom: 10 } },
                  React.createElement("p", { style: { fontSize: 11, color: cores.textoTerciario, margin: "0 0 6px", textTransform: "uppercase" } }, "Consumo por marca"),
                  React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
                    Object.entries(l.consumoPorMarca).map(function(entry) {
                      return React.createElement("span", { key: entry[0], style: { ...estilosBase.badge, background: "#e8f0e8", color: cores.primariaEscura } },
                        entry[0] + ": " + entry[1].toFixed(1) + "kg"
                      )
                    })
                  )
                ),
                React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
                  l.ativo && React.createElement("button", { onClick: () => setLoteAtivo(l), style: estilosBase.btnVerde }, "Registrar dados"),
                  l.ativo && React.createElement("button", { onClick: () => encerrarLote(l.id), style: estilosBase.btnCinza }, "Encerrar lote")
                )
              )
            })
          )
        ),

        loteAtivo && React.createElement("div", null,
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 } },
            React.createElement("button", { onClick: () => { setLoteAtivo(null); carregar() }, style: estilosBase.btnCinza }, "Voltar aos lotes"),
            React.createElement("h2", { style: { fontSize: 16, fontWeight: 500, color: cores.texto, margin: 0 } }, loteAtivo.nome)
          ),

          React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16 } },
            React.createElement("button", { onClick: () => setAba("pesagem"), style: { ...estilosBase.btn, background: aba === "pesagem" ? cores.primaria : cores.fundoSecundario, color: aba === "pesagem" ? "#fff" : cores.texto, width: "auto", padding: "8px 16px" } }, "Pesagem"),
            React.createElement("button", { onClick: () => setAba("consumo"), style: { ...estilosBase.btn, background: aba === "consumo" ? cores.primaria : cores.fundoSecundario, color: aba === "consumo" ? "#fff" : cores.texto, width: "auto", padding: "8px 16px" } }, "Consumo")
          ),

          aba === "pesagem" && React.createElement("div", { style: estilosBase.card },
            React.createElement("p", { style: estilosBase.cardTitle }, "Registrar pesagem"),
            React.createElement("form", { onSubmit: registrarPesagem, style: { display: "flex", flexDirection: "column", gap: 10 } },
              React.createElement("input", { style: estilosBase.input, type: "date", value: pesData, onChange: e => setPesData(e.target.value), required: true }),
              React.createElement("input", { style: estilosBase.input, type: "number", step: "0.01", placeholder: "Peso total do lote (kg)", value: pesoTotal, onChange: e => setPesoTotal(e.target.value), required: true }),
              React.createElement("input", { style: estilosBase.input, type: "number", placeholder: "Quantidade de animais", value: pesQtd, onChange: e => setPesQtd(e.target.value), required: true }),
              React.createElement("input", { style: estilosBase.input, placeholder: "Observacoes (opcional)", value: pesObs, onChange: e => setPesObs(e.target.value) }),
              React.createElement("button", { style: estilosBase.btn, type: "submit" }, "Registrar pesagem")
            )
          ),

          aba === "consumo" && React.createElement("div", { style: estilosBase.card },
            React.createElement("p", { style: estilosBase.cardTitle }, "Registrar consumo"),
            React.createElement("form", { onSubmit: registrarConsumo, style: { display: "flex", flexDirection: "column", gap: 10 } },
              React.createElement("input", { style: estilosBase.input, type: "date", value: conData, onChange: e => setConData(e.target.value), required: true }),
              React.createElement("select", { style: estilosBase.input, value: conTipo, onChange: e => setConTipo(e.target.value) },
                React.createElement("option", { value: "racao_comercial" }, "Racao comercial"),
                React.createElement("option", { value: "racao_verde" }, "Racao verde"),
                React.createElement("option", { value: "feno" }, "Feno"),
                React.createElement("option", { value: "misto" }, "Misto (racao + natural)")
              ),
              conTipo === "racao_comercial" && React.createElement("input", { style: estilosBase.input, placeholder: "Marca da racao", value: conMarca, onChange: e => setConMarca(e.target.value) }),
              React.createElement("div", { style: { display: "flex", gap: 8 } },
                React.createElement("input", { style: { ...estilosBase.input, flex: 1 }, type: "number", step: "0.01", placeholder: "Quantidade", value: conQtd, onChange: e => setConQtd(e.target.value), required: true }),
                React.createElement("select", { style: { ...estilosBase.input, width: 80 }, value: conUnidade, onChange: e => setConUnidade(e.target.value) },
                  React.createElement("option", { value: "kg" }, "kg"),
                  React.createElement("option", { value: "g" }, "g")
                )
              ),
              React.createElement("input", { style: estilosBase.input, placeholder: "Observacoes (opcional)", value: conObs, onChange: e => setConObs(e.target.value) }),
              React.createElement("button", { style: estilosBase.btn, type: "submit" }, "Registrar consumo")
            )
          )
        )
      )
    )
  )
}`

fs.writeFileSync('src/pages/Engorda.jsx', engorda, 'utf8')
console.log('Engorda.jsx criado com sucesso!')