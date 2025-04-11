import { useBuilder, useCondition, useInstance } from '@mpietrucha/instance'
import { createPipeline } from '@mpietrucha/pipeline'
import {
    castArray,
    isArray,
    isBoolean,
    isEmpty,
    isFunction,
    isInteger,
    isNumber,
    isObject,
    isString,
    negate,
} from 'lodash-es'

export class Collection {
    constructor(items = []) {
        this.collect(items)

        this.pipeline = createPipeline()

        useCondition(this, 'unsupported', 'supported')
    }

    collect(items) {
        this.items = castArray(items)

        return this
    }

    supported(callback) {
        return this.pipeline.supported(callback)
    }

    map(map) {
        this.unsupported(map) && this.throwInvalidMapError()

        this.pipeline.defer(map, (items, callback) => {
            return items.map(callback)
        })

        return this
    }

    filter(filter) {
        if (!filter) {
            return this.filter(Boolean)
        }

        this.unsupported(filter) && this.throwInvalidFilterError()

        this.pipeline.defer(filter, (items, callback) => {
            return items.filter(callback)
        })

        return this
    }

    reject(reject) {
        this.unsupported(reject) && this.throwInvalidRejectError()

        return this.filter(negate(reject))
    }

    strings() {
        return this.filter(isString)
    }

    arrays() {
        return this.filter(isArray)
    }

    objects() {
        return this.filter(isObject)
    }

    functions() {
        return this.filter(isFunction)
    }

    booleans() {
        return this.filter(isBoolean)
    }

    integers() {
        return this.filter(isInteger)
    }

    numbers() {
        return this.filter(isNumber)
    }

    filled() {
        return this.reject(isEmpty)
    }

    instances(input) {
        if (!input) {
            return this.objects()
        }

        const instance = useInstance(input)

        return this.filter(value => value instanceof instance)
    }

    get(...parameters) {
        return this.pipeline.get(this.items, ...parameters)
    }

    throwInvalidMapError() {
        throw new TypeError('Map callback must be a function')
    }

    throwInvalidFilterError() {
        throw new TypeError('Filter callback must be a function')
    }

    throwInvalidRejectError() {
        throw new TypeError('Reject callback must be a function')
    }
}

export const createCollection = useBuilder(Collection)
