import getIterator from "./iterator.js"
import iteratorClose from "./close.js"

export default function* using(...args) {
    const iterables = args.slice(0, args.length-1)
    const handler = args.slice(-1)[0]

    const iterators = []
    try {
        for (const iterable of iterables) {
            iterators.push(getIterator(iterable))
        }
        return yield* handler(...iterators)
    } finally {
        // Regardless of what happens we'll make sure we close all the iterators
        for (const iterator of iterators) {
            try {
                iteratorClose(iterator)
            } catch (_) {
                /* If closing an iterator fails we need not do anything */
            }
        }
    }
}
