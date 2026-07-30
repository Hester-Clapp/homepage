import { MetadataReader } from "./MetadataReader.js"

export class FileLoader {
    constructor(proxyPath = '/nocors/') {
        this.proxy = proxyPath

        this.meta = new MetadataReader()
    }

    async fetch(sources) {
        const urls = sources.split(';')
        let progress = 0
        const blobs = await Promise.all(urls.map(async url => {
            const res = await fetch(`${this.proxy}?url=${encodeURIComponent(url)}`)
            progress++
            return res.blob()
        }))
        const filename = urls[0].split('/').pop()
        return { blobs, filename }
    }

    async stripID3(blob) {
        return new Promise(resolve => {
            jsmediatags.read(blob, {
                onSuccess: tag => resolve(blob.slice(tag.size)),
                onError: () => resolve(blob)
            })
        })
    }

    async getDuration(file) {
        return new Promise(resolve => {
            if (file.type !== 'audio/mpeg') return resolve(0)
            const url = URL.createObjectURL(file)
            const audio = new Audio()
            audio.src = url
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration)
                URL.revokeObjectURL(url)
                audio.src = ''
            })
        })
    }

    async combine(files, filename) {
        if (files.every(file => file.type === "audio/mpeg")) {
            return new File(files, filename, { type: 'audio/mpeg' })
        }

        return new File([files[0]], filename, { type: 'audio/mpeg' })
    }
}