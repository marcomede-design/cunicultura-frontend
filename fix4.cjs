const fs = require('fs')

const relatorios = `import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

export default function Relatorios() {
  const [dados, setDados] = useState(null)
  const [animais, setAnimais] = useState([])
  const [reproducoes, setReproducoes] = useState([])
  const [ninhadas, setNinhadas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function carregar() {
      try {
        const [dashRes, aniRes, repRes, ninRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/animais"),
          api.get("/reproducao"),
          api.get("/ninhadas")
        ])
        setDados(dashRes.data)
        setAnimais(aniRes.data)
        setReproducoes(repRes.data)
        setNinhadas(ninRes.data)
      } catch(e) {
        console.error("Erro ao carregar dados", e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  function gerarPDF() {
    const doc = new jsPDF()
    const hoje = new Date().toLocaleDateString("pt-BR")
    doc.setFontSize(18)
    doc.setTextColor(45, 106, 79)
    doc.text("Relatorio da Granja - Cunicultura", 14, 20)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("Gerado em: " + hoje, 14, 28)
    doc.setFontSize(13)
    doc.setTextColor(45, 106, 79)
    doc.text("Resumo Geral", 14, 40)
    if (dados) {
      autoTable(doc, {
        startY: 45,
        head: [["Indicador", "Valor"]],
        body: [
          ["Total de animais", dados.animais.total],
          ["Femeas", dados.animais.femeas],
          ["Machos", dados.animais.machos],
          ["Partos este mes", dados.reproducao.partosMes],
          ["Media de filhotes", dados.reproducao.mediaFilhotes],
          ["Taxa de mortalidade", dados.mortalidade.taxaMortalidade + "%"]
        ],
        theme: "grid",
        headStyles: { fillColor: [45, 106, 79] }
      })
    }
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(45, 106, 79)
    doc.text("Animais Cadastrados", 14, 20)
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Nome", "Sexo", "Cadastrado em"]],
      body: animais.map(a => [a.id, a.nome, a.sexo === "F" ? "Femea" : "Macho", new Date(a.createdAt).toLocaleDateString("pt-BR")]),
      theme: "grid",
      headStyles: { fillColor: [45, 106, 79] }
    })
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(45, 106, 79)
    doc.text("Reproducoes", 14, 20)
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Matriz", "Cobertura", "Prenhez", "Parto"]],
      body: reproducoes.map(r => [r.id, r.matriz ? r.matriz.nome : "", new Date(r.dataCobertura).toLocaleDateString("pt-BR"), r.confirmadaPrenhez ? "Sim" : "Nao", r.dataParto ? new Date(r.dataParto).toLocaleDateString("pt-BR") : "Pendente"]),
      theme: "grid",
      headStyles: { fillColor: [45, 106, 79] }
    })
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(45, 106, 79)
    doc.text("Ninhadas", 14, 20)
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Matriz", "Nascidos", "Vivos", "Mortalidade"]],
      body: ninhadas.map(n => [n.id, n.reproducao && n.reproducao.matriz ? n.reproducao.matriz.nome : "", n.totalNascidos, n.nascidosVivos, n.taxaMortalidade]),
      theme: "grid",
      headStyles: { fillColor: [45, 106, 79] }
    })
    doc.save("relatorio-cunicultura-" + hoje.replace(/\\//g, "-") + ".pdf")
  }

  function gerarExcel() {
    const wb = XLSX.utils.book_new()
    if (dados) {
      const resumo = [["Indicador", "Valor"], ["Total de animais", dados.animais.total], ["Femeas", dados.animais.femeas], ["Machos", dados.animais.machos], ["Partos este mes", dados.reproducao.partosMes], ["Media de filhotes", dados.reproducao.mediaFilhotes], ["Taxa de mortalidade", dados.mortalidade.taxaMortalidade + "%"]]
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumo), "Resumo")
    }
    const aniData = [["ID", "Nome", "Sexo", "Cadastrado em"]].concat(animais.map(a => [a.id, a.nome, a.sexo === "F" ? "Femea" : "Macho", new Date(a.createdAt).toLocaleDateString("pt-BR")]))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aniData), "Animais")
    const repData = [["ID", "Matriz", "Cobertura", "Prenhez", "Parto"]].concat(reproducoes.map(r => [r.id, r.matriz ? r.matriz.nome : "", new Date(r.dataCobertura).toLocaleDateString("pt-BR"), r.confirmadaPrenhez ? "Sim" : "Nao", r.dataParto ? new Date(r.dataParto).toLocaleDateString("pt-BR") : "Pendente"]))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(repData), "Reproducoes")
    const ninData = [["ID", "Matriz", "Nascidos", "Vivos", "Mortalidade"]].concat(ninhadas.map(n => [n.id, n.reproducao && n.reproducao.matriz ? n.reproducao.matriz.nome : "", n.totalNascidos, n.nascidosVivos, n.taxaMortalidade]))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ninData), "Ninhadas")
    const hoje = new Date().toLocaleDateString("pt-BR").replace(/\\//g, "-")
    XLSX.writeFile(wb, "relatorio-cunicultura-" + hoje + ".xlsx")
  }

  if (carregando) return React.createElement("p", { style: { padding: 24, color: cores.textoSecundario } }, "Carregando...")

  return (
    React.createElement("div", { style: estilosBase.container },
      React.createElement("header", { style: estilosBase.header },
        React.createElement("button", { onClick: () => navigate("/dashboard"), style: estilosBase.voltarBtn }, "Voltar"),
        React.createElement("h1", { style: estilosBase.logo }, "Relatorios"),
        React.createElement("div", { style: { width: 80 } })
      ),
      React.createElement("main", { style: { ...estilosBase.main, maxWidth: 700 } },
        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Exportar relatorios"),
          React.createElement("p", { style: { fontSize: 14, color: cores.textoSecundario, marginBottom: 16 } }, "Gere relatorios completos com dados de animais, reproducoes e ninhadas."),
          React.createElement("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" } },
            React.createElement("button", { onClick: gerarPDF, style: { ...estilosBase.btn, width: "auto", padding: "12px 24px" } }, "Baixar PDF"),
            React.createElement("button", { onClick: gerarExcel, style: { ...estilosBase.btnCinza, padding: "12px 24px" } }, "Baixar Excel")
          )
        ),
        dados && React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Resumo geral"),
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 } },
            [["Total de animais", dados.animais.total], ["Femeas", dados.animais.femeas], ["Machos", dados.animais.machos], ["Partos este mes", dados.reproducao.partosMes], ["Media filhotes", dados.reproducao.mediaFilhotes], ["Mortalidade", dados.mortalidade.taxaMortalidade + "%"]].map(function(item) {
              return React.createElement("div", { key: item[0], style: estilosBase.metric },
                React.createElement("p", { style: estilosBase.metricLabel }, item[0]),
                React.createElement("p", { style: { ...estilosBase.metricValue, fontSize: 20 } }, item[1])
              )
            })
          )
        ),
        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Animais (" + animais.length + ")"),
          animais.map(function(a) {
            return React.createElement("div", { key: a.id, style: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid " + cores.borda } },
              React.createElement("span", { style: { fontSize: 14, color: cores.texto } }, a.nome),
              React.createElement("span", { style: { ...estilosBase.badge, background: a.sexo === "F" ? "#fbeaf0" : "#e6f1fb", color: a.sexo === "F" ? "#72243e" : "#0c447c" } }, a.sexo === "F" ? "Femea" : "Macho")
            )
          })
        ),
        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Reproducoes (" + reproducoes.length + ")"),
          reproducoes.map(function(r) {
            return React.createElement("div", { key: r.id, style: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid " + cores.borda } },
              React.createElement("span", { style: { fontSize: 14, color: cores.texto } }, (r.matriz ? r.matriz.nome : "") + " - " + new Date(r.dataCobertura).toLocaleDateString("pt-BR")),
              React.createElement("span", { style: { ...estilosBase.badge, background: r.dataParto ? "#eaf3de" : "#faeeda", color: r.dataParto ? "#27500a" : "#633806" } }, r.dataParto ? "Parto ok" : "Em andamento")
            )
          })
        ),
        React.createElement("div", { style: estilosBase.card },
          React.createElement("p", { style: estilosBase.cardTitle }, "Ninhadas (" + ninhadas.length + ")"),
          ninhadas.map(function(n) {
            return React.createElement("div", { key: n.id, style: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid " + cores.borda } },
              React.createElement("span", { style: { fontSize: 14, color: cores.texto } }, "Ninhada #" + n.id + " - " + (n.reproducao && n.reproducao.matriz ? n.reproducao.matriz.nome : "")),
              React.createElement("span", { style: { ...estilosBase.badge, background: "#eaf3de", color: "#27500a" } }, n.nascidosVivos + " vivos")
            )
          })
        )
      )
    )
  )
}`

fs.writeFileSync('src/pages/Relatorios.jsx', relatorios, 'utf8')
console.log('Relatorios.jsx reescrito com sucesso!')