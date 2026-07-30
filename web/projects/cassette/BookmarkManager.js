import * as svg from "./svg.js"

export class BookmarkManager {
    constructor(seekbarContainer, bookmarkButton) {
        this.container = seekbarContainer
        this.button = bookmarkButton
        this.currentBookmark = -1 // -1 means no bookmark selected
    }

    setCurrentBookmark(value) {
        if (value === -1) return this.removeCurrentBookmark()

        this.currentBookmark = value
        console.log(this.button)
        this.button.innerHTML = svg.unbookmark
    }

    removeCurrentBookmark() {
        this.currentBookmark = -1
        this.button.innerHTML = svg.bookmark
    }

    load(cassette, duration) {
        this.removeCurrentBookmark()
        this.container.querySelectorAll('div.bookmark').forEach(el => el.remove())
        cassette.bookmarks.forEach(time => this.createElement(time, duration))
    }

    place(cassette, time, duration, playSound) {
        const rounded = Math.floor(time)
        if (rounded === 0) return
        if (rounded === Math.floor(duration)) return
        cassette.addBookmark(rounded)
        this.createElement(rounded, duration)
        this.setCurrentBookmark(rounded)
        playSound?.()
    }

    remove(cassette, time, playSound) {
        cassette.removeBookmark(time)
        this.removeCurrentBookmark()
        this.container.querySelector(`div.bookmark.time-${time}`)?.remove()
        playSound?.()
    }

    clear(cassette) {
        cassette.bookmarks = []
        document.querySelectorAll(".bookmark").forEach(el => el.remove())
    }

    toggle(cassette, duration, sfx) {
        if (this.currentBookmark === -1) {
            this.place(cassette, Math.floor(cassette.position), duration, () => sfx.play('press'))
        } else {
            this.remove(cassette, this.currentBookmark, () => sfx.play('press'))
        }
    }

    createElement(time, duration) {
        const div = document.createElement('div')
        div.classList.add('bookmark', `time-${time}`)
        const ratio = time / duration
        const seekbarWidth = this.container.clientWidth
        const thumbWidth = 16
        const offsetLeft = (thumbWidth / 2) + (seekbarWidth - thumbWidth) * ratio
        div.style.left = `${offsetLeft}px`
        this.container.appendChild(div)
    }
}