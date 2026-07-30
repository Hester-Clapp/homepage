import ciphers from "../../../../lib/ciphers.js"

//substitute(input,key,encrypt), for caesar and substitution ciphers
//transpose(input,key,encrypt), for transposition ciphers
//vigenere(input,key,encrypt), for vigenere and polyalphabetic ciphers

let cipherText = `AITLL CBEOM CESLE NAROW AWHTA ITFRS PTAPE EARDA JSAUM EBLDM SESHA ODSME TPATE TRNOI NTADN YOWOU NCARE TADHE SMESA IGENP ILANT TEXGO WODOR NKODE YCRPT GINTH IEFRS RTTAN OSPSI OTINC HIPER NFIDT NHEEX ETMSS EAGWI TTHHE LURWO SRDPA GCEYM SNATT NHEEX ETMSS EAGWI BLLEA ITRCK RYTAN OSPSI OTINC HIPER`

const nonLetters = ["","\n"," ",".",",","!","?","'","-",":","’"]
const letterFreqs = [0.0812, 0.0149, 0.0271, 0.0432, 0.1202, 0.023, 0.0203, 0.0592, 0.0731, 0.001, 0.0069, 0.0398, 0.0261, 0.0695, 0.0768, 0.0182, 0.0011, 0.0602, 0.0628, 0.091, 0.0288, 0.0111, 0.0209, 0.0017, 0.0211, 0.0007]

cipherText = cipherText.toUpperCase().split("")
let key = solveCaesar(cipherText.filter(v => !nonLetters.includes(v)).map(v => v.charCodeAt(0)))
// console.log(cipherText.map(v => (nonLetters.includes(v)) ? v : String.fromCharCode((v.charCodeAt(0)-65+key)%26+65)).reduce((acc,v) => acc + v,""))
// console.log(cipherText.toUpperCase().split("").map(v => String.fromCharCode((v.charCodeAt(0)-65+solveCaesar(cipherText))%26+65)).reduce((acc,v) => acc + v,""))


function solveCaesar(cipherArray) {
    let scores = []
    // let cipherArray = cipherTextInput.map(v => v.charCodeAt(0))
    for (let i=0;i<26;i++) {
        let shift = cipherArray.map(v => (v+i-65)%26)
        let shiftFreqs = shift.reduce((c, v) => (c[v] = (c[v] || 0) + 1, c), []).map(v => +((v/cipherArray.length).toFixed(4)))
        scores[i] = 0
        for (let j=0;j<26;j++) {
            scores[i] += letterFreqs[j] * (shiftFreqs [j] || 0)
        }
    }
    return(scores.indexOf(Math.max(...scores)))
}

console.log(ciphers.transpose(cipherText,23145,false))

