function rpn(expression) {
    const precedence = {
        "^": 3,
        "*": 2,
        "/": 2,
        "+": 1,
        "-": 1
    }
    const functions = ["ln"]
    function toNumber(n) {
        if (n === "pi") return Math.PI
        if (n === "e") return Math.E
        return Number(n)
    }
    // expression is an array of tokens in normal infix mathematical notation (e.g. ["3", "*", "2", "+", "5"])
    let output = []
    let opStack = []
    for (let term of expression) {
        let num = toNumber(term)
        if (num) { // If the term is numeric, add it to the output
            output.push(num)
        } else if (functions.includes(term)) {
            opStack.push(term)
        } else if (term in precedence) {
            while ((precedence[opStack.at(-1)] || 0) >= precedence[term]) output.push(opStack.pop())
            opStack.push(term)
        } else if (term === ",") {
            while (opStack.at(-1) !== "(") output.push(opStack.pop())
        } else if (term === "(") {
            opStack.push("(")
        } else if (term === ")") {
            while (opStack.at(-1) !== "(") output.push(opStack.pop())
            opStack.pop()
            if (functions.includes(opStack.at(-1))) output.push(opStack.pop())
        }
    }
    while (opStack.length) output.push(opStack.pop())
    return output
}