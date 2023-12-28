
document.getElementById("projects").onmousemove = e => {
    for(const card of document.getElementsByClassName("card")) {
        const rect = card.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", x + 'px');
    card.style.setProperty("--mouse-y", y + 'px');
    }

    document.querySelectorAll(".card").forEach(card => {
        card.onmousemove = m => {
            const rect = card.getBoundingClientRect(),
            xDeg = (e.clientX - rect.left - rect.width / 2) / 100,
            yDeg = -(e.clientY - rect.top - rect.height / 2) / 100;

            card.style.setProperty("--deg-x", xDeg + 'deg');
            card.style.setProperty("--deg-y", yDeg + 'deg');
        };
    });
}