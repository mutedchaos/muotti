import React, { useEffect, useState } from 'react'
import './App.css'
import Simple from './Examples/Simple'
import Validation from './Examples/Validation'

const modules = [
  { label: 'Simple', component: Simple },
  { label: 'Validation', component: Validation },
]

function App() {
  const [active, setActive] = useState(localStorage.getItem('muotti-demo-selection') ?? 'Simple')
  const Component = modules.find((m) => m.label === active)!.component
  useEffect(() => {
    localStorage.setItem('muotti-demo-selection', active)
  }, [active])
  return (
    <div className="App">
      <div>
        <select value={active} onChange={(e) => setActive(e.target.value)}>
          {modules.map((mod) => (
            <option key={mod.label} value={mod.label}>
              {mod.label}
            </option>
          ))}
        </select>
        <hr />
        <Component />
      </div>
    </div>
  )
}

export default App
