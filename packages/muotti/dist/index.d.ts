import React from 'react';
declare type ValidationResult<TState> = false | null | undefined | string | {
    blame: Array<keyof TState>;
    message: string;
};
interface Options<TState> {
    pristineState: TState;
    onSubmit?(state: TState): Promise<void> | void;
}
declare type FieldOfType<T> = {
    handleChange(e: {
        target: {
            value: T;
        };
    }): void;
    value: T;
    isValid: boolean;
    validationError: string | null;
    validationErrors: string[];
};
declare type Field<TState> = {
    [K in keyof TState]: FieldOfType<TState[K]>;
};
interface Muotti<TState> {
    state: TState;
    handleSubmit(e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): void;
    fields: Field<TState>;
    useValidationRule<T extends keyof TState>(field: T, rule: (value: TState[T], state: TState) => ValidationResult<TState>): void;
    useValidationRule(rule: (state: TState) => ValidationResult<TState>): void;
    isValid: boolean;
    otherValidationError: string | null;
    otherValidationErrors: string[];
    validationErrors: Array<{
        fields: Array<keyof TState>;
        message: string;
    }>;
}
export declare function useMuotti<TState>({ pristineState, onSubmit }: Options<TState>): Muotti<TState>;
export {};
