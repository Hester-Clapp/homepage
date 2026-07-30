import { Vector } from "../Vector.js"
import { PointParticle } from "./PointParticle.js"

export class Node extends PointParticle {
    radius

    selected = false
    select() { this.selected = !this.selected }
    deselect() { this.selected = false }

    constructor(position, mass = 1, radius = 5) {
        super(position, mass)
        this.radius = radius
    }

    /**
     * Calculates the distance between the surfaces of each point
     * @param {Point} that The other point
     * @returns The minimum distance between the surface of this point and the surface of the other point
     */
    outerDistance(that) {
        return this.to(that).magnitude
            - this.radius
            - that.radius
    }

    /**
     * Returns true if the position lies inside this point
     * @param {Vector} position The position to test
     * @param {int} tolerance The maximum distance outside the point that will still trigger this
     * @returns True if the vector is within the point
     */
    encircles(position, tolerance = 10) {
        return position.minus(this.position).magnitude < this.radius + tolerance
    }

    /**
     * Decides whether these points are colliding with each other
     * This is true iff the points intersect and 
     * @param {Point} that The other point
     * @returns True if this point is colliding with the other point
     */
    isCollidingWith(that) {
        return this.outerDistance(that) < 0
            && this.to(that).dot(this.velocity) > 0
    }

    draw(ctx) {
        ctx.save()

        ctx.fillStyle = "yellow"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.moveTo(this.position.x + this.radius, this.position.y)
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        this.drawSelection(ctx)

        ctx.restore()
    }

    drawSelection(ctx) {
        if (this.selected) {
            ctx.lineWidth = 2
            ctx.strokeStyle = "white"
            ctx.beginPath()
            ctx.moveTo(this.position.x + this.radius + 4, this.position.y)
            ctx.arc(this.position.x, this.position.y, this.radius + 4, 0, 2 * Math.PI)
            ctx.closePath()
            ctx.stroke()
        }

    }

    // equals(that) {
    //     if (!that) return false
    //     return this.mass === that.mass
    //         && this.radius === that.radius
    //         && this.position.equals(that.position)
    //         && this.velocity.equals(that.velocity)
    // }

    clone() {
        return new Node(
            this.position.clone(),
            this.mass,
            this.radius
        )
    }

}