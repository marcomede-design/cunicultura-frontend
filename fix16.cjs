const fs = require('fs')

const animais = `import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

const RACAS = ["Nova Zelandia", "Californiano", "Rex", "Angora", "Gigante de Flandres", "Mini Rex", "Lionhead", "Holland Lop", "Dutch", "Mestico", "Outro"]
const PELAGENS = ["Branco", "Preto", "Cinza", "Ruivo", "Marrom", "Malhado", "Champagne", "Azul", "Lince", "Outro"]

export default function Animais() {
  const [animais, setAnimais] = useState([])
  const [nome, setNome] = useState("")
  const [sexo, setSexo] = useState("F")
  const [raca, setRaca] = useState("")
  const [racaOutra, setRacaOutra] = useState("")
  const [pelagem, setPelagem] = useState("")
  const [pelagemOutra, setPelagemOutra] = useState("")
  const [castrado, setCastrado] = useState("")
  const [pesoAtual, setPesoAtual] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [veterinario, setVeterinario] = useState("")
  const [mostrarMais, setMostrarMais] = useState(false)
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
      await api.post("/animais", {
        nome, sexo,
        raca: racaFinal,
        pelagem: pelagemFinal,
        castrado: castrado === "" ? null : castrado === "true",
        pesoAtual: pesoAtual || null,
        dataNascimento: dataNascimento || null,
        veterinario: veterinario || null
      })
      setNome("")
      setSexo("F")
      setRaca("")
      setRacaOutra("")
      setPelagem("")
      setPelagemOutra("")
      setCastrado("")
      setPesoAtual("")
      setDataNascimento("")
      setVeterinario("")
      setMostrarMais(false)
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

  function AnimalItem({ a }) {
    return React.createElement("div", { style: { padding: "10px 0", borderBottom: "0.5px solid " + cores.borda } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
          React.createElement("span", { style: { ...estilosBase.badge, background: a.sexo === "F" ? "#fbeaf0" : "#e6f1fb", color: a.sexo === "F" ? "#72243e" : "#0c447c" } }, a.sexo),
          React.createElement("div", null,
            React.createElement("span", { style: { fontSize: 14, fontWeight: 500, color: cores.texto } }, a.nome),
            React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 } },
              a.raca && React.createElement("span", { style: { ...estilosBase.badge, background: "#e8f0e8", color: cores.primariaEscura, fontSize: 10 } }, a.raca),
              a.pelagem && React.createElement("span", { style: { ...estilosBase.badge, background: "#f5f0e8", color: "#633806", fontSize: 10 } }, a.pelagem),
              a.castrado !== null && a.castrado !== undefined && React.createElement("span", { style: { ...estilosBase.badge, background: "#f0f0f0", color: "#666", fontSize: 10 } }, a.castrado ? "Castrado" : "Inteiro"),
              a.pesoAtual && React.createElement("span", { style: { ...estilosBase.badge, background: "#e8f0e8", color: cores.primariaEscura, fontSize: 10 } }, a.pesoAtual + "kg"),
              a.dataNascimento && React.createElement("span", { style: { ...estilosBase.badge, background: "#f0f0f0", color: "#666", fontSize: 10 } }, new Date(a.dataNascimento).toLocaleDateString("pt-BR"))
            ),
            a.veterinario && React.createElement("p", { style: { fontSize: 11, color: cores.textoTerciario, margin: "2px 0 0" } }, "Vet: " + a.veterinario)
          )
        ),
        React.createElement("button", { onClick: () => excluir(a.id), style: estilosBase.btnVermelho }, "Excluir")
      )
    )
  }

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
            React.createElement("input", { style: estilosBase.input, placeholder: "Nome (ex: F-01 ou Bolinha)", value: nome, onChange: e => setNome(e.target.value), required: true }),
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

            React.createElement("button", { type: "button", onClick: () => setMostrarMais(!mostrarMais), style: { ...estilosBase.btnCinza, textAlign: "left", padding: "8px 14px" } },
              mostrarMais ? "Menos campos ▲" : "Mais campos (peso, nascimento, veterinario) ▼"
            ),

            mostrarMais && React.createElement(React.Fragment, null,
              React.createElement("select", { style: estilosBase.input, value: castrado, onChange: e => setCastrado(e.target.value) },
                React.createElement("option", { value: "" }, "Castrado? (opcional)"),
                React.createElement("option", { value: "false" }, "Nao castrado"),
                React.createElement("option", { value: "true" }, "Castrado")
              ),
              React.createElement("input", { style: estilosBase.input, type: "number", step: "0.01", placeholder: "Peso atual (kg)", value: pesoAtual, onChange: e => setPesoAtual(e.target.value) }),
              React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } },
                React.createElement("label", { style: { fontSize: 12, color: cores.textoSecundario } }, "Data de nascimento"),
                React.createElement("input", { style: estilosBase.input, type: "date", value: dataNascimento, onChange: e => setDataNascimento(e.target.value) })
              ),
              React.createElement("input", { style: estilosBase.input, placeholder: "Veterinario responsavel (opcional)", value: veterinario, onChange: e => setVeterinario(e.target.value) })
            ),

            React.createElement("button", { style: estilosBase.btn, type: "submit" }, "Cadastrar")
          ),
          erro && React.createElement("p", { style: estilosBase.erro }, erro)
        ),

        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Femeas (" + femeas.length + ")"),
          femeas.length === 0 && React.createElement("p", { style: estilosBase.vazio }, "Nenhuma femea cadastrada"),
          femeas.map(a => React.createElement(AnimalItem, { key: a.id, a: a }))
        ),

        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Machos (" + machos.length + ")"),
          machos.length === 0 && React.createElement("p", { style: estilosBase.vazio }, "Nenhum macho cadastrado"),
          machos.map(a => React.createElement(AnimalItem, { key: a.id, a: a }))
        )
      )
    )
  )
}`

fs.writeFileSync('src/pages/Animais.jsx', animais, 'utf8')
console.log('Animais.jsx atualizado com campos pet!')