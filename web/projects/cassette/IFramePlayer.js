export class IFramePlayer extends EventTarget {
    constructor(videoId) {
        super()
        this.videoId = videoId
        this.paused = true
        this.title = ''
        this.author = ''
    }

    async initialise() {
        return new Promise(resolve => {
            this.ytPlayer = new YT.Player('iframe', {
                videoId: this.videoId,
                playerVars: { controls: 0, disablekb: 1, rel: 0, origin: window.location.origin, modestbranding: 1 },
                events: {
                    onReady: async (e) => {
                        // history.replaceState(null, document.title, location.href)
                        await e.target.loadVideoById(this.videoId)
                        e.target.mute()
                        e.target.playVideo()
                        await this.durationLoaded()

                        const data = e.target.getVideoData()
                        this.title = data.title
                        this.author = data.author

                        e.target.pauseVideo()
                        e.target.unMute()
                        e.target.seekTo(0, true)
                        resolve()
                    },
                    onStateChange: (e) => {
                        const name =
                            e.data === YT.PlayerState.ENDED ? 'ended' :
                                e.data === YT.PlayerState.BUFFERING ? 'waiting' :
                                    e.data === YT.PlayerState.PLAYING ? 'playing' :
                                        e.data === YT.PlayerState.PAUSED ? 'pause' : null
                        if (name) this.dispatchEvent(new Event(name))
                    }
                }
            })
        })
    }

    async durationLoaded() {
        const player = this.ytPlayer
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (player.getDuration() > 0) {
                    clearInterval(interval)
                    resolve()
                }
            }, 25)
        })
    }

    play() { this.ytPlayer.playVideo(); this.paused = false }
    pause() { this.ytPlayer.pauseVideo(); this.paused = true }

    get currentTime() { return this.ytPlayer.getCurrentTime() }
    set currentTime(t) { this.ytPlayer.seekTo(t, true) }

    get duration() { return this.ytPlayer.getDuration() }

    get volume() { return this.ytPlayer.getVolume() / 100 }
    set volume(v) { this.ytPlayer.setVolume(v * 100) }

    previous() { this.ytPlayer.previousVideo() }
    next() { this.ytPlayer.nextVideo() }
}
