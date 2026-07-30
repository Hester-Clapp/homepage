let expression = prompt("Enter an expression (reverse Polish notation):").split(" ")
// console.log(expression)
let stack = []
for (let term of expression) {
    let num = Number(term)
    if (num) {
        stack.push(num)
    } else {
        switch (term) {
            case "+":
                stack.push(stack.pop() + stack.pop())
                break
            case "-":
                stack.push(stack.pop() - stack.pop())
                break
            case "*":
                stack.push(stack.pop() * stack.pop())
                break
            case "/":
                stack.push(stack.pop() / stack.pop())
                break
            case "**":
                stack.push(stack.pop() ** stack.pop())
                break
        }
    }
}
console.log(stack.pop())