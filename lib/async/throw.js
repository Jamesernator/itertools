import getMethod from "../#helpers/getMethod.js"
import isObject from "../#helpers/isObject.js"
import iteratorClose from "./close.js"

export default async function iteratorThrow(iterator, error) {
    const throw_ = getMethod(iterator, 'throw')
    if (throw_ === undefined) {
        try {
            await iteratorClose(iterator)
        } catch (_) {
            /* Just close the iterator doesn't matter what it does */
        }

        throw error
    } else {
        const result = await Reflect.apply(throw_, iterator, error)
        if (!isObject(result)) {
            throw new TypeError(`${ result } is not an iterator result`)
        }
        return result
    }
}
