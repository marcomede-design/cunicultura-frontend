const fs = require('fs')

const app = `import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Animais from "./pages/Animais"
import Reproducao from "./pages/Reproducao"
import Ninhadas from "./pages/Ninhadas"
import Saude from "./pages/Saude"
import Alimentacao from "./pages/Alimentacao"
import Relatorios from "./pages/Relatorios"
import ForcaSelecao from "./pages/ForcaSelecao"
import Engorda from "./pages/Engorda"

function RotaProtegida({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
        <Route path="/animais" element={<RotaProtegida><Animais /></RotaProtegida>} />
        <Route path="/reproducao" element={<RotaProtegida><Reproducao /></RotaProtegida>} />
        <Route path="/ninhadas" element={<RotaProtegida><Ninhadas /></RotaProtegida>} />
        <Route path="/saude" element={<RotaProtegida><Saude /></RotaProtegida>} />
        <Route path="/alimentacao" element={<RotaProtegida><Alimentacao /></RotaProtegida>} />
        <Route path="/relatorios" element={<RotaProtegida><Relatorios /></RotaProtegida>} />
        <Route path="/forca-selecao" element={<RotaProtegida><ForcaSelecao /></RotaProtegida>} />
        <Route path="/engorda" element={<RotaProtegida><Engorda /></RotaProtegida>} />
      </Routes>
    </BrowserRouter>
  )
}`

const dashboard = `import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

export default function Dashboard() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setDados(res.data))
      .catch(() => setErro("Erro ao carregar dados"))
  }, [])

  function sair() {
    localStorage.removeItem("token")
    navigate("/")
  }

  if (erro) return React.createElement("p", { style: { padding: 24, color: cores.perigo } }, erro)
  if (!dados) return React.createElement("p", { style: { padding: 24, color: cores.textoSecundario } }, "Carregando...")

  return (
    React.createElement("div", { style: estilosBase.container },
      React.createElement("header", { style: estilosBase.header },
        React.createElement("h1", { style: estilosBase.logo }, "Cunicultura"),
        React.createElement("button", { onClick: sair, style: estilosBase.sairBtn }, "Sair")
      ),
      React.createElement("main", { style: estilosBase.main },
        React.createElement("p", { style: estilosBase.sectionTitle }, "Visao geral"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 16 } },
          React.createElement("div", { style: { ...estilosBase.metric, borderTop: "3px solid " + cores.primaria } },
            React.createElement("p", { style: estilosBase.metricLabel }, "Total de animais"),
            React.createElement("p", { style: estilosBase.metricValue }, dados.animais.total),
            React.createElement("p", { style: estilosBase.metricSub }, dados.animais.femeas + " femeas - " + dados.animais.machos + " machos")
          ),
          React.createElement("div", { style: estilosBase.metric },
            React.createElement("p", { style: estilosBase.metricLabel }, "Partos este mes"),
            React.createElement("p", { style: estilosBase.metricValue }, dados.reproducao.partosMes),
            React.createElement("p", { style: estilosBase.metricSub }, "media " + dados.reproducao.mediaFilhotes + " filhotes")
          ),
          React.createElement("div", { style: estilosBase.metric },
            React.createElement("p", { style: estilosBase.metricLabel }, "Taxa de mortalidade"),
            React.createElement("p", { style: estilosBase.metricValue }, dados.mortalidade.taxaMortalidade + "%"),
            React.createElement("p", { style: estilosBase.metricSub }, "ultimos 30 dias")
          ),
          React.createElement("div", { style: estilosBase.metric },
            React.createElement("p", { style: estilosBase.metricLabel }, "Alertas ativos"),
            React.createElement("p", { style: estilosBase.metricValue }, dados.alertas.length),
            React.createElement("p", { style: estilosBase.metricSub }, "pendencias")
          )
        ),
        dados.alertas.length > 0 && React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Alertas"),
          dados.alertas.map(function(a, i) {
            return React.createElement("div", { key: i, style: { display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "0.5px solid " + cores.borda } },
              React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 4, background: a.tipo === "danger" ? cores.perigo : a.tipo === "warning" ? "#ba7517" : cores.info } }),
              React.createElement("div", null,
                React.createElement("p", { style: { fontSize: 13, fontWeight: 500, margin: "0 0 2px", color: cores.texto } }, a.mensagem),
                React.createElement("p", { style: { fontSize: 12, color: cores.textoTerciario, margin: 0 } }, a.detalhe)
              )
            )
          })
        ),
        React.createElement("p", { style: estilosBase.sectionTitle }, "Modulos"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 } },
          React.createElement("button", { onClick: () => navigate("/animais"), style: estilosBase.navBtn }, "Animais"),
          React.createElement("button", { onClick: () => navigate("/reproducao"), style: estilosBase.navBtn }, "Reproducao"),
          React.createElement("button", { onClick: () => navigate("/ninhadas"), style: estilosBase.navBtn }, "Ninhadas"),
          React.createElement("button", { onClick: () => navigate("/saude"), style: estilosBase.navBtn }, "Saude"),
          React.createElement("button", { onClick: () => navigate("/alimentacao"), style: estilosBase.navBtn }, "Alimentacao"),
          React.createElement("button", { onClick: () => navigate("/engorda"), style: estilosBase.navBtn }, "Conv. Alimentar"),
          React.createElement("button", { onClick: () => navigate("/forca-selecao"), style: { ...estilosBase.navBtn, borderColor: cores.primaria, color: cores.primaria } }, "Forca de Selecao"),
          React.createElement("button", { onClick: () => navigate("/relatorios"), style: estilosBase.navBtn }, "Relatorios")
        )
      )
    )
  )
}`

fs.writeFileSync('src/App.jsx', app, 'utf8')
fs.writeFileSync('src/pages/Dashboard.jsx', dashboard, 'utf8')
console.log('App.jsx e Dashboard.jsx atualizados!')