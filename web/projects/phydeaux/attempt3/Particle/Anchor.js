import { Vector } from "../Vector.js"
import { Node } from "./Node.js"

export class Anchor extends Node {

    setMass() {
        this.mass = 0
        this.invMass = 0
    }
    addMass() { this.setMass(0) }

    constructor(position, radius = 5) {
        super(position, 0, radius)
    }

    setPosition() { }

    draw(ctx) {
        ctx.save()

        ctx.fillStyle = "red"
        ctx.strokeStyle = "black"
        ctx.lineWeight = 4

        let origin = this.position.minus(Vector.one.times(this.radius))

        ctx.beginPath()
        ctx.moveTo(origin.x, origin.y)
        ctx.rect(origin.x, origin.y, 2 * this.radius, 2 * this.radius)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        super.drawSelection(ctx)

        ctx.restore()
    }

    equals(that) {
        if (!that) return false
        return that.mass === 0
            && that.invMass === 0
            && this.radius === that.radius
            && this.position.equals(that.position)
    }

    clone() {
        return new Anchor(
            this.position.clone(),
            this.mass,
            this.radius
        )
    }

}