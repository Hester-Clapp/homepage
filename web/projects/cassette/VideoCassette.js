import { Cassette } from "./Cassette.js"

export class VideoCassette extends Cassette {
    constructor({ file, title, id, position = 0, bookmarks = [], targetVolume = 1 }) {
        super({ file, title, author: '', art: '', id, position, bookmarks, targetVolume, isAlbum: false })
    }

    toJSON() {
        return {
            position: this.position,
            bookmarks: this.bookmarks,
            targetVolume: this.targetVolume,
            title: this.title
        }
    }

    static fromJSON(file, json = {}, id = file.name) {
        return new VideoCassette({
            file,
            title: id,
            id,
            position: json?.position ?? 0,
            bookmarks: json?.bookmarks ?? [],
            targetVolume: json?.targetVolume ?? 1,
        })
    }
}
