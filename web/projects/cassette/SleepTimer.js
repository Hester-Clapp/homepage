export class SleepTimer {
    constructor(audioEngine, sfx, onPause) {
        this.audio = audioEngine
        this.sfx = sfx
        this.onPause = onPause
        this.sleeping = false
        this.timeout = null
        this.mediaDuration = 0
    }

    start(minutes, buttonEl, mediaCurrentTime) {
        const seconds = minutes * 60
        const now = this.audio.ctx.currentTime
        const fade = this.audio.fadeOut

        this.sleeping = true
        fade.gain.setValueAtTime(1, now)
        fade.gain.linearRampToValueAtTime(0, now + seconds)

        buttonEl.classList.add('pressed')
        this.sfx.play('toggleDown')
        this.createElement(mediaCurrentTime, seconds, this.mediaDuration)

        this.timeout = setTimeout(() => this.stop(), seconds * 1000)
    }

    stop(buttonEl) {
        this.sleeping = false
        fade.gain.setValueAtTime(1, this.audio.ctx.currentTime + 1)

        this.onPause()
        buttonEl.classList.remove('pressed')
        document.querySelectorAll(".timer").forEach(el => el.remove())
    }

    cancel(buttonEl) {
        const now = this.audio.ctx.currentTime
        const fade = this.audio.fadeOut

        this.sleeping = false
        clearTimeout(this.timeout)
        fade.gain.cancelScheduledValues(now)
        fade.gain.setValueAtTime(1, now)

        document.querySelectorAll(".timer").forEach(el => el.remove())
        this.sfx.toggle(true)
        if (!buttonEl.classList.contains("pressed")) this.sfx.play("toggleDown")
        buttonEl.classList.remove('pressed')
    }

    createElement(startTime, timerDuration, mediaDuration) {
        const container = document.getElementById("seekbarContainer")

        const div = document.createElement('div')
        div.classList.add('timer', `time-${startTime}`)

        const thumbWidth = 16
        const thumbOffset = (thumbWidth / 2)

        const ratio = startTime / mediaDuration
        const seekbarWidth = container.clientWidth - thumbWidth
        const startTimeOffset = seekbarWidth * ratio
        const totalOffset = startTimeOffset + thumbOffset

        const maxDuration = Math.min(mediaDuration - startTime, timerDuration) // How much time until the media ends or the timer runs out
        const maxDurationRatio = maxDuration / timerDuration
        const targetWidth = seekbarWidth * maxDuration / mediaDuration
        const height = container.clientHeight
        const skew = targetWidth / height
        const secant = Math.sqrt(skew * skew + 1)

        div.style.left = `${totalOffset}px`
        div.style.transform = `matrix(${secant / maxDurationRatio}, 0, ${skew}, ${maxDurationRatio}, ${targetWidth / 2}, ${height * (maxDurationRatio - 1) / 2})`
        container.appendChild(div)
    }
}