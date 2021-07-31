"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMuotti = exports.unspecifiedField = void 0;
const react_1 = require("react");
exports.unspecifiedField = Symbol('muotti-unspecified-field');
function useMuotti({ pristineState, onSubmit, validateFully, validation, }) {
    const [state, updateValue] = react_1.useReducer((state, update) => (Object.assign(Object.assign({}, state), update)), pristineState);
    const [submitted, setSubmitted] = react_1.useState(false);
    const [dirtyFields, setDirtyFields] = react_1.useState([]);
    const allValidationErrors = react_1.useMemo(() => {
        if (!validation)
            return [];
        const errors = Array.isArray(validation) ? validation : Array.from(validation(state));
        return errors.reduce((errorsSoFar, errorObject) => {
            // TODO: this is terrible use of reduce, make this cleaner
            for (const key of Object.keys(errorObject)) {
                errorsSoFar.push({ field: key, error: errorObject[key] });
            }
            if (exports.unspecifiedField in errorObject) {
                errorsSoFar.push({ field: null, error: errorObject[exports.unspecifiedField] });
            }
            return errorsSoFar;
        }, []);
    }, [state, validation]);
    const anyValidationErrors = allValidationErrors.length > 0;
    const handleSubmit = react_1.useCallback((e) => {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        setSubmitted(true);
        if (anyValidationErrors)
            return;
        onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(state);
    }, [anyValidationErrors, onSubmit, state]);
    const relevantValidationErrors = react_1.useMemo(() => {
        if (submitted || validateFully)
            return allValidationErrors;
        return allValidationErrors.filter((error) => dirtyFields.includes(error.field));
    }, [allValidationErrors, dirtyFields, submitted, validateFully]);
    const rawFields = Object.fromEntries(Object.keys(pristineState).map((untypedKey) => {
        var _a;
        const key = untypedKey;
        const fieldValidationErrors = relevantValidationErrors.filter((ve) => ve.field === key).map((ve) => ve.error);
        const isDirty = dirtyFields.includes(key);
        return [
            untypedKey,
            {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                handleChange: react_1.useCallback((e) => {
                    updateValue({ [key]: e.target.value });
                    if (!isDirty) {
                        setDirtyFields((old) => [...old, key]);
                    }
                }, [key, isDirty]),
                isDirty,
                isValid: fieldValidationErrors.length === 0,
                validationErrors: fieldValidationErrors,
                validationError: (_a = fieldValidationErrors[0]) !== null && _a !== void 0 ? _a : null,
                value: state[key],
            },
        ];
    }));
    const fields = react_1.useMemo(() => (Object.assign({}, rawFields)), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(rawFields)]);
    const otherValidationErrors = react_1.useMemo(() => relevantValidationErrors.filter((x) => x.field === null).map((x) => x.error), [relevantValidationErrors]);
    return react_1.useMemo(() => {
        var _a;
        return {
            state,
            handleSubmit,
            fields,
            isValid: relevantValidationErrors.length === 0,
            otherValidationErrors: otherValidationErrors,
            otherValidationError: (_a = otherValidationErrors[0]) !== null && _a !== void 0 ? _a : null,
            validationErrors: relevantValidationErrors,
        };
    }, [state, handleSubmit, fields, relevantValidationErrors, otherValidationErrors]);
}
exports.useMuotti = useMuotti;
