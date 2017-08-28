import isObject from "../#helpers/isObject.js"
import getMethod from "../#helpers/getMethod.js"

export default function getIterator(iterable) {
    const method = getMethod(iterable, Symbol.iterator)
    const iterator = Reflect.apply(method, iterable, [])
    if (!isObject(iterator)) {
        throw new TypeError(`${ iterator } is not an iterator`)
    }
    return iterator
}
