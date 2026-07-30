import { Environment } from "./Environment.js"

export class Tracker extends Environment {
    constructor() {
        super()
        this.accesses = 0
        this.comparisons = 0
        this.swaps = 0
    }

    async get(x) {
        this.accesses++
        return super.get(x)
    }

    async compare(x, y) {
        this.comparisons++
        this.accesses += 2
        return super.compare(x, y)
    }

    async compareImmediate(x, v) {
        this.comparisons++
        this.accesses += 2
        return super.compareImmediate(x, v)
    }

    async swap(x, y) {
        this.swaps++
        this.accesses += 2
        super.swap(x, y)
    }

    async writeToAux(main, aux = main) {
        this.swaps++
        this.accesses++
        super.writeToAux(main, aux = main)
    }

    async readFromAux(aux, main = aux) {
        this.swaps++
        this.accesses++
        super.readFromAux(aux, main)
    }

    async sort(algorithm) {
        this.accesses = 0
        this.comparisons = 0
        this.swaps = 0
        await algorithm(this.n, this.interface)
    }
}