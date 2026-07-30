export class SeekbarController {
    constructor(seekbarEl) {
        this.player = null
        this.seekbar = seekbarEl
        this.rafId = null
    }

    set(time) {
        this.player.currentTime = time
        this.seekbar.value = `${time}`
        if (!this.player.paused) this.startLoop()
    }

    stopLoop() {
        cancelAnimationFrame(this.rafId)
        this.rafId = null
    }

    get currentTime() {
        return this.player.currentTime
    }

    startLoop() {
        const tick = () => {
            this.seekbar.value = `${this.player.currentTime}`
            if (!this.player.paused) this.rafId = requestAnimationFrame(tick)
        }
        this.rafId = requestAnimationFrame(tick)
    }
}