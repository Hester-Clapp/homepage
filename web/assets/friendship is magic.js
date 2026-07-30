let friendshipStats = JSON.parse(localStorage.getItem('friendshipStats') || `{
    "Loyalty": 0,
    "Honesty": 0,
    "Laughter": 0,
    "Kindness": 0,
    "Generosity": 0,
    "Magic": 0
}`)

function increase(e, stat) {
    if (friendshipStats[stat] === undefined) {
        friendshipStats[stat] = 0;
    }
    friendshipStats[stat]++;
    localStorage.setItem('friendshipStats', JSON.stringify(friendshipStats));
    tooltip(`+1 ${stat}`, e.clientX, e.clientY);
}
function tooltip(message, x, y) {
    let tooltip = document.createElement('p');
    tooltip.className = 'tooltip';
    tooltip.innerText = message;
    tooltip.style.top = `${y + 5}px`;
    tooltip.style.left = `${x}px`;
    document.body.appendChild(tooltip);
    setTimeout(() => { tooltip.style.opacity = '1'; }, 1);
    setTimeout(() => { tooltip.style.opacity = '0' }, 1800);
    setTimeout(() => { tooltip.remove() }, 2000);
}