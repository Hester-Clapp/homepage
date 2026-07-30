export class Environment {

    interface = {
        get: this.get.bind(this),
        compare: this.compare.bind(this),
        compareImmediate: this.compareImmediate.bind(this),
        swap: this.swap.bind(this),
        writeToAux: this.writeToAux.bind(this),
        readFromAux: this.readFromAux.bind(this)
    }

    constructor() {
        this.n = 0
        this.elements = []
        this.aux = []
        this.shuffled = false
    }

    initialise(n) {
        this.n = n
        for (let i = 0; i < n; i++) {
            this.elements[i] = i + 1
            this.aux[i] = 0
        }
        this.shuffled = false
    }

    async get(x) {
        return this.elements[x]
    }

    async compare(x, y) {
        const valX = this.elements[x]
        const valY = this.elements[y]

        if (valX < valY) return -1
        if (valX > valY) return 1
        else return 0
    }

    async compareImmediate(x, v) {
        const valX = this.elements[x]

        if (valX < v) return -1
        if (valX > v) return 1
        else return 0
    }

    async swap(x, y) {
        const tmp = this.elements[x]
        this.elements[x] = this.elements[y]
        this.elements[y] = tmp
    }

    async writeToAux(main, aux = main) {
        this.aux[aux] = this.elements[main]
    }

    async readFromAux(aux, main = aux) {
        this.elements[main] = this.aux[aux]
    }

    async shuffle() {
        for (let i = this.elements.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            await this.swap(i, j)
        }
    }

    async sort(algorithm) {
        if (!this.shuffled) await this.shuffle()
        await algorithm(this.n, this.interface)
        this.shuffled = false
    }
}