const inputFile = Bun.file("src.json")
const src = await inputFile.json()

for (const [className, definition] of Object.entries(src)) {
    const parentClass = definition.extends
    const interfaces = definition.implements
    const input = getAttributes(definition)

    const attributes = Object.keys(input)
    let allAttributes = []
    let inherited = []
    if (parentClass) {
        for (let currentClass = className; currentClass in src; currentClass = src[currentClass].extends) {
            let currentAttributes = getAttributes(src[currentClass])
            if (currentAttributes) {
                allAttributes = allAttributes.concat(Object.keys(currentAttributes))
                if (currentClass !== className) inherited = inherited.concat(Object.keys(currentAttributes))
            }
        }
    } else {
        allAttributes = attributes
    }

    let nameAndType = genNameAndType(className)

    const outputFile = Bun.file(`${className}.java`)
    const writer = outputFile.writer()

    // Signature
    writer.write(`public class ${className} `)
    if (parentClass) writer.write(`extends ${parentClass} `)
    if (interfaces) writer.write(`implements ${interfaces.join(", ")} `)
    writer.write("{\n\n")

    // Initialise attributes
    writer.write(
        attributes.map(attr =>
            `\tprivate ${nameAndType(attr)};\n`
        ).join("")
    )

    // Constructor
    writer.write(`\n\tpublic ${className}(`)
    writer.write(allAttributes
        .map(nameAndType)
        .join(", ")
    )
    writer.write(") {\n")
    if (parentClass) {
        writer.write(`\t\tsuper(${inherited
            .join(", ")
            });\n`)
    }
    attributes.forEach(attr => {
        writer.write(`\t\tthis.${attr} = ${attr};\n`)
    })
    writer.write("\t}\n")

    // Getters
    attributes.forEach(attr => {
        const type = input[attr]
        writer.write(`\n\tpublic ${type} get${capitaliseFirstLetter(attr)} () {
        return ${attr};
    }\n`)
    })

    // Equals
    writer.write(`\n\t@Override\n\tpublic boolean equals(Object other) {
        if (other == this) return true;
        if (other == null || other.getClass() != this.getClass()) return false;
        ${className} that = (${className}) other;
        return ${parentClass ? `super.equals(that)` : ""}${parentClass && attributes.length > 0 ? " && " : ""}${attributes.map(attr => {
        const type = input[attr]
        if (isReference(type)) { // reference type
            return `this.${attr}.equals(that.${attr})`
        } else { // primitive type
            return `this.${attr} == that.${attr}`
        }
    }).join("\n\t\t\t\t&& ")
        };
    } \n`)

    // Hashcode
    writer.write(`\n\t@Override\n\tpublic int hashCode() {
        int hash = 7;
${attributes.map(attr => {
        const type = input[attr]
        return `\t\thash = 31 * hash + ${isReference(type)
            ? `${attr}.hashCode()`
            : `${toReferenceType(type)}.hashCode(${attr})`};\n`
    }).join("")
        } \t\treturn hash;
    } \n`)

    // toString
    writer.write(`\n\t@Override\n\tpublic String toString() {
        return "${className}["
${attributes.map(attr => `\t\t\t\t+ "${attr} = " + ${attr}${isReference(input[attr]) && input[attr] !== "String" ? ".toString()" : ""} + ", "`).join("\n")}
\t\t\t\t+ "]";
    } \n`)

    // End
    writer.write("}\n")
    writer.flush()
    writer.end()
}

function toReferenceType(primitiveType) {
    const lookup = {
        "byte": "Byte",
        "short": "Short",
        "int": "Integer",
        "long": "Long",
        "float": "Float",
        "double": "Double",
        "bool": "Boolean",
        "char": "Character",
    }
    return lookup?.[primitiveType]
}

function capitaliseFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function isReference(type) {
    return type.charCodeAt(0) < 96
}

function genNameAndType(className) {
    return function nameAndType(attr) {
        let extended = inheritAll(className)
        return `${extended[attr]} ${attr}`
    }
}

function getAttributes(obj) {
    let attributes = { ...obj }
    if (obj.extends) delete attributes.extends
    if (obj.implements) delete attributes.implements
    return attributes
}

function inheritAll(className) {
    let attributes = {}
    for (let currentClass = className; currentClass in src; currentClass = src[currentClass].extends) {
        attributes = { ...attributes, ...getAttributes(src[currentClass]) }
    }
    return attributes
}
