const fs = require('fs')

const forcaSelecao = `import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

export default function ForcaSelecao() {
  const [ranking, setRanking] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/forca-selecao")
      .then(res => setRanking(res.data))
      .catch(() => setErro("Erro ao carregar ranking"))
      .finally(() => setCarregando(false))
  }, [])

  function corPontuacao(pontos) {
    if (pontos >= 150) return { bg: "#eaf3de", cor: "#27500a" }
    if (pontos >= 100) return { bg: "#faeeda", cor: "#633806" }
    return { bg: "#fcebeb", cor: "#791f1f" }
  }

  if (carregando) return React.createElement("p", { style: { padding: 24, color: cores.textoSecundario } }, "Calculando...")

  return (
    React.createElement("div", { style: estilosBase.container },
      React.createElement("header", { style: estilosBase.header },
        React.createElement("button", { onClick: () => navigate("/dashboard"), style: estilosBase.voltarBtn }, "Voltar"),
        React.createElement("h1", { style: estilosBase.logo }, "Forca de Selecao"),
        React.createElement("div", { style: { width: 80 } })
      ),
      React.createElement("main", { style: { ...estilosBase.main, maxWidth: 900 } },
        erro && React.createElement("p", { style: estilosBase.erro }, erro),

        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Como funciona"),
          React.createElement("p", { style: { fontSize: 13, color: cores.textoSecundario, margin: 0, lineHeight: 1.6 } },
            "A Forca de Selecao e calculada com base em: taxa de prenhez (25%), taxa de sucesso de parto (25%), media de nascidos vivos (25%), mortalidade e rusticidade (25%). Pontuacao minima de 100 indica matriz adequada para fornecer reprodutores."
          )
        ),

        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 16 } },
          React.createElement("div", { style: estilosBase.metric },
            React.createElement("p", { style: estilosBase.metricLabel }, "Total de matrizes"),
            React.createElement("p", { style: estilosBase.metricValue }, ranking.length)
          ),
          React.createElement("div", { style: estilosBase.metric },
            React.createElement("p", { style: estilosBase.metricLabel }, "Adequadas (>=100)"),
            React.createElement("p", { style: { ...estilosBase.metricValue, color: cores.primaria } }, ranking.filter(r => r.adequada).length)
          ),
          React.createElement("div", { style: estilosBase.metric },
            React.createElement("p", { style: estilosBase.metricLabel }, "Inadequadas (<100)"),
            React.createElement("p", { style: { ...estilosBase.metricValue, color: cores.perigo } }, ranking.filter(r => !r.adequada).length)
          )
        ),

        ranking.length === 0 && React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.vazio }, "Nenhuma femea cadastrada ainda.")
        ),

        ranking.map((r, i) =>
          React.createElement("div", { key: r.id, style: { ...estilosBase.card, borderLeft: "4px solid " + (r.adequada ? cores.primaria : cores.perigo) } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
                React.createElement("span", { style: { fontSize: 20, fontWeight: 500, color: cores.textoTerciario } }, "#" + (i + 1)),
                React.createElement("div", null,
                  React.createElement("h3", { style: { fontSize: 15, fontWeight: 500, color: cores.texto, margin: "0 0 2px" } }, r.nome),
                  r.raca && React.createElement("p", { style: { fontSize: 12, color: cores.textoTerciario, margin: 0 } }, r.raca)
                )
              ),
              React.createElement("div", { style: { textAlign: "right" } },
                React.createElement("p", { style: { fontSize: 24, fontWeight: 500, color: corPontuacao(r.forcaSelecao).cor, margin: "0 0 2px" } }, r.forcaSelecao),
                React.createElement("span", { style: { ...estilosBase.badge, background: corPontuacao(r.forcaSelecao).bg, color: corPontuacao(r.forcaSelecao).cor } },
                  r.adequada ? "Adequada" : "Inadequada"
                )
              )
            ),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8 } },
              [
                ["Partos", r.totalPartos],
                ["Coberturas", r.totalCoberturas],
                ["% Prenhez", r.percPrenhez + "%"],
                ["% Sucesso", r.percSucesso + "%"],
                ["Media NNV", r.mediaNNV],
                ["% Mort.", r.percMortalidade + "%"],
                ["Rusticidade", r.rusticidade]
              ].map(function(item) {
                return React.createElement("div", { key: item[0], style: { background: cores.fundoSecundario, borderRadius: 8, padding: "8px 10px" } },
                  React.createElement("p", { style: { fontSize: 11, color: cores.textoTerciario, margin: "0 0 2px" } }, item[0]),
                  React.createElement("p", { style: { fontSize: 16, fontWeight: 500, color: cores.texto, margin: 0 } }, item[1])
                )
              })
            )
          )
        )
      )
    )
  )
}`

fs.writeFileSync('src/pages/ForcaSelecao.jsx', forcaSelecao, 'utf8')
console.log('ForcaSelecao.jsx criado com sucesso!')