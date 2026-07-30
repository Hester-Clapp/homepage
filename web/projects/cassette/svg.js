const insert = `<svg width="1rem" height="1rem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="0" width="70" height="40" rx="6" fill="black" />
    <circle cx="35" cy="20" r="8" fill="white" />
    <circle cx="65" cy="20" r="8" fill="white" />
    <line x1="50" y1="50" x2="50" y2="80" stroke="black" stroke-width="10" stroke-linecap="round" />
    <polyline points="35,65 50,80 65,65" fill="none" stroke="black" stroke-width="10"
        stroke-linejoin="round" stroke-linecap="round" />
    <rect x="0" y="90" width="100" height="10" rx="3" fill="black" />
</svg>`

const eject = `<svg width="1rem" height="1rem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="10,60 50,0 90,60" fill="black" />
    <rect x="10" y="75" width="80" height="20" rx="3" fill="black" />
</svg>`

const bookmark = `<svg width="1rem" height="1rem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20,5 80,5 80,95 50,75 20,95 20,5" fill="none" stroke="black" stroke-width="12"
        stroke-linejoin="round" stroke-linecap="round" />
</svg>`

const unbookmark = `<svg width="1rem" height="1rem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20,5 80,5 80,95 50,75 20,95 20,5" fill="black" stroke="black" stroke-width="12"
        stroke-linejoin="round" stroke-linecap="round" />
</svg>`

const play = `<svg width="1rem" height="1rem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<polygon points="20,10 20,90 90,50" fill="black"/>
</svg>`

const pause = `<svg width="1rem" height="1rem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<rect x="15" y="10" width="28" height="80" rx="4" fill="black"/>
<rect x="57" y="10" width="28" height="80" rx="4" fill="black"/>
</svg>`

const forward = `<svg width="1rem" height="1rem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<polygon points="5,20 50,50 5,80" fill="black" />
<polygon points="50,20 95,50 50,80" fill="black" />
</svg>`

const rewind = `<svg width="1rem" height="1rem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<polygon points="50,20 5,50 50,80" fill="black" />
<polygon points="95,20 50,50 95,80" fill="black" />
</svg>`

function white(svg) {
    return svg.replaceAll("black", "white")
}

export { insert, eject, bookmark, unbookmark, play, pause, forward, rewind, white }