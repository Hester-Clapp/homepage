const precedence = {
    "**": 3,
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1
}
const commutative = {
    "+": true,
    "*": true
}
const evaluate = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
    "**": (x, y) => x ** y,
    "sqrt": x => Math.sqrt(x),
    "ln": x => Math.log(x),
}
function toNumber(n) {
    if (n === "pi") return Math.PI
    if (n === "e") return Math.E
    return Number(n)
}
function infixToPostfix(expression) {
    // expression is an array of tokens in normal infix mathematical notation (e.g. ["3", "*", "2", "+", "5"])
    const output = []
    const opStack = []
    for (const token of expression) {
        const num = toNumber(token)
        if (num) { // If the term is numeric, add it to the output
            output.push(num)
        } else if (token === "x") {
            output.push(token)
        } else if (token in evaluate) {
            if (token in precedence) {
                while ((precedence[opStack.at(-1)] || 0) >= precedence[token]) output.push(opStack.pop())
            }
            opStack.push(token)
        } else if (token === ",") {
            while (opStack.at(-1) !== "(") output.push(opStack.pop())
        } else if (token === "(") {
            opStack.push("(")
        } else if (token === ")") {
            while (opStack.at(-1) !== "(") output.push(opStack.pop())
            opStack.pop()
            if (opStack.at(-1) in evaluate && !opStack.at(-1) in precedence) output.push(opStack.pop())
        }
    }
    while (opStack.length) output.push(opStack.pop())
    return output
}

function postfixToTree(exp) {
    const stack = []
    for (const term of exp) {
        const num = toNumber(term)
        if (num) {
            stack.push(num)
        } else if (term === "x") {
            stack.push(term)
        } else if (term in evaluate) {
            if (term in precedence) {
                stack.push({
                    operator: term,
                    term1: stack.pop(),
                    term0: stack.pop()
                })
            } else {
                stack.push({
                    operator: term,
                    argument: stack.pop()
                })
            }
        }
    }
    return stack[0]
}
// let expression = rpn(prompt("Enter an expression (separate terms with spaces):").replaceAll("^", "**").replaceAll("√", "sqrt").split(" "))
function treeToPostfix(exp) {
    if (typeof exp === "object") {
        if ("argument" in exp) return [...treeToPostfix(exp.argument), exp.operator]
        return [...treeToPostfix(exp.term0), ...treeToPostfix(exp.term1), exp.operator]
    }
    return [exp]
}

function differentiate(exp) {
    if (toNumber(exp)) return 0
    if (exp === "x") return 1
    if (typeof exp === "object") {
        switch (exp.operator) {
            case "+": return {
                operator: "+",
                term0: differentiate(exp.term0),
                term1: differentiate(exp.term1)
            }
            case "-": return {
                operator: "-",
                term0: differentiate(exp.term0),
                term1: differentiate(exp.term1)
            }
            case "*":
                if (exp.term0 === "x" && toNumber(exp.term1)) return exp.term1
                if (exp.term1 === "x" && toNumber(exp.term0)) return exp.term0
                return {
                    operator: "+",
                    term0: {
                        operator: "*",
                        term0: exp.term0,
                        term1: differentiate(exp.term1)
                    },
                    term1: {
                        operator: "*",
                        term0: differentiate(exp.term0),
                        term1: exp.term1
                    }
                }
            case "/": return {
                operator: "/",
                term0: {
                    operator: "+",
                    term0: {
                        operator: "*",
                        term0: exp.term0,
                        term1: differentiate(exp.term1)
                    },
                    term1: {
                        operator: "*",
                        term0: differentiate(exp.term0),
                        term1: exp.term1
                    }
                },
                term1: {
                    operator: "**",
                    term0: term1,
                    term1: 2
                }
            }
            case "**":
                if (exp.term1 === 1) return exp.term0
                if (exp.term1 === 2) return {
                    operator: "*",
                    term0: exp.term1,
                    term1: exp.term0
                }
                return {
                    operator: "*",
                    term0: exp.term1,
                    term1: {
                        operator: "**",
                        term0: exp.term0,
                        term1: exp.term1 - 1
                    }
                }
            case "ln": return {
                operator: "/",
                term0: differentiate(exp.argument),
                term1: exp.argument
            }
        }
    }
    throw new Error(`Failed to differentiate, invalid type ${exp}`)
}

function polynomial(exp) {
    if (typeof exp === "object") exp = treeToPostfix(exp)
    let stack = []
    for (const token of exp) {
        if (token === "x") stack.push({ operator: "x", coef: 1, power: 1 })
        else if (toNumber(token)) stack.push(token)
        if (token in precedence) {
            let term1 = stack.pop()
            let term0 = stack.pop()
            let num0 = toNumber(term0)
            let num1 = toNumber(term1)
            if (num0 && num1) stack.push(evaluate[token](num0, num1))
            else if (num0 || num1) {
                stack.push(simplify({ operator: token, term0, term1 }))
            }
            else if (term0?.operator === "x" && term1?.operator === "x") stack.push({
                operator: "x",
                coef: term0.coef * term1.coef,
                power: term0.power + term1.power
            })
        }
    }
    return stack
}
function simplify(exp) {
    let num0 = toNumber(exp.term0)
    let num1 = toNumber(exp.term1)
    if (num0 && num1) return evaluate[token](num0, num1)
    else if (num0 || num1) {
        let num
        let term
        if (num1 && !num0) {
            num = num1
            term = exp.term0
        } else {
            num = num0
            term = exp.term1
        }
        switch (exp.operator) {
            case "+":
                if (num === 0) return term
                break
            case "-":
                // if (num0 === 0) return term
                if (num1 === 0) return term
                break
            case "*":
                if (num === 1) return term
                break
            case "/":
                // if (num0 === 0) return term
                if (num1 === 1) return term
                break
            case "**":
                // if (num0 === 0) return term
                if (num1 === 0) return 1
                if (num1 === 1) return term
                break
        }
    }
}

function treeToInfix(exp) {
    if (typeof exp === "object") {
        if ("argument" in exp) return `${exp.operator}(${treeToInfix(exp.argument)})`
        return `${treeToInfix(exp.term0)} ${exp.operator} ${treeToInfix(exp.term1)}`
    }
    return exp
}
console.log(polynomial(differentiate(postfixToTree(infixToPostfix("2 * ( x * 2 + 4 * x ) ** 2".split(" "))))))