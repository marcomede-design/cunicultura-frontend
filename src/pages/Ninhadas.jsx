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
      await api.post(`/ninhadas/${id}/mortalidade`, { quantidade, causa })
      carregar()
    } catch {
      setErro("Erro ao registrar mortalidade")
    }
  }

  async function atualizarPeso(id) {
    const pesoMedioNascer = parseFloat(prompt("Peso médio ao nascer (g):"))
    const pesoMedioDesmame = parseFloat(prompt("Peso médio ao desmame (g):"))
    try {
      await api.patch(`/ninhadas/${id}`, { pesoMedioNascer, pesoMedioDesmame })
      carregar()
    } catch {
      setErro("Erro ao atualizar peso")
    }
  }

  async function registrarSexagem(id) {
    const machos = parseInt(prompt("Quantidade de machos:"))
    const femeas = parseInt(prompt("Quantidade de fêmeas:"))
    try {
      await api.patch(`/ninhadas/${id}`, { machos, femeas })
      carregar()
    } catch {
      setErro("Erro ao registrar sexagem")
    }
  }

  return (
    <div style={estilosBase.container}>
      <header style={estilosBase.header}>
        <button onClick={() => navigate("/dashboard")} style={estilosBase.voltarBtn}> Voltar</button>
        <h1 style={estilosBase.logo}> Ninhadas</h1>
        <div style={{ width: 80 }} />
      </header>