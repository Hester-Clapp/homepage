import { Cassette } from "./Cassette.js"

export class YoutubeCassette extends Cassette {
    constructor({ videoId, title = '', author = '', position = 0, bookmarks = [], targetVolume = 1 }) {
        super({ file: null, title, author, art: '', id: videoId, position, bookmarks, targetVolume, isAlbum: false })
        this.videoId = videoId
    }

    toJSON() {
        return {
            videoId: this.videoId,
            position: this.position,
            bookmarks: this.bookmarks,
            targetVolume: this.targetVolume,
        }
    }

    static fromJSON(videoId, title, author, json = null) {
        return new YoutubeCassette({
            title,
            author,
            videoId: json?.videoId ?? videoId,
            position: json?.position ?? 0,
            bookmarks: json?.bookmarks ?? [],
            targetVolume: json?.targetVolume ?? 1,
        })
    }

    get youtubeURL() {
        return `https://www.youtube.com/watch?v=${this.videoId}&t=${Math.floor(this.position)}`
    }
}
