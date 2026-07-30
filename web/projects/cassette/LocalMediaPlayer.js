import { MediaPlayer } from "./MediaPlayer.js"
import { BookmarkManager } from "./BookmarkManager.js"
import * as svg from "./svg.js"

export class LocalMediaPlayer extends MediaPlayer {

    constructor(params) {
        super()
        this.params = params
        this.loadExternal = params ? params.has('links') : false

        this.player = document.getElementById('player')
        this.insertEjectEl = document.getElementById('upload')

        this.bookmarks = new BookmarkManager(
            document.getElementById('seekbarContainer'),
            document.getElementById('bookmark')
        )
        this.seekbar.player = this.player
        this.wind.player = this.player
    }

    async insert(file) {
        if (!file) return
        this.loadExternal = false
        if (!this.player.paused) this.player.pause()
        document.querySelectorAll('.bookmark').forEach(d => d.remove())
        this.insertEjectEl.innerHTML = svg.eject
        this.persistence.saveFile(file)
    }

    async eject() {
        if (!this.player.paused) this.pause()
        this.insertEjectEl.innerHTML = svg.insert
        document.getElementById('title').textContent = 'No media open'
        document.getElementById('author').textContent = 'Insert a cassette below'
        this.player.src = ""
        this.seekbarEl.value = '0'
        this.seekbarEl.max = '0'
        this.persistence.deleteFile()
        this.persistence.clearCurrentId()
        this.cassette = null
    }

    async loadFromCache() {
        const blob = await this.persistence.loadFile()
        if (blob) {
            this.loadExternal = false
            await this.open(blob)
        } else {
            await this.open(null)
        }
    }

    async open(file) {
        return new Promise(async resolve => {
            if (!file) {
                this.eject()
                resolve()
                return
            }

            const url = URL.createObjectURL(file)
            this.player.pause()
            this.paused = true
            this.playpauseEl.innerHTML = svg.play
            this.insertEjectEl.innerHTML = svg.eject
            this.player.src = url

            this.player.addEventListener('loadedmetadata', async () => {
                await this.displayLoadedFile(file)
                resolve()
            }, { once: true })
        })
    }

    async displayLoadedFile(file) {
        if (!file) {
            this.eject()
            return
        }

        this.seekbarEl.max = `${this.player.duration}`
        this.volumeEl.value = this.cassette?.targetVolume ?? '0'
        this.audio.loaded.then(() => this.audio.setVolume(this.cassette.targetVolume))
        this.seekbar.set(this.cassette.position)
        this.bookmarks.load(this.cassette, this.player.duration)
    }

    applyMeta(cassette = this.cassette) {
        document.getElementById('title').textContent = cassette.title
        document.getElementById('author').textContent = `by ${cassette.author}`
        document.getElementById('art').src = cassette.art
    }

    play(sfx) {
        super.play(sfx)
        this.bookmarks.removeCurrentBookmark()
    }

    seekTo(time) {
        super.seekTo(time)
        this.bookmarks.removeCurrentBookmark()
    }

    windStart(backwards, el) {
        super.windStart(backwards, el)
        this.bookmarks.removeCurrentBookmark()
    }

    toggleBookmark() {
        if (!this.cassette) return
        this.bookmarks.toggle(this.cassette, this.player.duration, this.sfx)
        this.saveState()
    }

    restoreBookmark(supplier) {
        if (!this.cassette) return
        const time = supplier()
        this.seekTo(time)
        this.bookmarks.setCurrentBookmark(Math.floor(time))
    }

    previousBookmark() {
        return this.restoreBookmark(() => this.cassette.getPreviousBookmark())
    }

    nextBookmark() {
        return this.restoreBookmark(() => this.cassette.getNextBookmark(this.player.duration))
    }

    bindEvents() {
        super.bindEvents()

        document.getElementById('fileInput').addEventListener('input', async e => {
            const file = e.target.files[0]
            await this.insert(file)
            await this.open(file)
        })
        document.getElementById("upload").addEventListener('click', () => this.eject())

        document.getElementById('bookmark').addEventListener('click', () => this.toggleBookmark())
        document.getElementById('previous').addEventListener('click', () => this.previousBookmark())
        document.getElementById('next').addEventListener('click', () => this.nextBookmark())

        for (const id of ['upload', 'bookmark', 'previous', 'next']) {
            document.getElementById(id).addEventListener('pointerdown', () => this.sfx.clicky())
        }
    }
}
