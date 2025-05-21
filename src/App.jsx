import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Residentes } from './views/residentes'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NuevoResidente } from './components/agregar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Residentes />} />
        <Route path="/agregar" element={<NuevoResidente />} />
      </Routes>
    </Router>
  )
}

export default App
