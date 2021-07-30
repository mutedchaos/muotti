"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMuotti = void 0;
const react_1 = require("react");
const compact_1 = __importDefault(require("./utils/compact"));
function useMuotti({ pristineState, onSubmit }) {
    const [state, updateValue] = react_1.useReducer((state, update) => (Object.assign(Object.assign({}, state), update)), pristineState);
    const [validationRules, setValidationRules] = react_1.useState([]);
    const handleSubmit = react_1.useCallback((e) => {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(state);
    }, [onSubmit, state]);
    const validationErrors = react_1.useMemo(() => compact_1.default(validationRules.map((rule) => rule(state))), [state, validationRules]);
    const rawFields = Object.fromEntries(Object.keys(pristineState).map((untypedKey) => {
        var _a;
        const key = untypedKey;
        const fieldValidationErrors = validationErrors.filter((ve) => ve && typeof ve !== 'string' && ve.blame.includes(key)).map((ve) => ve.message);
        return [
            untypedKey,
            {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                handleChange: react_1.useCallback((e) => {
                    updateValue({ [key]: e.target.value });
                }, [key]),
                isValid: fieldValidationErrors.length === 0,
                validationErrors: fieldValidationErrors,
                validationError: (_a = fieldValidationErrors[0]) !== null && _a !== void 0 ? _a : null,
                value: state[key],
            },
        ];
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fields = react_1.useMemo(() => (Object.assign({}, rawFields)), [...Object.values(rawFields)]);
    const useValidationRule = react_1.useCallback((...args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        react_1.useEffect(() => {
            const arg0 = args[0];
            const arg1 = args[1];
            if (typeof arg0 === 'function') {
                setValidationRules((old) => [...old, arg0]);
                return () => {
                    setValidationRules((old) => old.filter((x) => x !== arg0));
                };
            }
            else {
                const field = arg0, rule = arg1;
                if (!rule)
                    throw new Error('Invalid rule');
                const ruleFn = (state) => {
                    const output = rule(state[field], state);
                    if (output && typeof output === 'string') {
                        return { blame: [field], message: output };
                    }
                };
                setValidationRules((old) => [...old, ruleFn]);
                return () => {
                    setValidationRules((old) => old.filter((x) => x !== ruleFn));
                };
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [state, args[0], args[1]]);
    }, [state]);
    const formattedValidationErrors = react_1.useMemo(() => validationErrors.map((ve) => typeof ve === 'string' ? { fields: [], message: ve } : { fields: ve.blame, message: ve.message }), []);
    return react_1.useMemo(() => {
        var _a;
        const otherValidationErrors = validationErrors.filter((x) => typeof x === 'string');
        return {
            state,
            handleSubmit,
            fields,
            useValidationRule,
            isValid: validationErrors.length === 0,
            otherValidationErrors,
            otherValidationError: (_a = otherValidationErrors[0]) !== null && _a !== void 0 ? _a : null,
            validationErrors: formattedValidationErrors,
        };
    }, [fields, formattedValidationErrors, handleSubmit, state, useValidationRule, validationErrors]);
}
exports.useMuotti = useMuotti;
