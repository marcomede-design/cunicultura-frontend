import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
}