export class MetadataReader {
    constructor(params = new Map()) {
        this.params = params // URLSearchParams
    }

    async read(file, useAlbum, loadExternal) {
        const tags = await this.getTags(file)
        const p = this.params

        const title = (loadExternal && p.get('title'))
            || (useAlbum && tags.album)
            || tags.title
            || 'Unknown Book'

        const author = (loadExternal && p.get('author'))
            || tags.artist
            || 'Unknown Author'

        const src = loadExternal && p.get('src')
        const art = (tags.picture && this.imageFromTag(tags.picture))
            || (src && src.includes('youtube') && await this.imageFromYoutube(src))
            || './no-thumbnail.svg'

        const id = `${title} - ${author}${useAlbum ? ' (album)' : ''}`
        return { id, title, author, art, tags }
    }

    getTags(file) {
        if (!file) return {}
        return new Promise(resolve => {
            window.jsmediatags.read(file, {
                onSuccess: tag => {
                    const { title, artist, album, picture } = tag.tags
                    resolve({ title, artist, album, picture })
                },
                onError: () => resolve({})
            })
        })
    }

    imageFromTag(picture) {
        const blob = new Blob([new Uint8Array(picture.data)], { type: picture.format })
        return URL.createObjectURL(blob)
    }

    async imageFromYoutube(url) {
        const oEmbed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
        const res = await fetch(`/nocors/?url=${encodeURIComponent(oEmbed)}`)
        if (!res.ok) return ''
        const data = await res.json()
        return data.thumbnail_url
    }
}