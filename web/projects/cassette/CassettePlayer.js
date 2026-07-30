import { Cassette } from "./Cassette.js"
import { MetadataReader } from "./MetadataReader.js"
import { SleepTimer } from "./SleepTimer.js"
import { LocalMediaPlayer } from "./LocalMediaPlayer.js"

export class CassettePlayer extends LocalMediaPlayer {
    constructor(params) {
        super()

        // Subsystems
        this.meta = new MetadataReader(params)
        this.persistence.setCacheName("audio")

        // SleepTimer needs AudioEngine initialised first — reassigned in initAudio
        this.sleep = null

        this.bindEvents()

        if (this.loadExternal) this.fetchExternal(params.get('links'))
        else this.loadFromCache()
    }

    async eject() {
        await super.eject()
        document.getElementById('art').src = "./no-thumbnail.svg"
    }

    async open(file) {
        const meta = await this.meta.read(file, false, this.loadExternal)
        const savedJSON = this.persistence.loadState(meta.id || file.name)
        this.cassette = Cassette.fromJSON(file, meta, savedJSON)
        this.persistence.setCurrentId(this.cassette.id)
        await super.open(file)
    }

    async fetchExternal(sources) {
        document.getElementById('title').textContent = 'Loading external audiobook…'
        const { blobs, filename } = await this.loader.fetch(sources)
        await this.combineAndOpen(blobs, filename)
    }

    // async combineAndOpen(files, filename) {
    //     const meta = await this.meta.read(files[0], files.length > 1, this.loadExternal)
    //     const combined = await this.loader.combine(files, filename)

    //     await this.persistence.saveFile(combined)
    //     await this.open(combined, meta)

    //     // Place chapter bookmarks at file boundaries
    //     let time = 0
    //     const durations = await Promise.all(files.map(f => this.loader.getDuration(f)))
    //     this.bookmarks.clear(this.cassette)
    //     durations.forEach(dur => {
    //         if (time !== 0) this.bookmarks.place(this.cassette, time, this.player.duration, null)
    //         time += dur
    //     })

    //     this.saveState()
    // }

    async displayLoadedFile(file) {
        super.displayLoadedFile(file)
        this.applyMeta(await this.meta.read(file, false, this.loadExternal))
        if (this.sleep) this.sleep.mediaDuration = this.player.duration
    }

    applyMeta(cassette = this.cassette) {
        document.getElementById('title').textContent = cassette.title
        document.getElementById('author').textContent = `by ${cassette.author}`
        document.getElementById('art').src = cassette.art
    }

    async initAudio() {
        const disableEffects = this.params && this.params.get('disableEffects')
        await super.initAudio(disableEffects)
        this.sleep = new SleepTimer(this.audio, this.sfx, () => this.pause(false))
        this.sleep.mediaDuration = this.player.duration
    }

    play(sfx) {
        super.play(sfx)
        this.audio.setHiss(true)
    }

    pause(sfx) {
        super.pause(sfx)
        this.audio.setHiss(false)
    }

    sleepTimer(duration) {
        return function sleep(e) {
            if (!this.sleep) return
            if (this.sleep.sleeping) {
                this.sleep.cancel(e.currentTarget)
                document.querySelectorAll('.sleep').forEach(el => el.classList.remove("pressed"))
            } else {
                this.sleep.mediaDuration = this.player.duration
                this.sleep.start(duration, e.currentTarget, this.player.currentTime)
            }
        }
    }

    bindEvents() {
        super.bindEvents()

        // Sleep timers
        document.getElementById('sleep15').addEventListener('pointerdown', this.sleepTimer(15).bind(this))
        document.getElementById('sleep30').addEventListener('pointerdown', this.sleepTimer(30).bind(this))
    }
}
