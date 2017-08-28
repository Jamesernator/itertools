import isObject from "../#helpers/isObject.js"
import getMethod from "../#helpers/getMethod.js"
import iteratorNext from "./next.js"

const AsyncIteratorPrototype =
    Object.getPrototypeOf(
        Object.getPrototypeOf(
            Object.getPrototypeOf(
                async function*() { /* just get the prototype */ }()
            )
        )
    )

const syncIteratorField = Symbol('syncIterator')

const asyncFromSyncIteratorPrototype =
    Object.create(AsyncIteratorPrototype, {
        next: {
            enumerable: true,
            async value(nextValue) {
                const obj = this
                if (!isObject(obj) || !Reflect.has(obj, syncIteratorField)) {
                    throw new Error(`${ obj } is not a AsyncFromSyncIterator`)
                }
                const syncIterator = obj[syncIteratorField]
                const { value, done } = iteratorNext(syncIterator, nextValue)
                return {
                    value: await value,
                    done: Boolean(done),
                }
            }
        },

        return: {
            enumerable: true,
            async value(returnValue) {
                const obj = this
                if (!isObject(obj) || !Reflect.has(obj, syncIteratorField)) {
                    throw new Error(`${ obj } is not a AsyncFromSyncIterator`)
                }
                const syncIterator = obj[syncIteratorField]
                const return_ = getMethod(syncIterator, 'return')
                if (return_ === undefined) {
                    return {
                        value: returnValue,
                        done: true,
                    }
                }
                const returnResult = Reflect.apply(
                    return_,
                    syncIterator,
                    [returnValue],
                )
                if (!isObject(returnResult)) {
                    throw new TypeError(`${ returnResult } is not an iterator result`)
                }
                return {
                    value: await returnResult.value,
                    done: returnResult.done,
                }
            }
        },

        throw: {
            enumerable: true,
            async value(throwValue) {
                const obj = this
                if (!isObject(obj) || !Reflect.has(obj, syncIteratorField)) {
                    throw new Error(`${ obj } is not a AsyncFromSyncIterator`)
                }
                const syncIterator = obj[syncIteratorField]
                const throw_ = getMethod(syncIterator, 'throw')
                if (throw_ === undefined) {
                    throw throwValue
                }

                const throwResult = Reflect.apply(
                    throw_,
                    syncIterator,
                    [throwValue],
                )
                if (!isObject(throwResult)) {
                    throw new TypeError(`${ throwResult } is not an iterator result`)
                }
                return {
                    value: await throwResult.value,
                    done: throwResult.value,
                }
            }
        },

        [Symbol.toStringTag]: {
            enumerable: false,
            value: "Async-from-Sync Iterator",
        }
    })

// Why do we freeze? Because AsyncFromSyncIterator
// is a spec device we will prevent it being tampered with
Object.freeze(asyncFromSyncIteratorPrototype)

function createAsyncFromSyncIterator(syncIterator) {
    const asyncIterator = Object.create(asyncFromSyncIteratorPrototype)
    asyncIterator[syncIteratorField] = syncIterator
    return asyncIterator
}

export default function getIterator(iterable) {
    const method = getMethod(iterable, Symbol.asyncIterator)
    if (method === undefined) {
        const syncMethod = getMethod(iterable, Symbol.iterator)
        let syncIterator
        try {
            syncIterator = Reflect.apply(syncMethod, iterable, [])
        } catch (_) {
            throw new TypeError(`${ iterable } is not async iterable`)
        }
        return createAsyncFromSyncIterator(syncIterator)
    }
    const iterator = Reflect.apply(method, iterable, [])
    if (!isObject(iterator)) {
        throw new TypeError(`${ iterator } is not an iterator`)
    }
    return iterator
}
