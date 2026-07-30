export class Engine {

    points = []
    springs = []
    phydeaux = []

    constructor() {

    }

    click(mouseVector) { }
    rightclick(mouseVector) { }
    keypress(key) { }

    draw(ctx) {
        this.phydeaux.forEach(phydeau => phydeau.draw(ctx))
        this.springs.forEach(spring => spring.draw(ctx))
        this.points.forEach(point => point.draw(ctx))
    }

}