import { useEffect, useState } from "react"
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
        <h1 style={estilosBase.logo}>🐇 Cunicultura</h1>
        <button onClick={sair} style={estilosBase.sairBtn}>Sair</button>
      </header>

      <main style={estilosBase.main}>
        <p style={estilosBase.sectionTitle}>Visão geral</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 16 }}>
          <div style={{ ...estilosBase.metric, borderTop: `3px solid ${cores.primaria}` }}>
            <p style={estilosBase.metricLabel}>Total de animais</p>
            <p style={estilosBase.metricValue}>{dados.animais.total}</p>
            <p style={estilosBase.metricSub}>{dados.animais.femeas} fêmeas · {dados.animais.machos} machos</p>
          </div>
          <div style={estilosBase.metric}>
            <p style={estilosBase.metricLabel}>Partos este mês</p>
            <p style={estilosBase.metricValue}>{dados.reproducao.partosMes}</p>
            <p style={estilosBase.metricSub}>média {dados.reproducao.mediaFilhotes} filhotes</p>
          </div>
          <div style={estilosBase.metric}>
            <p style={estilosBase.metricLabel}>Taxa de mortalidade</p>
            <p style={estilosBase.metricValue}>{dados.mortalidade.taxaMortalidade}%</p>
            <p style={estilosBase.metricSub}>últimos 30 dias</p>
          </div>
          <div style={estilosBase.metric}>
            <p style={estilosBase.metricLabel}>Alertas ativos</p>
            <p style={estilosBase.metricValue}>{dados.alertas.length}</p>
            <p style={estilosBase.metricSub}>pendências</p>
          </div>
        </div>

        {dados.alertas.length > 0 && (
          <div style={estilosBase.card}>
            <p style={estilosBase.cardTitle}>Alertas</p>
            {dados.alertas.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `0.5px solid ${cores.borda}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 4, background: a.tipo === "danger" ? cores.perigo : a.tipo === "warning" ? "#ba7517" : cores.info }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 2px", color: cores.texto }}>{a.mensagem}</p>
                  <p style={{ fontSize: 12, color: cores.textoTerciario, margin: 0 }}>{a.detalhe}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={estilosBase.sectionTitle}>Módulos</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
          <button onClick={() => navigate("/animais")} style={estilosBase.navBtn}>🐇<br/>Animais</button>
          <button onClick={() => navigate("/reproducao")} style={estilosBase.navBtn}>🔁<br/>Reprodução</button>
          <button onClick={() => navigate("/ninhadas")} style={estilosBase.navBtn}>🍼<br/>Ninhadas</button>
          <button onClick={() => navigate("/saude")} style={estilosBase.navBtn}>🏥<br/>Saúde</button>
          <button onClick={() => navigate("/alimentacao")} style={estilosBase.navBtn}>🥬<br/>Alimentação</button>
        </div>
      </main>
    </div>
  )
}