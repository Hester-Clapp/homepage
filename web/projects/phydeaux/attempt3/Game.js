import { PhysicsEngine } from "./Engine/PhysicsEngine.js"
import { Editor } from "./Engine/Editor.js"
import { Vector } from "./Vector.js"
import { Anchor } from "./Particle/Anchor.js"
import { Phydeau } from "./Particle/Phydeau.js"

export class Game {
    points = []
    springs = []
    ctx
    speed = 1

    physicsEngine = new PhysicsEngine()
    editor = new Editor([
        new Phydeau(new Vector(100, 250), 50000)
    ], [
        new Anchor(new Vector(100, 300)),
        new Anchor(new Vector(400, 300)),

        // new Node(new Vector(200, 100)),
        // new Node(new Vector(150, 25)),
        // new Node(new Vector(250, 25)),
    ])

    physicsEnabled = false
    currentEngine = this.editor
    switchEngine() {
        this.physicsEnabled = !this.physicsEnabled
        this.currentEngine = this.physicsEnabled ? this.physicsEngine : this.editor
        this.physicsEngine.load(this.editor)
    }

    constructor(ctx) {
        this.ctx = ctx
    }

    tick(dt) {
        if (this.physicsEnabled) this.physicsEngine.tick(dt * this.speed)
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.currentEngine.draw(this.ctx)
    }

    /**
     * The method to run when a user clicks the screen
     * @param {Event} event The click event
     */
    click(event) {
        let mouseVector = new Vector(event.offsetX, event.offsetY)
        this.currentEngine.click(mouseVector)
    }

    rightclick(event) {
        event.preventDefault()
        let mouseVector = new Vector(event.offsetX, event.offsetY)
        this.currentEngine.rightclick(mouseVector)
    }

    keypress(event) {
        switch (event.key) {
            case " ":
                this.switchEngine()
                break;
            default:
                this.currentEngine.keypress(event.key)
        }
    }
}