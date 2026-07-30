export class Cassette {
    constructor({ file, title, author, art, id, position = 0, bookmarks = [], targetVolume = 1, isAlbum = false }) {
        this.file = file
        this.title = title
        this.author = author
        this.art = art
        this.id = id          // "<title> - <author>[(album)]" — stable identity key
        this.position = position
        this.bookmarks = bookmarks
        this.targetVolume = targetVolume
        // this.isAlbum = isAlbum
    }

    // Serialisable snapshot — what PersistenceManager stores
    toJSON() {
        return {
            position: this.position,
            bookmarks: this.bookmarks,
            targetVolume: this.targetVolume,
            // isAlbum: this.isAlbum,
        }
    }

    // Reconstruct state from a PersistenceManager record (file comes separately)
    static fromJSON(file, meta, json = {}) {
        if (!json) json = {}
        return new Cassette({
            file,
            ...meta,                                // { id, title, author, art, isAlbum }
            position: json.position ?? 0,
            bookmarks: json.bookmarks ?? [],
            targetVolume: json.targetVolume ?? 1,
            // isAlbum: json.isAlbum ?? meta.isAlbum,
        })
    }

    addBookmark(time) {
        if (this.bookmarks.includes(time)) return
        this.bookmarks = [...this.bookmarks, time].sort((a, b) => a - b)
    }

    removeBookmark(time) {
        this.bookmarks = this.bookmarks.filter(b => b !== time)
    }

    getPreviousBookmark() {
        const lower = [0, ...this.bookmarks].filter(b => b < this.position)
        return lower.length ? lower[lower.length - 1] : 0
    }

    getNextBookmark(duration) {
        const higher = [...this.bookmarks, duration].filter(b => b > this.position)
        return higher.length ? higher[0] : Math.floor(duration)
    }
}