export class Vector {
    x
    y

    static get X() { return new Vector(1, 0) }
    static get Y() { return new Vector(0, 1) }
    static get zero() { return new Vector(0, 0) }
    static get one() { return new Vector(1, 1) }
    static unit(angle) { return new Vector(Math.cos(angle), Math.sin(angle)) }

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    get magnitude() {
        return Math.hypot(this.x, this.y)
    }

    get angle() {
        return Math.atan2(this.y, this.x)
    }

    get unit() {
        return this.times(1 / this.magnitude)
    }

    get perpendicular() {
        return new Vector(-this.y, this.x)
    }

    dot(that) {
        return this.x * that.x
            + this.y * that.y
    }

    cross(that) {
        return this.x * that.y
            - this.y * that.x
    }

    plus(that) {
        return new Vector(
            this.x + that.x,
            this.y + that.y
        )
    }

    minus(that) {
        return new Vector(
            this.x - that.x,
            this.y - that.y
        )
    }

    times(scale) {
        return new Vector(
            this.x * scale,
            this.y * scale
        )
    }

    rotate(angle) {
        return new Vector(
            this.x * Math.cos(angle) + this.y * Math.sin(angle),
            this.x * Math.sin(angle) - this.y * Math.cos(angle)
        )
    }

    lerp(that, t) {
        return this.times(1 - t).plus(that.times(t))
    }

    transform(x, y) {
        return new Vector(
            this.x * x,
            this.y * y
        )
    }

    equals(that) {
        if (!that) return false
        return this.x === that.x
            && this.y === that.y
    }

    clone() {
        return new Vector(
            this.x,
            this.y
        )
    }
}