import isObject from "../#helpers/isObject.js"

export default async function iteratorNext(iterator, ...args) {
    const nextValue = args.slice(0, 1)
    const result = await iterator.next(...nextValue)
    if (!isObject(result)) {
        throw new TypeError(`${ result } is not a valid iterator result`)
    }
    return result
}
