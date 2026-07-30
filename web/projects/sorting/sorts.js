async function forkJoin(...tasks) {
    await Promise.all(tasks)
}

export async function insertionSort(n, environment) {
    const { compare, swap } = environment

    for (let i = 0; i < n; i++) {
        for (let j = i; j > 0; j--) {
            if (await compare(j - 1, j) > 0) {
                await swap(j - 1, j)
            } else {
                break
            }
        }
    }
}

export async function oddEvenSort(n, environment) {
    const { compare, swap } = environment

    let swaps = 1
    async function swapIfNecessary(i) {
        if (await compare(i - 1, i) > 0) {
            swaps++
            await swap(i - 1, i)
        }
    }

    while (swaps > 0) {
        swaps = 0

        let odd = []
        for (let j = 1; j < n; j += 2) {
            odd.push(swapIfNecessary(j))
        }
        await forkJoin(...odd)

        let even = []
        for (let j = 2; j < n; j += 2) {
            even.push(swapIfNecessary(j))
        }
        await forkJoin(...even)
    }
}

export async function quickSort(n, environment) {
    const { compare, swap } = environment

    async function sort(from, to) {
        if (to - from <= 1) return

        const pivotIndex = await partition(from, to)
        sort(from, pivotIndex)
        sort(pivotIndex + 1, to)
    }

    async function partition(from, to) {
        const pivot = from
        let left = from + 1
        let right = to - 1

        let probingLeft = true

        while (left <= right) {
            if (probingLeft) {
                if (await compare(left, pivot) <= 0) left++
                else probingLeft = false
            } else {
                if (await compare(right, pivot) > 0) right--
                else {
                    probingLeft = true
                    swap(left, right)
                }
            }
        }

        swap(pivot, left - 1)

        return left - 1
    }

    await sort(0, n)
}

export async function mergeSort(n, environment) {
    const { compare, swap, writeToAux, readFromAux } = environment

    async function sort(from, to) {
        if (to - from <= 1) return

        const mid = (from + to) >> 1
        await forkJoin(
            sort(from, mid),
            sort(mid, to)
        )
        await merge(from, mid, to)
    }

    async function merge(from, mid, to) {
        let left = from
        let right = mid
        let i = from

        if (to - from <= 1) return
        if (to - from === 2 && await compare(from, mid) > 0) {
            await swap(from, mid)
            return
        }

        while (left < mid && right < to) {
            if (await compare(left, right) <= 0) {
                await writeToAux(left, i)
                left++
            } else {
                await writeToAux(right, i)
                right++
            }
            i++
        }

        while (left < mid) {
            writeToAux(left, i)
            left++
            i++
        }

        while (right < to) {
            writeToAux(right, i)
            right++
            i++
        }

        for (let i = from; i < to; i++) {
            readFromAux(i)
        }
    }

    await sort(0, n)
}

export async function heapSort(n, environment) {
    const { compare, swap } = environment

    let heapSize = n

    async function siftDown(parent = 0) {
        async function swapWith(child) {
            if (await compare(parent, child) < 0) {
                await swap(parent, child)
                siftDown(child)
            }
        }

        const leftChild = 2 * parent + 1
        const rightChild = 2 * parent + 2
        if (rightChild < heapSize) {
            if (leftChild < heapSize) {
                if (await compare(leftChild, rightChild) < 0) {
                    await swapWith(rightChild)
                } else await swapWith(leftChild)
            } else {
                swapWith(child)
            }
        }
    }

    for (let i = n; i >= 0; i--) {
        await siftDown(i)
    }

    for (let i = n - 1; i > 0; i--) {
        await swap(0, i)
        heapSize--
        await siftDown()
    }

    // if (await compare(0, 1) > 0) await swap(0, 1)
    await insertionSort(n, environment)
}

export async function shellSort(n, environment) {
    const { compare, swap } = environment

    async function insert(i, gap) {
        for (let j = i; j > gap; j -= gap) {
            if (await compare(j - gap, j) > 0) {
                await swap(j - gap, j)
            } else {
                break
            }
        }
    }

    for (let gap = n >> 1; gap > 1; gap >>= 1) {
        const queue = []

        for (let i = 0; i < n; i++) {
            if (queue.length > gap) await queue.shift()
            queue.push(insert(i, gap))
        }
    }

    await insertionSort(n, environment)
}

export async function strandSort(n, environment) {
    const { get, compare, compareImmediate, swap, readFromAux, writeToAux } = environment

    await sort()

    async function sort(sublistBase = 0) {
        if (sublistBase >= n) return

        let pointer = sublistBase
        let max = 0

        for (let i = sublistBase; i < n; i++) {
            if (await compareImmediate(i, max) >= 0) {
                max = await get(i)
                await swap(i, pointer)
                pointer++
            }
        }

        await merge(0, sublistBase, pointer)
        await sort(pointer)
    }

    async function merge(from, mid, to) {
        let left = from
        let right = mid
        let i = from

        if (to - from <= 1) return
        if (to - from === 2 && await compare(from, mid) > 0) {
            await swap(from, mid)
            return
        }

        while (left < mid && right < to) {
            if (await compare(left, right) <= 0) {
                await writeToAux(left, i)
                left++
            } else {
                await writeToAux(right, i)
                right++
            }
            i++
        }

        while (left < mid) {
            writeToAux(left, i)
            left++
            i++
        }

        while (right < to) {
            writeToAux(right, i)
            right++
            i++
        }

        for (let i = from; i < to; i++) {
            readFromAux(i)
        }
    }
}

export async function rotateMergeSort(n, environment) {
    const { compare, swap } = environment

    await sort(0, n)

    async function sort(from, to) {
        if (to - from <= 1) return

        const mid = (from + to) >> 1

        await forkJoin(
            sort(from, mid),
            sort(mid, to)
        )
        await merge(from, mid, to)
    }

    async function merge(from, mid, to) {
        if (from >= mid) return
        if (mid >= to) return

        const leftMid = (from + mid) >> 1

        // Binary search for the right midpoint
        let lower = mid
        let upper = to
        while (lower < upper) {
            const pivot = (lower + upper) >> 1
            if (await compare(leftMid, pivot) > 0) {
                lower = pivot + 1
            } else {
                upper = pivot
            }
        }
        const rightMid = lower

        // console.log(from, leftMid, mid, rightMid, to)

        if (rightMid === mid) {
            if (leftMid > from) await merge(leftMid, mid, to)
            return
        }

        await rotate(leftMid, mid, rightMid)

        const newMid = leftMid + rightMid - mid

        await forkJoin(
            merge(from, leftMid, newMid),
            merge(newMid, rightMid, to)
        )
    }

    async function rotate(from, mid, to) {
        if (from >= mid) return
        if (mid >= to) return

        await forkJoin(
            reverse(from, mid),
            reverse(mid, to)
        )
        await reverse(from, to)
    }

    async function reverse(from, to) {
        if (to - from <= 1) return

        let swaps = []
        const mid = (from + to) >> 1
        for (let i = from; i < mid; i++) {
            swaps.push(swap(i, to + from - i - 1))
        }
        await forkJoin(...swaps)
    }
}
