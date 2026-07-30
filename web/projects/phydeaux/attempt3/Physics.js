import { Vector } from "./Vector.js"

export class Physics {
    static get gravity() { return Vector.Y.times(500) }
    static damping = 1 - 0.02
    static restitution = 0.1

    static collisionMatrix(m1, m2) {
        let mT = m1 + m2
        return {
            c11: (m1 - m2) / mT,
            c12: (2 * m2) / mT,
            c21: (2 * m1) / mT,
            c22: (m2 - m1) / mT
        }
    }
}