import React from 'react';
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
};
declare type Field<TState> = {
    [K in keyof TState]: FieldOfType<K>;
};
interface Muotti<TState> {
    state: TState;
    handleSubmit(e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): void;
    fields: Field<TState>;
}
export declare function useMuotti<TState>({ pristineState, onSubmit }: Options<TState>): Muotti<TState>;
export {};
