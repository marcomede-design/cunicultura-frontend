const fs = require('fs')

const assinar = `import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

export default function Assinar() {
  const [status, setStatus] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [processando, setProcessando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/pagamento/status")
      .then(res => setStatus(res.data))
      .catch(() => navigate("/"))
      .finally(() => setCarregando(false))
  }, [])

  async function assinar(plano) {
    setProcessando(true)
    try {
      const { data } = await api.post("/pagamento/criar-preferencia", { plano })
      window.location.href = data.url
    } catch {
      alert("Erro ao processar pagamento. Tente novamente.")
      setProcessando(false)
    }
  }

  if (carregando) return React.createElement("p", { style: { padding: 24, color: cores.textoSecundario } }, "Carregando...")

  return (
    React.createElement("div", { style: { ...estilosBase.container, minHeight: "100vh" } },
      React.createElement("header", { style: estilosBase.header },
        React.createElement("h1", { style: estilosBase.logo }, "Cunicultura"),
        React.createElement("button", { onClick: () => navigate("/dashboard"), style: estilosBase.sairBtn }, "Voltar")
      ),
      React.createElement("main", { style: { ...estilosBase.main, maxWidth: 700 } },

        status && status.emTeste && React.createElement("div", { style: { ...estilosBase.card, borderLeft: "4px solid " + cores.acento, marginBottom: 16 } },
          React.createElement("p", { style: { fontSize: 14, fontWeight: 500, color: cores.texto, margin: "0 0 4px" } },
            "Periodo de teste ativo"
          ),
          React.createElement("p", { style: { fontSize: 13, color: cores.textoSecundario, margin: 0 } },
            "Voce tem " + status.diasRestantesTeste + " dia(s) restantes de teste gratuito. Assine agora para nao perder o acesso!"
          )
        ),

        status && status.testeExpirado && !status.planoAtivo && React.createElement("div", { style: { ...estilosBase.card, borderLeft: "4px solid " + cores.perigo, marginBottom: 16 } },
          React.createElement("p", { style: { fontSize: 14, fontWeight: 500, color: cores.perigo, margin: "0 0 4px" } },
            "Periodo de teste encerrado"
          ),
          React.createElement("p", { style: { fontSize: 13, color: cores.textoSecundario, margin: 0 } },
            "Seu periodo de teste gratuito encerrou. Assine um plano para continuar usando o sistema."
          )
        ),

        status && status.planoAtivo && React.createElement("div", { style: { ...estilosBase.card, borderLeft: "4px solid " + cores.primaria, marginBottom: 16 } },
          React.createElement("p", { style: { fontSize: 14, fontWeight: 500, color: cores.primaria, margin: "0 0 4px" } },
            "Plano ativo - " + (status.planoTipo === "anual" ? "Anual" : "Mensal")
          ),
          React.createElement("p", { style: { fontSize: 13, color: cores.textoSecundario, margin: 0 } },
            "Assinatura ativa desde " + new Date(status.dataAssinatura).toLocaleDateString("pt-BR")
          )
        ),

        React.createElement("p", { style: { ...estilosBase.sectionTitle, marginBottom: 16 } }, "Escolha seu plano"),

        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } },

          React.createElement("div", { style: { ...estilosBase.card, textAlign: "center", border: "1px solid " + cores.borda } },
            React.createElement("p", { style: { fontSize: 12, fontWeight: 500, color: cores.textoSecundario, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" } }, "Plano Mensal"),
            React.createElement("p", { style: { fontSize: 32, fontWeight: 500, color: cores.texto, margin: "0 0 4px" } }, "R$ 29,90"),
            React.createElement("p", { style: { fontSize: 12, color: cores.textoTerciario, margin: "0 0 16px" } }, "por mes"),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 20, textAlign: "left" } },
              ["Todos os modulos inclusos", "Suporte por WhatsApp", "Atualizacoes automaticas", "Cancele quando quiser"].map(item =>
                React.createElement("p", { key: item, style: { fontSize: 13, color: cores.textoSecundario, margin: 0 } }, "✓ " + item)
              )
            ),
            React.createElement("button", {
              onClick: () => assinar("mensal"),
              disabled: processando || status.planoAtivo,
              style: { ...estilosBase.btn, opacity: processando || status.planoAtivo ? 0.6 : 1 }
            }, processando ? "Processando..." : status.planoAtivo ? "Plano ativo" : "Assinar mensalmente")
          ),

          React.createElement("div", { style: { ...estilosBase.card, textAlign: "center", border: "2px solid " + cores.primaria, position: "relative" } },
            React.createElement("div", { style: { position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: cores.primaria, color: "#fff", fontSize: 11, fontWeight: 500, padding: "2px 12px", borderRadius: 20 } }, "MAIS POPULAR"),
            React.createElement("p", { style: { fontSize: 12, fontWeight: 500, color: cores.textoSecundario, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" } }, "Plano Anual"),
            React.createElement("p", { style: { fontSize: 32, fontWeight: 500, color: cores.primaria, margin: "0 0 4px" } }, "R$ 249,00"),
            React.createElement("p", { style: { fontSize: 12, color: cores.textoTerciario, margin: "0 0 4px" } }, "por ano"),
            React.createElement("p", { style: { fontSize: 11, color: cores.primariaClara, margin: "0 0 16px", fontWeight: 500 } }, "Economia de R$ 109,80 (30% off)"),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 20, textAlign: "left" } },
              ["Todos os modulos inclusos", "Suporte prioritario por WhatsApp", "Atualizacoes automaticas", "2 meses gratis em relacao ao mensal"].map(item =>
                React.createElement("p", { key: item, style: { fontSize: 13, color: cores.textoSecundario, margin: 0 } }, "✓ " + item)
              )
            ),
            React.createElement("button", {
              onClick: () => assinar("anual"),
              disabled: processando || status.planoAtivo,
              style: { ...estilosBase.btn, background: cores.primaria, opacity: processando || status.planoAtivo ? 0.6 : 1 }
            }, processando ? "Processando..." : status.planoAtivo ? "Plano ativo" : "Assinar anualmente")
          )
        ),

        React.createElement("div", { style: { ...estilosBase.card, marginTop: 16, textAlign: "center" } },
          React.createElement("p", { style: { fontSize: 13, color: cores.textoSecundario, margin: "0 0 4px" } }, "Pagamento 100% seguro via Mercado Pago"),
          React.createElement("p", { style: { fontSize: 12, color: cores.textoTerciario, margin: 0 } }, "Cartao de credito, boleto, Pix e carteira digital")
        )
      )
    )
  )
}`

fs.writeFileSync('src/pages/Assinar.jsx', assinar, 'utf8')
console.log('Assinar.jsx criado!')