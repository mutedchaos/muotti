"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMuotti = void 0;
const react_1 = require("react");
function useMuotti({ pristineState, onSubmit }) {
    const [state, updateValue] = react_1.useReducer((state, update) => (Object.assign(Object.assign({}, state), update)), pristineState);
    const handleSubmit = react_1.useCallback((e) => {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(state);
    }, [onSubmit, state]);
    const rawFields = Object.fromEntries(Object.keys(pristineState).map((key) => [
        key,
        {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            handleChange: react_1.useCallback((e) => {
                updateValue({ [key]: e.target.value });
            }, [key]),
        },
    ]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fields = react_1.useMemo(() => (Object.assign({}, rawFields)), [...Object.values(rawFields)]);
    return react_1.useMemo(() => ({ state, handleSubmit, fields }), [fields, handleSubmit, state]);
}
exports.useMuotti = useMuotti;
