export class Spring {
    start
    end

    freeLength
    get displacement() { return this.start.to(this.end) }
    get length() { return this.displacement.magnitude }
    get axis() { return this.displacement.unit }
    get extension() { return this.length - this.freeLength }
    get strain() { return this.extension / this.freeLength }

    static maxLength = 200

    elasticModulus = 50_000_000
    plasticModulus = 5_000_000
    yieldStress = 2_000_000
    plasticDeformationRate = 2
    breakingStress = 4_000_000
    bucklingStress = -3_000_000
    density = 8
    price = 5

    broken = false

    width = 4
    get mass() { return (this.width ** 2) * this.length * this.density }

    colour = "#E3D610"

    constructor(start, end, preTension = 1) {
        // if (start?.equals(end)) throw new Error("Cannot create spring with the same start and end node")
        this.start = start
        this.end = end
        this.freeLength = this.length * preTension
        this.calculateStrains()
    }

    calculateStrains() {
        this.yieldStrain = this.yieldStress / this.elasticModulus
        this.breakingStrain = this.yieldStrain + (this.breakingStress - this.yieldStress) / this.plasticModulus
        this.bucklingStrain = this.bucklingStress / this.elasticModulus
    }

    compliance(dt) {
        if (this.strain > this.yieldStrain) {
            let excess = this.strain - this.yieldStrain
            this.freeLength += excess * this.plasticDeformationRate * dt
            return 1 / this.plasticModulus
        } else {
            return 1 / this.elasticModulus
        }
    }

    applyConstraint(dt) {
        if (!this.broken) {
            this.break()

            const totalInverseMass = this.start.invMass + this.end.invMass
            if (totalInverseMass === 0) return // Skip springs connecting two anchors

            const correction = this.axis.times(this.extension / (totalInverseMass + this.compliance(dt) / (dt ** 2)))
            this.start.move(correction.times(this.start.invMass))
            this.end.move(correction.times(-this.end.invMass))
        }
    }

    break() {
        if (this.strain > this.breakingStrain || this.strain < this.bucklingStrain) this.broken = true
    }

    isCollidingWith() { return false }
    collide() { }

    draw(ctx, showStress) {
        ctx.save()

        if (showStress) {
            const t = Math.max(0, Math.min(1, Math.max(this.strain / this.breakingStrain, -this.strain / this.bucklingStrain)))
            ctx.strokeStyle = `rgb(${200 * t}, ${200 - 200 * t}, 0)`
        } else ctx.strokeStyle = this.colour
        ctx.lineWidth = this.width

        ctx.beginPath()
        if (!this.broken) {
            ctx.moveTo(this.start.position.x, this.start.position.y)
            ctx.lineTo(this.end.position.x, this.end.position.y)
        } else {
            ctx.moveTo(this.start.position.x, this.start.position.y)
            ctx.lineTo(this.start.position.x, this.start.position.y + this.freeLength / 2)
            ctx.moveTo(this.end.position.x, this.end.position.y)
            ctx.lineTo(this.end.position.x, this.end.position.y + this.freeLength / 2)
        }
        ctx.closePath()
        ctx.stroke()

        ctx.restore()
    }

    equals(that) {
        if (!that) return false
        return this.freeLength === that.freeLength
            && this.stiffness === that.stiffness
            && this.start.equals(that.start)
            && this.end.equals(that.end)
    }

    clone() {
        let clone = new Spring(
            this.start.clone(),
            this.end.clone()
        )
        clone.freeLength = this.freeLength // Account for pre-tension
        return clone
    }

}