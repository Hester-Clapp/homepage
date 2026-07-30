const precedence = {
    "^": 3,
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1
}
const functions = ["sqrt", "ln"]
// const simplifications = {
//     "+": function(a,b) {
//         if (a === 0) return b
//         if (a?.term0?.operator === "+" && toNumber(b)) {

//         }
//     }
// }
const evaluate = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
    "**": (x, y) => x ** y,
    "sqrt": (x, y) => Math.sqrt(x, y),
    "ln": (x, y) => Math.log(x, y),
}
function toNumber(n) {
    if (n === "pi") return Math.PI
    if (n === "e") return Math.E
    return Number(n)
}
function rpn(expression) {
    // expression is an array of tokens in normal infix mathematical notation (e.g. ["3", "*", "2", "+", "5"])
    let output = []
    let opStack = []
    for (let term of expression) {
        let num = toNumber(term)
        if (num) { // If the term is numeric, add it to the output
            output.push(num)
        } else if (functions.includes(term) || term === "x") {
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

let expression = rpn("sqrt ( 3 ) * 5 + 7 / 2 ^ 2".split(" "))
// let expression = rpn(prompt("Enter an expression (separate terms with spaces):").replaceAll("^", "**").replaceAll("√", "sqrt").split(" "))
let stack = []
for (let term of expression) {
    let num = toNumber(term)
    if (num) {
        stack.push(num)
    } else if (functions.includes(term)) {
        stack.push({
            operator: term,
            argument: stack.pop()
        })
    } else if (term in precedence) {
        stack.push({
            operator: term,
            term1: stack.pop(),
            term0: stack.pop()
        })
    }
}
function simplify(exp) {
    if (typeof exp === "object") {
        if ("argument" in exp) {
            exp.argument = simplify(exp.argument)
        }
        if ("term0" in exp) {
            exp.term0 = simplify(exp.term0)
            exp.term1 = simplify(exp.term1)
            if (toNumber(exp.term0) && toNumber(exp.term1)) {
                return evaluate(exp.term0, exp.term1)
            }
        }
    }
    return exp
}
console.log(stack[0])