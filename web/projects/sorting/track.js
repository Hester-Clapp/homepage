import { Tracker } from "./Tracker.js"
import * as sorts from "./sorts.js"

addEventListener("message", (e) => {
    const { n, algorithm } = e.data
    const tracker = new Tracker()
    tracker.initialise(n)
    tracker.shuffle(n)
    console.log(`Running ${algorithm} with n=${n}`)
    tracker.sort(sorts[algorithm]).then(() => {
        postMessage({ n, accesses: tracker.accesses, comparisons: tracker.comparisons, swaps: tracker.swaps })
    })
})