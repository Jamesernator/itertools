import iteratorNext from "./next.js"

export default async function iteratorStep(iterator, ...args) {
    const result = await iteratorNext(iterator, ...args)
    if (result.done) {
        return false
    }
    return result
}
