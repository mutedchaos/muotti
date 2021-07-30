import { useMuotti } from 'muotti'
import { useMemo, useState } from 'react'
import { DebugLayout } from '../DebugPanel'

interface State {
  myValue: string
}

export default function Simple() {
  const pristineState = useMemo<State>(() => ({ myValue: '' }), [])
  const [submitted, setSubmitted] = useState<State | null>(null)
  const { state, fields, handleSubmit } = useMuotti({
    pristineState,
    onSubmit(state) {
      setSubmitted(state)
    },
  })
  return (
    <DebugLayout
      items={[
        { label: 'State', value: state },
        { label: 'Submitted', value: submitted },
      ]}
    >
      <form onSubmit={handleSubmit}>
        <label>
          Input:
          <input type="text" onChange={fields.myValue.handleChange} value={state.myValue} />
        </label>
        <button>Submit</button>
      </form>
    </DebugLayout>
  )
}
