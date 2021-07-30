import { ReactNode, useState } from 'react'

interface Item {
  label: string
  value: any
}

interface Props {
  items: Item[]
}

export default function DebugPanel({ items }: Props) {
  return (
    <div className="debug-panel">
      {items.map((item) => (
        <DebugItem key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  )
}

function DebugItem({ label, value }: Item) {
  const [active, setActive] = useState(false)
  return (
    <div>
      <label>
        <input type="checkbox" checked={active} onClick={() => setActive((x) => !x)} /> {label}
      </label>
      {active && <div className="debug-entry">{JSON.stringify(value, null, 2)}</div>}
      <hr />
    </div>
  )
}

export function DebugLayout({ items, children }: Props & { children: ReactNode }) {
  return (
    <div className="debug-layout">
      <div>{children}</div>
      <DebugPanel items={items} />
    </div>
  )
}
