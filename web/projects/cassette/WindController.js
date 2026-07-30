export class WindController {
    constructor(sfx, onPositionChange) {
        this.player = null
        this.sfx = sfx
        this.onPositionChange = onPositionChange
        this.winding = false
        this.startTime = 0
        this.usePlaybackRate = false

        this.step = 1 / 125
    }

    start(cassette, backwards, buttonEl) {
        if (this.winding) this.cancel()
        if (!cassette || !this.player) return
        cassette.position = this.player.currentTime
        this.pausedBeforeWind = this.player.paused

        requestAnimationFrame(() => {
            this.winding = true
            buttonEl.classList.add('pressed')
            this.sfx.play('toggleDown')
            this.sfx.play('winding')
            if (!backwards && this.usePlaybackRate) {
                this.fastForwards()
            } else {
                this.startTime = 0
                this.player.volume = 0
                backwards ? this.ticker(-this.step)() : this.ticker(this.step)()
            }
        })
    }

    stop(cassette, buttonEl) {
        this.winding = false
        if (!cassette || !this.player) return
        cassette.position = this.player.currentTime
        this.player.volume = 1
        this.player.playbackRate = 1
        if (this.pausedBeforeWind) this.player.pause()
        buttonEl?.classList.remove('pressed')
        this.sfx.pause('winding')
        this.sfx.play('toggleUp')
    }

    cancel() {
        this.stop()
        this.sfx.play('stop')
        setTimeout(() => this.sfx.play('releaseStop'), 200)
    }

    fastForwards() {
        this.player.playbackRate = 8
        this.player.play()
    }

    ticker(step) {
        const tick = (time = this.startTime) => {
            const dt = time - this.startTime
            if (dt > 0 && dt < 100) {
                const pos = this.onPositionChange(dt * step)
                if (pos <= 0) { this.cancel(); return }
            }
            if (this.winding) {
                this.startTime = time
                requestAnimationFrame(tick)
            }
        }
        return tick
    }
}