const fs = require('fs')

const animais = `import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

const RACAS = ["Nova Zelandia", "Californiano", "Rex", "Angorá", "Gigante de Flandres", "Mini Rex", "Lionhead", "Holland Lop", "Dutch", "Mestico", "Outro"]
const PELAGENS = ["Branco", "Preto", "Cinza", "Ruivo", "Marrom", "Malhado", "Champagne", "Azul", "Lince", "Outro"]

export default function Animais() {
  const [animais, setAnimais] = useState([])
  const [nome, setNome] = useState("")
  const [sexo, setSexo] = useState("F")
  const [raca, setRaca] = useState("")
  const [racaOutra, setRacaOutra] = useState("")
  const [pelagem, setPelagem] = useState("")
  const [pelagemOutra, setPelagemOutra] = useState("")
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
    const racaFinal = raca === "Outro" ? racaOutra : raca
    const pelagemFinal = pelagem === "Outro" ? pelagemOutra : pelagem
    try {
      await api.post("/animais", { nome, sexo, raca: racaFinal, pelagem: pelagemFinal })
      setNome("")
      setSexo("F")
      setRaca("")
      setRacaOutra("")
      setPelagem("")
      setPelagemOutra("")
      carregar()
    } catch {
      setErro("Erro ao cadastrar animal")
    }
  }

  async function excluir(id) {
    if (!confirm("Excluir este animal?")) return
    try {
      await api.delete("/animais/" + id)
      carregar()
    } catch {
      setErro("Erro ao excluir animal")
    }
  }

  const femeas = animais.filter(a => a.sexo === "F")
  const machos = animais.filter(a => a.sexo === "M")

  return (
    React.createElement("div", { style: estilosBase.container },
      React.createElement("header", { style: estilosBase.header },
        React.createElement("button", { onClick: () => navigate("/dashboard"), style: estilosBase.voltarBtn }, "Voltar"),
        React.createElement("h1", { style: estilosBase.logo }, "Animais"),
        React.createElement("div", { style: { width: 80 } })
      ),
      React.createElement("main", { style: { ...estilosBase.main, maxWidth: 600 } },
        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Cadastrar animal"),
          React.createElement("form", { onSubmit: cadastrar, style: { display: "flex", flexDirection: "column", gap: 10 } },
            React.createElement("input", { style: estilosBase.input, placeholder: "Nome (ex: F-01)", value: nome, onChange: e => setNome(e.target.value), required: true }),
            React.createElement("select", { style: estilosBase.input, value: sexo, onChange: e => setSexo(e.target.value) },
              React.createElement("option", { value: "F" }, "Femea"),
              React.createElement("option", { value: "M" }, "Macho")
            ),
            React.createElement("select", { style: estilosBase.input, value: raca, onChange: e => setRaca(e.target.value) },
              React.createElement("option", { value: "" }, "Selecione a raca (opcional)"),
              RACAS.map(r => React.createElement("option", { key: r, value: r }, r))
            ),
            raca === "Outro" && React.createElement("input", { style: estilosBase.input, placeholder: "Digite a raca", value: racaOutra, onChange: e => setRacaOutra(e.target.value) }),
            React.createElement("select", { style: estilosBase.input, value: pelagem, onChange: e => setPelagem(e.target.value) },
              React.createElement("option", { value: "" }, "Selecione a pelagem (opcional)"),
              PELAGENS.map(p => React.createElement("option", { key: p, value: p }, p))
            ),
            pelagem === "Outro" && React.createElement("input", { style: estilosBase.input, placeholder: "Digite a pelagem", value: pelagemOutra, onChange: e => setPelagemOutra(e.target.value) }),
            React.createElement("button", { style: estilosBase.btn, type: "submit" }, "Cadastrar")
          ),
          erro && React.createElement("p", { style: estilosBase.erro }, erro)
        ),

        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Femeas (" + femeas.length + ")"),
          femeas.length === 0 && React.createElement("p", { style: estilosBase.vazio }, "Nenhuma femea cadastrada"),
          femeas.map(a =>
            React.createElement("div", { key: a.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid " + cores.borda } },
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                React.createElement("span", { style: { ...estilosBase.badge, background: "#fbeaf0", color: "#72243e" } }, "F"),
                React.createElement("div", null,
                  React.createElement("span", { style: { fontSize: 14, fontWeight: 500, color: cores.texto } }, a.nome),
                  (a.raca || a.pelagem) && React.createElement("p", { style: { fontSize: 11, color: cores.textoTerciario, margin: 0 } },
                    [a.raca, a.pelagem].filter(Boolean).join(" - ")
                  )
                )
              ),
              React.createElement("button", { onClick: () => excluir(a.id), style: estilosBase.btnVermelho }, "Excluir")
            )
          )
        ),

        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Machos (" + machos.length + ")"),
          machos.length === 0 && React.createElement("p", { style: estilosBase.vazio }, "Nenhum macho cadastrado"),
          machos.map(a =>
            React.createElement("div", { key: a.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid " + cores.borda } },
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                React.createElement("span", { style: { ...estilosBase.badge, background: "#e6f1fb", color: "#0c447c" } }, "M"),
                React.createElement("div", null,
                  React.createElement("span", { style: { fontSize: 14, fontWeight: 500, color: cores.texto } }, a.nome),
                  (a.raca || a.pelagem) && React.createElement("p", { style: { fontSize: 11, color: cores.textoTerciario, margin: 0 } },
                    [a.raca, a.pelagem].filter(Boolean).join(" - ")
                  )
                )
              ),
              React.createElement("button", { onClick: () => excluir(a.id), style: estilosBase.btnVermelho }, "Excluir")
            )
          )
        )
      )
    )
  )
}`

fs.writeFileSync('src/pages/Animais.jsx', animais, 'utf8')
console.log('Animais.jsx atualizado com raca e pelagem!')