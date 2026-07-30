export class AudioEngine {
    constructor() {
        this.ctx = null
        this.playbackVolume = null
        this.hissNode = null
        this.fadeOut = null
        this.hissSource = null
        this.loaded = new Promise(resolve => this.resolveLoad = resolve)
    }

    async init(mediaElement, options = {}) {
        // Back-compat: init(el, true) means disableEffects
        if (typeof options !== 'object') options = { disableEffects: !!options }
        const { disableEffects = true } = options

        this.ctx = new AudioContext()
        this.playbackVolume = this.ctx.createGain()
        this.hissNode = this.ctx.createGain()
        this.hissNode.gain.value = 0
        this.fadeOut = this.ctx.createGain()

        const source = this.ctx.createMediaElementSource(mediaElement)

        if (disableEffects) {
            source.connect(this.playbackVolume)
        } else {
            this.connectTapeEffect(source)
        }

        this.playbackVolume.connect(this.fadeOut)
        this.fadeOut.connect(this.ctx.destination)

        this.resolveLoad()
    }

    setVolume(value) {
        this.playbackVolume.gain.setValueAtTime(value, this.ctx.currentTime)
    }

    setHiss(on) {
        if (!this.hissNode) return
        this.hissNode.gain.setValueAtTime(on ? 0.15 : 0, this.ctx.currentTime)
    }

    connectTapeEffect(source) {
        const lowpass = this.ctx.createBiquadFilter()
        lowpass.type = 'lowpass'
        lowpass.frequency.value = 12000
        lowpass.Q.value = 0.7

        const highpass = this.ctx.createBiquadFilter()
        highpass.type = 'highpass'
        highpass.frequency.value = 40
        highpass.Q.value = 0.7

        const waveshaper = this.ctx.createWaveShaper()
        waveshaper.curve = this.makeTapeCurve(0.2)
        waveshaper.oversample = '4x'

        const tilt = this.ctx.createBiquadFilter()
        tilt.type = 'highshelf'
        tilt.frequency.value = 4000
        tilt.gain.value = -4

        this.hissSource = this.createHiss()
        this.hissSource.connect(this.hissNode)

        source.connect(highpass)
        highpass.connect(lowpass)
        lowpass.connect(waveshaper)
        waveshaper.connect(tilt)
        tilt.connect(this.playbackVolume)
        this.hissNode.connect(this.playbackVolume)
    }

    makeTapeCurve(amount) {
        const samples = 44100
        const curve = new Float32Array(samples)
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1
            curve[i] = x / (1 + amount * Math.abs(x))
        }
        return curve
    }

    createHiss() {
        const bufferSize = 2 * this.ctx.sampleRate
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.02

        const noise = this.ctx.createBufferSource()
        noise.buffer = buffer
        noise.loop = true

        const hp = this.ctx.createBiquadFilter()
        hp.type = 'highpass'
        hp.frequency.value = 3000

        noise.connect(hp)
        noise.start()
        return noise
    }
}