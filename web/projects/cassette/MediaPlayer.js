import { SoundEffects } from "./SoundEffects.js"
import { AudioEngine } from "./AudioEngine.js"
import { SeekbarController } from "./SeekbarController.js"
import { WindController } from "./WindController.js"
import { PersistenceManager } from "./PersistenceManager.js"
import * as svg from "./svg.js"

export class MediaPlayer {
    constructor() {
        this.player = null
        this.cassette = null
        this.paused = true
        this.winding = false
        this.windStartTime = 0

        // Elements
        this.seekbarEl = document.getElementById('seekbar')
        this.volumeEl = document.getElementById('volume')
        this.rewindEl = document.getElementById('rewind')
        this.playpauseEl = document.getElementById('playpause')
        this.forwardsEl = document.getElementById('forwards')

        // Subsystems
        this.sfx = new SoundEffects()
        this.audio = new AudioEngine()
        this.persistence = new PersistenceManager()
        this.seekbar = new SeekbarController(this.seekbarEl)
        this.wind = new WindController(this.sfx, (delta) => this.onPositionChange(delta))
    }

    async initAudio(disableEffects = true) {
        await this.audio.init(this.player, { disableEffects })
        this.sfx.parseWinding(this.audio.ctx)
    }

    play(sfx = true) {
        if (!this.cassette) return
        if (this.player.ended || this.player.currentTime === this.player.duration) {
            this.sfx.play('releaseStop')
            this.pause()
            return
        }

        this.player?.play()
        this.paused = false
        this.playpauseEl.innerHTML = svg.pause
        this.seekbar.startLoop()
        if (sfx) this.sfx.play('play')

        const ctrl = new AbortController()
        this.player?.addEventListener('ended', () => this.pause(), { signal: ctrl.signal, once: true })
        this.player?.addEventListener('pause', () => { if (!this.player.ended) ctrl.abort() }, { signal: ctrl.signal, once: true })
    }

    pause(sfx = true) {
        this.player?.pause()
        this.paused = true
        this.playpauseEl.innerHTML = svg.play
        this.seekbar.stopLoop()
        if (this.cassette) this.cassette.position = this.player?.currentTime
        this.saveState()
        if (sfx) {
            this.sfx.play('stop')
            window.addEventListener("pointerup", () => this.sfx.play("releaseStop"), { once: true })
        }
    }

    togglePlay() {
        if (this.paused) this.play()
        else this.pause()
    }

    seekTo(time) {
        this.seekbar.set(time)
        this.saveState()
    }

    applyVolume(v) {
        this.audio.setVolume(v)
        this.saveState()
    }

    windStart(backwards, el) { this.wind.start(this.cassette, backwards, el) }

    windStop(el) {
        this.wind.stop(this.cassette, el)
        this.saveState()
    }

    onPositionChange(delta) {
        if (!this.cassette) return 0
        const next = Math.max(0, Math.min(this.player.duration, this.cassette.position + delta))
        this.cassette.position = next
        this.seekbar.set(next)
        return next
    }

    saveState() {
        if (!this.cassette) return
        this.cassette.position = this.player.currentTime
        this.cassette.targetVolume = this.volumeEl.value
        this.persistence.saveState(this.cassette)
        this.persistence.setCurrentId(this.cassette.id)
    }

    bindEvents() {
        window.addEventListener('pointerdown', () => this.initAudio(), { once: true })

        this.seekbarEl.addEventListener("input", () => this.seekTo(this.seekbarEl.value))
        this.volumeEl.addEventListener("input", () => this.applyVolume(this.volumeEl.value))

        this.rewindEl.addEventListener("pointerdown", () => this.windStart(true, this.rewindEl))
        this.rewindEl.addEventListener("pointerup", () => this.windStop(this.rewindEl))
        this.playpauseEl.addEventListener("pointerdown", () => this.togglePlay())
        this.forwardsEl.addEventListener("pointerdown", () => this.windStart(false, this.forwardsEl))
        this.forwardsEl.addEventListener("pointerup", () => this.windStop(this.forwardsEl))

    }
}
