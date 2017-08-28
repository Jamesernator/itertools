import isObject from "../#helpers/isObject.js"

export default function iteratorNext(iterator, ...args) {
    const nextValue = args.slice(0, 1)
    const result = iterator.next(...nextValue)
    if (!isObject(result)) {
        throw new TypeError(`${ result } is not a valid iterator result`)
    }
    return result
}
