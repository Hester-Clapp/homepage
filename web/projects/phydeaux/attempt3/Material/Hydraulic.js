import { Steel } from "./Materials.js"

export class Hydraulic extends Steel {

    maxLength = 200

    colour = "#512996"

    /* ToDo: Extend */

    clone() {
        return new Hydraulic(
            this.start.clone(),
            this.end.clone()
        )
    }

}