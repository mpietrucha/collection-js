import { createCollection } from './dist/index.mjs'

console.log(
    createCollection([null, false, true, undefined, '', []]).filter().get(),
)
