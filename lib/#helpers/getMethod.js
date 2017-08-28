import toObject from "./toObject.js"

export default function getMethod(value, property) {
    const obj = toObject(value)
    const method = Reflect.get(obj, property)
    if (method == null) {
        return undefined
    }

    if (typeof method !== 'function') {
        throw new Error(`${ value } does have a method ${ property }`)
    }

    return method
}
