import getMethod from "../#helpers/getMethod.js"
import isObject from "../#helpers/isObject.js"

export default function iteratorClose(iterator, ...value) {
    const return_ = getMethod(iterator, 'return')
    if (return_ === undefined) {
        return { done: true, value: undefined }
    } else {
        const result = Reflect.apply(return_, iterator, value.slice(0, 1))
        if (!isObject(result)) {
            throw new TypeError(`${ result } is not an iterator result`)
        }
        return result
    }
}
