import { Vector } from "../Vector.js"
import { Physics } from "../Physics.js"

export class PointParticle {
    position
    previousPosition
    velocity = Vector.zero

    mass
    invMass
    setMass(mass) {
        this.mass = mass
        this.invMass = (mass === 0) ? 0 : (1 / mass)
    }
    addMass(mass) { this.setMass(this.mass + mass) }

    constructor(position, mass = 1) {
        this.position = position.clone()
        this.previousPosition = position.clone()
        this.setMass(mass)
    }

    move(displacement) {
        if (this.invMass === 0) return
        this.position = this.position.plus(displacement)
    }

    moveTo(position) {
        if (this.invMass === 0) return
        this.position = position
    }

    savePosition() {
        this.previousPosition = this.position.clone();
    }

    applyExternalForces(dt, forces = []) {
        let netForce = Physics.gravity.times(this.mass)
        for (const force of forces) netForce = netForce.plus(force)
        this.velocity = this.velocity.plus(netForce.times(this.invMass * dt))
    }

    predictPosition(dt) {
        this.move(this.velocity.times(dt))
    }

    updateVelocity(dt) {
        this.velocity = this.position.minus(this.previousPosition).times(1 / dt)
    }

    dampVelocity(damping) {
        this.velocity = this.velocity.times(damping)
    }

    to(that) {
        return that.position.minus(this.position).clone()
    }

    equals(that) {
        if (!that) return false
        return this.mass === that.mass
            && this.radius === that.radius
            && this.position.equals(that.position)
            && this.previousPosition.equals(that.previousPosition)
            && this.velocity.equals(that.velocity)
    }

    clone() {
        return new PointParticle(
            this.position,
            this.mass,
            this.radius
        )
    }

}