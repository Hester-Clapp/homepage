import { Engine } from "./Engine.js"
import { Physics } from "../Physics.js"

export class PhysicsEngine extends Engine {

    destroyFallenPartsHeight = 1000
    showStress = false

    constructor() {
        super()
    }

    load(editor) {
        const pointMap = new Map();

        for (const point of editor.points) {
            const clone = point.clone();
            pointMap.set(point, clone);
        }

        const springClones = editor.springs.map(spring => {
            const clone = spring.clone();
            clone.start = pointMap.get(spring.start);
            clone.end = pointMap.get(spring.end);

            // Distribute spring mass between start and end point
            const mass = clone.mass
            clone.start.addMass(mass / 2)
            clone.end.addMass(mass / 2)

            return clone;
        });

        this.points = Array.from(pointMap.values())
        this.springs = springClones
        this.phydeaux = editor.phydeaux.map(phydeau => phydeau.clone())
    }

    tick(dt) {
        const iterations = 10
        for (let i = 0; i < iterations; i++) {
            const dtStep = dt / iterations
            for (const phydeau of this.phydeaux) {
                phydeau.savePosition(dtStep)
                phydeau.applyExternalForces(dtStep)
                phydeau.walk(dtStep)
                for (const spring of this.springs) {
                    spring.collide(phydeau, dtStep)
                }
                phydeau.predictPosition(dtStep)
            }
            for (const point of this.points) {
                point.savePosition(dtStep)
                point.applyExternalForces(dtStep)
                point.predictPosition(dtStep)
            }
            for (const spring of this.springs) {
                spring.applyConstraint(dtStep)
                // for (const phydeau of this.phydeaux) {
                //     spring.collide(phydeau, dtStep)
                // }
            }
            for (const phydeau of this.phydeaux) {
                phydeau.updateVelocity(dtStep)
            }
            for (const point of this.points) {
                point.updateVelocity(dtStep)
            }
        }
        for (const point of this.points) point.dampVelocity(Physics.damping)

        this.deleteFallenParts()

    }

    draw(ctx) {
        this.phydeaux.forEach(phydeau => phydeau.draw(ctx))
        this.springs.forEach(spring => spring.draw(ctx, this.showStress))
        this.points.forEach(point => point.draw(ctx))
    }

    deleteFallenParts() {
        let fallenParts = this.points
            .map((point, i) => point.position.y > this.destroyFallenPartsHeight ? i : -1)
            .filter(i => i !== -1)
        if (fallenParts.length) {
            let fallenSprings = this.springs
                .map((spring, i) => fallenParts.includes(spring.start) || fallenParts.includes(spring.end) ? i : -1)
                .filter(i => i !== -1)

            this.points = this.points.filter((_, i) => !fallenParts.includes(i))
            this.springs = this.springs.filter((_, i) => !fallenSprings.includes(i))
        }
    }

    keypress(key) {
        switch (key) {
            case "s":
                this.showStress = !this.showStress
                break;
        }
    }

}