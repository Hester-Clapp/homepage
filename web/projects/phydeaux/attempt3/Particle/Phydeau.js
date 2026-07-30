import { Vector } from "../Vector.js"
import { PointParticle } from "./PointParticle.js"

export class Phydeau extends PointParticle {
    radius = 20

    static id = 1

    speed = 100
    compliance = 2

    constructor(position, mass = 1, radius = 20) {
        super(position, mass)
        this.radius = radius
        this.id = Phydeau.id++
    }

    walk(dt) {
        const acceleration = this.speed - this.velocity.x
        this.velocity = this.velocity.plus(Vector.X.times(acceleration * this.compliance * dt))
    }

    draw(ctx) {
        ctx.save()

        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 1

        ctx.beginPath()
        ctx.moveTo(this.position.x + this.radius, this.position.y)
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.restore()

    }

    equals(that) {
        if (!that) return false
        return super.equals(that)
            && this.id === that.id
            && this.radius === that.radius
    }

    clone() {
        return new Phydeau(
            this.position,
            this.mass,
            this.radius
        )
    }

}