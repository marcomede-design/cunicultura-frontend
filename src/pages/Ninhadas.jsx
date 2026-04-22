import { useEffect, useState } from "react"
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
}