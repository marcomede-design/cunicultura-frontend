const fs = require('fs')

const financeiro = `import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

export default function Financeiro() {
  const [dados, setDados] = useState(null)
  const [tipo, setTipo] = useState("custo")
  const [categoria, setCategoria] = useState("racao")
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [data, setData] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [erro, setErro] = useState("")
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [ano, setAno] = useState(hoje.getFullYear())
  const navigate = useNavigate()

  const categoriasCusto = ["racao", "medicamento", "mao_de_obra", "equipamento", "energia", "agua", "transporte", "outro"]
  const categoriasReceita = ["venda_animais", "venda_carne", "venda_reproducao", "outro"]

  async function carregar() {
    try {
      const { data } = await api.get("/financeiro?mes=" + mes + "&ano=" + ano)
      setDados(data)
    } catch {
      setErro("Erro ao carregar dados")
    }
  }

  useEffect(() => { carregar() }, [mes, ano])

  async function lancar(e) {
    e.preventDefault()
    try {
      await api.post("/financeiro", { data, tipo, categoria, descricao, valor, observacoes })
      setDescricao("")
      setValor("")
      setObservacoes("")
      setData("")
      carregar()
    } catch {
      setErro("Erro ao lancar")
    }
  }

  async function excluir(id) {
    if (!confirm("Excluir este lancamento?")) return
    try {
      await api.delete("/financeiro/" + id)
      carregar()
    } catch {
      setErro("Erro ao excluir")
    }
  }

  const meses = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
  const categoriaLabel = { racao: "Racao", medicamento: "Medicamento", mao_de_obra: "Mao de obra", equipamento: "Equipamento", energia: "Energia", agua: "Agua", transporte: "Transporte", venda_animais: "Venda de animais", venda_carne: "Venda de carne", venda_reproducao: "Venda reproducao", outro: "Outro" }

  return (
    React.createElement("div", { style: estilosBase.container },
      React.createElement("header", { style: estilosBase.header },
        React.createElement("button", { onClick: () => navigate("/dashboard"), style: estilosBase.voltarBtn }, "Voltar"),
        React.createElement("h1", { style: estilosBase.logo }, "Financeiro"),
        React.createElement("div", { style: { width: 80 } })
      ),
      React.createElement("main", { style: { ...estilosBase.main, maxWidth: 800 } },
        erro && React.createElement("p", { style: estilosBase.erro }, erro),

        React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16, alignItems: "center" } },
          React.createElement("select", { style: { ...estilosBase.input, width: "auto" }, value: mes, onChange: e => setMes(parseInt(e.target.value)) },
            meses.map((m, i) => React.createElement("option", { key: i, value: i + 1 }, m))
          ),
          React.createElement("select", { style: { ...estilosBase.input, width: "auto" }, value: ano, onChange: e => setAno(parseInt(e.target.value)) },
            [2024, 2025, 2026, 2027].map(a => React.createElement("option", { key: a, value: a }, a))
          )
        ),

        dados && React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 16 } },
          React.createElement("div", { style: { ...estilosBase.metric, borderTop: "3px solid " + cores.primaria } },
            React.createElement("p", { style: estilosBase.metricLabel }, "Receitas"),
            React.createElement("p", { style: { ...estilosBase.metricValue, color: cores.primaria } }, "R$ " + dados.totalReceitas.toFixed(2))
          ),
          React.createElement("div", { style: { ...estilosBase.metric, borderTop: "3px solid " + cores.perigo } },
            React.createElement("p", { style: estilosBase.metricLabel }, "Custos"),
            React.createElement("p", { style: { ...estilosBase.metricValue, color: cores.perigo } }, "R$ " + dados.totalCustos.toFixed(2))
          ),
          React.createElement("div", { style: { ...estilosBase.metric, borderTop: "3px solid " + (dados.lucro >= 0 ? cores.primaria : cores.perigo) } },
            React.createElement("p", { style: estilosBase.metricLabel }, "Lucro"),
            React.createElement("p", { style: { ...estilosBase.metricValue, color: dados.lucro >= 0 ? cores.primaria : cores.perigo } }, "R$ " + dados.lucro.toFixed(2))
          )
        ),

        dados && Object.keys(dados.porCategoria).length > 0 && React.createElement("div", { style: { ...estilosBase.card, marginBottom: 16 } },
          React.createElement("p", { style: estilosBase.cardTitle }, "Por categoria"),
          React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
            Object.entries(dados.porCategoria).map(function(entry) {
              const isCusto = entry[1].tipo === "custo"
              return React.createElement("span", { key: entry[0], style: { ...estilosBase.badge, background: isCusto ? "#fcebeb" : "#eaf3de", color: isCusto ? "#791f1f" : "#27500a" } },
                (categoriaLabel[entry[0]] || entry[0]) + ": R$ " + entry[1].total.toFixed(2)
              )
            })
          )
        ),

        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Novo lancamento"),
          React.createElement("form", { onSubmit: lancar, style: { display: "flex", flexDirection: "column", gap: 10 } },
            React.createElement("div", { style: { display: "flex", gap: 8 } },
              React.createElement("button", { type: "button", onClick: () => { setTipo("custo"); setCategoria("racao") }, style: { ...estilosBase.btn, width: "auto", padding: "8px 16px", background: tipo === "custo" ? cores.perigo : cores.fundoSecundario, color: tipo === "custo" ? "#fff" : cores.texto } }, "Custo"),
              React.createElement("button", { type: "button", onClick: () => { setTipo("receita"); setCategoria("venda_animais") }, style: { ...estilosBase.btn, width: "auto", padding: "8px 16px", background: tipo === "receita" ? cores.primaria : cores.fundoSecundario, color: tipo === "receita" ? "#fff" : cores.texto } }, "Receita")
            ),
            React.createElement("select", { style: estilosBase.input, value: categoria, onChange: e => setCategoria(e.target.value) },
              (tipo === "custo" ? categoriasCusto : categoriasReceita).map(c =>
                React.createElement("option", { key: c, value: c }, categoriaLabel[c] || c)
              )
            ),
            React.createElement("input", { style: estilosBase.input, placeholder: "Descricao", value: descricao, onChange: e => setDescricao(e.target.value), required: true }),
            React.createElement("input", { style: estilosBase.input, type: "number", step: "0.01", placeholder: "Valor (R$)", value: valor, onChange: e => setValor(e.target.value), required: true }),
            React.createElement("input", { style: estilosBase.input, type: "date", value: data, onChange: e => setData(e.target.value), required: true }),
            React.createElement("input", { style: estilosBase.input, placeholder: "Observacoes (opcional)", value: observacoes, onChange: e => setObservacoes(e.target.value) }),
            React.createElement("button", { style: estilosBase.btn, type: "submit" }, "Lancar")
          )
        ),

        dados && dados.lancamentos.length > 0 && React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Lancamentos (" + dados.lancamentos.length + ")"),
          dados.lancamentos.map(l =>
            React.createElement("div", { key: l.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid " + cores.borda } },
              React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 2 } },
                  React.createElement("span", { style: { ...estilosBase.badge, background: l.tipo === "custo" ? "#fcebeb" : "#eaf3de", color: l.tipo === "custo" ? "#791f1f" : "#27500a" } }, l.tipo === "custo" ? "Custo" : "Receita"),
                  React.createElement("span", { style: { fontSize: 14, fontWeight: 500, color: cores.texto } }, l.descricao)
                ),
                React.createElement("p", { style: { fontSize: 12, color: cores.textoTerciario, margin: 0 } },
                  new Date(l.data).toLocaleDateString("pt-BR") + " - " + (categoriaLabel[l.categoria] || l.categoria)
                )
              ),
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
                React.createElement("span", { style: { fontSize: 15, fontWeight: 500, color: l.tipo === "custo" ? cores.perigo : cores.primaria } },
                  "R$ " + l.valor.toFixed(2)
                ),
                React.createElement("button", { onClick: () => excluir(l.id), style: { ...estilosBase.btnVermelho, padding: "4px 8px", fontSize: 11 } }, "X")
              )
            )
          )
        ),

        dados && dados.lancamentos.length === 0 && React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.vazio }, "Nenhum lancamento em " + meses[mes - 1] + "/" + ano)
        )
      )
    )
  )
}`

fs.writeFileSync('src/pages/Financeiro.jsx', financeiro, 'utf8')
console.log('Financeiro.jsx criado com sucesso!')