export class PersistenceManager {
    static STORAGE_KEY = 'cassetteReader'
    static CACHE_KEY = 'currentCassetteBlob'
    static CURRENT_ID_KEY = 'currentCassetteId'
    static CACHE_SIZE_LIMIT = 250 * 1024 * 1024  // 250 MB

    setCacheName(name) {
        this.cacheName = name
        this.storageKey = name + PersistenceManager.STORAGE_KEY
        this.cacheKey = name + PersistenceManager.CACHE_KEY
        this.currentIdKey = name + PersistenceManager.CURRENT_ID_KEY
    }

    loadState(cassetteId = this.getCurrentId()) {
        const stored = JSON.parse(localStorage.getItem(this.storageKey) || '{}')
        return stored[cassetteId] ?? {}
    }

    saveState(cassette) {
        const stored = JSON.parse(localStorage.getItem(this.storageKey) || '{}')
        stored[cassette.id] = cassette.toJSON()
        localStorage.setItem(this.storageKey, JSON.stringify(stored))
    }

    clearState(cassetteId) {
        const stored = JSON.parse(localStorage.getItem(this.storageKey) || '{}')
        delete stored[cassetteId]
        localStorage.setItem(this.storageKey, JSON.stringify(stored))
    }

    getCurrentId() {
        return localStorage.getItem(this.currentIdKey)
    }

    setCurrentId(cassetteId) {
        localStorage.setItem(this.currentIdKey, cassetteId)
    }

    clearCurrentId() {
        // throw new Error("Someone tried to remove the current cassette id")
        // localStorage.removeItem(this.currentIdKey)
    }

    async loadFile() {
        const cache = await caches.open(this.cacheName)
        const response = await cache.match(this.cacheKey)
        return response ? response.blob() : null
    }

    async saveFile(file) {
        if (file.size > PersistenceManager.CACHE_SIZE_LIMIT) return
        const cache = await caches.open(this.cacheName)
        await cache.put(this.cacheKey, new Response(file, {
            headers: { 'Content-Type': file.type, 'Accept-Ranges': 'bytes' }
        }))
    }

    async deleteFile() {
        const cache = await caches.open(this.cacheName)
        await cache.delete(this.cacheKey)
    }
}