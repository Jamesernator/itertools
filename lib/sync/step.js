import iteratorNext from "./next.js"

export default function iteratorStep(iterator, ...args) {
    const result = iteratorNext(iterator, ...args)
    if (result.done) {
        return false
    }
    return result
}
