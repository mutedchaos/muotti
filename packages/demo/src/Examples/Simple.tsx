import { useMuotti } from 'muotti'
import { useMemo } from 'react'
import { DebugLayout } from '../DebugPanel'

interface State {
  myValue: string
}

export default function Simple() {
  const pristineState = useMemo<State>(() => ({ myValue: '' }), [])
  const { state, fields, handleSubmit } = useMuotti({
    pristineState,
  })
  return (
    <DebugLayout items={[{ label: 'State', value: state }]}>
      <form onSubmit={handleSubmit}>
        <label>
          Input:
          <input type="text" onChange={fields.myValue.handleChange} value={state.myValue} />
        </label>
      </form>
    </DebugLayout>
  )
}
