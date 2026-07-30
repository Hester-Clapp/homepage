import { Environment } from "./Environment.js"

export class Visualisation extends Environment {
    constructor(delay, visualArray, visualAux) {
        super()
        this.delay = delay
        this.visualArray = visualArray
        this.visualAux = visualAux
    }

    initialise(n) {
        this.n = n
        this.elements = []
        for (let i = 0; i < n; i++) {
            let value = i + 1
            this.elements[i] = value
        }
        this.shuffled = false

        this.visualArray.innerHTML = ""
        this.visualAux.innerHTML = ""
        // this.visualArray.style.width = "50rem"
        // requestAnimationFrame(() => {
        //     const actualWidth = this.visualArray.getBoundingClientRect().width
        //     const itemWidth = actualWidth / n
        //     const targetWidth = (itemWidth < 1) ? n / Math.ceil(1 / itemWidth) : (Math.floor(actualWidth / itemWidth) * itemWidth)
        //     this.visualArray.style.width = `${targetWidth}px`
        // })

        for (let i = 0; i < n; i++) {
            const width = 1 / n;
            const height = this.elements[i] / n;
            this.visualArray.appendChild(this.createElement(i, width, height))
            this.visualAux.appendChild(this.createElement(i, width, 0))
        }
    }

    createElement(i, width, height) {
        const el = document.createElement("div")
        el.classList.add("item")
        el.classList.add(`item-${i}`)
        el.style.width = `${width * 100}%`
        el.style.left = `${width * i * 100}%`
        el.style.height = `${height * 100}%`
        el.style.background = `hsl(${height * 360}deg, 100%, 80%)`
        return el
    }

    async get(x) {
        const el = this.visualArray.querySelector(`.item-${x}`)
        el.classList.add("accessing")

        const value = super.get(x)

        return new Promise(resolve => {
            setTimeout(() => {
                el.classList.remove("accessing")

                resolve(value)
            }, this.delay)
        })
    }

    async compare(x, y) {
        const elX = this.visualArray.querySelector(`.item-${x}`)
        const elY = this.visualArray.querySelector(`.item-${y}`)
        elX.classList.add("comparing")
        elY.classList.add("comparing")

        return new Promise(resolve => {
            setTimeout(() => {
                elX.classList.remove("comparing")
                elY.classList.remove("comparing")

                resolve(super.compare(x, y))
            }, this.delay)
        })
    }

    async compareImmediate(x, v) {
        const el = this.visualArray.querySelector(`.item-${x}`)
        el.classList.add("accessing")

        const result = super.compareImmediate(x, v)

        return new Promise(resolve => {
            setTimeout(() => {
                el.classList.remove("accessing")

                resolve(result)
            }, this.delay)
        })
    }

    async writeToAux(main, aux = main) {
        super.writeToAux(main, aux)
        const elM = this.visualArray.querySelector(`.item-${main}`)
        const elA = this.visualAux.querySelector(`.item-${aux}`)

        elM.classList.add("copying")
        elA.classList.add("copying")

        elA.style.transition = `height ${this.delay}ms`
        elA.style.height = elM.style.height
        elA.style.background = elM.style.background

        return new Promise(resolve => {
            setTimeout(() => {
                elM.classList.remove("copying")
                elA.classList.remove("copying")
                elM.style.transition = "none"
                elA.style.transition = "none"

                resolve()
            }, this.delay)
        })
    }

    async readFromAux(aux, main = aux) {
        super.readFromAux(aux, main)
        const elM = this.visualArray.querySelector(`.item-${main}`)
        const elA = this.visualAux.querySelector(`.item-${aux}`)

        elM.classList.add("copying")
        elA.classList.add("copying")

        elM.style.transition = `height ${this.delay}ms`
        elM.style.height = elA.style.height
        elM.style.background = elA.style.background

        return new Promise(resolve => {
            setTimeout(() => {
                elM.classList.remove("copying")
                elA.classList.remove("copying")
                elM.style.transition = "none"
                elA.style.transition = "none"

                resolve()
            }, this.delay)
        })
    }

    async swap(x, y) {
        const elX = this.visualArray.querySelector(`.item-${x}`)
        const elY = this.visualArray.querySelector(`.item-${y}`)
        elX.classList.add("swapping")
        elY.classList.add("swapping")

        elX.classList.remove(`item-${x}`)
        elY.classList.remove(`item-${y}`)
        elX.classList.add(`item-${y}`)
        elY.classList.add(`item-${x}`)
        super.swap(x, y)
        // console.log(JSON.stringify(this.elements))

        elX.style.transition = `left ${this.delay}ms`
        elY.style.transition = `left ${this.delay}ms`

        requestAnimationFrame(() => {
            const tmp = elX.style.left
            elX.style.left = elY.style.left
            elY.style.left = tmp
        })

        return new Promise(resolve => {
            setTimeout(() => {
                elX.classList.remove("swapping")
                elY.classList.remove("swapping")
                elX.style.transition = "none"
                elY.style.transition = "none"

                resolve()
            }, this.delay)
        })
    }

    async shuffle() {
        const prevDelay = this.delay
        this.delay = 0
        await super.shuffle()
        this.delay = prevDelay
        this.shuffled = true
    }
}