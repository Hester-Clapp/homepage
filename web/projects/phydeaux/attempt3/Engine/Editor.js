import { Engine } from "./Engine.js"
import { Node } from "../Particle/Node.js"
import { Spring } from "../Material/Spring.js"
import { Wood, Steel, Rope, Cable, Concrete } from "../Material/Materials.js"
import { Road } from "../Material/Road.js"
import { Hydraulic } from "../Material/Hydraulic.js"

export class Editor extends Engine {

    tool = 0

    materials = [Road, Concrete, Wood, Steel, Hydraulic, Rope, Cable, Spring]
    currentMaterial = Road

    minimumPointSpacing = 10
    maxLengthTolerance = 10

    constructor(phydeaux, anchors) {
        super()
        phydeaux.forEach(phydeau => this.phydeaux.push(phydeau))
        anchors.forEach(anchor => this.points.push(anchor))
    }

    get selectedPoint() {
        return this.points.filter(point => point.selected)[0]
    }

    addPoint(position) {
        const existing = this.points
            .filter(point => point.position.minus(position).magnitude < this.minimumPointSpacing)

        if (existing.length === 0) {
            const point = new Node(position, 1, 5)
            this.points.push(point)
            return point
        }
    }

    addSpring(start, end) {
        if (!start || !end || start?.equals(end)) return

        this.springs = this.springs
            .filter(spring => !(spring.start.equals(start) && spring.end.equals(end)))
            .filter(spring => !(spring.start.equals(end) && spring.end.equals(start)))

        const spring = new this.currentMaterial(start, end)
        this.springs.push(spring)
        return spring
    }

    target(mouseVector) {
        return this.points.filter(point => point.encircles(mouseVector))[0]
    }

    draw(ctx) {
        super.draw(ctx)
        if (this.selectedPoint) {
            const position = this.selectedPoint.position
            const radius = this.currentMaterial.maxLength
            ctx.beginPath()
            ctx.moveTo(position.x + radius, position.y)
            ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI)
            ctx.strokeStyle = "rgba(0,0,0,0.5)"
            ctx.stroke()
        }
        ctx.fillText("Tool: " + this.tool, 10, 20)
    }

    click(mouseVector) {
        const selected = this.selectedPoint
        const distance = selected ? mouseVector.minus(selected.position).magnitude : 0
        const target = this.target(mouseVector)

        if (target) {
            this.points.forEach(point => point.deselect())
            if (target.equals(selected)) {
                target.deselect()
                return
            }
            target.select()

            if (target && selected && (
                this.currentMaterial.maxLength === 0 ||
                selected.to(target).magnitude <= this.currentMaterial.maxLength + this.maxLengthTolerance
            )) {
                this.addSpring(selected, target)
            }
        } else if (selected) {
            const position = this.currentMaterial.maxLength === 0 || distance <= this.currentMaterial.maxLength
                ? mouseVector
                : selected.position.plus(mouseVector.minus(selected.position).unit.times(this.currentMaterial.maxLength))

            const point = this.addPoint(position)
            if (point) {
                this.addSpring(selected, point)
                selected.deselect()
                point.select()
            }
        }
        // else this.addPoint(mouseVector)
    }

    rightclick(mouseVector) {
        const target = this.target(mouseVector)
        if (target && !target.selected) {
        } else {
            this.selectedPoint?.deselect()
        }
    }

    keypress(key) {
        const number = Number(key)
        if (number) {
            this.tool = number
            if (number >= 1 && number <= this.materials.length) {
                this.currentMaterial = this.materials[number - 1]
            }
        }
    }
}