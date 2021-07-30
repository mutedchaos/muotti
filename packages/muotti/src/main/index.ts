import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import compact from './utils/compact'

type ValidationResult<TState> = false | null | undefined | string | { blame: Array<keyof TState>; message: string }

interface Options<TState> {
  pristineState: TState
  onSubmit?(state: TState): Promise<void> | void
}

type FieldOfType<T> = {
  handleChange(e: { target: { value: T } }): void
  value: T
  isValid: boolean
  validationError: string | null
  validationErrors: string[]
}

type Field<TState> = {
  [K in keyof TState]: FieldOfType<TState[K]>
}

type ValidationRule<TState> = (state: TState) => ValidationResult<TState>

interface Muotti<TState> {
  state: TState
  handleSubmit(e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): void
  fields: Field<TState>
  useValidationRule<T extends keyof TState>(
    field: T,
    rule: (value: TState[T], state: TState) => ValidationResult<TState>
  ): void
  useValidationRule(rule: (state: TState) => ValidationResult<TState>): void

  isValid: boolean
  otherValidationError: string | null
  otherValidationErrors: string[]
  validationErrors: Array<{ fields: Array<keyof TState>; message: string }>
}

export function useMuotti<TState>({ pristineState, onSubmit }: Options<TState>): Muotti<TState> {
  const [state, updateValue] = useReducer(
    (state: TState, update: Partial<TState>) => ({ ...state, ...update }),
    pristineState
  )

  const [validationRules, setValidationRules] = useState<ValidationRule<TState>[]>([])
  const handleSubmit = useCallback<Muotti<TState>['handleSubmit']>(
    (e) => {
      e?.preventDefault()
      onSubmit?.(state)
    },
    [onSubmit, state]
  )

  const validationErrors = useMemo(() => compact(validationRules.map((rule) => rule(state))), [state, validationRules])

  const rawFields = Object.fromEntries(
    Object.keys(pristineState).map<[string, FieldOfType<any>]>((untypedKey) => {
      const key = untypedKey as keyof TState
      const fieldValidationErrors = (
        validationErrors.filter((ve) => ve && typeof ve !== 'string' && ve.blame.includes(key)) as Array<{
          blame: Array<keyof TState>
          message: string
        }>
      ).map((ve) => ve.message)
      return [
        untypedKey,
        {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          handleChange: useCallback<FieldOfType<any>['handleChange']>(
            (e) => {
              updateValue({ [key]: e.target.value } as any)
            },
            [key]
          ),
          isValid: fieldValidationErrors.length === 0,
          validationErrors: fieldValidationErrors,
          validationError: fieldValidationErrors[0] ?? null,
          value: state[key],
        },
      ]
    })
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fields = useMemo<Muotti<TState>['fields']>(() => ({ ...rawFields } as any), [...Object.values(rawFields)])

  const useValidationRule = useCallback<Muotti<TState>['useValidationRule']>(
    (
      ...args:
        | [keyof TState, (field: any, state: TState) => ValidationResult<TState>]
        | [(state: TState) => ValidationResult<TState>]
    ) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const arg0 = args[0]
        const arg1 = args[1]
        if (typeof arg0 === 'function') {
          setValidationRules((old) => [...old, arg0])
          return () => {
            setValidationRules((old) => old.filter((x) => x !== arg0))
          }
        } else {
          const field = arg0,
            rule = arg1
          if (!rule) throw new Error('Invalid rule')
          const ruleFn: ValidationRule<TState> = (state) => {
            const output = rule(state[field], state)
            if (output && typeof output === 'string') {
              return { blame: [field], message: output }
            }
          }
          setValidationRules((old) => [...old, ruleFn])
          return () => {
            setValidationRules((old) => old.filter((x) => x !== ruleFn))
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [state, args[0], args[1]])
    },
    [state]
  )
  const formattedValidationErrors = useMemo(
    () =>
      validationErrors.map((ve) =>
        typeof ve === 'string' ? { fields: [], message: ve } : { fields: ve.blame, message: ve.message }
      ),
    []
  )

  return useMemo<Muotti<TState>>(() => {
    const otherValidationErrors = validationErrors.filter((x) => typeof x === 'string') as string[]
    return {
      state,
      handleSubmit,
      fields,
      useValidationRule,
      isValid: validationErrors.length === 0,
      otherValidationErrors,
      otherValidationError: otherValidationErrors[0] ?? null,
      validationErrors: formattedValidationErrors,
    }
  }, [fields, formattedValidationErrors, handleSubmit, state, useValidationRule, validationErrors])
}
