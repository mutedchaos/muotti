import { useCallback, useMemo, useReducer } from 'react';
export function useMuotti({ pristineState, onSubmit }) {
    const [state] = useReducer((state, update) => (Object.assign(Object.assign({}, state), update)), pristineState);
    const handleSubmit = useCallback((e) => {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(state);
    }, [onSubmit, state]);
    const fields = useMemo(() => Object.fromEntries(), []);
    return useMemo(() => ({ state, handleSubmit, fields }), [handleSubmit, state]);
}
