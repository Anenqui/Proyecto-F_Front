import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Residentes } from './views/residentes'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NuevoResidente } from './components/agregar'
import { EditarResidente } from './components/editar'
import { SubirImagen } from './components/imagen'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Residentes />} />
        <Route path="/agregar" element={<NuevoResidente />} />
        <Route path="/editar/:id" element={<EditarResidente />} />
        <Route path="/imagen" element={<SubirImagen />} />
      </Routes>
    </Router>
  )
}

export default App
