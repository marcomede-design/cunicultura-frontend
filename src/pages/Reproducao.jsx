import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { cores, estilosBase } from "../styles/tema"

export default function Reproducao() {
  const [reproducoes, setReproducoes] = useState([])
  const [animais, setAnimais] = useState([])
  const [matrizId, setMatrizId] = useState("")
  const [reproducaoId, setReproducaoId] = useState("")
  const [dataCobertura, setDataCobertura] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  async function carregar() {
    try {
      const [repRes, aniRes] = await Promise.all([
        api.get("/reproducao"),
        api.get("/animais")
      ])
      setReproducoes(repRes.data)
      setAnimais(aniRes.data)
    } catch {
      setErro("Erro ao carregar dados")
    }
  }

  useEffect(() => { carregar() }, [])

  async function cadastrar(e) {
    e.preventDefault()
    try {
      await api.post("/reproducao", {
        matrizId: parseInt(matrizId),
        reproducaoId: parseInt(reproducaoId),
        dataCobertura,
        observacoes
      })
      setMatrizId("")
      setReproducaoId("")
      setDataCobertura("")
      setObservacoes("")
      carregar()
    } catch {
      setErro("Erro ao registrar cobertura")
    }
  }

  async function confirmarPrenhez(id) {
    try {
      await api.patch(`/reproducao/${id}/confirmar-prenhez`)
      carregar()
    } catch {
      setErro("Erro ao confirmar prenhez")
    }
  }

  async function registrarParto(id) {
    const totalNascidos = parseInt(prompt("Total de nascidos:"))
    const nascidosVivos = parseInt(prompt("Nascidos vivos:"))
    const nascidosMortos = totalNascidos - nascidosVivos
    try {
      await api.patch(`/reproducao/${id}/parto`, { totalNascidos, nascidosVivos, nascidosMortos })
      carregar()
    } catch {
      setErro("Erro ao registrar parto")
    }
  }

  const femeas = animais.filter(a => a.sexo === "F")
  const machos = animais.filter(a => a.sexo === "M")

  return (
    <div style={estilosBase.container}>
      <header style={estilosBase.header}>
        <button onClick={() => navigate("/dashboard")} style={estilosBase.voltarBtn}> Voltar</button>
        <h1 style={estilosBase.logo}> Reprodução</h1>
        <div style={{ width: 80 }} />
      </header>

      <main style={{ ...estilosBase.main, maxWidth: 700 }}>
        <div style={estilosBase.card}>
          <p style={estilosBase.cardTitle}>Registrar c