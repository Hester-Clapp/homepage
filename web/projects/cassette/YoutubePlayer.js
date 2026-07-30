import { MediaPlayer } from "./MediaPlayer.js"
import { IFramePlayer } from "./IFramePlayer.js"
import { YoutubeCassette } from "./YoutubeCassette.js"
import { ScreenController } from "./ScreenController.js"

export class YoutubePlayer extends MediaPlayer {
    constructor(videoId) {
        super()

        this.screen = new ScreenController(document.getElementById("iframe"), document.getElementById("titler"))
        this.persistence.setCacheName("youtube")
        this.persistence.setCurrentId(videoId)

        this.bindEvents()
        this.loadVideo(videoId)
    }

    initAudio() {
        const audioCtx = new AudioContext()
        this.sfx.parseWinding(audioCtx)
    }

    async loadVideo(videoId) {
        if (!videoId) {
            document.getElementById('title').textContent = "Video ID missing from URL"
            document.getElementById('author').textContent = ''
            this.screen.noSignal()
            return
        }

        document.getElementById('title').textContent = 'Loading video…'
        document.getElementById('author').textContent = 'Please wait'

        this.player = new IFramePlayer(videoId)
        this.seekbar.player = this.player
        this.wind.player = this.player

        await window.ytReady
        await this.player.initialise()

        const title = this.player.title || 'Unknown Video'
        const author = this.player.author || 'Unknown Channel'

        // Forget any previously saved video if it's a different one
        const saved = this.persistence.loadState()
        if (!saved || saved.videoId !== videoId) {
            this.persistence.clearState()
        }
        this.cassette = YoutubeCassette.fromJSON(videoId, title, author, saved)

        document.getElementById('title').textContent = title
        document.getElementById('author').textContent = author
        document.querySelector('title').textContent = `${title} - Youtube Video Player`

        this.seekbarEl.max = `${this.player.duration}`
        this.seekbarEl.value = `${this.cassette.position}`
        this.volumeEl.value = this.cassette.targetVolume
        this.player.volume = this.cassette.targetVolume
        if (this.cassette.position > 0) this.player.currentTime = this.cassette.position

        this.player.addEventListener('ended', () => this.pause())
        this.screen.pause()
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

    updateYoutubeLink() {
        this.saveState()
        document.getElementById('youtube').href = this.cassette.youtubeURL
    }

    toggleFullscreen() {
        const main = document.querySelector("main")
        const isFullscreen = main.classList.contains("fullscreen")

        main.classList.toggle("fullscreen")
        fullscreen.classList.toggle("pressed", !isFullscreen)
        this.sfx.toggle(isFullscreen)
    }

    bindEvents() {
        super.bindEvents()

        document.getElementById('youtube').addEventListener('pointerover', () => this.updateYoutubeLink())
        document.getElementById('fullscreen').addEventListener('pointerdown', () => this.toggleFullscreen())

        document.getElementById("youtube").addEventListener('pointerdown', () => this.sfx.clicky())
    }
}
