import getMethod from "../#helpers/getMethod.js"
import isObject from "../#helpers/isObject.js"
import iteratorClose from "./close.js"

export default function iteratorThrow(iterator, error) {
    const throw_ = getMethod(iterator, 'throw')
    if (throw_ === undefined) {
        try {
            iteratorClose(iterator)
        } catch (_) {
            /* Just close the iterator doesn't matter what it does */
        }

        throw error
    } else {
        const result = Reflect.apply(throw_, iterator, error)
        if (!isObject(result)) {
            throw new TypeError(`${ result } is not an iterator result`)
        }
        return result
    }
}
