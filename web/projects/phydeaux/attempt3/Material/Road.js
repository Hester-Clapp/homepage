import { Physics } from "../Physics.js"
import { Concrete } from "./Materials.js"

export class Road extends Concrete {

    static maxLength = 100

    colour = "#47474A"

    isCollidingWith(phydeau) {
        const signedDistance = this.start.to(phydeau).cross(this.axis)
        if (Math.abs(signedDistance) > phydeau.radius + this.width / 2) return false
        const distanceAlong = this.start.to(phydeau).dot(this.axis)
        if (distanceAlong < -phydeau.radius || distanceAlong > this.length + phydeau.radius) return false
        const velocity = phydeau.velocity.cross(this.axis)
        return signedDistance * velocity < 0 // Only collide if moving towards the road
    }

    collide(phydeau, dt) {
        if (this.broken || !this.isCollidingWith(phydeau)) return

        const normalDistance = this.start.to(phydeau).cross(this.axis)
        const normal = this.axis.perpendicular
            .times(Math.sign(normalDistance))
        const along = this.start.to(phydeau).dot(this.axis) / this.length
        // const contactVelocity = this.start.velocity.lerp(this.end.velocity, along)
        // const relativeVelocity = phydeau.velocity.minus(contactVelocity)

        const totalInvMass = this.start.invMass + this.end.invMass + phydeau.invMass;
        if (totalInvMass === 0) return;

        const penetration = phydeau.radius + this.width / 2 - Math.abs(normalDistance);
        if (penetration <= 0) return;

        const correction = normal.times(0.5 * penetration / totalInvMass);
        phydeau.move(correction.times(-phydeau.invMass));
        this.start.move(correction.times(this.start.invMass * (1 - along)));
        this.end.move(correction.times(this.end.invMass * along));

    }

    clone() {
        return new Road(
            this.start.clone(),
            this.end.clone()
        )
    }

}