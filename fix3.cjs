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
      </Routes>
    </BrowserRouter>
  )
}`

const dashboard = `import { useEffect, useState } from "react"
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

  if (erro) return <p style={{ padding: 24, color: cores.perigo }}>{erro}</p>
  if (!dados) return <p style={{ padding: 24, color: cores.textoSecundario }}>Carregando...</p>

  return (
    <div style={estilosBase.container}>
      <header style={estilosBase.header}>
        <h1 style={estilosBase.logo}>Cunicultura</h1>
        <button onClick={sair} style={estilosBase.sairBtn}>Sair</button>
      </header>
      <main style={estilosBase.main}>
        <p style={estilosBase.sectionTitle}>Visao geral</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 16 }}>
          <div style={{ ...estilosBase.metric, borderTop: "3px solid " + cores.primaria }}>
            <p style={estilosBase.metricLabel}>Total de animais</p>
            <p style={estilosBase.metricValue}>{dados.animais.total}</p>
            <p style={estilosBase.metricSub}>{dados.animais.femeas + " femeas - " + dados.animais.machos + " machos"}</p>
          </div>
          <div style={estilosBase.metric}>
            <p style={estilosBase.metricLabel}>Partos este mes</p>
            <p style={estilosBase.metricValue}>{dados.reproducao.partosMes}</p>
            <p style={estilosBase.metricSub}>{"media " + dados.reproducao.mediaFilhotes + " filhotes"}</p>
          </div>
          <div style={estilosBase.metric}>
            <p style={estilosBase.metricLabel}>Taxa de mortalidade</p>
            <p style={estilosBase.metricValue}>{dados.mortalidade.taxaMortalidade + "%"}</p>
            <p style={estilosBase.metricSub}>ultimos 30 dias</p>
          </div>
          <div style={estilosBase.metric}>
            <p style={estilosBase.metricLabel}>Alertas ativos</p>
            <p style={estilosBase.metricValue}>{dados.alertas.length}</p>
            <p style={estilosBase.metricSub}>pendencias</p>
          </div>
        </div>
        {dados.alertas.length > 0 && (
          <div style={estilosBase.card}>
            <p style={estilosBase.cardTitle}>Alertas</p>
            {dados.alertas.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "0.5px solid " + cores.borda }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 4, background: a.tipo === "danger" ? cores.perigo : a.tipo === "warning" ? "#ba7517" : cores.info }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 2px", color: cores.texto }}>{a.mensagem}</p>
                  <p style={{ fontSize: 12, color: cores.textoTerciario, margin: 0 }}>{a.detalhe}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <p style={estilosBase.sectionTitle}>Modulos</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
          <button onClick={() => navigate("/animais")} style={estilosBase.navBtn}>Animais</button>
          <button onClick={() => navigate("/reproducao")} style={estilosBase.navBtn}>Reproducao</button>
          <button onClick={() => navigate("/ninhadas")} style={estilosBase.navBtn}>Ninhadas</button>
          <button onClick={() => navigate("/saude")} style={estilosBase.navBtn}>Saude</button>
          <button onClick={() => navigate("/alimentacao")} style={estilosBase.navBtn}>Alimentacao</button>
          <button onClick={() => navigate("/relatorios")} style={estilosBase.navBtn}>Relatorios</button>
        </div>
      </main>
    </div>
  )
}`

fs.writeFileSync('src/App.jsx', app, 'utf8')
fs.writeFileSync('src/pages/Dashboard.jsx', dashboard, 'utf8')
console.log('App.jsx e Dashboard.jsx atualizados!')