import React, { useCallback, useMemo, useReducer } from 'react'

interface Options<TState> {
  pristineState: TState
  onSubmit?(state: TState): Promise<void> | void
}

type FieldOfType<T> = {
  handleChange(e: { target: { value: T } }): void
}

type Field<TState> = {
  [K in keyof TState]: FieldOfType<TState[K]>
}

interface Muotti<TState> {
  state: TState
  handleSubmit(e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): void
  fields: Field<TState>
}

export function useMuotti<TState>({ pristineState, onSubmit }: Options<TState>): Muotti<TState> {
  const [state, updateValue] = useReducer(
    (state: TState, update: Partial<TState>) => ({ ...state, ...update }),
    pristineState
  )

  const handleSubmit = useCallback<Muotti<TState>['handleSubmit']>(
    (e) => {
      e?.preventDefault()
      onSubmit?.(state)
    },
    [onSubmit, state]
  )

  const rawFields = Object.fromEntries(
    Object.keys(pristineState).map<[string, FieldOfType<any>]>((key) => [
      key,
      {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        handleChange: useCallback<FieldOfType<any>['handleChange']>(
          (e) => {
            updateValue({ [key]: e.target.value } as any)
          },
          [key]
        ),
      },
    ])
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fields = useMemo<Muotti<TState>['fields']>(() => ({ ...rawFields } as any), [...Object.values(rawFields)])

  return useMemo<Muotti<TState>>(() => ({ state, handleSubmit, fields }), [fields, handleSubmit, state])
}
