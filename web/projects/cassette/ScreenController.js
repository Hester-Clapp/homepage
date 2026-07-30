import * as svg from "./svg.js"

export class ScreenController {
    constructor(player, titler) {
        this.playerEl = player
        this.titlerEl = titler

        this.defaultFilter = "brightness(120%) contrast(90%) saturate(80%) blur(1px)"
        this.desaturatedFilter = "brightness(120%) contrast(90%) saturate(20%) blur(1px)"
        this.noSignalFilter = "none"
    }

    play() {
        this.playerEl.style.filter = this.defaultFilter
        this.playerEl.classList.remove("no-signal")
        this.titlerEl.innerHTML = ""
    }

    pause(ended = false) {
        this.playerEl.style.filter = this.defaultFilter
        this.titlerEl.innerHTML = ended ? "END" : `PAUSE ${svg.white(svg.pause)}`
    }

    playPause(paused) {
        if (paused) this.pause()
        else this.play()
    }

    forward() {
        this.playerEl.style.filter = this.desaturatedFilter
        this.titlerEl.innerHTML = `F FWD ${svg.white(svg.forward)}`
    }

    rewind() {
        this.playerEl.style.filter = this.desaturatedFilter
        this.titlerEl.innerHTML = `REW ${svg.white(svg.rewind)}`
    }

    wind(backwards) {
        if (backwards) this.rewind()
        else this.forward()
    }

    noSignal() {
        if (this.winding) return
        this.playerEl.style.filter = this.noSignalFilter
        this.playerEl.classList.add("no-signal")
        this.titlerEl.innerHTML = "NO SIGNAL"
    }
}