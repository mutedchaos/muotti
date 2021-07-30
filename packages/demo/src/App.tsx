import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Simple from './Examples/Simple'

const modules = [{ label: 'Simple', component: Simple }]

function App() {
  const [active, setActive] = useState('Simple')
  const Component = modules.find((m) => m.label === active)!.component
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
