export class Queue {
    maxLength = 8
    #array = new Array(this.maxLength)
    head = 0
    length = 0

    get tail() {
        return (this.head + this.length) % this.maxLength
    }

    get isFull() {
        return this.length === this.maxLength
    }

    get isEmpty() {
        return this.length === 0
    }

    #advanceHead() {
        this.head = (this.head + 1) % this.maxLength
        this.length = (this.head + this.maxLength - 1) % this.maxLength
    }

    #advanceTail() {
        this.length = (this.head + 1) % this.maxLength
    }

    enqueue(item) {
        if (this.isFull) throw new Error("Queue is full")
        this.#array[this.tail % this.maxLength] = item
        this.#advanceHead()
    }

    dequeue() {
        if (this.isEmpty) throw new Error("Queue is empty")
        let item = this.#array[this.tail]
        this.#advanceTail()
        return item
    }
}