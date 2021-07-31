import React, { useCallback, useMemo, useReducer, useState } from 'react'

export const unspecifiedField = Symbol('muotti-unspecified-field')

type ValidationErrors<TState, TValidationError> = Array<{ field: keyof TState | null; error: TValidationError }>
type ValidationResult<TState, TValidationError> = {
  [key in keyof TState]?: TValidationError
} & { [unspecifiedField]?: TValidationError }

interface Options<TState, TValidationError> {
  pristineState: TState
  onSubmit?(state: TState): Promise<void> | void
  validateFully?: boolean
  validation?:
    | Array<ValidationResult<TState, TValidationError>>
    | ((
        state: TState
      ) =>
        | Array<ValidationResult<TState, TValidationError>>
        | IterableIterator<ValidationResult<TState, TValidationError>>)
}

type FieldOfType<TValue, TValidationError> = {
  handleChange(e: { target: { value: TValue } }): void
  value: TValue
  isValid: boolean
  isDirty: boolean
  validationError: TValidationError | null
  validationErrors: TValidationError[]
}

type Field<TState, TValidationError> = {
  [K in keyof TState]: FieldOfType<TState[K], TValidationError>
}

interface Muotti<TState, TValidationError> {
  state: TState
  handleSubmit(e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): void
  fields: Field<TState, TValidationError>
  isValid: boolean
  otherValidationError: TValidationError | null
  otherValidationErrors: TValidationError[]
  validationErrors: ValidationErrors<TState, TValidationError>
}

export function useMuotti<TState, TValidationError = string>({
  pristineState,
  onSubmit,
  validateFully,
  validation,
}: Options<TState, TValidationError>): Muotti<TState, TValidationError> {
  const [state, updateValue] = useReducer(
    (state: TState, update: Partial<TState>) => ({ ...state, ...update }),
    pristineState
  )

  const [submitted, setSubmitted] = useState(false)
  const [dirtyFields, setDirtyFields] = useState<Array<keyof TState>>([])

  const allValidationErrors = useMemo(() => {
    if (!validation) return []
    const errors = Array.isArray(validation) ? validation : Array.from(validation(state))
    return errors.reduce((errorsSoFar, errorObject) => {
      // TODO: this is terrible use of reduce, make this cleaner
      for (const key of Object.keys(errorObject) as Array<keyof TState>) {
        errorsSoFar.push({ field: key, error: errorObject[key] as any })
      }
      if (unspecifiedField in errorObject) {
        errorsSoFar.push({ field: null, error: errorObject[unspecifiedField] as any })
      }
      return errorsSoFar
    }, [] as ValidationErrors<TState, TValidationError>)
  }, [state, validation])

  const anyValidationErrors = allValidationErrors.length > 0

  const handleSubmit = useCallback<Muotti<TState, TValidationError>['handleSubmit']>(
    (e) => {
      e?.preventDefault()
      setSubmitted(true)
      if (anyValidationErrors) return
      onSubmit?.(state)
    },
    [anyValidationErrors, onSubmit, state]
  )

  const relevantValidationErrors = useMemo<ValidationErrors<TState, TValidationError>>(() => {
    if (submitted || validateFully) return allValidationErrors

    return allValidationErrors.filter((error) => dirtyFields.includes(error.field as any))
  }, [allValidationErrors, dirtyFields, submitted, validateFully])

  const rawFields = Object.fromEntries(
    Object.keys(pristineState).map<[string, FieldOfType<any, TValidationError>]>((untypedKey) => {
      const key = untypedKey as keyof TState
      const fieldValidationErrors = relevantValidationErrors.filter((ve) => ve.field === key).map((ve) => ve.error)
      const isDirty = dirtyFields.includes(key)
      return [
        untypedKey,
        {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          handleChange: useCallback<FieldOfType<any, TValidationError>['handleChange']>(
            (e) => {
              updateValue({ [key]: e.target.value } as any)
              if (!isDirty) {
                setDirtyFields((old) => [...old, key])
              }
            },
            [key, isDirty]
          ),
          isDirty,
          isValid: fieldValidationErrors.length === 0,
          validationErrors: fieldValidationErrors,
          validationError: fieldValidationErrors[0] ?? null,
          value: state[key],
        },
      ]
    })
  )

  const fields = useMemo<Muotti<TState, TValidationError>['fields']>(
    () => ({ ...rawFields } as any),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(rawFields)]
  )
  const otherValidationErrors = useMemo<Muotti<TState, TValidationError>['otherValidationErrors']>(
    () => relevantValidationErrors.filter((x) => x.field === null).map((x) => x.error),
    [relevantValidationErrors]
  )
  return useMemo<Muotti<TState, TValidationError>>(() => {
    return {
      state,
      handleSubmit,
      fields,
      isValid: relevantValidationErrors.length === 0,
      otherValidationErrors: otherValidationErrors,
      otherValidationError: otherValidationErrors[0] ?? null,
      validationErrors: relevantValidationErrors,
    }
  }, [state, handleSubmit, fields, relevantValidationErrors, otherValidationErrors])
}
