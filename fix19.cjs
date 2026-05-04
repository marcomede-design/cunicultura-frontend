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
import Financeiro from "./pages/Financeiro"
import Cadastro from "./pages/Cadastro"
import Assinar from "./pages/Assinar"

function RotaProtegida({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/assinar" element={<RotaProtegida><Assinar /></RotaProtegida>} />
        <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
        <Route path="/animais" element={<RotaProtegida><Animais /></RotaProtegida>} />
        <Route path="/reproducao" element={<RotaProtegida><Reproducao /></RotaProtegida>} />
        <Route path="/ninhadas" element={<RotaProtegida><Ninhadas /></RotaProtegida>} />
        <Route path="/saude" element={<RotaProtegida><Saude /></RotaProtegida>} />
        <Route path="/alimentacao" element={<RotaProtegida><Alimentacao /></RotaProtegida>} />
        <Route path="/relatorios" element={<RotaProtegida><Relatorios /></RotaProtegida>} />
        <Route path="/forca-selecao" element={<RotaProtegida><ForcaSelecao /></RotaProtegida>} />
        <Route path="/engorda" element={<RotaProtegida><Engorda /></RotaProtegida>} />
        <Route path="/financeiro" element={<RotaProtegida><Financeiro /></RotaProtegida>} />
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
  const [usuario, setUsuario] = useState("")
  const [nomeGranja, setNomeGranja] = useState("")
  const [statusPlano, setStatusPlano] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setDados(res.data))
      .catch(() => setErro("Erro ao carregar dados"))
    api.get("/auth/me")
      .then(res => { setUsuario(res.data.nome); setNomeGranja(res.data.nomeGranja || "") })
      .catch(() => {})
    api.get("/pagamento/status")
      .then(res => setStatusPlano(res.data))
      .catch(() => {})
  }, [])

  function sair() {
    localStorage.removeItem("token")
    navigate("/")
  }

  if (erro) return React.createElement("p", { style: { padding: 24, color: cores.perigo } }, erro)
  if (!dados) return React.createElement("p", { style: { padding: 24, color: cores.textoSecundario } }, "Carregando...")

  return (
    React.createElement("div", { style: { ...estilosBase.container, position: "relative" } },
      usuario && React.createElement("div", { style: {
        position: "fixed", bottom: 16, right: 16, fontSize: 11,
        color: "rgba(45,106,79,0.3)", fontWeight: 500,
        pointerEvents: "none", zIndex: 9999, userSelect: "none"
      }}, "Licenciado para: " + (nomeGranja || usuario)),

      React.createElement("header", { style: estilosBase.header },
        React.createElement("div", null,
          React.createElement("h1", { style: estilosBase.logo }, nomeGranja || "Cunicultura"),
          nomeGranja && React.createElement("p", { style: { fontSize: 11, color: "rgba(255,255,255,0.6)", margin: 0 } }, usuario)
        ),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
          React.createElement("button", { onClick: sair, style: estilosBase.sairBtn }, "Sair")
        )
      ),

      statusPlano && statusPlano.emTeste && statusPlano.diasRestantesTeste <= 5 && React.createElement("div", {
        style: { background: "#faeeda", borderBottom: "1px solid #f0c060", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }
      },
        React.createElement("p", { style: { fontSize: 13, color: "#633806", margin: 0 } },
          "Periodo de teste: " + statusPlano.diasRestantesTeste + " dia(s) restantes"
        ),
        React.createElement("button", { onClick: () => navigate("/assinar"), style: { background: "#ba7517", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 500 } }, "Assinar agora")
      ),

      statusPlano && statusPlano.testeExpirado && !statusPlano.planoAtivo && React.createElement("div", {
        style: { background: "#fcebeb", borderBottom: "1px solid #e24b4a", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }
      },
        React.createElement("p", { style: { fontSize: 13, color: "#791f1f", margin: 0, fontWeight: 500 } },
          "Periodo de teste encerrado. Assine para continuar usando todos os recursos."
        ),
        React.createElement("button", { onClick: () => navigate("/assinar"), style: { background: cores.perigo, color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 500 } }, "Assinar agora")
      ),

      React.createElement("main", { style: estilosBase.main },
        React.createElement("p", { style: estilosBase.sectionTitle }, "Visao geral"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 16 } },
          React.createElement("div", { style: { ...estilosBase.metric, borderTop: "3px solid " + cores.primaria } },
            React.createElement("p", { style: estilosBase.metricLabel }, "Total de animais"),
            React.createElement("p", { style: estilosBase.metricValue }, dados.animais.total),
            React.createElement("p", { style: estilosBase.metricSub }, dados.animais.femeas + " femeas / " + dados.animais.machos + " machos")
          ),
          React.createElement("div", { style: estilosBase.metric },
            React.createElement("p", { style: estilosBase.metricLabel }, "Partos este mes"),
            React.createElement("p", { style: estilosBase.metricValue }, dados.reproducao.partosMes),
            React.createElement("p", { style: estilosBase.metricSub }, "media de " + dados.reproducao.mediaFilhotes + " filhotes")
          ),
          React.createElement("div", { style: estilosBase.metric },
            React.createElement("p", { style: estilosBase.metricLabel }, "Mortalidade"),
            React.createElement("p", { style: estilosBase.metricValue }, dados.mortalidade.taxaMortalidade + "%"),
            React.createElement("p", { style: estilosBase.metricSub }, "taxa de mortalidade geral")
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
          React.createElement("button", { onClick: () => navigate("/engorda"), style: estilosBase.navBtn }, "Lotes - Conv. Alimentar"),
          React.createElement("button", { onClick: () => navigate("/financeiro"), style: { ...estilosBase.navBtn, borderColor: "#ba7517", color: "#ba7517" } }, "Financeiro"),
          React.createElement("button", { onClick: () => navigate("/forca-selecao"), style: { ...estilosBase.navBtn, borderColor: cores.primaria, color: cores.primaria } }, "Forca de Selecao"),
          React.createElement("button", { onClick: () => navigate("/relatorios"), style: estilosBase.navBtn }, "Relatorios"),
          React.createElement("button", { onClick: () => navigate("/assinar"), style: { ...estilosBase.navBtn, borderColor: "#ba7517", color: "#ba7517", fontSize: 12 } },
            statusPlano && statusPlano.planoAtivo ? "Plano ativo" : "Assinar"
          )
        )
      )
    )
  )
}`

fs.writeFileSync('src/App.jsx', app, 'utf8')
fs.writeFileSync('src/pages/Dashboard.jsx', dashboard, 'utf8')
console.log('App.jsx e Dashboard.jsx atualizados!')