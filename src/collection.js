import { InteractsWithArray } from '@mpietrucha/array'
import { useNegate } from '@mpietrucha/function'
import { is, not } from '@mpietrucha/is'
import { createPipeline } from '@mpietrucha/pipeline'
import { useBuilder } from '@mpietrucha/pkg'

export const useDefaultFilter = () => {
    return Boolean
}

export class Collection extends InteractsWithArray {
    constructor(items) {
        super(items)

        this.pipeline = createPipeline()

        InteractsWithArray.protected(this)
    }

    collect(items) {
        super.flush()

        return super.add(items)
    }

    map(map) {
        this.pipeline.unsupported(map) && this.throwInvalidMapError()

        this.pipeline.transform(map, (items, callback) => {
            return items.map(callback)
        })

        return this
    }

    filter(filter = useDefaultFilter()) {
        this.pipeline.unsupported(filter) && this.throwInvalidFilterError()

        this.pipeline.transform(filter, (items, callback) => {
            return items.filter(callback)
        })

        return this
    }

    reject(reject = useDefaultFilter()) {
        this.pipeline.unsupported(reject) && this.throwInvalidRejectError()

        return this.filter(useNegate(reject))
    }

    is(rule) {
        return this.filter(value => is(value, rule))
    }

    not(rule) {
        return this.filter(value => not(value, rule))
    }

    get(...parameters) {
        return this.pipeline.get(super.items(), ...parameters)
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
