import { LocalMediaPlayer } from "./LocalMediaPlayer.js"
import { VideoCassette } from "./VideoCassette.js"
import { ScreenController } from "./ScreenController.js"

export class VideoPlayer extends LocalMediaPlayer {
    constructor() {
        super()

        this.screen = new ScreenController(document.getElementById("player"), document.getElementById("titler"))
        this.persistence.setCacheName("video")
        this.wind.usePlaybackRate = true

        this.bindEvents()
        this.loadFromCache()
    }

    async eject() {
        await super.eject()
        this.screen.noSignal()
    }

    play() {
        if (!this.cassette) return
        super.play()
        this.screen.play()
    }

    pause(sfx) {
        const ended = this.player.ended || this.player.currentTime === this.player.duration
        super.pause(sfx)
        this.screen.pause(ended)
    }

    async open(blob) {
        const id = blob?.name ?? this.persistence.getCurrentId()
        const savedJSON = this.persistence.loadState(id)
        this.cassette = VideoCassette.fromJSON(blob, savedJSON, id)
        this.persistence.setCurrentId(id)
        this.screen.pause()
        await super.open(blob)
    }

    async displayLoadedFile(file) {
        super.displayLoadedFile(file)
        document.getElementById('title').textContent = this.cassette.title ?? file.name ?? "Unknown Video"
        document.getElementById('author').textContent = ``
    }

    windStart(backwards, buttonEl) {
        super.windStart(backwards, buttonEl)
        this.screen.wind(backwards)
    }

    windStop(buttonEl) {
        super.windStop(buttonEl)
        this.screen.playPause(this.paused)
    }

    toggleFullscreen() {
        const main = document.querySelector("main")
        const isFullscreen = main.classList.contains("fullscreen")

        main.classList.toggle("fullscreen")
        fullscreen.classList.toggle("pressed", !isFullscreen)
        this.sfx.toggle(isFullscreen)
    }

    togglePip() {
        const isPip = document.pictureInPictureElement === this.player
        if (isPip) {
            document.exitPictureInPicture()
            this.pause(false)
        } else {
            this.player.requestPictureInPicture()
        }
        this.sfx.toggle(isPip)
        document.getElementById('pip').classList.toggle('pressed', !isPip)
    }

    bindEvents() {
        super.bindEvents()

        // Fullscreen / PIP
        document.getElementById('fullscreen').addEventListener('pointerdown', () => this.toggleFullscreen())
        document.getElementById('pip').addEventListener('pointerdown', () => this.togglePip())
    }
}
