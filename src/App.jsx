import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Residentes } from './views/residentes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Residentes/>
    </div>
  )
}

export default App
