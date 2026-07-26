export function debug(message) {
    const box = document.getElementById("debug");

    if (box) {
        box.innerHTML += "<br>" + message;
    }
}