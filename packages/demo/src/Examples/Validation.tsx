import { unspecifiedField, useMuotti } from 'muotti'
import { useCallback, useMemo, useState } from 'react'
import { DebugLayout } from '../DebugPanel'

interface State {
  val1: string
  val2: string
}

export default function Validation() {
  const pristineState = useMemo<State>(() => ({ val1: '', val2: '' }), [])
  const [submitted, setSubmitted] = useState<State | null>(null)
  const { state, fields, handleSubmit, isValid, otherValidationError, validationErrors } = useMuotti({
    pristineState,
    onSubmit(state) {
      setSubmitted(state)
    },
    validation: useCallback(function* (state: State) {
      if (!state.val1) yield { val1: 'Value is required' }
      if (!state.val2) yield { val2: 'Value is required' }
      if (+state.val1 + +state.val2 >= 100) {
        yield {
          val1: 'Sum must be below 100',
          val2: 'Sum must be below 100',
        }
      }
      if (state.val1.includes('9')) {
        yield { [unspecifiedField]: 'Val1 cannot include a 9' }
      }
    }, []),
  })

  return (
    <DebugLayout
      items={[
        { label: 'State', value: state },
        { label: 'Validation', value: validationErrors },
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
