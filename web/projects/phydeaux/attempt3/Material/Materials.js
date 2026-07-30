import { Spring } from "./Spring.js"

export class Wood extends Spring {

    static maxLength = 100

    elasticModulus = 25_000_000
    plasticModulus = 5_000_000
    yieldStress = 6_000_000
    plasticDeformationRate = 0.3
    breakingStress = 8_000_000
    bucklingStress = -2_000_000
    density = 5
    price = 2

    colour = "#C48C0C"

    constructor(start, end, preTension = 1) {
        super(start, end, preTension)
        this.calculateStrains()
    }

    clone() {
        return new Wood(
            this.start.clone(),
            this.end.clone()
        )
    }

}

export class Steel extends Spring {

    static maxLength = 200

    elasticModulus = 20_000_000_000
    plasticModulus = 100_000_000
    yieldStress = 40_000_000
    plasticDeformationRate = 0.5
    breakingStress = 500_000_000
    bucklingStress = -20_000_000
    density = 15
    price = 6

    colour = "#B31919"

    constructor(start, end, preTension = 1) {
        super(start, end, preTension)
        this.calculateStrains()
    }

    clone() {
        return new Steel(
            this.start.clone(),
            this.end.clone()
        )
    }

}

export class Rope extends Spring {

    static maxLength = 0

    elasticModulus = 50_000_000
    plasticModulus = 1_000_000
    yieldStress = 18_000_000
    plasticDeformationRate = 1
    breakingStress = 20_000_000
    bucklingStress = -Infinity
    density = 1
    price = 1

    colour = "#573B08"

    constructor(start, end, preTension = 1) {
        super(start, end, preTension)
        this.calculateStrains()
    }

    compliance(dt) {
        if (this.strain < 0) return Infinity
        else return super.compliance(dt)
    }

    break() {
        if (this.strain > this.breakingStrain) this.broken = true
    }

    clone() {
        return new Rope(
            this.start.clone(),
            this.end.clone()
        )
    }

}

export class Cable extends Rope {

    static maxLength = 0

    elasticModulus = 20_000_000_000_000
    plasticModulus = 1_000_000_000
    yieldStress = 40_000_000
    plasticDeformationRate = 1
    breakingStress = 50_000_000
    bucklingStress = -Infinity
    density = 4
    price = 10

    colour = "#573B08"

    constructor(start, end, preTension = 1) {
        super(start, end, preTension)
        this.calculateStrains()
    }

    clone() {
        return new Cable(
            this.start.clone(),
            this.end.clone()
        )
    }

}

export class Concrete extends Spring {

    static maxLength = 200

    elasticModulus = 40_000_000
    plasticModulus = 1_000_000
    yieldStress = 2_000_000
    plasticDeformationRate = 0.1
    breakingStress = 2_000_000
    bucklingStress = -20_000_000
    density = 10
    price = 3

    colour = "#91979C"

    constructor(start, end, preTension = 1) {
        super(start, end, preTension)
        this.calculateStrains()
    }

    clone() {
        return new Concrete(
            this.start.clone(),
            this.end.clone()
        )
    }

}