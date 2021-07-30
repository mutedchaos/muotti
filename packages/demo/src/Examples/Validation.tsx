import { useMuotti } from 'muotti'
import { useMemo, useState } from 'react'
import { DebugLayout } from '../DebugPanel'

interface State {
  val1: string
  val2: string
}

export default function Validation() {
  const pristineState = useMemo<State>(() => ({ val1: '', val2: '' }), [])
  const [submitted, setSubmitted] = useState<State | null>(null)
  const { state, fields, handleSubmit, isValid, otherValidationError, useValidationRule } = useMuotti({
    pristineState,
    onSubmit(state) {
      setSubmitted(state)
    },
  })
  useValidationRule('val1', (val) => !val && 'Value is required')
  useValidationRule('val2', (val) => !val && 'Value is required')
  useValidationRule(
    (state) => +state.val1 + +state.val2 >= 100 && { blame: ['val1', 'val2'], message: 'Sum must be below 100' }
  )
  useValidationRule((state) => (state.val1.includes('9') ? 'Val1 cannot include a 9' : ''))
  return (
    <DebugLayout
      items={[
        { label: 'State', value: state },
        { label: 'Submitted', value: submitted },
      ]}
    >
      <form onSubmit={handleSubmit}>
        <label>
          Value 1:
          <input
            type="text"
            className={fields.val1.isValid ? 'valid' : 'invalid'}
            onChange={fields.val1.handleChange}
          />
        </label>
        <p className="error">{fields.val1.validationError}</p>
        <label>
          Value 2:
          <input
            type="text"
            className={fields.val2.isValid ? 'valid' : 'invalid'}
            onChange={fields.val2.handleChange}
          />
        </label>
        <p className="error">{fields.val2.validationError}</p>

        <button disabled={!isValid}>Submit</button>
        <p className="error">{otherValidationError}</p>
      </form>
    </DebugLayout>
  )
}
