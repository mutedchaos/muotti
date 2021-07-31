import React from 'react';
export declare const unspecifiedField: unique symbol;
declare type ValidationErrors<TState, TValidationError> = Array<{
    field: keyof TState | null;
    error: TValidationError;
}>;
declare type ValidationResult<TState, TValidationError> = {
    [key in keyof TState]?: TValidationError;
} & {
    [unspecifiedField]?: TValidationError;
};
interface Options<TState, TValidationError> {
    pristineState: TState;
    onSubmit?(state: TState): Promise<void> | void;
    validateFully?: boolean;
    validation?: Array<ValidationResult<TState, TValidationError>> | ((state: TState) => Array<ValidationResult<TState, TValidationError>> | IterableIterator<ValidationResult<TState, TValidationError>>);
}
declare type FieldOfType<TValue, TValidationError> = {
    handleChange(e: {
        target: {
            value: TValue;
        };
    }): void;
    value: TValue;
    isValid: boolean;
    isDirty: boolean;
    validationError: TValidationError | null;
    validationErrors: TValidationError[];
};
declare type Field<TState, TValidationError> = {
    [K in keyof TState]: FieldOfType<TState[K], TValidationError>;
};
interface Muotti<TState, TValidationError> {
    state: TState;
    handleSubmit(e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): void;
    fields: Field<TState, TValidationError>;
    isValid: boolean;
    otherValidationError: TValidationError | null;
    otherValidationErrors: TValidationError[];
    validationErrors: ValidationErrors<TState, TValidationError>;
}
export declare function useMuotti<TState, TValidationError = string>({ pristineState, onSubmit, validateFully, validation, }: Options<TState, TValidationError>): Muotti<TState, TValidationError>;
export {};
