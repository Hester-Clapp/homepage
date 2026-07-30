function loadInto(fileName, element) {
    fetch(fileName).then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(html => {
        element.innerHTML = html;
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

loadInto("./assets/header.html", document.querySelector('header'))
loadInto("./assets/footer.html", document.querySelector('footer'))